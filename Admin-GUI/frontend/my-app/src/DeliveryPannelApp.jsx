import React, { useEffect, useState } from "react";
import axios from "axios";
import { Truck, PackageOpen, CheckCheck, History, MapPin, ShoppingCart, BarChart3, TrendingUp, AlertTriangle, Star, Award, MessageSquare, Zap, Target } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = "http://localhost:9000";

/* ----------------- Global Styles ----------------- */
const GlobalStyles = () => (
  <style>{`
    :root {
      --green: #22c55e; --green-dark: #16a34a;
      --blue: #3b82f6; --blue-dark: #2563eb;
      --red: #ef4444; --red-dark: #dc2626;
      --bg-light: #f3f4f6; --text-dark: #1f2937; --text-light: #6b7280;
      --border-color: #e5e7eb;
      --shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
      --shadow-md: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
    }
    html, body, #root { height:100%; margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; color: var(--text-dark); background: var(--bg-light);}
    * { box-sizing:border-box; }

    .btn { padding:12px 16px; font-size:1rem; font-weight:600; border:none; border-radius:8px; cursor:pointer; transition:0.15s; }
    .btn-submit { background:var(--green); color:white; width:100%; }
    .btn-accept { background:var(--green); color:white; }
    .btn-dispatch { background:var(--blue); color:white; }
    .btn-deliver { background:var(--green); color:white; }
    .btn-cancel { background:var(--border-color); color:var(--text-dark); flex:1; }
    .btn-verify { background:var(--green); color:white; flex:1; }

    .auth-page { display:flex; justify-content:center; align-items:center; min-height:100vh; padding:24px; }
    .auth-container { width:100%; max-width:420px; background:white; border-radius:12px; padding:32px; box-shadow:var(--shadow-md); border:1px solid var(--border-color); text-align:center; }
    .auth-icon { color: var(--green); }
    .auth-title { margin:16px 0 24px; font-size:1.75rem; font-weight:800; }
    .auth-form { display:flex; flex-direction:column; gap:12px; }
    .auth-input { padding:12px 14px; border:1px solid var(--border-color); border-radius:8px; font-size:1rem; }
    .auth-input:focus { outline:none; box-shadow:0 0 0 4px rgba(34,197,94,0.08); border-color: var(--green); }
    .auth-toggle { color:var(--text-light); margin-top:12px; }

    .app-header { background:white; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; box-shadow:var(--shadow); position:sticky; top:0; z-index:10; }
    .app-header-logo { display:flex; gap:12px; align-items:center; }
    .app-header-title { margin:0; font-size:1.25rem; font-weight:700; }
    .app-main { padding:20px; display:flex; flex-direction:column; gap:20px; max-width:1200px; margin:20px auto; width:calc(100%-40px); }

    .app-nav { display:flex; gap:12px; padding:12px 20px; background:white; box-shadow:var(--shadow); margin-top:1px; }
    .tab-button { display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:10px; background:transparent; border:none; font-weight:700; cursor:pointer; color:var(--text-light); position:relative; }
    .tab-button.active { background:var(--green); color:white; box-shadow:var(--shadow); }
    .tab-badge { position:absolute; top:-8px; right:-8px; background:var(--red); color:white; width:22px; height:22px; border-radius:50%; display:flex; justify-content:center; align-items:center; font-weight:700; font-size:0.75rem; border:2px solid white; }

    .order-card { background:white; padding:18px; border-radius:12px; box-shadow:var(--shadow); display:flex; flex-direction:column; gap:12px; max-width:640px; width:100%; }
    .order-card-header { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
    .order-card-id { font-weight:800; font-size:1.05rem; }
    .order-card-customer { color:var(--text-light); font-size:0.9rem; }
    .order-card-price { font-weight:800; color:var(--green); }
    .order-card-body { display:flex; flex-direction:column; gap:8px; padding-top:8px; border-top:1px solid var(--border-color); }
    .order-card-detail { display:flex; gap:8px; align-items:flex-start; color:var(--text-dark); }
    .order-card-icon { color:var(--text-light); margin-top:2px; flex-shrink:0; }
    .order-card-actions { margin-top:6px; display:flex; gap:10px; flex-direction:column; }
    .order-card-delivered-badge { background:#dcfce7; color:#166534; font-weight:700; padding:10px; border-radius:8px; text-align:center; }
    .empty-text { color:var(--text-light); }

    .otp-modal-overlay { position:fixed; inset:0; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:60; padding:20px; }
    .otp-modal-content { background:white; padding:28px; border-radius:12px; width:100%; max-width:420px; box-shadow:var(--shadow-md); }
    .otp-modal-title { font-size:1.25rem; margin:0 0 6px; font-weight:800; text-align:center; }
    .otp-modal-subtitle { color:var(--text-light); text-align:center; margin-bottom:16px; }
    .otp-modal-input { width:100%; padding:12px; font-size:1.25rem; text-align:center; letter-spacing:0.35em; border:2px solid var(--border-color); border-radius:10px; margin-bottom:18px; }
    .otp-modal-actions { display:flex; gap:12px; }

    @media (min-width:900px){ .app-main { align-items:flex-start; } }
  `}</style>
);

