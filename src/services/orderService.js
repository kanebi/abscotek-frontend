import apiClient from '@/lib/apiClient';

// Create order directly
const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

// Create order from cart and clear cart
const checkout = async (checkoutData) => {
  const response = await apiClient.post('/orders/checkout', checkoutData);
  return response.data;
};

// List user's orders
const getOrders = async (category = 'all') => {
  const response = await apiClient.get(`/orders?category=${category}`);
  return response.data;
};

// List user's orders with pagination and filtering
const getOrdersPaginated = async (page = 1, limit = 10, status = 'all') => {
  const response = await apiClient.get(`/orders/paginated?page=${page}&limit=${limit}&status=${status}`);
  return response.data;
};

// Get order by ID (owner or admin)
const getOrderById = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

// Get order by order number (owner or admin)
const getOrderByNumber = async (orderNumber) => {
  const response = await apiClient.get(`/orders/by-number/${orderNumber}`);
  return response.data;
};

// Get order by Paystack reference
const getOrderByPaystackReference = async (reference) => {
  const response = await apiClient.get(`/orders/by-reference/${reference}`);
  return response.data;
};

// Update order status (owner or admin)
const updateOrderStatus = async (id, status) => {
  const response = await apiClient.put(`/orders/${id}/status`, { status });
  return response.data;
};

// --- Admin --- //

// List all orders (admin)
const adminGetAllOrders = async () => {
  const response = await apiClient.get('/admin/orders');
  return response.data;
};

// View order (admin)
const adminGetOrderById = async (id) => {
  const response = await apiClient.get(`/admin/orders/${id}`);
  return response.data;
};

// Update order (admin)
const adminUpdateOrder = async (id, updateData) => {
  const response = await apiClient.put(`/admin/orders/${id}`, updateData);
  return response.data;
};

// Verify payment and create/update order
const verifyPaymentAndCreateOrder = async (orderData) => {
  const response = await apiClient.post('/orders/verify-payment', orderData);
  return response.data;
};

export default {
  createOrder,
  checkout,
  getOrders,
  getOrdersPaginated,
  getOrderById,
  getOrderByNumber,
  getOrderByPaystackReference,
  verifyPaymentAndCreateOrder,
  updateOrderStatus,
  adminGetAllOrders,
  adminGetOrderById,
  adminUpdateOrder,
};