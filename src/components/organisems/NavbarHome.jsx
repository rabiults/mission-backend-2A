import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/vb-logo.png';
import Avatar from '../../assets/images/Avatar.png';
import LogoutButton from '../atoms/LogoutButton';

const NavbarHome = () => {
  return (
    <nav className="top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img className="h-10 w-auto" src={Logo} alt="VideoBelajar Logo" />
            </Link>
          </div>
          
          {/* Right Side Navigation */}
          <div className="flex items-center space-x-4">
            {/* Kategori Link */}
            <div className="text-gray-700 font-medium">
              <Link to="/kategori" className="hover:text-blue-600 transition-colors">
                Kategori
              </Link>
            </div>
            
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <Link to="/profile" className="flex items-center">
                <img className="h-8 w-8 rounded-xl" src={Avatar} alt="User Avatar" />
              </Link>
            </div>
            
            {/* Logout Button */}
            <LogoutButton variant="icon" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;