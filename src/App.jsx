import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import { restoreAuth } from './store/redux/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <div>Loading...</div>;

  return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />;
};

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthInitializer>
      </Router>
    </Provider>
  );
}

export default App;
