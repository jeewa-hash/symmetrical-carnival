import React from 'react';
import logo from '../image/logo.png';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-pink-300 py-12">
      <div className="container mx-auto flex flex-wrap justify-between px-4">
        {/* Logo and Address Section */}
        <div className="flex flex-col items-start mb-8 max-w-xs">
          <img 
            src={logo} 
            alt="Bear Works Lanka Logo" 
            className="w-24 h-24 mb-4 rounded-full shadow-lg" 
          />
          <address className="text-gray-800 text-base leading-relaxed">
            15 Schofield Pl, Colombo 09892 <br />
            <a 
              href="mailto:bearworkslanka@gmail.com" 
              className="text-pink-600 hover:text-pink-500"
            >
              bearworkslanka@gmail.com
            </a>
          </address>
        </div>

        {/* Quick Links Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-pink-600 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#about" className="text-gray-800 hover:text-pink-500">
                About Us
              </a>
            </li>
            <li>
              <a href="#location" className="text-gray-800 hover:text-pink-500">
                Location
              </a>
            </li>
            <li>
              <a href="#services" className="text-gray-800 hover:text-pink-500">
                Services
              </a>
            </li>
            <li>
              <a href="#contact" className="text-gray-800 hover:text-pink-500">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Resources Links Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-pink-600 mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <a href="#faq" className="text-gray-800 hover:text-pink-500">
                FAQ
              </a>
            </li>
            <li>
              <a href="#blog" className="text-gray-800 hover:text-pink-500">
                Blog
              </a>
            </li>
            <li>
              <a href="#news" className="text-gray-800 hover:text-pink-500">
                News
              </a>
            </li>
            <li>
              <a href="#careers" className="text-gray-800 hover:text-pink-500">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-pink-600 mb-4">Follow Us</h3>
          <ul className="flex space-x-4">
            <li>
              <a href="#facebook" className="text-blue-600 hover:text-blue-800">
                <FaFacebook className="w-8 h-8 transition-transform transform hover:scale-110" />
              </a>
            </li>
            <li>
              <a href="#instagram" className="text-pink-500 hover:text-pink-700">
                <FaInstagram className="w-8 h-8 transition-transform transform hover:scale-110" />
              </a>
            </li>
            <li>
              <a href="#twitter" className="text-blue-400 hover:text-blue-600">
                <FaTwitter className="w-8 h-8 transition-transform transform hover:scale-110" />
              </a>
            </li>
            <li>
              <a href="#linkedin" className="text-blue-700 hover:text-blue-900">
                <FaLinkedin className="w-8 h-8 transition-transform transform hover:scale-110" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-pink-200 text-center py-6 mt-8">
        <p className="text-base text-gray-800">
          &copy; 2024 Bear Works Lanka. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
