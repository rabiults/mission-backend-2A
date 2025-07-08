import { configureStore } from '@reduxjs/toolkit';
import kelasReducer from './kelasSlice';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    kelas: kelasReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;