import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/vb-logo.png';
import Avatar from '../../assets/images/Avatar.png';

const NavbarHome = () => {
  return (
    <nav className="top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img className="h-10 w-auto" src={Logo} alt="VideoBelajar Logo" />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-gray-700 font-medium">
              <Link to="/kategori" className="hover:text-blue-600 transition-colors">
                Kategori
              </Link>
            </div>
          
            <div className="flex-shrink-0">
              <Link to="/profile" className="flex items-center">
                <img className="h-8 w-8 rounded-xl" src={Avatar} alt="User Avatar" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;