import API from '../api/axios';

/**
 * Product Service
 * Handles all API calls related to products.
 */

export const getProducts = (params = {}) => {
  return API.get('/products', { params });
};

export const getPopularProducts = () => {
  return API.get('/products/popular');
};

export const getProductById = (id) => {
  return API.get(`/products/${id}`);
};

export const searchProducts = (queryString) => {
  return API.get(`/products?${queryString}`);
};

// ── Admin ──

export const getAllProductsAdmin = () => {
  return API.get('/products/admin/all');
};

export const createProduct = (productData) => {
  return API.post('/products', productData);
};

export const updateProduct = (id, productData, adminPassword) => {
  return API.put(`/products/${id}`, { ...productData, admin_password: adminPassword });
};

export const updateProductStatus = (id, is_active) => {
  return API.patch(`/products/${id}/status`, { is_active });
};

export const deleteProduct = (id, adminPassword) => {
  return API.delete(`/products/${id}`, { data: { admin_password: adminPassword } });
};
