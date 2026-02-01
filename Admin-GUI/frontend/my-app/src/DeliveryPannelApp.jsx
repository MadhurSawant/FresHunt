import React, { useEffect, useState } from "react";
import axios from "axios";
import { Truck, PackageOpen, CheckCheck, History, MapPin, ShoppingCart } from "lucide-react";

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
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0,6))}
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
          <div className="order-card-customer" style={{ fontSize:"0.85rem", color:"var(--text-light)" }}>Username: {username}</div>
        </div>
        <div className="order-card-price">₹{totalAmount.toFixed(2)}</div>
      </div>
      <div className="order-card-body">
        <div className="order-card-detail">
          <MapPin size={18} className="order-card-icon" />
          <div style={{ wordBreak:"break-word" }}>{address}</div>
        </div>
        <div className="order-card-detail">
          <ShoppingCart size={18} className="order-card-icon" />
          <div style={{ wordBreak:"break-word" }}>{items}</div>
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


/* ----------------- Delivery Interface ----------------- */
const DeliveryInterface = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("new");
  const [orders, setOrders] = useState({ new: [], accepted: [], delivered: [] });
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const groupOrders = (list) => {
    const grouped = { new: [], accepted: [], delivered: [] };
    (list || []).forEach(o => {
      const s = o.status || "created";
      if(s === "created" || s === "new") grouped.new.push(o);
      else if(s === "accepted" || s === "shipped") grouped.accepted.push(o);
      else if(s === "delivered" || s === "completed") grouped.delivered.push(o);
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
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontWeight:700 }}>Mad</div>
          <button className="btn" onClick={onLogout} style={{ background:"var(--red)", color:"white", padding:"8px 12px", borderRadius:8 }}>Logout</button>
        </div>
      </header>

      <nav className="app-nav" role="navigation" aria-label="Delivery navigation">
        <button className={`tab-button ${activeTab==="new"?"active":""}`} onClick={()=>setActiveTab("new")}> <PackageOpen size={18}/> New Orders <span className="tab-badge">{orders.new.length}</span></button>
        <button className={`tab-button ${activeTab==="accepted"?"active":""}`} onClick={()=>setActiveTab("accepted")}> <CheckCheck size={18}/> Accepted <span className="tab-badge">{orders.accepted.length}</span></button>
        <button className={`tab-button ${activeTab==="delivered"?"active":""}`} onClick={()=>setActiveTab("delivered")}> <History size={18}/> Delivered <span className="tab-badge">{orders.delivered.length}</span></button>
        <div style={{ marginLeft:"auto", color:"var(--text-light)", alignSelf:"center", fontWeight:600 }}>{loading?"Refreshing...":"Orders refreshed"}</div>
      </nav>

      <main className="app-main">
        {(orders[activeTab].length === 0) ? <p className="empty-text">No orders here.</p>
          : orders[activeTab].map(o =>
            <OrderCard key={o.orderNumber || o.id} order={o} 
              onAccept={o=>safePutStatus(o,"accepted")} 
              onDispatch={o=>safePutStatus(o,"shipped")} 
              onShowOtp={o=>{ setSelectedOrder(o); setShowOtpModal(true); }}
            />
          )
        }
      </main>

      {showOtpModal && selectedOrder &&
        <OtpModal username={selectedOrder.username} orderNumber={selectedOrder.orderNumber || selectedOrder.id}
          onClose={()=>setShowOtpModal(false)} onVerified={fetchOrders}
        />
      }
    </div>
  );
};

/* ----------------- Auth Page ----------------- */
const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin,setIsLogin]=useState(true), [email,setEmail]=useState(""), [password,setPassword]=useState("");
  const submit = e => { e.preventDefault(); onLoginSuccess?.(); };
  return (
    <div className="auth-page">
      <div className="auth-container">
        <Truck size={48} className="auth-icon" />
        <h2 className="auth-title">{isLogin?"Sign in":"Create account"}</h2>
        <form className="auth-form" onSubmit={submit}>
          {!isLogin && <input className="auth-input" placeholder="Full name" required />}
          <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-submit">{isLogin?"Sign in":"Register"}</button>
        </form>
        <p className="auth-toggle">
          {isLogin?"Don't have an account?":"Already have account?"}{" "}
          <button onClick={()=>setIsLogin(!isLogin)} style={{ background:"none", border:"none", color:"var(--green)", fontWeight:700, cursor:"pointer" }}>{isLogin?"Register":"Sign in"}</button>
        </p>
      </div>
    </div>
  );
};

/* ----------------- Root App ----------------- */
export default function DeliveryPanelAppUI(){
  const [isAuthed,setIsAuthed]=useState(false);
  return <>
    <GlobalStyles />
    {!isAuthed ? <AuthPage onLoginSuccess={()=>setIsAuthed(true)} /> : <DeliveryInterface onLogout={()=>setIsAuthed(false)} />}
  </>;
}
