import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update date/time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Format date in Bengali
  const formatBengaliDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('bn-BD', options);
  };

  // Format time in 12-hour format
  const formatTime = (date) => {
    return date.toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      {/* Top bar with date/time */}
      <div className="bg-blue-900 text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden md:block">
            <span className="font-medium">বগুড়া: ২৪°সে | আর্দ্রতা: ৭৮%</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{formatBengaliDate(currentDateTime)}</span>
            <span className="hidden sm:inline">|</span>
            <span className="font-semibold">{formatTime(currentDateTime)}</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo with improved design */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="bg-white p-1 rounded-full group-hover:rotate-12 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">
                বগুড়াবাসী<span className="text-yellow-300">.কম</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-900 text-white shadow-inner" 
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              হোম
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-900 text-white shadow-inner" 
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              আমাদের কথা
            </NavLink>

            {/* Enhanced Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors">
                <span>সার্ভিসসমূহ</span>
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-1 w-56 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <NavLink
                    to="/services/blood-donor"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    রক্তদাতা
                  </NavLink>
                  <NavLink
                    to="/services/hospitals"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    হাসপাতাল
                  </NavLink>
                  <NavLink
                    to="/services/ambulance"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    অ্যাম্বুলেন্স
                  </NavLink>
                </div>
                <div className="py-1">
                  <Link
                    to="/AllServices"
                    className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    সকল সার্ভিস দেখুন →
                  </Link>
                </div>
              </div>
            </div>

            <NavLink
              to="/news"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-900 text-white shadow-inner" 
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              খবর
            </NavLink>

            <NavLink
              to="/notice"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-900 text-white shadow-inner" 
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              নোটিশ
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-900 text-white shadow-inner" 
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              যোগাযোগ
            </NavLink>

            {/* Login/Register Buttons */}
            <div className="ml-4 flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-white text-blue-700 hover:bg-gray-100 transition-colors"
              >
                লগইন
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-yellow-400 text-blue-800 hover:bg-yellow-300 transition-colors"
              >
                রেজিস্টার
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="px-3 py-2 text-xs text-blue-100 border-b border-blue-600">
              {formatBengaliDate(currentDateTime)} | {formatTime(currentDateTime)}
            </div>
            
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`
              }
            >
              হোম
            </NavLink>
            
            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`
              }
            >
              আমাদের কথা
            </NavLink>

            {/* Mobile Dropdown */}
            <details className="group">
              <summary className="flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-600 hover:text-white cursor-pointer">
                <span>সার্ভিসসমূহ</span>
                <svg
                  className="w-4 h-4 ml-2 transform group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="pl-4 mt-1 space-y-1">
                <NavLink
                  to="/services/blood-donor"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-600 hover:text-white"
                >
                  রক্তদাতা
                </NavLink>
                <NavLink
                  to="/services/hospitals"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-600 hover:text-white"
                >
                  হাসপাতাল
                </NavLink>
                <NavLink
                  to="/services/ambulance"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-600 hover:text-white"
                >
                  অ্যাম্বুলেন্স
                </NavLink>
              </div>
            </details>

            <NavLink
              to="/news"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`
              }
            >
              খবর
            </NavLink>
            
            <NavLink
              to="/notice"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`
              }
            >
              নোটিশ
            </NavLink>
            
            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`
              }
            >
              যোগাযোগ
            </NavLink>
            
            <div className="pt-2 border-t border-blue-600">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full px-3 py-2 rounded-md text-base font-medium text-center bg-white text-blue-700 hover:bg-gray-100"
              >
                লগইন
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full mt-2 px-3 py-2 rounded-md text-base font-medium text-center bg-yellow-400 text-blue-800 hover:bg-yellow-300"
              >
                রেজিস্টার
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;