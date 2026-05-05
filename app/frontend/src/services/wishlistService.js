import API from '../api/axios';

/**
 * Wishlist Service
 * Handles all API calls related to the user's wishlist.
 */

export const getWishlist = () => {
  return API.get('/wishlist');
};

export const toggleWishlistItem = (productId) => {
  return API.post('/wishlist/toggle', { productId });
};
