// ------------------ IMPORTS ------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto")
const nodemailer = require("nodemailer");

const { Schema, model } = mongoose;



// ------------------ SCHEMAS ------------------

// ✅ Address Schema (embedded)
const AddressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
});

// ✅ Order Item Schema (embedded)
const OrderItemSchema = new Schema(
  {
    product: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

// ✅ Order Schema (embedded inside User)
const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true },
    items: [OrderItemSchema],

    // Delivery address for this order
    address: { type: AddressSchema, required: true },

    // Payment mode for this order
    paymentMode: {
      type: String,
      enum: ["UPI", "CARD", "COD"],
      required: true,
    },

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "created",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "accepted"
      ],
      default: "created",
    },

    loyaltyPointsEarned: { type: Number, default: 0 },
    loyaltyPointsUsed: { type: Number, default: 0 },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true, _id: false }
);



// ✅ User Schema
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hash in prod
    phone: String,

    // Embedded data
    addresses: [AddressSchema],
    orders: [OrderSchema],

    // Loyalty program
    loyaltyPoints: { type: Number, default: 0 },
    loyaltyTier: { type: String, default: "Bronze" },

    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    isActive: { type: Boolean, default: true },

    // 🔹 Forgot password OTP
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

OrderSchema.pre("save", function (next) {
  // When status changes to 'delivered'
  if (this.isModified("status") && this.status === "delivered") {
    this.otp = undefined;
    this.otpExpiry = undefined;
  }
  next();
});


function getTier(points) {
  if (points >= 1000) return "Platinum";
  if (points >= 500) return "Gold";
  if (points >= 200) return "Silver";
  return "Bronze";
}


// ------------------ EXPRESS APP ------------------
const app = express();
app.use(cors());
app.use(express.json());

// ------------------ USER ROUTES ------------------

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "madhur.sawant0608@gmail.com", // 🔹 replace with your Gmail
    pass: "uzxo tpkl ycbe aydl", // 🔹 use an App Password (not real password)
  },
});

