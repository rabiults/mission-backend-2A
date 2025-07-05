import React from 'react';
import { Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';
import Logo from "../../assets/images/vb-logo.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 max-w-7xl mx-auto">
          
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img 
                src={Logo} 
                alt="VideoBelajar Logo" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Gali Potensi Anda Melalui Pembelajaran Video di penambangilmu.id
            </p>
            <p className="text-gray-600 text-sm mb-2">
              Jl. Usman Effendi No. 50 Lowokwaru, Malang
            </p>
            <p className="text-gray-600 text-sm">
              +62-877-7125-1234
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Kategori</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Digital & Teknologi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Pemasaran
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Manajemen Bisnis
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Pengembangan Diri
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Desain
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Ketentuan Layanan
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Bantuan
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Komunitas</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Tips Sukses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
            
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">
                ©2025 Penambang ilmu All Right Reserved.
              </p>
            </div>

            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;