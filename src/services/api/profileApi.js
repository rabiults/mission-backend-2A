import api from './api';

const API_ENDPOINT = '/user';

const getUsers = async () => {
  try {
    const response = await api.get(API_ENDPOINT);
    console.log('Get Users Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get Users Failed:', error.message);
    throw error;
  }
};


const getUserById = async (id) => {
  try {
    const response = await api.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get User By ID Failed:', error.message);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    return (await api.post(API_ENDPOINT, userData)).data;
  } catch (error) {
    console.error('Create User Failed:', error.message);
    throw error;
  }
};

const updateUser = async (id, userData) => {
  try {
    return (await api.put(`${API_ENDPOINT}/${id}`, userData)).data;
  } catch (error) {
    console.error('Update User Failed:', error.message);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    return (await api.delete(`${API_ENDPOINT}/${id}`)).data;
  } catch (error) {
    console.error('Delete User Failed:', error.message);
    throw error;
  }
};

// Test API
const testConnection = async () => {
  try {
    await api.get(API_ENDPOINT);
    return true;
  } catch (error) {
    console.error('API Test Failed:', error.message);
    return false;
  }
};

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  testConnection
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  testConnection
};
