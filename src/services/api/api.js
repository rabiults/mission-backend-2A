import axios from 'axios';

// Base URL configuration - PERBAIKI: gunakan port backend yang benar
const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3001'; // Port backend yang benar

const api = axios.create({
  baseURL,
  timeout: 30000, // Increased timeout untuk development
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // PENTING: Untuk CORS issues
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params,
      data: config.data
    });
    
    // Add auth token if exists (optional)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      data: response.data
    });
    
    return response;
  },
  (error) => {
    const errorDetails = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      code: error.code,
      data: error.response?.data,
      baseURL: error.config?.baseURL
    };
    
    console.error('❌ Response Error Details:', errorDetails);
    
    // Enhanced error handling untuk debugging
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.log('🔍 Server Error Response:', {
        status,
        data,
        headers: error.response.headers
      });
      
      switch (status) {
        case 400:
          console.error('🔴 Bad Request - Check request data');
          break;
        case 401:
          console.error('🔴 Unauthorized');
          break;
        case 403:
          console.error('🔴 Forbidden');
          break;
        case 404:
          console.error('🔴 Not Found - Check endpoint URL');
          console.error('💡 Trying to access:', errorDetails.url);
          break;
        case 500:
          console.error('🔴 Internal Server Error');
          break;
        default:
          console.error(`🔴 HTTP Error: ${status}`);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('🔴 Network Error - No response from server');
      console.error('🔍 Request details:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`,
        method: error.config?.method,
        timeout: error.config?.timeout
      });
      
      if (error.code === 'ECONNABORTED') {
        console.error('🔴 Request timeout - Server took too long');
        error.message = 'Request timeout - server tidak merespons dalam waktu yang ditentukan';
      } else if (error.code === 'ERR_NETWORK') {
        console.error('🔴 Network connection failed');
        console.error('💡 Kemungkinan penyebab:');
        console.error('   - Backend server tidak berjalan di', baseURL);
        console.error('   - CORS policy blocking request');
        console.error('   - Port salah atau firewall blocking');
        error.message = 'Tidak dapat terhubung ke backend server';
      } else if (error.code === 'ERR_CONNECTION_REFUSED') {
        console.error('🔴 Connection refused');
        console.error('💡 Backend server mungkin tidak berjalan di port 3001');
        error.message = 'Koneksi ditolak - pastikan backend server berjalan';
      }
    } else {
      console.error('🔴 Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API connectivity check menggunakan endpoint /api/kelas
export const checkApiConnection = async () => {
  try {
    console.log('🔍 Checking API connection at:', baseURL);
    const response = await api.get('/api/kelas');
    console.log('✅ API Connection Check Successful:', {
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
      message: 'Successfully connected to /api/kelas endpoint'
    });
    return { success: true, data: response.data, message: 'API connection successful' };
  } catch (error) {
    console.error('❌ API Connection Check Failed:', error.message);
    return { 
      success: false, 
      error: error.message,
      details: {
        code: error.code,
        status: error.response?.status,
        url: `${baseURL}/api/kelas`
      }
    };
  }
};

// Test koneksi ke endpoint kelas (alias untuk checkApiConnection)
export const testKelasEndpoint = async () => {
  return await checkApiConnection();
};

// Direct axios test (bypass interceptors untuk debugging)
export const testDirectConnection = async () => {
  try {
    console.log('🔍 Testing direct axios connection...');
    const response = await axios.get('http://localhost:3001/api/kelas', {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Direct connection successful:', {
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Direct connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    return { success: false, error: error.message };
  }
};

// Comprehensive connection test dengan multiple methods
export const runConnectionTests = async () => {
  console.log('🚀 Running comprehensive API connection tests...');
  
  const results = {
    configured: false,
    interceptor: false,
    direct: false,
    summary: ''
  };
  
  // Test 1: Using configured API instance
  console.log('\n📋 Test 1: Using configured API instance');
  const configuredTest = await checkApiConnection();
  results.configured = configuredTest.success;
  
  // Test 2: Direct axios call
  console.log('\n📋 Test 2: Direct axios connection');
  const directTest = await testDirectConnection();
  results.direct = directTest.success;
  
  // Summary
  if (results.configured && results.direct) {
    results.summary = '✅ All tests passed - API connection is working properly';
  } else if (results.configured || results.direct) {
    results.summary = '⚠️ Partial success - some connection methods work';
  } else {
    results.summary = '❌ All tests failed - check backend server and network';
  }
  
  console.log('\n📊 Connection Test Summary:');
  console.log('   Configured API:', results.configured ? '✅' : '❌');
  console.log('   Direct Connection:', results.direct ? '✅' : '❌');
  console.log('   Overall:', results.summary);
  
  return results;
};

// Debug function untuk cek konfigurasi
export const debugApiConfig = () => {
  console.log('🔧 API Configuration Debug:');
  console.log('   Base URL:', baseURL);
  console.log('   Environment VITE_API_BASE:', import.meta.env.VITE_API_BASE);
  console.log('   Timeout:', api.defaults.timeout);
  console.log('   Headers:', api.defaults.headers);
  console.log('   With Credentials:', api.defaults.withCredentials);
  console.log('   Available endpoints: /api/kelas');
};

// Quick test function untuk development
export const quickTest = async () => {
  debugApiConfig();
  return await checkApiConnection();
};

export default api;