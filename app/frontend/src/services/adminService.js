import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// Overview
export const getDashboardAnalytics = (days = 30) => {
    return axios.get(`${API_URL}/dashboard?days=${days}`, getAuthHeader());
};

export const getRecentNotifications = () => {
    return axios.get(`${API_URL}/notifications`, getAuthHeader());
};

// Users
export const getAllUsers = () => {
    return axios.get(`${API_URL}/users`, getAuthHeader());
};

export const getUserDetails = (id) => {
    return axios.get(`${API_URL}/users/${id}`, getAuthHeader());
};

export const updateUserInfo = (id, userData, adminPassword) => {
    return axios.put(
        `${API_URL}/users/${id}`, 
        { ...userData, adminPassword }, 
        getAuthHeader()
    );
};

export const toggleUserStatus = (id, adminPassword) => {
    return axios.patch(
        `${API_URL}/users/${id}/status`, 
        { adminPassword }, 
        getAuthHeader()
    );
};

export const deleteUser = (id, adminPassword) => {
    // Axios DELETE with body requires 'data' property
    return axios.delete(
        `${API_URL}/users/${id}`, 
        { 
            ...getAuthHeader(),
            data: { adminPassword }
        }
    );
};
