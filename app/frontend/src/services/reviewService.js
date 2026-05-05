import API from '../api/axios';

/**
 * Review Service
 * Handles all API calls related to product reviews.
 */

export const getReviewsByProduct = (productId) => {
  return API.get(`/reviews/${productId}`);
};

export const createReview = (reviewData) => {
  return API.post('/reviews', reviewData);
};
