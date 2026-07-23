from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.neighbors import NearestNeighbors
from pymongo import MongoClient
import numpy as np
import threading
import time

app = Flask(__name__)
CORS(app)

# --- GLOBAL STATE & CACHING ---
# We cache the matrix and model to avoid re-calculating on every request
cache = {
    "matrix": None,
    "model": None,
    "last_updated": 0,
    "popular_items": []
}
CACHE_TIMEOUT = 300 # 5 minutes
cache_lock = threading.Lock()

analyzer = SentimentIntensityAnalyzer()
client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['freshuntDB']
users_collection = db['users']

def update_cache():
    """Fetches data from MongoDB and builds the recommendation model."""
    global cache
    try:
        data = {'user_id': [], 'item': []}
        for user_doc in users_collection.find():
            for order in user_doc.get('orders', []):
                for item in order.get('items', []):
                    data['user_id'].append(user_doc.get('username', 'unknown'))
                    if isinstance(item, dict):
                        data['item'].append(item.get('product', 'unknown'))
                    else:
                        data['item'].append(str(item))
        
        if not data['user_id']:
            cache["popular_items"] = ["Fresh Tomatoes", "Bananas", "Potatoes"]
            return

        df = pd.DataFrame(data)
        # Create item-user matrix for item-item similarity
        matrix = df.groupby(['item', 'user_id']).size().unstack(fill_value=0)
        
        # Fit model
        n_neighbors = min(5, len(matrix.index))
        if n_neighbors > 1:
            model = NearestNeighbors(metric='cosine', algorithm='brute')
            model.fit(matrix.values)
            
            with cache_lock:
                cache["matrix"] = matrix
                cache["model"] = model
                cache["popular_items"] = df['item'].value_counts().head(5).index.tolist()
                cache["last_updated"] = time.time()
        else:
            cache["popular_items"] = df['item'].value_counts().head(5).index.tolist()
            
    except Exception as e:
        print(f"Cache Update Error: {e}")

# Initial cache build
update_cache()

@app.route('/api/sentiment', methods=['POST'])
def sentiment_analysis():
    try:
        content = request.json
        review = content.get('review', '')
        if not review:
            return jsonify({"error": "No review provided"}), 400
        
        scores = analyzer.polarity_scores(review)
        compound = scores['compound']
        sentiment = "Positive" if compound >= 0.05 else "Negative" if compound <= -0.05 else "Neutral"
        
        return jsonify({**scores, "sentiment": sentiment})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sentiment/batch', methods=['POST'])
def batch_sentiment():
    """Bonus: Processes multiple reviews in one go for the Admin Panel"""
    try:
        reviews = request.json.get('reviews', [])
        results = []
        for text in reviews:
            scores = analyzer.polarity_scores(text)
            compound = scores['compound']
            sentiment = "Positive" if compound >= 0.05 else "Negative" if compound <= -0.05 else "Neutral"
            results.append({"text": text, "sentiment": sentiment, "scores": scores})
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        # Check if cache is stale
        if time.time() - cache["last_updated"] > CACHE_TIMEOUT:
            threading.Thread(target=update_cache).start()

        content = request.json or {}
        item_name = content.get('item', '')
        username = content.get('username', '')

        with cache_lock:
            matrix = cache["matrix"]
            model = cache["model"]
            popular = cache["popular_items"]

        # 1. If we have a specific item (from Product Page), recommend similar to it
        if item_name and matrix is not None and item_name in matrix.index:
            distances, indices = model.kneighbors(matrix.loc[item_name].values.reshape(1, -1), n_neighbors=min(5, len(matrix.index)))
            recs = [matrix.index[i] for i in indices.flatten()[1:] if matrix.index[i] != item_name]
            return jsonify({"recommendations": recs[:4]})

        # 2. If no item but username, find their last purchase
        if username and not item_name:
            user_data = users_collection.find_one({"username": username})
            if user_data and user_data.get('orders'):
                last_order = user_data['orders'][-1]
                if last_order.get('items'):
                    last_item = last_order['items'][-1]
                    seed_item = last_item.get('product') if isinstance(last_item, dict) else str(last_item)
                    if matrix is not None and seed_item in matrix.index:
                        distances, indices = model.kneighbors(matrix.loc[seed_item].values.reshape(1, -1), n_neighbors=min(5, len(matrix.index)))
                        recs = [matrix.index[i] for i in indices.flatten()[1:] if matrix.index[i] != seed_item]
                        return jsonify({"recommendations": recs[:4]})

        # 3. Fallback to popular
        return jsonify({"recommendations": popular[:4]})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

import json
import os

PRODUCT_JSON_PATH = r"C:\PowerHouseVault\Cutomer-GUI\my-app\src\data\Product.json"

@app.route('/api/sentiment/dashboard', methods=['GET'])
def get_dashboard_sentiment():
    try:
        if not os.path.exists(PRODUCT_JSON_PATH):
            return jsonify({"error": "Product data not found"}), 404
            
        with open(PRODUCT_JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        response_data = []
        
        for category, products in data.items():
            cat_data = {
                "category": category.capitalize(),
                "sentiment_distribution": {"positive": 0, "neutral": 0, "negative": 0},
                "average_sentiment_score": 0.0,
                "total_reviews": 0,
                "top_product": "None",
                "low_product": "None",
                "products": []
            }
            
            total_score = 0
            
            for prod in products:
                prod_reviews = prod.get("reviews", [])
                if not prod_reviews:
                    continue
                    
                prod_stats = {
                    "name": prod.get("name", "Unknown"),
                    "image": prod.get("image", ""),
                    "positive": 0,
                    "neutral": 0,
                    "negative": 0,
                    "score": 0.0,
                    "total": 0
                }
                
                prod_sum_score = 0
                
                for rev in prod_reviews:
                    comment = rev.get("comment", "")
                    if not comment:
                        continue
                    
                    scores = analyzer.polarity_scores(comment)
                    compound = scores['compound']
                    
                    if compound >= 0.05:
                        sent = "positive"
                    elif compound <= -0.05:
                        sent = "negative"
                    else:
                        sent = "neutral"
                        
                    prod_stats[sent] += 1
                    cat_data["sentiment_distribution"][sent] += 1
                    
                    prod_stats["total"] += 1
                    cat_data["total_reviews"] += 1
                    
                    prod_sum_score += compound
                    total_score += compound
                
                if prod_stats["total"] > 0:
                    prod_stats["score"] = round(prod_sum_score / prod_stats["total"], 2)
                    cat_data["products"].append(prod_stats)
            
            if cat_data["total_reviews"] > 0:
                cat_data["average_sentiment_score"] = round(total_score / cat_data["total_reviews"], 2)
                
                # Sort products by score
                sorted_products = sorted(cat_data["products"], key=lambda x: x["score"], reverse=True)
                cat_data["products"] = sorted_products
                if sorted_products:
                    cat_data["top_product"] = sorted_products[0]["name"]
                    cat_data["low_product"] = sorted_products[-1]["name"]
                
                response_data.append(cat_data)
                
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
