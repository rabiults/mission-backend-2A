import { configureStore } from '@reduxjs/toolkit';
import kelasReducer from './redux/kelasSlice';
import filterReducer from './redux/filterSlice';
import userReducer from './redux/userSlice';
import authReducer from './redux/authSlice';

export const store = configureStore({
  reducer: {
    kelas: kelasReducer,
    filter: filterReducer,
    user: userReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;