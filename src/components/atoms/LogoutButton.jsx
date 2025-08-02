import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader2 } from 'lucide-react';
import { logoutUser } from '../../store/redux/authSlice';

const LogoutButton = ({ variant = 'button', className = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('🚪 Logging out user...');
      
      const result = await dispatch(logoutUser());
      
      if (logoutUser.fulfilled.match(result)) {
        console.log('✅ Logout successful');
        navigate('/login');
      } else {
        console.log('❌ Logout failed:', result.payload);
        // Even if API fails, still redirect to login (token already removed)
        navigate('/login');
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still redirect to login page
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Variant: icon button (untuk navbar)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading || isLoggingOut}
        className={`flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Logout"
      >
        {isLoggingOut ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <LogOut className="h-5 w-5" />
        )}
      </button>
    );
  }

  // Variant: text button
  if (variant === 'text') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading || isLoggingOut}
        className={`flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
      </button>
    );
  }

  // Variant: full button (default)
  return (
    <button
      onClick={handleLogout}
      disabled={isLoading || isLoggingOut}
      className={`flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </>
      )}
    </button>
  );
};

export default LogoutButton;