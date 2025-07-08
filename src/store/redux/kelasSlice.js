import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [], 
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
    setData: (state, action) => {
      state.data = action.payload;
    },
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
  },
});

export const {
  setData,
  setSearch,
  setSort,
  setCategory,
  setPriceRange,
  setRating,
  resetFilter,
} = kelasSlice.actions;

export default kelasSlice.reducer;