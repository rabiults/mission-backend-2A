import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/vb-logo.png';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img className="h-10 w-auto" src={Logo} alt="VideoBelajar Logo" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;