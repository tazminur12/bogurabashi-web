import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaAd, FaBuilding, FaMapMarkerAlt, FaExternalLinkAlt, FaPhone, FaEye } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

const AdsSlider = ({ ads }) => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [ads.length, isHovered]);

  const goTo = (idx) => setCurrent(idx);
  const goToNext = () => setCurrent((prev) => (prev + 1) % ads.length);
  const goToPrev = () => setCurrent((prev) => (prev - 1 + ads.length) % ads.length);

  if (!ads || ads.length === 0) return null;

  const ad = ads[current];

  return (
    <div
      className="relative w-full h-[56vh] md:h-[64vh] rounded-2xl overflow-hidden shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <div
          key={ad._id || current}
          className="absolute inset-0"
        >
          {/* Background Image */}
          {ad.image && (
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover object-center"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'; }}
            />
          )}
          {/* Contrast overlays for readability */}
          <div className="absolute inset-0 bg-black/30 md:bg-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/0" />

          {/* Overlay Content */}
          <div className="absolute inset-0 p-4 sm:p-6 md:p-10 flex flex-col justify-end md:justify-center">
            <div className="mb-3 md:mb-4">
              <span className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                <FaAd className="mr-1" /> বিজ্ঞাপন
              </span>
              {ad.discount && (
                <span className="ml-2 inline-flex items-center bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {ad.discount}% ছাড়
                </span>
              )}
            </div>
            <div className="bg-black/45 backdrop-blur-[2px] rounded-xl p-4 sm:p-5 md:p-6 max-w-2xl">
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 leading-tight">{ad.title}</h3>
              {ad.description && (
                <p className="text-white/90 text-sm md:text-base mb-3 md:mb-4 leading-relaxed">{ad.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                {ad.category && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/15 text-white">{ad.category}</span>
                )}
                {ad.company && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/15 text-white"><FaBuilding className="mr-1" /> {ad.company}</span>
                )}
                {ad.location && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/15 text-white"><FaMapMarkerAlt className="mr-1" /> {ad.location}</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* বিস্তারিত দেখুন Button - Navigate to AdsDetails page */}
                <Link 
                  to={`/ads/${ad._id}`}
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <FaEye className="mr-2" /> বিস্তারিত দেখুন
                </Link>
                
                {/* External Link Button - Only show if ad.link exists */}
                {ad.link && (
                  <a 
                    href={ad.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <FaExternalLinkAlt className="mr-2" /> ওয়েবসাইট
                  </a>
                )}
                
                {/* Phone Button - Only show if ad.phone exists */}
                {ad.phone && (
                  <a 
                    href={`tel:${ad.phone}`} 
                    className="inline-flex items-center justify-center bg-white/90 text-blue-700 px-4 py-2 rounded-md hover:bg-white transition-colors text-sm font-medium"
                  >
                    <FaPhone className="mr-2" /> {ad.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatePresence>

      {/* Controls */}
      <button
        onClick={goToPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 z-10"
        aria-label="Previous ad"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-300 z-10"
        aria-label="Next ad"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {ads.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === current ? 'bg-white w-6' : 'bg-white/60 hover:bg-white'}`}
            aria-label={`Go to ad ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdsSlider;