import React, { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    img: 'https://i.ibb.co/q3bVBCjX/1745776413-U.jpg',
    title: 'বগুড়াবাসীর জন্য একত্রিত তথ্যভাণ্ডার',
    subtitle: 'আপনার এলাকার হাসপাতাল, রক্তদাতা, শিক্ষা প্রতিষ্ঠান, চাকরি খোঁজ ও আরও অনেক কিছু।',
    cta: 'সার্ভিসগুলো দেখুন',
    link: '/services'
  },
  {
    id: 2,
    img: 'https://i.ibb.co/nqNFQT5w/blood-in20190326155849.jpg',
    title: 'রক্তদানের জন্য খুঁজুন',
    subtitle: 'জরুরী প্রয়োজনে বগুড়ার রক্তদাতা খুঁজে পান এক ক্লিকে।',
    cta: 'রক্তদাতা খুঁজুন',
    link: '/services/blood-donor'
  },
  {
    id: 3,
    img: 'https://i.ibb.co/1fXKMzjP/45299ae862a6b37b0a5515f0c751b641-6283636d76d53.jpg',
    title: 'শিক্ষা ও চাকরি তথ্য',
    subtitle: 'বগুড়ার শিক্ষা ও চাকরি সংক্রান্ত সকল তথ্য এক জায়গায়।',
    cta: 'আরও জানুন',
    link: '/services/education'
  },
  {
    id: 4,
    img: 'https://i.ibb.co/PZGPZm7q/mahasthangarh-bogra-770x420.jpg',
    title: 'পর্যটন ও খাবার',
    subtitle: 'বগুড়ার দর্শনীয় স্থান এবং রেস্টুরেন্টগুলো খুঁজে বের করুন।',
    cta: 'পরিভ্রমণ করুন',
    link: '/services/destinations'
  }
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide change
  useEffect(() => {
    if (isHovered) return; // Pause on hover
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovered]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div 
      className="w-full relative rounded-xl overflow-hidden shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div className="relative h-[500px] md:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.img} 
              className="w-full h-full object-cover" 
              alt={`slide-${slide.id}`} 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16 md:pb-24">
                <div 
                  className="text-white max-w-3xl transform transition-all duration-1000 ease-in-out"
                  style={{
                    transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                    opacity: index === currentSlide ? 1 : 0
                  }}
                >
                  <h2 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-6">
                    {slide.subtitle}
                  </p>
                  <a
                    href={slide.link}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
                  >
                    {slide.cta}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300 z-10"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300 z-10"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 z-10">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{
            width: `${(currentSlide + 1) * (100 / slides.length)}%`,
            transitionProperty: isHovered ? 'none' : 'width'
          }}
        />
      </div>
    </div>
  );
};

export default Slider;