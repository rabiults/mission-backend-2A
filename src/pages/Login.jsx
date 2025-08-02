import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginUser, clearError, clearMessage } from '../store/redux/authSlice';
import Logo from '../assets/images/vb-logo.png';
import Navbar from '../components/organisems/Navbar';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Debug: Log state changes
  useEffect(() => {
    console.log('🔍 Auth State:', { isLoading, error, message, isAuthenticated });
  }, [isLoading, error, message, isAuthenticated]);

  // Debug: Log form data changes
  useEffect(() => {
    console.log('📝 Form Data:', formData);
  }, [formData]);

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ User authenticated, redirecting...');
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  // Clear error/message saat component mount
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  // Clear error saat user mulai mengetik
  useEffect(() => {
    if (error && (formData.email || formData.password)) {
      dispatch(clearError());
    }
  }, [formData.email, formData.password, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 Input changed: ${name} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Form submit triggered');
    console.log('📋 Current form data:', formData);
    
    // Validasi basic
    if (!formData.email || !formData.password) {
      console.log('❌ Validation failed: empty fields');
      console.log('Email:', formData.email, 'Password:', formData.password);
      return;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log('❌ Invalid email format');
      return;
    }

    console.log('🚀 Submitting login form:', { 
      email: formData.email, 
      passwordLength: formData.password.length 
    });
    
    try {
      console.log('📤 Dispatching loginUser action...');
      const result = await dispatch(loginUser(formData));
      
      console.log('📥 Login result:', result);
      
      if (loginUser.fulfilled.match(result)) {
        console.log('✅ Login successful!');
        console.log('✅ Result payload:', result.payload);
        navigate('/home');
      } else if (loginUser.rejected.match(result)) {
        console.log('❌ Login rejected:', result);
        console.log('❌ Error payload:', result.payload);
        console.log('❌ Error message:', result.error?.message);
      }
    } catch (error) {
      console.error('❌ Login error (catch):', error);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked - not implemented yet');
    // TODO: Implement Google login
  };

  // Debug: Check if button should be disabled
  const isButtonDisabled = isLoading || !formData.email || !formData.password;
  console.log('🔘 Button disabled?', isButtonDisabled, {
    isLoading,
    hasEmail: !!formData.email,
    hasPassword: !!formData.password
  });

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Masuk ke Akun
              </h2>
              <p className="text-sm text-gray-600">
                Yuk, lanjutin belajarmu di videobelajar!
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && !error && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Masukkan email Anda"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 sm:py-2.5 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Masukkan kata sandi"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Lupa Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center justify-center ${
                  isButtonDisabled 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
                onClick={() => console.log('🔘 Button clicked!')}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">atau</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2.5 sm:py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoading ? 'Loading...' : 'Masuk dengan Google'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;