/* ----------------- OTP Modal ----------------- */
const OtpModal = ({ username, orderNumber, onClose, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) return alert("Enter 6-digit OTP");
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/users/username/${encodeURIComponent(username)}/orders/${encodeURIComponent(orderNumber)}/verify-otp`,
        { otp }
      );
      alert(res.data?.message || "OTP verified, delivery completed!");
      onVerified?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("OTP verification failed: " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-modal-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="otp-modal-content" role="dialog" aria-modal="true" aria-labelledby="otp-title">
        <h3 id="otp-title" className="otp-modal-title">Complete Delivery</h3>
        <p className="otp-modal-subtitle">Enter 6-digit OTP from customer</p>
        <input
          inputMode="numeric"
          pattern="\d*"
          className="otp-modal-input"
          placeholder="------"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          disabled={loading}
        />
        <div className="otp-modal-actions">
          <button className="btn btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-verify" onClick={handleVerify} disabled={loading || otp.length !== 6}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------- Order Card ----------------- */
/* ----------------- Order Card ----------------- */
const OrderCard = ({ order, onAccept, onDispatch, onShowOtp }) => {
  const id = order?.id || order?.orderNumber || "—";
  const customerName = order?.customerName || order?.customer || "Customer";
  const username = order?.username || "—";
  const totalAmount = Number(order?.totalAmount ?? order?.amount ?? 0);
  const paymentMode = order?.paymentMode || "Not specified";

  const formatAddress = (addr) => {
    if (!addr) return "Address not provided";
    if (typeof addr === "string") return addr;
    const { street, city, state, country } = addr;
    return [street, city, state, country].filter(Boolean).join(", ");
  };
  const address = formatAddress(order?.address || order?.deliveryAddress);

  const items = Array.isArray(order?.items)
    ? order.items.map((it) => (typeof it === "object" ? it.name : it)).join(", ")
    : order?.items || "Items not listed";

  const status = order?.status || "created";
  const deliveredOn = order?.deliveredAt || order?.date || null;

  return (
    <article className="order-card" aria-labelledby={`order-${id}`}>
      <div className="order-card-header">
        <div>
          <div id={`order-${id}`} className="order-card-id">{id}</div>
          <div className="order-card-customer">For: {customerName}</div>
          <div className="order-card-customer" style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>Username: {username}</div>
        </div>
        <div className="order-card-price">₹{totalAmount.toFixed(2)}</div>
      </div>
      <div className="order-card-body">
        <div className="order-card-detail">
          <MapPin size={18} className="order-card-icon" />
          <div style={{ wordBreak: "break-word" }}>{address}</div>
        </div>
        <div className="order-card-detail">
          <ShoppingCart size={18} className="order-card-icon" />
          <div style={{ wordBreak: "break-word" }}>{items}</div>
        </div>
        <div className="order-card-detail">

          <strong>Mode of Payment:</strong> {order.paymentMode || "-"}
        </div>
      </div>
      <div className="order-card-actions">
        {status === "created" && <button className="btn btn-accept" onClick={() => onAccept(order)}>Accept Order</button>}
        {(status === "accepted" || status === "shipped") && (
          <>
            {status === "accepted" && (
              <button className="btn btn-dispatch" onClick={() => onDispatch(order)}>
                Mark as Dispatched
              </button>
            )}
            <button className="btn btn-deliver" onClick={() => onShowOtp(order)}>
              Mark as Delivered
            </button>
          </>
        )}
        {status === "delivered" && <div className="order-card-delivered-badge">Delivered{deliveredOn ? ` on ${new Date(deliveredOn).toLocaleDateString()}` : ""}</div>}
      </div>
    </article>
  );
};



/* ----------------- Sentiment Analysis Component ----------------- */
const SentimentAnalysis = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/sentiment/dashboard");
      
      if (res.data && res.data.length > 0) {
        // Aggregate Overall Data
        const overallData = {
          category: "Overall",
          sentiment_distribution: { positive: 0, neutral: 0, negative: 0 },
          average_sentiment_score: 0,
          total_reviews: 0,
          products: []
        };

        let totalScoreSum = 0;

        res.data.forEach(cat => {
          overallData.sentiment_distribution.positive += cat.sentiment_distribution.positive;
          overallData.sentiment_distribution.neutral += cat.sentiment_distribution.neutral;
          overallData.sentiment_distribution.negative += cat.sentiment_distribution.negative;
          overallData.total_reviews += cat.total_reviews;
          overallData.products.push(...cat.products);
          
          totalScoreSum += cat.average_sentiment_score * cat.total_reviews;
        });

        if (overallData.total_reviews > 0) {
          overallData.average_sentiment_score = totalScoreSum / overallData.total_reviews;
        }

        overallData.products.sort((a, b) => b.score - a.score);
        if (overallData.products.length > 0) {
          overallData.top_product = overallData.products[0].name;
          overallData.low_product = overallData.products[overallData.products.length - 1].name;
        }

        const fullData = [overallData, ...res.data];
        setDashboardData(fullData);
        setActiveCategory("Overall");
      }
    } catch (err) {
      console.error("Dashboard data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeData = dashboardData.find((d) => d.category === activeCategory);

  const COLORS = {
    positive: '#22c55e', // Green
    neutral: '#3b82f6',  // Blue
    negative: '#ef4444'  // Red
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", background: "white", borderRadius: "12px", color: "var(--green)", boxShadow: "var(--shadow)" }}>
        <h2><Zap size={24} className="spin-animation" style={{ marginRight: 8, display: "inline-block" }} /> Analyzing Sentiment Data...</h2>
      </div>
    );
  }

  if (!activeData) {
    return <p className="empty-text">No sentiment data available.</p>;
  }

  const {
    sentiment_distribution,
    average_sentiment_score,
    total_reviews,
    top_product,
    low_product,
    products
  } = activeData;

  const pieData = [
    { name: 'Positive', value: sentiment_distribution.positive, color: COLORS.positive },
    { name: 'Neutral', value: sentiment_distribution.neutral, color: COLORS.neutral },
    { name: 'Negative', value: sentiment_distribution.negative, color: COLORS.negative }
  ].filter((d) => d.value > 0);

  // Determine dominant sentiment
  const maxSent = Math.max(sentiment_distribution.positive, sentiment_distribution.neutral, sentiment_distribution.negative);
  const dominant = maxSent === sentiment_distribution.positive ? "Positive" : maxSent === sentiment_distribution.negative ? "Negative" : "Neutral";
  const dominantColor = maxSent === sentiment_distribution.positive ? COLORS.positive : maxSent === sentiment_distribution.negative ? COLORS.negative : COLORS.neutral;

  // Simple insight generation
  const getInsight = () => {
    if (average_sentiment_score > 0.5) return "Performance is excellent. Customer satisfaction is very high in this area.";
    if (average_sentiment_score < 0) return "Attention required. Negative feedback is outweighing positive. Check quality immediately.";
    return "Stable feedback. Consistent neutral ratings highlight opportunities for improvement.";
  };

  return (
    <div className="sentiment-dashboard">
      <style>{`
        .sentiment-dashboard {
          color: var(--text-dark);
          position: relative;
          font-family: 'Inter', system-ui, sans-serif;
          width: 100%;
        }
        .sentiment-dashboard * { box-sizing: border-box; }
        
        .sd-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .sd-title { font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 12px; margin: 0; color: var(--text-dark); }
        .tech-badge { background: #dcfce7; border: 1px solid #86efac; font-size: 0.75rem; color: #166534; padding: 4px 10px; border-radius: 12px; font-weight: 700; text-transform: uppercase; }
        
        .cat-tabs { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 24px; scrollbar-width: none; }
        .cat-tabs::-webkit-scrollbar { display: none; }
        .cat-tab { background: white; color: var(--text-light); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 20px; cursor: pointer; transition: all 0.2s ease; font-weight: 600; box-shadow: var(--shadow); white-space: nowrap; }
        .cat-tab:hover { border-color: #bbf7d0; color: var(--green-dark); }
        .cat-tab.active { background: var(--green); border-color: var(--green); color: white; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
        
        .dash-panel { background: white; border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; box-shadow: var(--shadow); }
        
        .insights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .insight-card { display: flex; flex-direction: column; gap: 8px; position: relative; overflow: hidden; }
        .insight-card::before { content: ""; position: absolute; top: 0; left: 0; width: 4px; height: 100%; border-radius: 4px 0 0 4px; }
        .insight-title { font-size: 0.85rem; color: var(--text-light); text-transform: uppercase; font-weight: 700; display: flex; align-items: center; gap: 6px; }
        .insight-value { font-size: 1.6rem; font-weight: 800; display: flex; align-items: baseline; gap: 8px; color: var(--text-dark); }
        .insight-sub { font-size: 0.8rem; color: var(--text-light); font-weight: 500; }
        
        .chart-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 32px; }
        @media (max-width: 900px) { .chart-grid { grid-template-columns: 1fr; } }
        
        .pie-container { display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 24px; height: 100%; min-height: 280px; }
        .legend-list { display: flex; flex-direction: column; gap: 16px; }
        .legend-item { display: flex; align-items: center; gap: 12px; }
        .legend-color { width: 14px; height: 14px; border-radius: 4px; }
        .legend-val { font-size: 1.25rem; font-weight: 700; color: var(--text-dark); }
        .legend-label { color: var(--text-light); font-size: 0.9rem; font-weight: 600; }
        
        .rec-panel { background: #f0fdf4; border: 1px solid #bbf7d0; display: flex; flex-direction: column; justify-content: center; }
        .rec-icon { color: var(--green); margin-bottom: 12px; }
        
        .section-heading { font-size: 1.15rem; font-weight: 800; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; color: var(--text-dark); border-bottom: 1px solid var(--border-color); padding-bottom: 12px; }
        
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .product-card { display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s, box-shadow 0.2s; cursor: default; }
        .product-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: #d1d5db; }
        .prod-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .prod-name { font-weight: 800; font-size: 1.05rem; margin: 0; color: var(--text-dark); }
        .prod-score-badge { font-size: 0.8rem; font-weight: 800; padding: 4px 8px; border-radius: 12px; background: #f3f4f6; display: flex; align-items: center; gap: 4px; border: 1px solid var(--border-color); }
        
        .mini-meter { width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; display: flex; overflow: hidden; margin: 12px 0 8px; }
        .meter-fill-pos { background: #22c55e; }
        .meter-fill-neu { background: #3b82f6; }
        .meter-fill-neg { background: #ef4444; }
        
        .prod-stats-row { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; }
        .stat-pos { color: #16a34a; }
        .stat-neu { color: #2563eb; }
        .stat-neg { color: #dc2626; }
        
        /* Tooltip customization for recharts */
        .recharts-tooltip-wrapper { outline: none !important; }
        .recharts-tooltip-cursor { fill: rgba(0,0,0,0.05); }
        
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin-animation { animation: spin 2s linear infinite; }
      `}</style>

      <header className="sd-header">
        <h2 className="sd-title"><Target color="var(--green)" /> Sentiment Analysis <span className="tech-badge">Live</span></h2>
        <button className="btn" onClick={fetchDashboardData} style={{ background: 'white', border: '1px solid var(--border-color)', color: 'var(--text-dark)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', boxShadow: 'var(--shadow)' }}>
          <Zap size={14} color="var(--green)" /> Refresh
        </button>
      </header>

      {/* Category Selection */}
      <div className="cat-tabs">
        {dashboardData.map((d) => (
          <button
            key={d.category}
            className={`cat-tab ${activeCategory === d.category ? 'active' : ''}`}
            onClick={() => setActiveCategory(d.category)}
          >
            {d.category}
          </button>
        ))}
      </div>

      {/* Insight Panels */}
      <div className="insights-grid">
        <div className="dash-panel insight-card" style={{ borderLeftColor: dominantColor, borderLeftWidth: '4px' }}>
          <div className="insight-title"><TrendingUp size={16} /> Dominant Rating</div>
          <div className="insight-value" style={{ color: dominantColor }}>{dominant}</div>
          <div className="insight-sub">{maxSent} occurrences</div>
        </div>
        <div className="dash-panel insight-card" style={{ borderLeftColor: "#3b82f6", borderLeftWidth: '4px' }}>
          <div className="insight-title"><Star size={16} /> Avg Metric</div>
          <div className="insight-value">{average_sentiment_score > 0 ? "+" : ""}{average_sentiment_score.toFixed(2)}</div>
          <div className="insight-sub">Composite Score (-1 to 1)</div>
        </div>
        <div className="dash-panel insight-card" style={{ borderLeftColor: "var(--text-light)", borderLeftWidth: '4px' }}>
          <div className="insight-title"><MessageSquare size={16} /> Total Reviews</div>
          <div className="insight-value">{total_reviews}</div>
          <div className="insight-sub">Validated Feedbacks</div>
        </div>
        <div className="dash-panel insight-card" style={{ borderLeftColor: COLORS.positive, borderLeftWidth: '4px' }}>
          <div className="insight-title"><Award size={16} /> Top Performer</div>
          <div className="insight-value" style={{ fontSize: "1.2rem" }}>{top_product}</div>
          <div className="insight-sub">Highest Satisfaction</div>
        </div>
        <div className="dash-panel insight-card" style={{ borderLeftColor: COLORS.negative, borderLeftWidth: '4px' }}>
          <div className="insight-title"><AlertTriangle size={16} /> Needs Attention</div>
          <div className="insight-value" style={{ fontSize: "1.2rem" }}>{low_product}</div>
          <div className="insight-sub">Lowest Index</div>
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="chart-grid">
        <div className="dash-panel">
          <h3 className="section-heading"><BarChart3 size={20} color="var(--green)" /> {activeCategory} Distribution</h3>
          <div className="pie-container">
            <div style={{ width: '250px', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)', boxShadow: 'var(--shadow-md)', fontWeight: 'bold' }}
                    itemStyle={{ color: 'var(--text-dark)' }}
                  />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="legend-list">
              {pieData.map((item) => (
                <div key={item.name} className="legend-item">
                  <div className="legend-color" style={{ background: item.color }} />
                  <div>
                    <div className="legend-val">{item.value}</div>
                    <div className="legend-label">{item.name} <span style={{ fontWeight: 400 }}>({Math.round((item.value / total_reviews) * 100)}%)</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-panel rec-panel">
          <Zap size={36} className="rec-icon" />
          <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: 'var(--green-dark)' }}>Actionable Insight</h3>
          <p style={{ margin: 0, color: 'var(--text-dark)', lineHeight: 1.6, fontSize: '0.95rem', fontWeight: 500 }}>{getInsight()}</p>
        </div>
      </div>

      {/* Product Graph Array */}
      {products.length > 0 && (
        <>
          <h3 className="section-heading" style={{ marginTop: '16px' }}><PackageOpen size={20} color="var(--green)" /> Products in {activeCategory}</h3>
          <div className="products-grid">
            {products.map((prod) => {
              const posPct = prod.total > 0 ? (prod.positive / prod.total) * 100 : 0;
              const neuPct = prod.total > 0 ? (prod.neutral / prod.total) * 100 : 0;
              const negPct = prod.total > 0 ? (prod.negative / prod.total) * 100 : 0;

              return (
                <div key={prod.name} className="dash-panel product-card">
                  <div className="prod-header">
                    <div>
                      <h4 className="prod-name">{prod.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px', fontWeight: 500 }}>{prod.total} Reviews</div>
                    </div>
                    <div className="prod-score-badge" style={{ color: prod.score > 0 ? COLORS.positive : prod.score < 0 ? COLORS.negative : COLORS.neutral }}>
                      <Star size={12} fill="currentColor" /> {prod.score > 0 ? "+" : ""}{prod.score}
                    </div>
                  </div>

                  {/* Mini Sentiment Meter (Stacked Bar) */}
                  <div className="mini-meter">
                    <div className="meter-fill-pos" style={{ width: `${posPct}%` }} title={`Positive: ${posPct.toFixed(1)}%`} />
                    <div className="meter-fill-neu" style={{ width: `${neuPct}%` }} title={`Neutral: ${neuPct.toFixed(1)}%`} />
                    <div className="meter-fill-neg" style={{ width: `${negPct}%` }} title={`Negative: ${negPct.toFixed(1)}%`} />
                  </div>

                  <div className="prod-stats-row">
                    <span className="stat-pos">Pos: {prod.positive}</span>
                    <span className="stat-neu">Neu: {prod.neutral}</span>
                    <span className="stat-neg">Neg: {prod.negative}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};


/* ----------------- Delivery Interface ----------------- */
const DeliveryInterface = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("new");
  const [orders, setOrders] = useState({ new: [], accepted: [], delivered: [], sentiment: [] });
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const groupOrders = (list) => {
    const grouped = { new: [], accepted: [], delivered: [] };
    (list || []).forEach(o => {
      const s = o.status || "created";
      if (s === "created" || s === "new") grouped.new.push(o);
      else if (s === "accepted" || s === "shipped") grouped.accepted.push(o);
      else if (s === "delivered" || s === "completed") grouped.delivered.push(o);
      else grouped.new.push(o);
    });
    return grouped;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/orders`);
      const all = Array.isArray(res.data) ? res.data : res.data?.orders || [];
      setOrders(groupOrders(all));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      alert("Failed to fetch orders: " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const safePutStatus = async (order, status) => {
    const username = order?.username;
    const orderNum = order?.orderNumber || order?.id;

    if (!username || !orderNum) return alert("Invalid order data");

    try {
      await axios.put(
        `${API_URL}/users/username/${encodeURIComponent(username)}/orders/${encodeURIComponent(orderNum)}/status`,
        { status }
      );
      await fetchOrders(); // await to ensure UI updates after status change
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed: " + (err?.response?.data?.error || err.message));
    }
  };


  return (
    <div>
      <header className="app-header">
        <div className="app-header-logo">
          <Truck size={28} /> <h1 className="app-header-title">Delivery Panel</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 700 }}>Mad</div>
          <button className="btn" onClick={onLogout} style={{ background: "var(--red)", color: "white", padding: "8px 12px", borderRadius: 8 }}>Logout</button>
        </div>
      </header>

      <nav className="app-nav" role="navigation" aria-label="Delivery navigation">
        <button className={`tab-button ${activeTab === "new" ? "active" : ""}`} onClick={() => setActiveTab("new")}> <PackageOpen size={18} /> New Orders <span className="tab-badge">{orders.new.length}</span></button>
        <button className={`tab-button ${activeTab === "accepted" ? "active" : ""}`} onClick={() => setActiveTab("accepted")}> <CheckCheck size={18} /> Accepted <span className="tab-badge">{orders.accepted.length}</span></button>
        <button className={`tab-button ${activeTab === "delivered" ? "active" : ""}`} onClick={() => setActiveTab("delivered")}> <History size={18} /> Delivered <span className="tab-badge">{orders.delivered.length}</span></button>
        <button className={`tab-button ${activeTab === "sentiment" ? "active" : ""}`} onClick={() => setActiveTab("sentiment")}> <BarChart3 size={18} /> Sentiment</button>
        <div style={{ marginLeft: "auto", color: "var(--text-light)", alignSelf: "center", fontWeight: 600 }}>{loading ? "Refreshing..." : "Orders refreshed"}</div>
      </nav>

      <main className="app-main">
        {activeTab === "sentiment" ? (
          <SentimentAnalysis />
        ) : (orders[activeTab].length === 0) ? <p className="empty-text">No orders here.</p>
          : orders[activeTab].map(o =>
            <OrderCard key={o.orderNumber || o.id} order={o}
              onAccept={o => safePutStatus(o, "accepted")}
              onDispatch={o => safePutStatus(o, "shipped")}
              onShowOtp={o => { setSelectedOrder(o); setShowOtpModal(true); }}
            />
          )
        }
      </main>

      {showOtpModal && selectedOrder &&
        <OtpModal username={selectedOrder.username} orderNumber={selectedOrder.orderNumber || selectedOrder.id}
          onClose={() => setShowOtpModal(false)} onVerified={fetchOrders}
        />
      }
    </div>
  );
};

/* ----------------- Auth Page ----------------- */
const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // Use dummy dummy admin login check
    if (email === "admin@gmail.com" && password === "admin123") {
      onLoginSuccess?.();
    } else {
      alert("Invalid credentials. Try using admin@gmail.com and admin123");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Truck size={48} className="auth-icon" />
        <h2 className="auth-title">{isLogin ? "Sign in" : "Create account"}</h2>
        <form className="auth-form" onSubmit={submit}>
          {!isLogin && <input className="auth-input" placeholder="Full name" required />}
          <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="auth-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-submit">{isLogin ? "Sign in" : "Register"}</button>
        </form>
        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: "none", border: "none", color: "var(--green)", fontWeight: 700, cursor: "pointer" }}>{isLogin ? "Register" : "Sign in"}</button>
        </p>
      </div>
    </div>
  );
};

/* ----------------- Root App ----------------- */
export default function DeliveryPanelAppUI() {
  const [isAuthed, setIsAuthed] = useState(false);
  return <>
    <GlobalStyles />
    {!isAuthed ? <AuthPage onLoginSuccess={() => setIsAuthed(true)} /> : <DeliveryInterface onLogout={() => setIsAuthed(false)} />}
  </>;
}
