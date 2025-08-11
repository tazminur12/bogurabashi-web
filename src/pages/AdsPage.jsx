import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { 
  FaSearch, 
  FaFilter, 
  FaAd, 
  FaExternalLinkAlt, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaClock, 
  FaStar, 
  FaEye, 
  FaTimes,
  FaSort,
  FaCalendarAlt,
  FaTag,
  FaHeart,
  FaShare,
  FaBookmark,
  FaEllipsisH,
  FaWhatsapp,
  FaEnvelope
} from 'react-icons/fa';

const AdsPage = () => {
  const axiosSecure = useAxiosSecure();
  
  // State for filtering and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // State for terms and conditions section
  const [showTerms, setShowTerms] = useState(false);

  // Fetch all ads from backend
  const {
    data: ads = [],
    isLoading: adsLoading,
    error: adsError,
  } = useQuery({
    queryKey: ["all-ads"],
    queryFn: async () => {
      const res = await axiosSecure.get("/ads");
      return res.data;
    },
  });

  // Get unique categories and types from ads
  const categories = [...new Set(ads.map(ad => ad.category).filter(Boolean))];
  const types = [...new Set(ads.map(ad => ad.type).filter(Boolean))];

  // Filter and sort ads
  const filteredAds = ads
    .filter(ad => {
      const matchesSearch = 
        ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || ad.category === selectedCategory;
      const matchesType = !selectedType || ad.type === selectedType;
      const matchesStatus = !selectedStatus || ad.status === selectedStatus;
      
      const matchesPrice = 
        (!priceRange.min || (ad.price && ad.price >= parseInt(priceRange.min))) &&
        (!priceRange.max || (ad.price && ad.price <= parseInt(priceRange.max)));

      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAdTypeColor = (type) => {
    switch (type) {
      case "featured":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "premium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "sponsored":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getAdTypeText = (type) => {
    switch (type) {
      case "featured":
        return "ফিচার্ড";
      case "premium":
        return "প্রিমিয়াম";
      case "sponsored":
        return "স্পনসরড";
      default:
        return "বিজ্ঞাপন";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedStatus('active');
    setSortBy('latest');
    setPriceRange({ min: '', max: '' });
  };

  if (adsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ত্রুটি!</h2>
          <p className="text-gray-600 mb-4">বিজ্ঞাপন লোড করতে সমস্যা হয়েছে</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <FaAd className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">বিজ্ঞাপন</h1>
            <p className="text-base text-gray-600 mb-3">বগুড়া জেলার সব বিজ্ঞাপন ও অফার</p>
            
            {/* Stats */}
            <div className="flex justify-center space-x-6 text-xs text-gray-600">
              <span>মোট বিজ্ঞাপন: {ads.length}</span>
              <span>সক্রিয়: {ads.filter(ad => ad.status === 'active').length}</span>
              <span>বিভাগ: {categories.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="বিজ্ঞাপন খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <FaFilter className="mr-2" />
              ফিল্টার {showFilters ? 'লুকান' : 'দেখান'}
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">সাজান:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="latest">সর্বশেষ</option>
                <option value="oldest">পুরাতন</option>
                <option value="price-low">কম দাম</option>
                <option value="price-high">বেশি দাম</option>
                <option value="discount">ছাড়</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">বিভাগ</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">সব বিভাগ</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ধরন</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">সব ধরন</option>
                  {types.map(type => (
                    <option key={type} value={type}>{getAdTypeText(type)}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">অবস্থা</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">সব অবস্থা</option>
                  <option value="active">সক্রিয়</option>
                  <option value="inactive">নিষ্ক্রিয়</option>
                  <option value="expired">মেয়াদোত্তীর্ণ</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">দামের পরিসর</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="নূন্যতম"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="সর্বোচ্চ"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {(searchTerm || selectedCategory || selectedType || selectedStatus !== 'active' || priceRange.min || priceRange.max) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reset Button */}
              <div className="md:col-span-2">
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <FaTimes className="mr-2" />
                  সব ফিল্টার সরান
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">ফলাফল</h2>
            <span className="text-sm text-gray-600">
              {filteredAds.length} টি বিজ্ঞাপন পাওয়া গেছে
            </span>
          </div>

          {adsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">বিজ্ঞাপন লোড হচ্ছে...</span>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaAd className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">কোনো বিজ্ঞাপন পাওয়া যায়নি</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory || selectedType ? 
                  "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো বিজ্ঞাপন নেই" : 
                  "এখনও কোনো বিজ্ঞাপন প্রকাশ করা হয়নি"
                }
              </p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                সব ফিল্টার সরান
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAds.map((ad) => (
                <div key={ad._id} className="group relative">
                  {/* Ad Badge */}
                  <div className={`absolute top-3 left-3 z-10 ${getAdTypeColor(ad.type)} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
                    <FaAd className="mr-1" />
                    {getAdTypeText(ad.type)}
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 z-10 ${getStatusColor(ad.status)} px-3 py-1 rounded-full text-xs font-medium`}>
                    {ad.status === 'active' ? 'সক্রিয়' : ad.status === 'inactive' ? 'নিষ্ক্রিয়' : 'মেয়াদোত্তীর্ণ'}
                  </div>
                  
                  {/* Ad Card */}
                  <Link to={`/ads/${ad._id}`} className="block">
                    <div className="bg-white border-2 border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:border-blue-200">
                      {/* Ad Image */}
                      {ad.image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={ad.image}
                            alt={ad.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
                            }}
                          />
                          {ad.discount && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              {ad.discount}% ছাড়
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Ad Content */}
                      <div className="p-6">
                        {/* Category */}
                        {ad.category && (
                          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                            {ad.category}
                          </span>
                        )}
                        
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {ad.title}
                        </h3>
                        
                        {/* Description */}
                        {ad.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {ad.description}
                          </p>
                        )}
                        
                        {/* Price */}
                        {ad.price && (
                          <div className="flex items-center mb-4">
                            <span className="text-2xl font-bold text-green-600">
                              ৳{ad.price.toLocaleString()}
                            </span>
                            {ad.originalPrice && ad.originalPrice > ad.price && (
                              <span className="text-gray-400 line-through ml-2">
                                ৳{ad.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Meta Info */}
                        <div className="space-y-2 mb-4">
                          {ad.company && (
                            <div className="flex items-center text-xs text-gray-500">
                              <FaBuilding className="mr-2" />
                              <span>{ad.company}</span>
                            </div>
                          )}
                          {ad.location && (
                            <div className="flex items-center text-xs text-gray-500">
                              <FaMapMarkerAlt className="mr-2" />
                              <span>{ad.location}</span>
                            </div>
                          )}
                          {ad.validUntil && (
                            <div className="flex items-center text-xs text-gray-500">
                              <FaClock className="mr-2" />
                              <span>মেয়াদ: {formatDate(ad.validUntil)}</span>
                            </div>
                          )}
                          {ad.createdAt && (
                            <div className="flex items-center text-xs text-gray-500">
                              <FaCalendarAlt className="mr-2" />
                              <span>প্রকাশ: {formatDate(ad.createdAt)}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            {ad.link ? (
                              <a
                                href={ad.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                <FaExternalLinkAlt className="mr-1" />
                                দেখুন
                              </a>
                            ) : (
                              <button className="inline-flex items-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                <FaPhone className="mr-1" />
                                যোগাযোগ
                              </button>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {ad.phone && (
                              <a
                                href={`tel:${ad.phone}`}
                                className="text-blue-600 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                title="কল করুন"
                              >
                                <FaPhone className="w-4 h-4" />
                              </a>
                            )}
                            <button className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors" title="বুকমার্ক">
                              <FaBookmark className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors" title="শেয়ার করুন">
                              <FaShare className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>আপনার বিজ্ঞাপন প্রকাশ করুন
                </div>
              ))}
            </div>
          )}
        </div>
            
        {/* Terms & Conditions Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">নিয়ম ও শর্তাবলী</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              বিজ্ঞাপন প্রকাশের আগে আমাদের নিয়ম ও শর্তাবলী পড়ুন এবং বুঝুন
            </p>
          </div>

          {/* Terms Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowTerms(!showTerms)}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-between"
            >
              <span className="flex items-center">
                <FaAd className="mr-3" />
                বিজ্ঞাপন প্রকাশের নিয়মাবলী দেখুন
              </span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${
                  showTerms ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Terms Content */}
          {showTerms && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              {/* Ad Publishing Rules */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaAd className="mr-2 text-blue-600" />
                  বিজ্ঞাপন প্রকাশের নিয়মাবলী
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">বিজ্ঞাপন সত্য ও নির্ভুল হতে হবে</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">অপমানজনক বা ক্ষতিকর বিষয়বস্তু নিষিদ্ধ</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">ছবি উচ্চ মানের এবং স্পষ্ট হতে হবে</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">মেয়াদ শেষ হওয়ার তারিখ উল্লেখ করতে হবে</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">যোগাযোগের তথ্য সঠিক হতে হবে</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">মূল্য ও ছাড়ের তথ্য স্পষ্ট হতে হবে</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">বিভাগ সঠিকভাবে নির্বাচন করতে হবে</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700">নিয়মিত আপডেট করতে হবে</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad Types and Pricing */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaTag className="mr-2 text-green-600" />
                  বিজ্ঞাপনের ধরন ও মূল্য
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">সাধারণ বিজ্ঞাপন</h4>
                    <p className="text-2xl font-bold text-blue-600 mb-2">৳৫০০</p>
                    <p className="text-sm text-gray-600">৭ দিনের জন্য</p>
                    <ul className="text-xs text-gray-600 mt-2 space-y-1">
                      <li>• মৌলিক বৈশিষ্ট্য</li>
                      <li>• স্ট্যান্ডার্ড স্থান</li>
                      <li>• মৌলিক সাপোর্ট</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">ফিচার্ড বিজ্ঞাপন</h4>
                    <p className="text-2xl font-bold text-purple-600 mb-2">৳১২০০</p>
                    <p className="text-sm text-gray-600">১৫ দিনের জন্য</p>
                    <ul className="text-xs text-gray-600 mt-2 space-y-1">
                      <li>• শীর্ষে প্রদর্শিত</li>
                      <li>• বিশেষ হাইলাইট</li>
                      <li>• প্রাধান্য সাপোর্ট</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">প্রিমিয়াম বিজ্ঞাপন</h4>
                    <p className="text-2xl font-bold text-orange-600 mb-2">৳২৫০০</p>
                    <p className="text-sm text-gray-600">৩০ দিনের জন্য</p>
                    <ul className="text-xs text-gray-600 mt-2 space-y-1">
                      <li>• সর্বোচ্চ অগ্রাধিকার</li>
                      <li>• বিশেষ ডিজাইন</li>
                      <li>• ২৪/৭ সাপোর্ট</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How to Submit Ads */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaPhone className="mr-2 text-orange-600" />
                  বিজ্ঞাপন জমা দেওয়ার পদ্ধতি
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">১ম ধাপ: যোগাযোগ করুন</h4>
                      <p className="text-sm text-gray-700 mb-2">আমাদের ফোন, WhatsApp বা ইমেইলে যোগাযোগ করুন</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📞 ফোন: +8801645460095</p>
                        <p>📱 WhatsApp: +8801540288718</p>
                        <p>✉️ ইমেইল: tanimkhalifa55@gmail.com</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">২য় ধাপ: তথ্য সরবরাহ করুন</h4>
                      <p className="text-sm text-gray-700 mb-2">নিম্নলিখিত তথ্যগুলি প্রস্তুত করুন:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• বিজ্ঞাপনের শিরোনাম</li>
                        <li>• বিস্তারিত বিবরণ</li>
                        <li>• উচ্চ মানের ছবি</li>
                        <li>• মূল্য ও ছাড়ের তথ্য</li>
                        <li>• যোগাযোগের তথ্য</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaTimes className="mr-2 text-red-600" />
                  গুরুত্বপূর্ণ নোট
                </h3>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">⚠️</span>
                      <span>বিজ্ঞাপন প্রকাশের আগে সম্পূর্ণ তথ্য যাচাই করা হবে</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">⚠️</span>
                      <span>ভুল বা মিথ্যা তথ্য দেওয়া হলে বিজ্ঞাপন প্রত্যাহার করা হবে</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">⚠️</span>
                      <span>নিয়ম লঙ্ঘন করলে অ্যাকাউন্ট স্থায়ীভাবে বন্ধ করা হবে</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">⚠️</span>
                      <span>বিজ্ঞাপন প্রকাশের সময় ২৪-৪৮ ঘন্টা লাগতে পারে</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact for More Info */}
              <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">আরও তথ্যের জন্য যোগাযোগ করুন</h4>
                <p className="text-gray-600 mb-4">
                  বিজ্ঞাপন প্রকাশ সম্পর্কে আপনার কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href="tel:+8801645460095"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                  >
                    <FaPhone className="mr-2" />
                    কল করুন
                  </a>
                  <a
                    href="https://wa.me/8801540288718"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                  >
                    <FaWhatsapp className="mr-2" />
                    WhatsApp
                  </a>
                  <a
                    href="mailto:tanimkhalifa55@gmail.com"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                  >
                    <FaEnvelope className="mr-2" />
                    ইমেইল
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdsPage; 