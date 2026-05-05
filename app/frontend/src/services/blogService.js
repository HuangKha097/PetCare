import API from '../api/axios';

/**
 * Blog Service
 * Handles all API calls related to blog posts.
 */

export const getBlogs = () => {
  return API.get('/blogs');
};

export const getBlogById = (id) => {
  return API.get(`/blogs/${id}`);
};
