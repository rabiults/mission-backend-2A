import { configureStore } from '@reduxjs/toolkit';
import kelasReducer from './kelasSlice';
import filterReducer from './filterSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    kelas: kelasReducer,
    filter: filterReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;