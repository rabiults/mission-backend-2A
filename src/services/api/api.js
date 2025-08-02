import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3001'; 

const api = axios.create({
  baseURL,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});


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
    
    // Add auth token dari localStorage jika ada
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Added auth token to request');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle response dan error
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
    
    // Enhanced error handling
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
          console.error('🔴 Unauthorized - Token invalid/expired');
          // Auto logout jika token invalid
          if (localStorage.getItem('token')) {
            console.log('🔄 Removing invalid token and redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          break;
        case 403:
          console.error('🔴 Forbidden');
          break;
        case 404:
          console.error('🔴 Not Found - Check endpoint URL');
          console.error('💡 Trying to access:', errorDetails.url);
          break;
        case 409:
          console.error('🔴 Conflict - Data already exists');
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

// API Service Functions untuk Auth
export const authAPI = {
  // Register user
  register: (userData) => {
    console.log('📝 Registering user via API:', userData);
    return api.post('/api/auth/register', userData);
  },

  // Login user
  login: (credentials) => {
    console.log('🔐 Logging in user via API:', { email: credentials.email });
    return api.post('/api/auth/login', credentials);
  },

  // Logout user
  logout: () => {
    console.log('🚪 Logging out user via API');
    return api.post('/api/auth/logout');
  },

  // Get user profile
  getProfile: () => {
    console.log('👤 Getting user profile via API');
    return api.get('/api/auth/profile');
  },

  // Verify email
  verifyEmail: (token) => {
    console.log('✉️ Verifying email via API:', { token });
    return api.get(`/api/auth/verifikasi-email?token=${token}`);
  }
};

// Connection test functions
export const checkApiConnection = async () => {
  try {
    console.log('🔍 Checking API connection at:', baseURL);
    // Test dengan endpoint yang tidak memerlukan auth
    const response = await api.get('/');
    console.log('✅ API Connection Check Successful:', {
      status: response.status,
      message: 'Successfully connected to backend'
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
        url: `${baseURL}/`
      }
    };
  }
};

// Test koneksi auth endpoints
export const testAuthEndpoints = async () => {
  console.log('🔍 Testing auth endpoints...');
  
  const results = {
    register: false,
    login: false,
    summary: ''
  };
  
  try {
    // Test register endpoint dengan data dummy (akan gagal karena data tidak lengkap, tapi endpoint harus respond)
    await api.post('/api/auth/register', {});
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Register endpoint responding (400 expected for empty data)');
      results.register = true;
    }
  }
  
  try {
    // Test login endpoint dengan data dummy
    await api.post('/api/auth/login', {});
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Login endpoint responding (400 expected for empty data)');
      results.login = true;
    }
  }
  
  if (results.register && results.login) {
    results.summary = '✅ All auth endpoints are accessible';
  } else {
    results.summary = '❌ Some auth endpoints are not accessible';
  }
  
  console.log('📊 Auth Endpoints Test Summary:', results.summary);
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
  console.log('   Available auth endpoints:');
  console.log('     - POST /api/auth/register');
  console.log('     - POST /api/auth/login');
  console.log('     - POST /api/auth/logout');
  console.log('     - GET /api/auth/profile');
  console.log('     - GET /api/auth/verifikasi-email');
};

// Quick test function untuk development
export const quickTest = async () => {
  debugApiConfig();
  const connectionTest = await checkApiConnection();
  const authTest = await testAuthEndpoints();
  
  return {
    connection: connectionTest,
    auth: authTest
  };
};

export default api;