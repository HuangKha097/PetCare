import API from '../api/axios';

/**
 * Order Service
 * Handles all API calls related to orders.
 */

export const createOrder = (orderData) => {
  return API.post('/orders', orderData);
};

export const getMyOrders = () => {
  return API.get('/orders/my-orders');
};

// ── Admin ──

export const getAllOrders = () => {
  return API.get('/orders');
};

export const updateOrderStatus = (orderId, status) => {
  return API.patch(`/orders/${orderId}/status`, { status });
};
