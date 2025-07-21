import api, { checkApiConnection, debugApiConfig } from './api.js';

const kelasApi = {
  // Enhanced connection test with debugging
  testConnection: async () => {
    console.log('🔍 Testing Kelas API connection...');
    
    try {
      // First debug the configuration
      debugApiConfig();
      
      // Test using the enhanced API connection check
      const connectionResult = await checkApiConnection();
      
      if (connectionResult.success) {
        console.log('✅ Kelas API connection successful');
        return { 
          success: true, 
          data: connectionResult.data,
          message: 'Successfully connected to backend /api/kelas endpoint'
        };
      } else {
        console.error('❌ Kelas API connection failed:', connectionResult.error);
        return { 
          success: false, 
          error: connectionResult.error,
          details: connectionResult.details
        };
      }
    } catch (error) {
      console.error('❌ Kelas API connection test failed:', error);
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  },

  // Get all kelas with enhanced debugging
  getAllKelas: async () => {
    console.log('📋 Fetching all kelas...');
    
    try {
      console.log('🌐 Making request to: /api/kelas');
      const response = await api.get('/api/kelas');
      
      console.log('✅ Successfully fetched kelas:', {
        status: response.status,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        length: Array.isArray(response.data) ? response.data.length : 'N/A'
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching all kelas:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data
      });
      
      // Enhanced error handling with specific messages
      if (error.response?.status === 404) {
        const errorMsg = 'Kelas endpoint not found - check backend routing';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status >= 500) {
        const errorMsg = 'Server error when fetching kelas';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.code === 'ERR_NETWORK') {
        const errorMsg = 'Network error - backend server might not be running on http://localhost:3001';
        console.error('🔴', errorMsg);
        console.error('💡 Debug steps:');
        console.error('   1. Check if backend is running: curl http://localhost:3001/api/kelas');
        console.error('   2. Check CORS settings in backend');
        console.error('   3. Verify port 3001 is correct');
        throw new Error(errorMsg);
      } else if (error.code === 'ECONNABORTED') {
        const errorMsg = 'Request timeout - backend server took too long to respond';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.message.includes('Network Error')) {
        const errorMsg = 'Cannot connect to backend server - please check if it\'s running on port 3001';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      }
      
      // Re-throw original error if not handled above
      throw error;
    }
  },

  // Get kelas by ID with enhanced debugging
  getKelasById: async (id) => {
    if (!id) {
      const errorMsg = 'Kelas ID is required';
      console.error('🔴', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('📋 Fetching kelas by ID:', id);

    try {
      console.log('🌐 Making request to:', `/api/kelas/${id}`);
      const response = await api.get(`/api/kelas/${id}`);
      
      console.log('✅ Successfully fetched kelas by ID:', {
        id: id,
        status: response.status,
        hasData: !!response.data
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching kelas with ID ${id}:`, {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        responseData: error.response?.data
      });
      
      if (error.response?.status === 404) {
        const errorMsg = `Kelas with ID ${id} not found`;
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status >= 500) {
        const errorMsg = 'Server error when fetching kelas details';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const errorMsg = 'Network error - please check your connection and backend server';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  },

  // Get kelas by category with enhanced debugging
  getKelasByCategory: async (categoryId) => {
    if (!categoryId) {
      const errorMsg = 'Category ID is required';
      console.error('🔴', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('📋 Fetching kelas by category:', categoryId);

    try {
      console.log('🌐 Making request to:', `/api/kelas/category/${categoryId}`);
      const response = await api.get(`/api/kelas/category/${categoryId}`);
      
      console.log('✅ Successfully fetched kelas by category:', {
        category: categoryId,
        status: response.status,
        length: Array.isArray(response.data) ? response.data.length : 'N/A'
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching kelas by category ${categoryId}:`, error);
      
      if (error.response?.status === 404) {
        const errorMsg = `No kelas found for category ${categoryId}`;
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status >= 500) {
        const errorMsg = 'Server error when fetching kelas by category';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const errorMsg = 'Network error - please check your connection and backend server';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  },

  // Search kelas with enhanced debugging
  searchKelas: async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      const errorMsg = 'Search term is required';
      console.error('🔴', errorMsg);
      throw new Error(errorMsg);
    }

    const cleanSearchTerm = searchTerm.trim();
    console.log('🔍 Searching kelas with term:', cleanSearchTerm);

    try {
      const searchParams = { 
        q: cleanSearchTerm,
        limit: 50 // Optional: limit search results
      };
      
      console.log('🌐 Making request to: /api/kelas/search with params:', searchParams);
      const response = await api.get('/api/kelas/search', {
        params: searchParams
      });
      
      console.log('✅ Search successful:', {
        term: cleanSearchTerm,
        status: response.status,
        results: Array.isArray(response.data) ? response.data.length : 'N/A'
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error searching kelas with term "${cleanSearchTerm}":`, error);
      
      if (error.response?.status === 404) {
        const errorMsg = `No kelas found for search term: ${cleanSearchTerm}`;
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status >= 500) {
        const errorMsg = 'Server error when searching kelas';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const errorMsg = 'Network error - please check your connection and backend server';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  },

  // Get kelas with filters - enhanced debugging
  getKelasWithFilters: async (filters = {}) => {
    console.log('📋 Fetching kelas with filters:', filters);
    
    try {
      // Clean up filters - remove empty values
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          // Handle array filters
          if (Array.isArray(value) && value.length > 0) {
            acc[key] = value;
          } else if (!Array.isArray(value)) {
            acc[key] = value;
          }
        }
        return acc;
      }, {});

      console.log('🧹 Cleaned filters:', cleanFilters);
      console.log('🌐 Making request to: /api/kelas with params:', cleanFilters);

      const response = await api.get('/api/kelas', {
        params: cleanFilters
      });
      
      console.log('✅ Successfully fetched filtered kelas:', {
        status: response.status,
        results: Array.isArray(response.data) ? response.data.length : 'N/A'
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching kelas with filters:', error);
      
      if (error.response?.status === 400) {
        const errorMsg = 'Invalid filter parameters';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status >= 500) {
        const errorMsg = 'Server error when fetching filtered kelas';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const errorMsg = 'Network error - please check your connection and backend server';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  },

  // Create new kelas
  createKelas: async (kelasData) => {
    if (!kelasData) {
      const errorMsg = 'Kelas data is required';
      console.error('🔴', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('➕ Creating new kelas:', kelasData);

    try {
      console.log('🌐 Making POST request to: /api/kelas');
      const response = await api.post('/api/kelas', kelasData);
      
      console.log('✅ Successfully created kelas:', {
        status: response.status,
        hasData: !!response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Error creating kelas:', error);
      
      if (error.response?.status === 400) {
        const errorMsg = 'Invalid kelas data - please check your input';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status === 422) {
        const errorMsg = 'Validation error - please check required fields';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status >= 500) {
        const errorMsg = 'Server error when creating kelas';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const errorMsg = 'Network error - please check your connection and backend server';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  },

  // Update kelas
  updateKelas: async (id, kelasData) => {
    if (!id) {
      const errorMsg = 'Kelas ID is required';
      console.error('🔴', errorMsg);
      throw new Error(errorMsg);
    }
    if (!kelasData) {
      const errorMsg = 'Kelas data is required';
      console.error('🔴', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('✏️ Updating kelas:', { id, data: kelasData });

    try {
      console.log('🌐 Making PUT request to:', `/api/kelas/${id}`);
      const response = await api.put(`/api/kelas/${id}`, kelasData);
      
      console.log('✅ Successfully updated kelas:', {
        id: id,
        status: response.status
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating kelas with ID ${id}:`, error);
      
      if (error.response?.status === 404) {
        const errorMsg = `Kelas with ID ${id} not found`;
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status === 400) {
        const errorMsg = 'Invalid kelas data - please check your input';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status === 422) {
        const errorMsg = 'Validation error - please check required fields';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status >= 500) {
        const errorMsg = 'Server error when updating kelas';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const errorMsg = 'Network error - please check your connection and backend server';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  },

  // Delete kelas
  deleteKelas: async (id) => {
    if (!id) {
      const errorMsg = 'Kelas ID is required';
      console.error('🔴', errorMsg);
      throw new Error(errorMsg);
    }

    console.log('🗑️ Deleting kelas with ID:', id);

    try {
      console.log('🌐 Making DELETE request to:', `/api/kelas/${id}`);
      const response = await api.delete(`/api/kelas/${id}`);
      
      console.log('✅ Successfully deleted kelas:', {
        id: id,
        status: response.status
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting kelas with ID ${id}:`, error);
      
      if (error.response?.status === 404) {
        const errorMsg = `Kelas with ID ${id} not found`;
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.response?.status >= 500) {
        const errorMsg = 'Server error when deleting kelas';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const errorMsg = 'Network error - please check your connection and backend server';
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  },

  // Debug function untuk troubleshooting
  debugKelasApi: async () => {
    console.log('🔧 Kelas API Debug Information:');
    
    // Test basic connection
    const connectionTest = await kelasApi.testConnection();
    
    if (connectionTest.success) {
      console.log('✅ Basic connection: WORKING');
      
      try {
        // Test getAllKelas specifically
        console.log('🧪 Testing getAllKelas...');
        const allKelas = await kelasApi.getAllKelas();
        console.log('✅ getAllKelas: WORKING', {
          type: typeof allKelas,
          isArray: Array.isArray(allKelas),
          length: Array.isArray(allKelas) ? allKelas.length : 'N/A'
        });
      } catch (error) {
        console.log('❌ getAllKelas: FAILED', error.message);
      }
    } else {
      console.log('❌ Basic connection: FAILED');
      console.log('Error:', connectionTest.error);
      
      console.log('\n🩺 Troubleshooting steps:');
      console.log('1. Check if backend server is running on http://localhost:3001');
      console.log('2. Test manually: curl http://localhost:3001/api/kelas');
      console.log('3. Check backend CORS configuration');
      console.log('4. Verify network connectivity');
      console.log('5. Check browser console for additional errors');
    }
    
    return connectionTest;
  }
};

export default kelasApi;