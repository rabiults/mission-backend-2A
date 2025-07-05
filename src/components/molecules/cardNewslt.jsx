import React, { useState } from 'react';
import BackgroundImage from '../../assets/images/newslt.jpeg';

const CardNewslt = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email subscribed:', email);
    setEmail('');
  };

  return (
    <div className="relative rounded-lg overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${BackgroundImage})` }}>
        </div>
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 text-center text-white">
        <div className="mb-4 sm:mb-6">
          <span className="text-xs sm:text-sm md:text-base font-medium tracking-wider uppercase text-gray-300">
            Newsletter
          </span>
        </div>
    
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
          Mau Belajar Lebih Banyak?
        </h2>
                
        <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed text-gray-200">
          Daftarkan dirimu untuk mendapatkan informasi terbaru dan penawaran spesial dari program-program terbaik hariesok.id
        </p>
                
        <form onSubmit={handleSubmit} className="max-w-md sm:max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:bg-white sm:rounded-xl sm:p-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan Emailmu"
              className="flex-1 px-4 py-3 sm:py-3 sm:px-6 text-gray-800 text-sm sm:rounded-xl border-none outline-none focus:ring-0 bg-white sm:bg-transparent"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold px-8 py-3 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
            
      {/* Decorative Elements */}
      <div className="hidden sm:block absolute top-6 right-6 w-8 h-8 md:w-12 md:h-12 bg-orange-400 rounded-full opacity-30"></div>
      <div className="hidden sm:block absolute bottom-6 left-6 w-6 h-6 md:w-10 md:h-10 bg-blue-400 rounded-full opacity-30"></div>
      <div className="hidden md:block absolute top-1/3 right-12 w-4 h-4 lg:w-6 lg:h-6 bg-green-400 rounded-full opacity-30"></div>
    </div>
  );
};

export default CardNewslt;