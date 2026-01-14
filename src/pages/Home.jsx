import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaArrowRight, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaUser, 
  FaEye,
  FaMapMarkerAlt,
  FaUsers,
  FaIndustry,
  FaGraduationCap,
  FaHospital,
  FaCar,
  FaBus,
  FaTrain,
  FaPlane,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaStar,
  FaHeart,
  FaShieldAlt,
  FaHandshake,
  FaChartLine,
  FaBuilding,
  FaLandmark,
  FaCamera,
  FaUtensils,
  FaHotel,
  FaRoute,
  FaNewspaper,
  FaBullhorn,
  FaHandHoldingHeart,
  FaAd,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { WiDaySunny, WiRain, WiCloudy } from 'weather-icons-react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import usePageTitle from '../hooks/usePageTitle';
import Slider from '../components/Slider';
import ServiceCard from '../components/ServiceCard';
import AdsSlider from '../components/AdsSlider';

const reveal = { hidden:{opacity:0, y:20}, visible:{opacity:1, y:0, transition:{duration:.4}} };

function Home() {
  const axiosSecure = useAxiosSecure();
  usePageTitle('বগুড়াবাসী – Bogurabashi | বগুড়া জেলার সব সেবা ও তথ্য');
  // Fetch news from backend
  const {
    data: news = [],
    isLoading: newsLoading,
  } = useQuery({
    queryKey: ["home-news"],
    queryFn: async () => {
      const res = await axiosSecure.get("/news?limit=6");
      return res.data;
    },
  });

  // Fetch destinations from backend
  const {
    data: destinations = [],
    isLoading: destinationsLoading,
  } = useQuery({
    queryKey: ["home-destinations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/destinations?district=bogura&limit=3");
      return res.data;
    },
  });

  // Fetch events from backend
  // (Removed Upcoming Events section)

  // Fetch ads from backend
  const {
    data: ads = [],
    isLoading: adsLoading,
  } = useQuery({
    queryKey: ["home-ads"],
    queryFn: async () => {
      const res = await axiosSecure.get("/ads?status=active&limit=6");
      return res.data;
    },
    // Retry on error
    retry: 2,
    // Don't show error if ads fail to load
    onError: (error) => {
      console.error("Ads fetch error:", error);
    }
  });

  // Breaking news from backend - latest 3 published news (newest first)
  const breakingNews = news
    .filter(item => item.status === "Published")
    .sort((a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0))
    .slice(0, 3);

  // (Removed event helper utilities)

  // District statistics
  const districtStats = [
    { icon: FaUsers, label: "জনসংখ্যা", value: "৩৫ লক্ষ+", color: "blue" },
    { icon: FaMapMarkerAlt, label: "আয়তন", value: "২,৯২৮ বর্গকিমি", color: "green" },
    { icon: FaIndustry, label: "শিল্প", value: "৫০০+ কারখানা", color: "purple" },
    { icon: FaGraduationCap, label: "শিক্ষা", value: "১,২০০+ প্রতিষ্ঠান", color: "orange" }
  ];



  // Government services with official links
  const governmentServices = [
    { 
      name: "জমি রেজিস্ট্রি", 
      icon: FaLandmark, 
      link: "https://www.land.gov.bd/", 
      description: "জমি রেজিস্ট্রি ও জরিপ সেবা"
    },
    { 
      name: "ট্রেড লাইসেন্স", 
      icon: FaHandshake, 
      link: "https://www.business.gov.bd/", 
      description: "ব্যবসায়িক লাইসেন্স সেবা"
    },
    { 
      name: "বিবাহ রেজিস্ট্রি", 
      icon: FaHeart, 
      link: "https://www.bdris.gov.bd/", 
      description: "বিবাহ রেজিস্ট্রি সেবা"
    },
    { 
      name: "পাসপোর্ট সেবা", 
      icon: FaGlobe, 
      link: "https://www.passport.gov.bd/", 
      description: "পাসপোর্ট আবেদন ও সেবা"
    },
    { 
      name: "ড্রাইভিং লাইসেন্স", 
      icon: FaCar, 
      link: "https://www.brta.gov.bd/", 
      description: "ড্রাইভিং লাইসেন্স সেবা"
    },
    { 
      name: "ট্যাক্স সেবা", 
      icon: FaChartLine, 
      link: "https://www.nbr.gov.bd/", 
      description: "কর ও রাজস্ব সেবা"
    }
  ];

  // Partners from backend (always fetch all, filter client-side to avoid backend filter mismatches)
  const {
  	data: partners = [],
  	isLoading: partnersLoading,
  } = useQuery({
    queryKey: ["home-partners"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/partners");
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        return list
          .filter((p) => p?.isActive !== false)
          .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
      } catch (err) {
        console.error("Partners fetch failed", err);
        return [];
      }
    },
    retry: 1,
  });

  // Filter news and sort by newest first
  const filteredNews = news
    .filter(item => item.status === "Published")
    .sort((a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0))
    .slice(0, 6);



  return (
    <div className="bg-gray-50">
      {/* Breaking News Ticker */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 overflow-hidden shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="flex items-center mr-6">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-3"></div>
            <span className="font-bold text-lg whitespace-nowrap">সর্বশেষ সংবাদ:</span>
          </div>
          <div className="overflow-hidden flex-1">
            {newsLoading ? (
              <div className="animate-pulse">
                <span className="mx-8 inline-block">নিউজ লোড হচ্ছে...</span>
              </div>
            ) : breakingNews.length > 0 ? (
            <div className="animate-marquee whitespace-nowrap">
              {breakingNews.map((item) => (
                  <Link
                    key={item._id}
                    to={`/news/${item._id}`}
                    className="mx-8 inline-block hover:underline cursor-pointer transition-all duration-300 hover:text-yellow-200"
                  >
                    {item.title}
                  </Link>
              ))}
            </div>
            ) : (
              <div>
                <span className="mx-8 inline-block text-gray-200">কোনো ব্রেকিং নিউজ নেই</span>
              </div>
            )}
          </div>
        </div>
      </div>

     

      <Motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} className="px-2 sm:px-4">
        <Slider />
      </Motion.div>
      
      {/* District Statistics */}
      <Motion.section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-12 sm:py-16 px-3 sm:px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">বগুড়া জেলার পরিসংখ্যান</h2>
            <p className="text-gray-600 text-base sm:text-lg">উত্তরবঙ্গের প্রাণকেন্দ্র হিসেবে বগুড়ার গুরুত্বপূর্ণ তথ্য</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {districtStats.map((stat, index) => (
              <div key={index} className="text-center p-4 sm:p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-${stat.color}-100 text-${stat.color}-600 mb-3 sm:mb-4`}>
                  {React.createElement(stat.icon, { size: 20 })}
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Motion.section>

      {/* Services Section */}
      <Motion.section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-12 sm:py-16 px-3 sm:px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <ServiceCard />
        </div>
      </Motion.section>

      {/* Ads Section */}
      {ads.length > 0 && (
        <Motion.section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-6 sm:py-8 px-3 sm:px-4 bg-gradient-to-br from-white ">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full mb-2 sm:mb-3">
                <FaAd className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">বিশেষ বিজ্ঞাপন</h2>
              <p className="text-gray-600 text-sm sm:text-base">আমাদের অংশীদারদের বিশেষ অফার</p>
            </div>
            {adsLoading ? (
              <div className="flex items-center justify-center py-4 sm:py-6">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-2 text-gray-600 text-xs sm:text-sm">বিজ্ঞাপন লোড হচ্ছে...</span>
              </div>
            ) : (
              <AdsSlider ads={ads} />
            )}
            <div className="text-center mt-4 sm:mt-6">
              <Link 
                to="/ads" 
                className="inline-flex items-center px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm"
              >
                আরও বিজ্ঞাপন দেখুন <FaArrowRight className="ml-1 sm:ml-2" />
              </Link>
            </div>
          </div>
        </Motion.section>
      )}

      {/* News & Events Section */}
      <Motion.section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* News Section - full width */}
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <FaNewspaper className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">সর্বশেষ সংবাদ</h2>
                <p className="text-gray-600 text-lg">বগুড়া জেলার সর্বশেষ খবর</p>
              </div>
              
              {newsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <span className="ml-3 text-gray-600">নিউজ লোড হচ্ছে...</span>
                </div>
              ) : filteredNews.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {filteredNews.map(news => (
                      <div
                        key={news._id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                      >
                        {/* Image */}
                        {news.imageUrl && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={news.imageUrl}
                              alt={news.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {news.status === "Published" && (
                              <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                প্রকাশিত
                              </span>
                            )}
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                          {/* Category */}
                          {news.category && (
                            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                              {news.category}
                            </span>
                          )}

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                            <Link
                              to={`/news/${news._id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {news.title}
                            </Link>
                          </h3>

                          {/* Content Preview */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {news.content}
                          </p>

                          {/* Meta Info */}
                          <div className="space-y-2 mb-4">
                            {news.author && (
                              <div className="flex items-center text-xs text-gray-500">
                                <FaUser className="mr-2" />
                                <span>{news.author}</span>
                              </div>
                            )}
                            {news.publishDate && (
                              <div className="flex items-center text-xs text-gray-500">
                                <FaCalendarAlt className="mr-2" />
                                <span>{new Date(news.publishDate).toLocaleDateString('bn-BD')}</span>
                              </div>
                            )}
                          </div>

                          {/* Read More Button */}
                          <Link
                            to={`/news/${news._id}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                          >
                            <FaEye className="mr-2" />
                            বিস্তারিত পড়ুন
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link 
                      to="/news" 
                      className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      সব সংবাদ দেখুন <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📰</div>
                  <p className="text-gray-500 text-lg">কোনো নিউজ পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Motion.section>

      {/* Tourism Highlights */}
      <Motion.section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <span className="text-xl">🏛️</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">পর্যটন আকর্ষণ</h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto">বগুড়ার ঐতিহাসিক ও সাংস্কৃতিক স্থানগুলো</p>
          </div>
          
          {destinationsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600">গন্তব্যের তথ্য লোড হচ্ছে...</span>
            </div>
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <div key={destination._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center shadow-md">
                      <FaStar className="text-yellow-500 mr-1 text-xs" />
                      <span className="text-xs font-semibold text-gray-800">{destination.rating || 4.5}</span>
                    </div>
                    
                    {/* Category Badge */}
                    {destination.category && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                        {destination.category}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 relative">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{destination.name}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed text-sm">{destination.description}</p>
                    
                    {destination.location && (
                      <div className="flex items-center text-gray-500 text-xs mb-3 bg-gray-50 px-2 py-1 rounded">
                        <FaMapMarkerAlt className="mr-1 text-blue-500" />
                        <span className="font-medium">{destination.location}</span>
                      </div>
                    )}
                    
                    <Link 
                      to={`/destinatonDetails?id=${destination._id}`}
                      className="inline-flex items-center w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-102 shadow-md text-sm"
                    >
                      আরও জানুন <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏛️</div>
              <p className="text-gray-500 text-lg">কোনো গন্তব্য পাওয়া যায়নি</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link 
              to="/destinationData" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-base shadow-md hover:shadow-lg transform hover:scale-105"
            >
              সব গন্তব্য দেখুন <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </Motion.section>

      {/* Government Services */}
      <Motion.section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">সরকারি সেবা</h2>
            <p className="text-gray-600 text-lg">সরকারি সেবাগুলো সহজেই পেতে</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {governmentServices.map((service, index) => (
              <a
                key={index}
                href={service.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center border border-gray-100 hover:border-blue-200"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <service.icon size={24} />
                </div>
                <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                  {service.name}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-700">
                  {service.description}
                </div>
                <div className="mt-3 text-xs text-blue-600 group-hover:text-blue-700 font-medium">
                  সরকারি ওয়েবসাইটে যান →
                </div>
              </a>
            ))}
          </div>
        </div>
      </Motion.section>

      {/* Our Partners */}
      {(partnersLoading || partners.length > 0) && (
        <Motion.section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">আমাদের অংশীদার</h2>
              <p className="text-gray-600 text-lg">যারা আমাদের সাথে কাজ করছে</p>
            </div>
            {partnersLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-2 text-gray-600 text-sm">পার্টনার লোড হচ্ছে...</span>
              </div>
            ) : (
              <div className="relative overflow-hidden">
                <div className="animate-marquee">
                  <div className="flex items-stretch gap-6 px-1">
                    {[...partners, ...partners].map((partner, index) => (
                      <a
                        key={`${partner._id || partner.name}-${index}`}
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white border border-gray-100 hover:border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center shrink-0 w-44"
                      >
                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden mb-3">
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/80?text=Logo";
                            }}
                          />
                        </div>
                        <div className="font-semibold text-gray-800 group-hover:text-blue-600 mb-1 line-clamp-1">{partner.name}</div>
                        <div className="text-xs text-blue-600 group-hover:text-blue-700 inline-flex items-center">
                          ভিজিট করুন <FaExternalLinkAlt className="ml-1" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Motion.section>
      )}

      {/* Emergency Contacts */}
      <section className="py-16 px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">জরুরি যোগাযোগ</h2>
            <p className="text-gray-600 text-lg">জরুরি পরিস্থিতিতে যোগাযোগ করুন</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "পুলিশ", number: "৯৯৯", icon: FaShieldAlt, color: "blue" },
              { name: "অ্যাম্বুলেন্স", number: "১৬১৬৩", icon: FaHospital, color: "red" },
              { name: "ফায়ার সার্ভিস", number: "১৬১", icon: FaShieldAlt, color: "orange" },
              { name: "জেলা প্রশাসক", number: "০৫১-৬৬১০১", icon: FaBuilding, color: "green" }
            ].map((contact, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${contact.color}-100 text-${contact.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                  <contact.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{contact.name}</h3>
                <p className="text-2xl font-bold text-red-600 mb-4">{contact.number}</p>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                  কল করুন
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <Motion.section variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">আমাদের সাথে যোগাযোগ করুন</h2>
          <p className="text-xl mb-8 text-blue-100">কোনো প্রশ্ন বা পরামর্শ থাকলে আমাদের জানান</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
            >
              <FaEnvelope className="mr-2" />
              যোগাযোগ করুন
            </Link>
            <a 
              href="tel:+88051661001" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center"
            >
              <FaPhone className="mr-2" />
              কল করুন
            </a>
          </div>
        </div>
      </Motion.section>
    </div>
  );
}

export default Home;