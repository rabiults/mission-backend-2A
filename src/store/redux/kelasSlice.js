import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import kelasApi from '../../services/api/kelasApi.js';

export const fetchAllKelas = createAsyncThunk(
  'kelas/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await kelasApi.getAllKelas();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch kelas'
      );
    }
  }
);

export const fetchKelasById = createAsyncThunk(
  'kelas/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await kelasApi.getKelasById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch kelas by ID'
      );
    }
  }
);

export const fetchKelasByCategory = createAsyncThunk(
  'kelas/fetchByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await kelasApi.getKelasByCategory(categoryId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch kelas by category'
      );
    }
  }
);

export const searchKelas = createAsyncThunk(
  'kelas/search',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await kelasApi.searchKelas(searchTerm);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search kelas'
      );
    }
  }
);

// Initial State
const initialState = {
  data: [],
  currentKelas: null, // untuk detail kelas
  loading: false,
  error: null,
  filter: {
    search: '',
    sort: 'asc',
    category: [],
    priceRange: '',
    rating: 0,
  }
};

const kelasSlice = createSlice({
  name: 'kelas',
  initialState,
  reducers: {
    // Existing filter reducers
    setSearch: (state, action) => {
      state.filter.search = action.payload;
    },
    setSort: (state, action) => {
      state.filter.sort = action.payload;
    },
    setCategory: (state, action) => {
      state.filter.category = action.payload;
    },
    setPriceRange: (state, action) => {
      state.filter.priceRange = action.payload;
    },
    setRating: (state, action) => {
      state.filter.rating = action.payload;
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    },
    
    // Manual data setters (for backward compatibility)
    setData: (state, action) => {
      state.data = action.payload;
    },
    setCurrentKelas: (state, action) => {
      state.currentKelas = action.payload;
    },
    
    // Manual loading/error control
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  
  // Handle async thunk states
  extraReducers: (builder) => {
    // Fetch All Kelas
    builder
      .addCase(fetchAllKelas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllKelas.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAllKelas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Kelas By ID
    builder
      .addCase(fetchKelasById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKelasById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKelas = action.payload;
        state.error = null;
      })
      .addCase(fetchKelasById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Kelas By Category
    builder
      .addCase(fetchKelasByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKelasByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchKelasByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Search Kelas
    builder
      .addCase(searchKelas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchKelas.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(searchKelas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  setSearch,
  setSort,
  setCategory,
  setPriceRange,
  setRating,
  resetFilter,
  setData,
  setCurrentKelas,
  setLoading,
  setError,
  clearError
} = kelasSlice.actions;

// Selectors
export const selectKelasData = (state) => state.kelas.data;
export const selectCurrentKelas = (state) => state.kelas.currentKelas;
export const selectKelasLoading = (state) => state.kelas.loading;
export const selectKelasError = (state) => state.kelas.error;
export const selectKelasFilter = (state) => state.kelas.filter;

export default kelasSlice.reducer;