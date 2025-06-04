import axios from 'axios';

const API_URL = "http://localhost:8000";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login/`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/auth/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};