// ------------------ USER ROUTES ------------------
app.post("/users", async (req, res) => {
  try {
    const { username, email } = req.body;
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists)
      return res.status(400).json({ error: "Username or email already exists" });
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { username, email } = req.body;
    if (username || email) {
      const duplicate = await User.findOne({
        $or: [{ username }, { email }],
        _id: { $ne: req.params.id },
      });
      if (duplicate)
        return res.status(400).json({ error: "Username or email already exists" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.put("/users/username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { email, currentPassword, newPassword } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedCurrent = crypto.createHash("sha256").update(currentPassword).digest("hex");
    if (user.password !== hashedCurrent)
      return res.status(400).json({ error: "Current password is incorrect" });

    if (newPassword) {
      user.password = crypto.createHash("sha256").update(newPassword).digest("hex");
    }
    if (email) user.email = email;

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ SIGNUP
app.post("/auth/signup", async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email and password are required" });
    }

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists)
      return res.status(400).json({ error: "Username or email already exists" });

    // Hash the password
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const user = new User({
      username,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();
    res.json({ message: "Signup successful", user: { username, email, phone } });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    if (user.password !== hashedPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
});






// ------------------ FORGOT PASSWORD ROUTES ------------------

// ✅ Step 1: Request OTP
app.post("/forgot-password/request", async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    await transporter.sendMail({
      from: "FresHunt <your_email@gmail.com>",
      to: user.email,
      subject: "FresHunt Password Reset OTP",
      text: `Your OTP for resetting your password is: ${otp}. Valid for 10 minutes.`,
    });

    res.json({ success: true, message: "OTP sent successfully to your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Step 2: Verify OTP
app.post("/forgot-password/verify", async (req, res) => {
  try {
    const { email, username, otp } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user || user.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });
    if (user.otpExpiry < Date.now())
      return res.status(400).json({ error: "OTP expired" });
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Step 3: Reset Password
app.post("/forgot-password/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.otp !== otp)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    const hashedPassword = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ------------------ LOYALTY ROUTES ------------------

// Get loyalty by username
app.get("/users/username/:username/loyalty", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("loyaltyPoints loyaltyTier");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      points: user.loyaltyPoints || 0,
      tier: user.loyaltyTier || getTier(0),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST route - add points and update tier
app.post("/users/username/:username/loyalty", async (req, res) => {
  try {
    const { points } = req.body;
    const { username } = req.params;

    if (!points) return res.status(400).json({ error: "Points are required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // increment points
    user.loyaltyPoints = (user.loyaltyPoints || 0) + points;

    // recalc tier
    user.loyaltyTier = getTier(user.loyaltyPoints);

    await user.save();

    res.json({
      message: `${points} points added.`,
      points: user.loyaltyPoints,
      tier: user.loyaltyTier,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add points manually
app.post("/users/username/:username/loyalty", async (req, res) => {
  try {
    const { points } = req.body;
    const { username } = req.params;

    if (!points) return res.status(400).json({ error: "Points are required" });

    const user = await User.findOneAndUpdate(
      { username },
      { $inc: { loyaltyPoints: points } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      message: `${points} points added.`,
      loyaltyPoints: user.loyaltyPoints,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ ADDRESS ROUTES ------------------

// Add new address by username
app.post("/users/username/:username/addresses", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $push: { addresses: req.body } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.addresses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get addresses
app.get("/users/username/:username/addresses", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("addresses");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.addresses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------ ORDER ROUTES ------------------

// Place order with loyalty calculation
// Place order with loyalty calculation
app.post("/users/username/:username/orders", async (req, res) => {
  try {
    const { username } = req.params;
    const { items, totalAmount, loyaltyPointsUsed = 0, paymentMode, address } = req.body;

    if (!paymentMode || !address) {
      return res.status(400).json({ error: "Payment mode and address are required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (loyaltyPointsUsed > user.loyaltyPoints) {
      return res.status(400).json({
        error: "Not enough loyalty points",
        availablePoints: user.loyaltyPoints,
      });
    }

    const loyaltyPointsEarned = Math.floor(totalAmount / 10);

    // 🔹 Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // valid for 15 mins

    const newOrder = {
      orderNumber: `ORD-${Date.now()}`,
      items,
      totalAmount,
      loyaltyPointsUsed,
      loyaltyPointsEarned,
      status: "created",
      paymentMode,
      address,
      otp,
      
    };

    // Update loyalty points balance
    user.loyaltyPoints = user.loyaltyPoints - loyaltyPointsUsed + loyaltyPointsEarned;
    user.loyaltyTier = getTier(user.loyaltyPoints);

    user.orders.push(newOrder);
    await user.save();

    res.json({
      message: "Order placed successfully",
      order: newOrder,
      currentBalance: user.loyaltyPoints,
      otp, // return OTP to frontend for delivery verification
    });
  } catch (err) {
    console.error("❌ Place Order Error:", err);
    res.status(400).json({ error: err.message });
  }
});

  

// Get all orders for a username
app.get("/users/username/:username/orders", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("orders");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single order
app.get("/users/username/:username/orders/:orderNumber", async (req, res) => {
  try {
    const { username, orderNumber } = req.params;
    const user = await User.findOne(
      { username, "orders.orderNumber": orderNumber },
      { "orders.$": 1 }
    );
    if (!user || user.orders.length === 0) return res.status(404).json({ error: "Order not found" });
    res.json(user.orders[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- ALL ORDERS ROUTE ---
// GET /orders → Return all orders from all users
app.get("/orders", async (req, res) => {
  try {
    // Find all users and populate their orders
    const users = await User.find();

    // Flatten all orders into a single array
    const allOrders = users.flatMap((user) =>
      user.orders.map((order) => ({
        username: user.username,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        address: order.address,
        items: order.items,
        date: order.date,
        otp: order.otp,
        paymentMode: order.paymentMode || "Not specified", // ✅ added paymentMode
      }))
    );

    res.json(allOrders);
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});


// ------------------ OTP VERIFICATION & STATUS UPDATE ------------------

// ✅ Verify delivery OTP and mark order as delivered
app.post("/users/username/:username/orders/:orderNumber/verify-otp", async (req, res) => {
  try {
    const { username, orderNumber } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ error: "OTP is required" });
    }

    // Find the user and specific order
    const user = await User.findOne({ username, "orders.orderNumber": orderNumber });
    if (!user) return res.status(404).json({ error: "User or order not found" });

    const order = user.orders.find((o) => o.orderNumber === orderNumber);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Compare OTP
    if (order.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // If valid OTP → update order status to delivered
    order.status = "delivered";
    order.otp = undefined;
    order.otpExpiry = undefined;

    // Save the updated user document
    await user.save();

    res.json({
      success: true,
      message: "✅ OTP verified successfully. Order marked as delivered.",
      order,
    });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update order status manually
app.put("/users/username/:username/orders/:orderNumber/status", async (req, res) => {
  try {
    const { username, orderNumber } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = [
      "created",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
      "accepted"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const user = await User.findOneAndUpdate(
      { username, "orders.orderNumber": orderNumber },
      { $set: { "orders.$.status": status } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User or order not found" });

    res.json({
      success: true,
      message: `✅ Order status updated to "${status}".`,
      order: user.orders.find((o) => o.orderNumber === orderNumber),
    });
  } catch (error) {
    console.error("❌ Status Update Error:", error);
    res.status(500).json({ error: error.message });
  }
});




app.post("/create-payment", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("❌ Razorpay Order Error:", error);
    res.status(500).json({ error: error.message });
  }
});


app.post("/verify-payment", async (req, res) => {
  try {
    const {
      username,
      orderNumber,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }

    const user = await User.findOneAndUpdate(
      { username, "orders.orderNumber": orderNumber },
      {
        $set: {
          "orders.$.status": "paid",
          "orders.$.razorpayOrderId": razorpay_order_id,
          "orders.$.razorpayPaymentId": razorpay_payment_id,
          "orders.$.razorpaySignature": razorpay_signature,
        },
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User or order not found" });

    res.json({
      success: true,
      message: "✅ Payment verified successfully!",
      order: user.orders.find((o) => o.orderNumber === orderNumber),
    });
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
});


// ------------------ SERVER ------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/freshuntDB")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(9000, () => console.log("🚀 Server running on port 9000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err)); 
  
  