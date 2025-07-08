import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save, Trash2, RefreshCw } from 'lucide-react';
import Footer from '../components/organisems/Footer';
import NavbarHome from '../components/organisems/NavbarHome';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  testConnection
} from '../services/api/profileApi';

const ProfileForm = ({ user = {}, onUpdateProfile, onDeleteProfile, onTestConnection }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    setFormData({
      id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(formData);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus profil ini?')) {
      if (onDeleteProfile) {
        onDeleteProfile(formData.id);
      }
    }
  };

  return (
    <div className="flex-1 pt-20 py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="w-12 h-12 lg:w-16 lg:h-16 text-orange-600" />
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
                  {formData.name || 'Nama Pengguna'}
                </h1>
                <p className="text-gray-600 text-base lg:text-lg mb-4">
                  {formData.email || 'email@example.com'}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Ganti Foto Profil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 lg:p-8">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6 lg:mb-8">
              Ubah Profil
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <User className="w-4 h-4 inline mr-2" />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Mail className="w-4 h-4 inline mr-2" />
                    E-Mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="contoh@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Phone className="w-4 h-4 inline mr-2" />
                  No. Hp
                </label>
                <div className="flex max-w-md">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +62
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 border border-gray-300 rounded-r-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="81234567890"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Alamat
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
                  placeholder="Masukkan alamat lengkap Anda"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                {formData.id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Profil
                  </button>
                )}
                
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {formData.id ? 'Update Profil' : 'Simpan Profil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadUserData = async () => {
    try {
      setLoading(true);
      const users = await getUsers();
      console.log('Loaded users:', users);
      
      if (users && users.length > 0) {
        const latestUser = users[users.length - 1];
        setUser(latestUser);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError('❌ Gagal memuat data user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      if (formData.id) {
        const updatedUser = await updateUser(formData.id, formData);
        setUser(updatedUser);
        setSuccessMessage('✅ Profil berhasil diperbarui!');
      } else {
        const newUser = await createUser(formData);
        setUser(newUser);
        setSuccessMessage('✅ Profil berhasil dibuat!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (id) => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      await deleteUser(id);
      setUser({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: ''
      });
      setSuccessMessage('Profil berhasil dihapus!');
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test API connection
  const handleTestConnection = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      const isConnected = await testConnection();
      if (isConnected) {
        setSuccessMessage('Koneksi API berhasil!');
      } else {
        setError('❌ Koneksi API gagal!');
      }
    } catch (err) {
      console.error('Error testing connection:', err);
      setError('❌ Test koneksi gagal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavbarHome />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="text-lg text-gray-600">Loading...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarHome />
      {(successMessage || error) && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      )}
  
      <ProfileForm 
        user={user} 
        onUpdateProfile={handleUpdateProfile}
        onDeleteProfile={handleDeleteProfile}
        onTestConnection={handleTestConnection}
      />
      <Footer />
    </div>
  );
};

export default ProfilePage;