import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  sort: 'asc', 
  category: [],
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
      state.category = action.payload;
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
      return initialState;
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

export default filterSlice.reducer;