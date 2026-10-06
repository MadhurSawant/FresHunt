# 🛒 Fresh Hunt – Smart Grocery eCommerce Website

Fresh Hunt is a **full-stack Smart Grocery eCommerce Website** developed as an academic mini project. The system provides a digital platform where customers can browse grocery products, search and filter items, add products to their shopping cart, place orders, track deliveries, and provide product reviews.

The project is designed to demonstrate the practical implementation of **modern web development, database management, authentication, eCommerce workflows, real-time communication, inventory management, and Machine Learning**.

Unlike a basic grocery shopping website, Fresh Hunt also includes features such as **real-time product and order updates, OTP-based authentication, customer reviews, review sentiment analysis, delivery management, and loyalty/reward functionality**.

The application is divided into three major user areas:

* 👤 **Customer**
* 👨‍💼 **Admin**
* 🚚 **Delivery Personnel**

These modules communicate with the backend server through APIs and use MongoDB for storing and retrieving application data.

---

# 📌 Table of Contents

* [Project Overview](#-project-overview)
* [Problem Statement](#-problem-statement)
* [Objectives](#-objectives)
* [Key Features](#-key-features)
* [How Fresh Hunt Works](#-how-fresh-hunt-works)
* [User Modules](#-user-modules)
* [Machine Learning Feature](#-machine-learning-feature)
* [Real-Time Communication](#-real-time-communication)
* [Technology Stack](#-technology-stack)
* [System Architecture](#-system-architecture)
* [Application Workflow](#-application-workflow)
* [Database Structure](#-database-structure)
* [API and Backend Architecture](#-api-and-backend-architecture)
* [Security](#-security)
* [Project Structure](#-project-structure)
* [Installation](#-installation)
* [Environment Variables](#-environment-variables)
* [Running the Project](#-running-the-project)
* [Screenshots](#-screenshots)
* [Testing](#-testing)
* [Advantages](#-advantages)
* [Limitations](#-limitations)
* [Future Scope](#-future-scope)
* [Learning Outcomes](#-learning-outcomes)
* [Project Information](#-project-information)
* [Team](#-team)
* [License](#-license)

---

# 📖 Project Overview

Online grocery shopping has become an important part of modern eCommerce. Customers expect a system where they can easily find products, check availability, place orders, and receive updates about their purchases.

Fresh Hunt addresses this requirement by providing a centralized online grocery shopping platform.

The system allows customers to:

* Create an account
* Log in securely
* Browse grocery products
* Search for products
* Filter products by categories or other attributes
* View product details
* Add products to their cart
* Modify cart quantities
* Place orders
* View previous orders
* Track order status
* Submit product reviews
* Rate products
* Earn/use loyalty rewards

At the same time, administrators can manage the overall platform, including products, users, inventory, and orders.

Delivery personnel have a separate module where they can view assigned orders and update delivery statuses.

---

# ❗ Problem Statement

Traditional grocery shopping requires customers to physically visit stores, search for required products, check availability, wait at billing counters, and manually manage their purchases.

Even in online grocery systems, several challenges can occur:

* Difficulty finding products
* Lack of real-time inventory information
* Manual order management
* Limited customer feedback analysis
* Lack of integrated delivery management
* Delayed order-status updates
* Difficulty understanding large volumes of customer reviews

Fresh Hunt attempts to solve these problems by providing a centralized digital platform that combines:

```text
Online Shopping
       +
Product Management
       +
Inventory Management
       +
Order Management
       +
Delivery Management
       +
Customer Reviews
       +
Machine Learning
       +
Real-Time Updates
```

---

# 🎯 Objectives

The major objectives of Fresh Hunt are:

1. Develop a user-friendly online grocery shopping platform.
2. Provide secure registration and login functionality.
3. Allow customers to browse and search grocery products.
4. Implement shopping cart and order placement functionality.
5. Maintain product and inventory information using MongoDB.
6. Provide an admin dashboard for managing the application.
7. Provide a dedicated delivery management module.
8. Implement product reviews and ratings.
9. Analyze customer reviews using Machine Learning.
10. Provide real-time product and order updates.
11. Implement a loyalty/reward mechanism.
12. Demonstrate practical full-stack application development.

---

# ✨ Key Features

## 🛍️ Product Browsing

Customers can browse the available grocery products through the product catalog.

Product information can include:

* Product name
* Product image
* Category
* Description
* Price
* Discount
* Availability
* Stock quantity
* Customer ratings

---

## 🔎 Search and Filtering

Customers can quickly find required products using search and filtering functionality.

Examples include:

* Search by product name
* Search by category
* Filter by price
* Filter by availability
* Sort products
* Browse specific grocery categories

This improves the overall shopping experience.

---

## 🛒 Shopping Cart

Customers can add products to their shopping cart.

Cart functionality includes:

* Add product
* Remove product
* Increase quantity
* Decrease quantity
* Calculate subtotal
* Calculate total amount
* View selected products before checkout

The cart acts as an intermediate stage between product browsing and order placement.

---

## 👤 User Registration and Authentication

Customers can create accounts and securely access their profiles.

The authentication system can handle:

* Registration
* Login
* Logout
* Password protection
* OTP verification
* Authentication status
* Protected routes

Authentication ensures that users can access their personal orders and account information securely.

---

## 🔐 OTP Authentication

OTP-based verification can be used as an additional authentication mechanism.

A typical flow is:

```text
User enters phone/email
        ↓
OTP generated
        ↓
OTP sent to user
        ↓
User enters OTP
        ↓
OTP verified
        ↓
Account authenticated
```

This provides an additional layer of user verification.

---

# 📦 Product and Inventory Management

The admin can manage the grocery catalog.

Administrators can:

* Add new products
* Update product information
* Delete products
* Update prices
* Update stock quantity
* Manage categories
* Monitor product availability

Inventory management helps prevent situations where customers attempt to purchase unavailable products.

---

# 🧾 Order Management

After checkout, the customer can place an order.

The order system maintains information such as:

* Customer information
* Ordered products
* Product quantities
* Total amount
* Order date
* Delivery information
* Order status

Example order status:

```text
Order Placed
     ↓
Order Confirmed
     ↓
Preparing
     ↓
Out for Delivery
     ↓
Delivered
```

The exact status flow can be modified according to the implementation.

---

# 🚚 Delivery Management

Fresh Hunt includes a separate delivery module.

Delivery personnel can:

* Login to the system
* View assigned orders
* View delivery information
* Check customer details
* Update delivery status
* Mark orders as delivered

This creates a connection between the **order management system and delivery process**.

---

# ⭐ Reviews and Ratings

Customers can provide feedback after purchasing products.

A review may contain:

* Product
* Customer
* Rating
* Review text
* Date

Example:

```text
Product: Fresh Apples
Rating: ⭐⭐⭐⭐⭐
Review: "The quality was very good."
```

Reviews provide useful information to both customers and administrators.

---

# 🤖 Machine Learning – Review Sentiment Analysis

One of the intelligent features of Fresh Hunt is **Machine Learning-based review sentiment analysis**.

The purpose of sentiment analysis is to determine whether a customer review expresses a:

* Positive sentiment
* Negative sentiment
* Neutral sentiment

### Example

```text
Customer Review
       ↓
"Excellent product and very fresh."
       ↓
Text Processing
       ↓
Machine Learning Model
       ↓
Positive Sentiment
```

Another example:

```text
Customer Review
       ↓
"The product quality was poor."
       ↓
Text Processing
       ↓
Machine Learning Model
       ↓
Negative Sentiment
```

This feature can help administrators understand overall customer satisfaction.

### Possible Uses

Sentiment analysis can be used to:

* Identify negative customer feedback
* Analyze product satisfaction
* Monitor customer opinions
* Identify frequently criticized products
* Generate sentiment statistics
* Support future recommendation systems

---

# ⚡ Real-Time Communication

Fresh Hunt uses **Socket.IO** for real-time communication.

Traditional applications may require users to refresh a page to see updated information.

With real-time communication:

```text
Admin updates order
        ↓
Backend Server
        ↓
Socket.IO Event
        ↓
Connected Client
        ↓
Order Status Updated
```

Possible real-time events include:

* Order status changes
* Delivery status changes
* Inventory updates
* Product availability
* Notifications

This improves the responsiveness of the application.

---

# 🎁 Loyalty and Reward System

Fresh Hunt also includes a loyalty/reward concept.

Customers can potentially receive rewards based on their purchases or activities.

For example:

```text
Customer Purchase
       ↓
Reward Points
       ↓
Points Stored
       ↓
Future Purchase
       ↓
Points Redeemed
```

Possible reward mechanisms include:

* Loyalty points
* Purchase rewards
* Discount benefits
* Promotional offers
* Customer engagement rewards

---

# 👥 User Modules

Fresh Hunt consists of three primary modules.

---

## 👤 1. Customer Module

The customer module handles the complete shopping experience.

### Functions

* Registration
* Login
* OTP verification
* Product browsing
* Search
* Filtering
* Product details
* Shopping cart
* Checkout
* Order placement
* Order history
* Order tracking
* Reviews
* Ratings
* Loyalty rewards

---

## 👨‍💼 2. Admin Module

The admin module controls the management side of the platform.

### Functions

* Admin login
* Product management
* Category management
* Inventory management
* User management
* Order management
* Delivery management
* Review monitoring
* Product availability monitoring

---

## 🚚 3. Delivery Module

The delivery module manages the final stage of the order process.

### Functions

* Delivery login
* Assigned orders
* Customer delivery information
* Order status updates
* Delivery status
* Delivery completion

---

# 🏗️ System Architecture

Fresh Hunt follows a **client-server architecture**.

```text
                    ┌─────────────────────┐
                    │       CUSTOMER      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     React.js        │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                         REST APIs
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express.js│
                    │       Backend       │
                    └───────┬─────┬───────┘
                            │     │
                ┌───────────┘     └─────────────┐
                ▼                               ▼
       ┌─────────────────┐             ┌─────────────────┐
       │     MongoDB     │             │    Socket.IO    │
       │    Database     │             │ Real-Time Data  │
       └─────────────────┘             └─────────────────┘
                │
                ▼
       ┌─────────────────┐
       │ Machine Learning│
       │ Sentiment Model │
       └─────────────────┘
```

---

# 🔄 How Fresh Hunt Works

The overall application workflow can be represented as:

```text
Customer
   ↓
Register / Login
   ↓
Browse Products
   ↓
Search / Filter
   ↓
View Product
   ↓
Add to Cart
   ↓
Checkout
   ↓
Place Order
   ↓
Order Stored in Database
   ↓
Admin Processes Order
   ↓
Delivery Assigned
   ↓
Delivery Status Updated
   ↓
Customer Receives Updates
   ↓
Order Delivered
   ↓
Customer Provides Review
   ↓
Review Sentiment Analysis
```

---

# 🗄️ Database

MongoDB is used as the primary database for Fresh Hunt.

MongoDB is a **NoSQL document-oriented database** that stores information in flexible JSON-like documents.

Major data collections can include:

```text
Users
Products
Categories
Cart
Orders
Reviews
Deliveries
Rewards
```

---

## 👤 Users Collection

Stores information related to registered users.

Possible fields:

```text
userId
name
email
phone
password
role
address
createdAt
```

Possible roles:

```text
customer
admin
delivery
```

---

## 🛍️ Products Collection

Stores grocery product information.

Possible fields:

```text
productId
name
category
description
price
discount
stock
image
rating
createdAt
```

---

## 🧾 Orders Collection

Stores customer order information.

Possible fields:

```text
orderId
userId
products
quantity
totalAmount
address
paymentStatus
orderStatus
createdAt
```

---

## ⭐ Reviews Collection

Stores customer feedback.

Possible fields:

```text
reviewId
userId
productId
rating
reviewText
sentiment
createdAt
```

The `sentiment` field can store the result generated by the Machine Learning component.

---

# 🔌 Backend and API Architecture

The backend is developed using **Node.js and Express.js**.

The backend acts as the communication layer between the frontend and database.

```text
React Frontend
      ↓
HTTP Request
      ↓
Express.js Route
      ↓
Controller
      ↓
Database / Service
      ↓
MongoDB
      ↓
Response
      ↓
React Frontend
```

Example API categories:

```text
/api/users
/api/products
/api/cart
/api/orders
/api/reviews
/api/delivery
/api/admin
```

Possible operations include:

```text
GET     → Retrieve data
POST    → Create data
PUT     → Update data
DELETE  → Remove data
```

---

# 🛠️ Technologies Used

## Frontend

### React.js

Used to develop the interactive user interface and manage different pages/components.

### HTML5

Used for the basic structure of web pages.

### CSS3

Used for styling and layout.

### JavaScript

Used for application logic and client-side functionality.

---

## Backend

### Node.js

Provides the runtime environment for executing JavaScript on the server.

### Express.js

Used for:

* API creation
* Routing
* Middleware
* Request handling
* Server-side application logic

---

## Database

### MongoDB

Used to store:

* Users
* Products
* Orders
* Reviews
* Inventory
* Delivery information
* Rewards

---

## Real-Time Communication

### Socket.IO

Used for real-time communication between the frontend and backend.

---

## Machine Learning

Machine Learning is used for:

**Customer Review Sentiment Analysis**

The model processes review text and classifies the sentiment.

---

## Authentication

OTP authentication and secure account access are included as part of the authentication system.

---

# 📂 Project Structure

A possible project structure is:

```text
fresh-hunt/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── assets/
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── ml/
│   ├── dataset/
│   ├── model/
│   └── sentiment_analysis/
│
├── screenshots/
│
├── README.md
├── .gitignore
└── package.json
```

> The actual folder structure may vary depending on the final implementation.

---

# 🔐 Security

Security is an important part of an eCommerce application.

Fresh Hunt can implement the following security practices:

* User authentication
* Role-based access
* OTP verification
* Password protection
* Protected API routes
* Input validation
* Environment variables
* Secure database connection
* Authentication middleware
* Admin access control

Sensitive information should never be directly written inside the source code.

For example:

```env
MONGO_URI=your_database_connection
JWT_SECRET=your_secret_key
OTP_API_KEY=your_api_key
```

The `.env` file should be added to `.gitignore`.

```text
.env
node_modules/
```

---

# 🚀 How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/fresh-hunt.git
```

Move into the project directory:

```bash
cd fresh-hunt
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Install Backend Dependencies

Open another terminal or navigate to the backend:

```bash
cd ../backend
npm install
```

---

# ⚙️ Environment Configuration

Create a `.env` file inside the backend directory.

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Depending on your implementation, additional variables may include:

```env
JWT_SECRET=your_jwt_secret
OTP_API_KEY=your_otp_api_key
```

Do not upload actual credentials to GitHub.

---

# ▶️ Start the Backend

From the backend directory:

```bash
npm start
```

The backend server will start on the configured port.

Example:

```text
http://localhost:5000
```

---

# ▶️ Start the Frontend

Open another terminal:

```bash
cd frontend
npm start
```

The frontend will normally run on a local development address such as:

```text
http://localhost:3000
```

The exact port depends on the project configuration.

---

# 🖥️ Screenshots

Screenshots should be added to demonstrate the actual working interface.

Recommended screenshots:

### 🏠 Home Page

Add your Fresh Hunt home page screenshot here.

### 🛍️ Product Listing

Add the product listing page screenshot here.

### 📦 Product Details

Add product details screenshot here.

### 🛒 Shopping Cart

Add shopping cart screenshot here.

### 💳 Checkout

Add checkout screenshot here.

### 👨‍💼 Admin Dashboard

Add admin dashboard screenshot here.

### 🚚 Delivery Dashboard

Add delivery module screenshot here.

### ⭐ Review and Sentiment Analysis

Add review/sentiment analysis screenshot here.

---

# 🧪 Testing

The system can be tested using different testing approaches.

## Functional Testing

Important functions to test include:

* Registration
* Login
* OTP verification
* Product search
* Product filtering
* Add to cart
* Remove from cart
* Quantity update
* Checkout
* Order placement
* Order tracking
* Review submission
* Admin product management
* Inventory management
* Delivery status updates

---

## API Testing

Backend APIs can be tested using tools such as Postman.

Example:

```text
Frontend
   ↓
API Request
   ↓
Express Server
   ↓
Controller
   ↓
MongoDB
   ↓
API Response
```

Testing APIs separately helps identify backend problems before integrating them with the frontend.

---

# 📊 Advantages

Fresh Hunt provides several advantages:

* Convenient online grocery shopping
* Easy product discovery
* Centralized product management
* Digital order management
* Inventory monitoring
* Dedicated delivery module
* Customer review system
* Machine Learning-based sentiment analysis
* Real-time updates
* Scalable full-stack architecture
* Better customer interaction
* Reduced manual management

---

# ⚠️ Limitations

As an academic project, the current system may have certain limitations:

* Payment gateway integration may be limited or simulated.
* Delivery route optimization is not fully implemented.
* Product recommendation may not yet be AI-based.
* Machine Learning sentiment analysis depends on the quality of its training data.
* Large-scale production deployment may require additional optimization.
* Advanced fraud detection is not currently implemented.
* Mobile application support may not be available.

These limitations provide opportunities for future development.

---

# 🔮 Future Scope

Fresh Hunt can be extended into a more advanced intelligent grocery platform.

## 🤖 AI Product Recommendations

A recommendation engine can recommend products based on:

* Previous purchases
* Search history
* Frequently purchased products
* Similar products
* Customer preferences

---

## 📦 Intelligent Inventory Prediction

Machine Learning can predict future demand.

```text
Historical Sales Data
        ↓
Machine Learning Model
        ↓
Demand Prediction
        ↓
Inventory Planning
        ↓
Reduced Stock Problems
```

---

## 🛡️ Fraud Detection

Anomaly detection can be introduced to identify suspicious transactions or unusual purchasing behavior.

---

## 💳 Online Payment Gateway

Future versions can integrate payment services supporting:

* UPI
* Credit/Debit Cards
* Net Banking
* Digital Wallets

---

## 🚚 Delivery Route Optimization

A route optimization system can calculate efficient delivery routes based on:

* Customer location
* Delivery priority
* Distance
* Traffic
* Number of deliveries

---

## 📱 Mobile Application

Fresh Hunt can be converted into an Android/iOS application using technologies such as:

* React Native
* Flutter

---

## 🎤 Voice-Based Grocery Search

Customers could search for products using voice commands.

Example:

```text
"Show me rice under ₹500"
```

The system could convert the voice input into a product search query.

---

## 💬 AI Shopping Assistant

An AI-powered chatbot could assist customers with:

* Product discovery
* Product comparison
* Grocery suggestions
* Order tracking
* Frequently asked questions
* Personalized shopping assistance

---

# 📚 Learning Outcomes

Developing Fresh Hunt provides practical experience in several areas of software development.

### Frontend Development

* React.js
* Components
* State management
* Routing
* API integration
* Responsive UI

### Backend Development

* Node.js
* Express.js
* REST APIs
* Middleware
* Authentication
* Server-side logic

### Database

* MongoDB
* CRUD operations
* Data modeling
* Collections
* Database queries

### Real-Time Systems

* Socket.IO
* Event-based communication
* Real-time updates

### Machine Learning

* Text preprocessing
* Review classification
* Sentiment analysis
* Model integration

### Software Engineering

* System architecture
* Modular development
* Testing
* Debugging
* Version control
* GitHub

---

# 📈 Project Workflow Summary

The complete Fresh Hunt system can be summarized as:

```text
                 FRESH HUNT
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼
   Customer        Admin       Delivery
       │             │             │
       ▼             ▼             ▼
  Products       Products      Assigned
  Search         Inventory      Orders
  Cart           Users         Status
  Orders         Orders        Updates
  Reviews        Reviews
       │             │
       └──────┬──────┘
              ▼
         Node.js /
         Express.js
              │
              ▼
           MongoDB
              │
       ┌──────┴───────┐
       ▼              ▼
  Socket.IO      ML Model
       │              │
 Real-Time       Sentiment
  Updates         Analysis
```

---

# 🎓 Project Information

**Project Name:** Fresh Hunt – Smart Grocery eCommerce Website

**Project Type:** Academic Mini Project

**Domain:** Web Development / eCommerce / Machine Learning

**Application:** Full-Stack Web Application

**Frontend:** React.js

**Backend:** Node.js + Express.js

**Database:** MongoDB

**Real-Time Technology:** Socket.IO

**Programming Language:** JavaScript

**Machine Learning:** Review Sentiment Analysis

**Authentication:** OTP / Secure User Authentication

---

# 👥 Team

| Team Member | Responsibility             |
| ----------- | -------------------------- |
| Member 1    | Frontend Development       |
| Member 2    | Backend Development        |
| Member 3    | Database & API Development |
| Member 4    | Machine Learning           |
| Member 5    | Testing & Documentation    |

Replace the placeholder names and responsibilities with your actual team information.

---

# 📄 License

This project was developed for **academic and educational purposes**.

The source code can be used for learning and demonstration purposes according to the terms defined by the project authors.

---

# ⭐ Conclusion

Fresh Hunt demonstrates the development of a complete **smart grocery eCommerce platform** by combining frontend development, backend services, database management, authentication, real-time communication, delivery management, and Machine Learning.

The project provides customers with a convenient way to purchase groceries online while giving administrators and delivery personnel dedicated tools to manage products, orders, inventory, and deliveries.

The integration of **Machine Learning-based review sentiment analysis and real-time communication using Socket.IO** makes the project more than a conventional eCommerce application and provides a foundation for future improvements such as AI recommendations, intelligent inventory prediction, fraud detection, voice search, route optimization, and AI-powered shopping assistance.

---

<p align="center">

## 🛒 Fresh Hunt

**Smart Grocery Shopping — Simple, Convenient & Connected**

⭐ If you find this project useful, consider giving the repository a star!

</p>
