import API from '../api/axios';

/**
 * Cart Service
 * Handles all API calls related to the shopping cart.
 */

export const getCart = () => {
  return API.get('/cart');
};

export const addItemToCart = (productId, quantity) => {
  return API.post('/cart', { productId, quantity });
};

export const updateCartItemQty = (cartItemId, quantity) => {
  return API.put(`/cart/${cartItemId}`, { quantity });
};

export const removeCartItem = (cartItemId) => {
  return API.delete(`/cart/${cartItemId}`);
};
