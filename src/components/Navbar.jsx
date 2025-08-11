import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const CITY = import.meta.env.VITE_DEFAULT_CITY || 'Bogra,Bangladesh';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, [API_KEY, CITY]);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!API_KEY) throw new Error('Missing VITE_WEATHER_API_KEY');
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY}&lang=bn`);
        const data = await response.json();
        
        if (data && data.current && data.location) {
          setWeather({
            temp_c: Math.round(data.current.temp_c),
            humidity: data.current.humidity
          });
        }
      } catch (error) {
        console.error('Weather fetch failed:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather every 30 minutes
    const weatherTimer = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(weatherTimer);
  }, [API_KEY, CITY]);

  const formatBengaliDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("bn-BD", options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-blue-900 text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden md:block">
            {weatherLoading ? (
              <span className="font-medium">আবহাওয়া লোড হচ্ছে...</span>
            ) : weather ? (
              <span className="font-medium">বগুড়া: {weather.temp_c}°সে | আর্দ্রতা: {weather.humidity}%</span>
            ) : (
              <span className="font-medium">আবহাওয়ার তথ্য পাওয়া যায়নি</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span>{formatBengaliDate(currentDateTime)}</span>
            <span className="hidden sm:inline">|</span>
            <span className="font-semibold">{formatTime(currentDateTime)}</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
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
            {[
              { to: "/", label: "হোম" },
              { to: "/bogura-intro", label: "বগুড়ার পরিচিতি" }, 
              { to: "/about", label: "আমাদের কথা" },
              { to: "/news", label: "খবর" },
              { to: "/notice", label: "নোটিশ" },
              { to: "/contact", label: "যোগাযোগ" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-900 text-white shadow-inner"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors">
                সার্ভিসসমূহ
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
                  <NavLink to="/all-blood" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">রক্তদাতা</NavLink>
                  <NavLink to="/hospital-list" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">হাসপাতাল</NavLink>
                  <NavLink to="/ambulance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">অ্যাম্বুলেন্স</NavLink>
                </div>
                <div className="py-1">
                  <Link to="/services" className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">সকল সার্ভিস দেখুন →</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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

            {[
              { to: "/", label: "হোম" },
              { to: "/bogura-intro", label: "বগুড়ার পরিচিতি" }, 
              { to: "/about", label: "আমাদের কথা" },
              { to: "/services", label: "সার্ভিসসমূহ" },
              { to: "/news", label: "খবর" },
              { to: "/notice", label: "নোটিশ" },
              { to: "/contact", label: "যোগাযোগ" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? "bg-blue-900 text-white" : "text-blue-100 hover:bg-blue-600 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
