import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, ChevronDown, Loader2 } from 'lucide-react';
import { registerUser, clearError, clearMessage } from '../store/redux/authSlice';
import Navbar from '../components/organisems/Navbar';
import IndonesiaFlag from '../assets/images/indonesia-flag.png';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const { isLoading, error, message, isAuthenticated } = useSelector((state) => state.auth);
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        gender: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const genderOptions = [
        { value: 'male', label: 'Laki-laki' },
        { value: 'female', label: 'Perempuan' },
    ];

    // Debug: Log state changes
    useEffect(() => {
        console.log('🔍 Register Auth State:', { isLoading, error, message, isAuthenticated });
    }, [isLoading, error, message, isAuthenticated]);

    // Debug: Log form data changes
    useEffect(() => {
        console.log('📝 Register Form Data:', formData);
    }, [formData]);

    // Redirect jika sudah login
    useEffect(() => {
        if (isAuthenticated) {
            console.log('✅ User authenticated, redirecting from register...');
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
        if (error && Object.values(formData).some(value => value)) {
            dispatch(clearError());
        }
    }, [formData, error, dispatch]);

    // Check password match
    useEffect(() => {
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
            setPasswordMatchError('Password dan konfirmasi password tidak cocok');
        } else {
            setPasswordMatchError('');
        }
    }, [formData.password, formData.confirmPassword]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`📝 Register input changed: ${name} = ${value}`);
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleGenderSelect = (gender) => {
        console.log(`👤 Gender selected: ${gender}`);
        setFormData(prev => ({
            ...prev,
            gender: gender
        }));
        setShowGenderDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('🚀 Register form submit triggered');
        console.log('📋 Current register form data:', formData);
        
        // Validasi password match
        if (formData.password !== formData.confirmPassword) {
            console.log('❌ Password mismatch');
            setPasswordMatchError('Password dan konfirmasi password tidak cocok!');
            return;
        }

        // Validasi semua field required
        const requiredFields = ['fullName', 'email', 'gender', 'phoneNumber', 'password', 'confirmPassword'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            console.log('❌ Missing required fields:', missingFields);
            return;
        }

        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            console.log('❌ Invalid email format');
            return;
        }

        // Prepare data sesuai format backend yang benar
        const registerData = {
            full_name: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
            gender: formData.gender, // 'male' atau 'female'
            phone_number: formData.phoneNumber.trim(),
            password: formData.password
        };

        console.log('🚀 Submitting register form with data:', {
            ...registerData,
            password: '***' // hide password in logs
        });
        
        try {
            console.log('📤 Dispatching registerUser action...');
            const result = await dispatch(registerUser(registerData));
            
            console.log('📥 Register result:', result);
            
            if (registerUser.fulfilled.match(result)) {
                console.log('✅ Registration successful!');
                console.log('✅ Result payload:', result.payload);
                
                // Tampilkan pesan sukses dan arahkan ke login setelah beberapa detik
                setTimeout(() => {
                    console.log('🔄 Redirecting to login page...');
                    navigate('/login');
                }, 3000);
            } else if (registerUser.rejected.match(result)) {
                console.log('❌ Registration rejected:', result);
                console.log('❌ Error payload:', result.payload);
                console.log('❌ Error message:', result.error?.message);
            }
        } catch (error) {
            console.error('❌ Registration error (catch):', error);
        }
    };

    const handleGoogleRegister = () => {
        console.log('Google register clicked - not implemented yet');
        // TODO: Implement Google registration
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showGenderDropdown && !event.target.closest('.gender-dropdown')) {
                setShowGenderDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showGenderDropdown]);

    // Debug: Check if button should be disabled
    const isButtonDisabled = isLoading || passwordMatchError || !formData.fullName || !formData.email || !formData.gender || !formData.phoneNumber || !formData.password || !formData.confirmPassword;
    
    console.log('🔘 Register button disabled?', isButtonDisabled, {
        isLoading,
        passwordMatchError: !!passwordMatchError,
        hasFullName: !!formData.fullName,
        hasEmail: !!formData.email,
        hasGender: !!formData.gender,
        hasPhoneNumber: !!formData.phoneNumber,
        hasPassword: !!formData.password,
        hasConfirmPassword: !!formData.confirmPassword
    });

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-85 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-md w-full space-y-8 my-8">
                    <div className='bg-white rounded-lg shadow-md p-8'>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Pendaftaran Akun
                            </h2>
                            <p className="text-sm text-gray-600">
                                Yuk, daftarkan akunmu sekarang juga!
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
                                <br />
                                <span className="text-xs">Anda akan diarahkan ke halaman login dalam 3 detik...</span>
                            </div>
                        )}

                        {/* Password Match Error */}
                        {passwordMatchError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                                {passwordMatchError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name Field */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Lengkap *
                                </label>
                                <input
                                    type="text"
                                    required
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="Masukan nama lengkap"
                                />
                            </div>

                            {/* Email Field */}
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="Masukan email"
                                />
                            </div>

                            {/* Gender Field */}
                            <div className="gender-dropdown">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                    Jenis Kelamin *
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => !isLoading && setShowGenderDropdown(!showGenderDropdown)}
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <span className={formData.gender ? "text-gray-900" : "text-gray-400"}>
                                            {formData.gender ? genderOptions.find(g => g.value === formData.gender)?.label : "Pilih jenis kelamin"}
                                        </span>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </button>
                                    
                                    {showGenderDropdown && !isLoading && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                            {genderOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => handleGenderSelect(option.value)}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    No Hp *
                                </label>
                                <div className="flex">
                                    <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                                        <img src={IndonesiaFlag} alt="Indonesia Flag" className="w-5 h-4 mr-2" />
                                        <span className="text-sm text-gray-700">+62</span>
                                    </div>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="8123456789"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
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
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Masukan kata sandi"
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

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Konfirmasi Kata Sandi *
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder="Masukan kata sandi yang sama"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isButtonDisabled}
                                className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium flex items-center justify-center ${
                                    isButtonDisabled 
                                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                                onClick={() => console.log('🔘 Register button clicked!')}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        Memproses...
                                    </>
                                ) : (
                                    'Daftar'
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">atau</span>
                                </div>
                            </div>

                            {/* Google Register Button */}
                            <button
                                type="button"
                                onClick={handleGoogleRegister}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                {isLoading ? 'Loading...' : 'Daftar dengan Google'}
                            </button>
                        </form>
                        
                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Sudah punya akun?{' '}
                                <Link 
                                    to="/login" 
                                    className="font-medium text-green-600 hover:text-green-500 transition duration-200"
                                >
                                    Masuk
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );   
};

export default Register;