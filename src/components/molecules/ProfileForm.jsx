import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save, Trash2 } from 'lucide-react';
import Footer from '../components/organisems/Footer';
import NavbarHome from '../components/organisems/NavbarHome';


const ProfileForm = ({ user = {}, onUpdateProfile, onDeleteProfile }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <NavbarHome />
      
      <main className="pt-20">
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 mt-8">
              <div className="px-6 py-8 sm:px-8 lg:px-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
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
                    <button className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Ganti Foto Profil
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-8 sm:px-8 lg:px-10">
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-8">
                  Ubah Profil
                </h2>
                
                <div className="space-y-6">
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
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus Profil
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </section>
      </main>
  
      <Footer />
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '81234567890',
    address: 'Jl. Contoh No. 123, Jakarta'
  });

  const handleUpdateProfile = (formData) => {
    console.log('Update profile:', formData);
    setUser(formData);
    alert('Profil berhasil diupdate!');
  };

  const handleDeleteProfile = (id) => {
    console.log('Delete profile:', id);
    setUser({
      id: '',
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    alert('Profil berhasil dihapus!');
  };

  return (
    <ProfileForm 
      user={user}
      onUpdateProfile={handleUpdateProfile}
      onDeleteProfile={handleDeleteProfile}
    />
  );
};

export default App;