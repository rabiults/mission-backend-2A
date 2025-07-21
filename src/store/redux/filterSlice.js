import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  sort: 'asc',
  category: [], // Array untuk multiple selection (untuk bidang studi)
  priceRange: '',
  rating: '',
  duration: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setCategory: (state, action) => {
      // Handle both array and single value for bidang studi
      if (Array.isArray(action.payload)) {
        state.category = action.payload;
      } else {
        // Toggle category in array (untuk checkbox behavior)
        const category = action.payload;
        const index = state.category.indexOf(category);
        if (index > -1) {
          // Remove if already exists
          state.category = state.category.filter(item => item !== category);
        } else {
          // Add if doesn't exist
          state.category = [...state.category, category];
        }
      }
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setRating: (state, action) => {
      state.rating = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    resetFilter: (state) => {
      state.search = '';
      state.sort = 'asc';
      state.category = [];
      state.priceRange = '';
      state.rating = '';
      state.duration = '';
    },
  },
});

export const {
  setSearch,
  setSort,
  setCategory,
  setPriceRange,
  setRating,
  setDuration,
  resetFilter,
} = filterSlice.actions;

// Selectors
export const selectFilterSearch = (state) => state.filter.search;
export const selectFilterSort = (state) => state.filter.sort;
export const selectFilterCategory = (state) => state.filter.category;
export const selectFilterPriceRange = (state) => state.filter.priceRange;
export const selectFilterRating = (state) => state.filter.rating;
export const selectFilterDuration = (state) => state.filter.duration;
export const selectAllFilters = (state) => state.filter;

export default filterSlice.reducer;