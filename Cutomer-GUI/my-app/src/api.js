import axios from "axios";
import { data } from "react-router-dom";

// ================= BASE API INSTANCE =================
const API = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Backend base URL
});

// Attach token automatically for protected routes
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

// ==================== AUTH ====================
// ==================== AUTH ====================
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);


// If backend expects token in body:
export const resetPassword = (token, data) =>
  API.post("/auth/reset-password", { token, ...data });
// If backend expects token in URL, switch back:
// API.post(`/auth/reset-password/${token}`, data);

// ==================== USERS ====================
export const getUserProfile = () => API.get("/users/profile");
export const updateUserProfile = (data) => API.put("/users/profile", data);
export const addUserAddress = (data) => API.post("/users/address", data);
export const getUserProfileByUsername =(data)=>API.get("users/profile",data)

export const getAllUsers = () => API.get("/users");
export const deleteUser = (id) => API.delete(`/users/${id}`);

// ==================== PRODUCTS ====================
export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ✅ Fixed: now accepts category param
export const getProductsByCategory = (category) =>
  API.get(`/products/by-category?category=${category}`);

// ==================== ORDERS ====================
export const createOrder = (data) => API.post("/orders", data);
export const getUserOrders = () => API.get("/orders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, data) =>
  API.put(`/orders/${id}/status`, data);

// ==================== LOYALTY ====================
export const getLoyaltyPrograms = () => API.get("/loyalty");
export const createLoyaltyProgram = (data) => API.post("/loyalty", data);
export const enrollInLoyalty = (data) => API.post("/loyalty/enroll", data);
export const getLoyaltyByUserId = (id) => API.get(`/loyalty/${id}`);
export default API;
