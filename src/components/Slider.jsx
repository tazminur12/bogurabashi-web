import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure';

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosSecure = useAxiosSecure();

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosSecure.get('/sliders');
        
        // Filter only active slides
        const activeSlides = response.data.filter(slide => slide.isActive);
        
        setSlides(activeSlides);
      } catch (err) {
        console.error('Error fetching slides:', err);
        setError('স্লাইডার লোড করতে সমস্যা হয়েছে');
        
        // Fallback to default slides if API fails
        setSlides([
          {
            _id: 1,
            img: 'https://i.ibb.co/q3bVBCjX/1745776413-U.jpg',
            title: 'বগুড়াবাসীর জন্য একত্রিত তথ্যভাণ্ডার',
            subtitle: 'আপনার এলাকার হাসপাতাল, রক্তদাতা, শিক্ষা প্রতিষ্ঠান, চাকরি খোঁজ ও আরও অনেক কিছু।',
            cta: 'সার্ভিসগুলো দেখুন',
            link: '/services'
          },
          {
            _id: 2,
            img: 'https://i.ibb.co/nqNFQT5w/blood-in20190326155849.jpg',
            title: 'রক্তদানের জন্য খুঁজুন',
            subtitle: 'জরুরী প্রয়োজনে বগুড়ার রক্তদাতা খুঁজে পান এক ক্লিকে।',
            cta: 'রক্তদাতা খুঁজুন',
            link: '/all-blood'
          },
          {
            _id: 3,
            img: 'https://i.ibb.co/1fXKMzjP/45299ae862a6b37b0a5515f0c751b641-6283636d76d53.jpg',
            title: 'শিক্ষা ও চাকরি তথ্য',
            subtitle: 'বগুড়ার শিক্ষা ও চাকরি সংক্রান্ত সকল তথ্য এক জায়গায়।',
            cta: 'আরও জানুন',
            link: '/education'
          },
          {
            _id: 4,
            img: 'https://i.ibb.co/PZGPZm7q/mahasthangarh-bogra-770x420.jpg',
            title: 'পর্যটন ও খাবার',
            subtitle: 'বগুড়ার দর্শনীয় স্থান এবং রেস্টুরেন্টগুলো খুঁজে বের করুন।',
            cta: 'পরিভ্রমণ করুন',
            link: '/destinationData'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [axiosSecure]);

  // Auto slide change
  useEffect(() => {
    if (isHovered || slides.length === 0) return; // Pause on hover or if no slides
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovered, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full relative rounded-xl overflow-hidden shadow-lg">
        <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">স্লাইডার লোড হচ্ছে...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && slides.length === 0) {
    return (
      <div className="w-full relative rounded-xl overflow-hidden shadow-lg">
        <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2 text-sm sm:text-base">{error}</p>
            <p className="text-gray-600 text-sm sm:text-base">ডিফল্ট স্লাইডার দেখানো হচ্ছে</p>
          </div>
        </div>
      </div>
    );
  }

  // No slides state
  if (slides.length === 0) {
    return (
      <div className="w-full relative rounded-xl overflow-hidden shadow-lg">
        <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-sm sm:text-base">কোনো স্লাইডার পাওয়া যায়নি</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full relative rounded-xl overflow-hidden shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image || slide.img} 
              className="w-full h-full object-cover object-center" 
              alt={slide.title} 
              loading="lazy"
              onError={(e) => {
                // Fallback image if the main image fails to load
                e.target.src = 'https://via.placeholder.com/1200x600/1f2937/ffffff?text=বগুড়া+বাশি';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              <div className="container mx-auto px-3 sm:px-4 h-full flex flex-col justify-end pb-8 sm:pb-12 md:pb-16 lg:pb-24">
                <div 
                  className="text-white max-w-full sm:max-w-2xl lg:max-w-3xl transform transition-all duration-1000 ease-in-out"
                  style={{
                    transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                    opacity: index === currentSlide ? 1 : 0
                  }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-white/90">
                    {slide.subtitle}
                  </p>
                  <Link
                    to={slide.link}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if more than one slide */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors duration-300 z-10"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors duration-300 z-10"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators - Only show if more than one slide */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-4 sm:w-6' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar - Only show if more than one slide */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 z-10">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-linear"
            style={{
              width: `${(currentSlide + 1) * (100 / slides.length)}%`,
              transitionProperty: isHovered ? 'none' : 'width'
            }}
          />
        </div>
      )}

      {/* Error message if API fails but we have fallback slides */}
      {error && slides.length > 0 && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm z-20">
          {error}
        </div>
      )}
    </div>
  );
};

export default Slider;