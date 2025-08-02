import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function untuk API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP Error ${response.status}`);
  }

  return data;
};

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser', 
  async (credentials, thunkAPI) => {
    try {
      console.log('🚀 Attempting login with:', { email: credentials.email });
      
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('✅ Login response:', response);

      // Simpan token ke localStorage jika ada
      if (response.token) {
        localStorage.setItem('token', response.token);
        console.log('💾 Token saved to localStorage');
      }

      return response;
    } catch (error) {
      console.error('❌ Login error:', error.message);
      return thunkAPI.rejectWithValue(error.message || 'Login gagal.');
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  'auth/registerUser', 
  async (userData, thunkAPI) => {
    try {
      console.log('🚀 Attempting register with:', { email: userData.email });
      
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      console.log('✅ Register response:', response);
      return response;
    } catch (error) {
      console.error('❌ Register error:', error.message);
      return thunkAPI.rejectWithValue(error.message || 'Registrasi gagal.');
    }
  }
);

// RESTORE AUTH
export const restoreAuth = createAsyncThunk(
  'auth/restoreAuth', 
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      console.log('🔄 Restoring auth with token');

      const response = await apiCall('/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('✅ Restore auth response:', response);
      return response;
    } catch (error) {
      // Hapus token yang tidak valid
      localStorage.removeItem('token');
      console.error('❌ Restore auth error:', error.message);
      return thunkAPI.rejectWithValue(error.message || 'Gagal memulihkan sesi.');
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      
      // Hapus token dari localStorage
      localStorage.removeItem('token');
      console.log('🗑️ Token removed from localStorage');
      
      // Opsional: kirim request logout ke backend jika diperlukan
      if (token) {
        try {
          await apiCall('/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        } catch (error) {
          // Ignore logout API errors, token sudah dihapus
          console.log('⚠️ Logout API error (ignored):', error.message);
        }
      }
      
      return { message: 'Logout berhasil' };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
        console.log('⏳ Login pending...');
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || action.payload.data?.user;
        state.token = action.payload.token || action.payload.data?.token;
        state.isAuthenticated = true;
        state.message = action.payload.message || 'Login berhasil';
        state.error = null;
        console.log('✅ Login fulfilled:', {
          user: state.user,
          hasToken: !!state.token,
          isAuthenticated: state.isAuthenticated
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.message = null;
        localStorage.removeItem('token');
        console.log('❌ Login rejected:', action.payload);
      })
      
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message || 'Registrasi berhasil';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.message = null;
      })
      
      // RESTORE AUTH
      .addCase(restoreAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || action.payload.data?.user;
        state.isAuthenticated = true;
        console.log('✅ Auth restored:', state.user);
      })
      .addCase(restoreAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        console.log('❌ Auth restore failed:', action.payload);
      })
      
      // LOGOUT
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.message = action.payload.message || 'Logout berhasil';
        state.error = null;
        console.log('✅ Logout successful');
      });
  },
});

export const { clearError, clearMessage, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;