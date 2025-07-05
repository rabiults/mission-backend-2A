import React from 'react';
import BackgroundImage from '../../assets/images/img-3.png';

const CardArticle = () => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      ></div>
      
      <div className="absolute inset-0 bg-black opacity-60"></div>
      
      <div className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 text-center text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">
          Revolusi Pembelajaran: Temukan Ilmu Baru melalui Platform Video Interaktif!
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed text-gray-200">
          Temukan ilmu baru yang menarik dan mendalam melalui koleksi video pembelajaran berkualitas tinggi. 
          Tidak hanya itu, Anda juga dapat berpartisipasi dalam latihan interaktif yang akan meningkatkan 
          pemahaman Anda.
        </p>
        
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 lg:px-10 lg:py-4 text-sm sm:text-base md:text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
          Temukan Video Course untuk Dipelajari!
        </button>
      </div>
      
      <div className="hidden sm:block absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full opacity-20"></div>
      <div className="hidden sm:block absolute bottom-4 left-4 w-8 h-8 md:w-12 md:h-12 bg-green-500 rounded-full opacity-20"></div>
      <div className="hidden md:block absolute top-1/2 left-4 w-6 h-6 lg:w-8 lg:h-8 bg-yellow-500 rounded-full opacity-20"></div>
    </div>
  );
};

export default CardArticle;