import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaUser, 
  FaTag, 
  FaEye, 
  FaSearch, 
  FaNewspaper,
  FaClock,
  FaShare,
  FaBookmark,
  FaArrowRight,
  FaFire
} from "react-icons/fa";

const News = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedCategory, setSelectedCategory] = useState("সব");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: news = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await axiosSecure.get("/news");
      return res.data;
    },
  });

  // Filter news based on category and search
  const filteredNews = news.filter((item) => {
    const matchesCategory = selectedCategory === "সব" || item.category === selectedCategory;
    
    // Improved search logic
    const searchLower = searchTerm.toLowerCase().trim();
    const titleLower = (item.title || '').toLowerCase();
    const contentLower = (item.content || '').toLowerCase();
    const authorLower = (item.author || '').toLowerCase();
    const categoryLower = (item.category || '').toLowerCase();
    
    const matchesSearch = searchLower === '' || 
                         titleLower.includes(searchLower) ||
                         contentLower.includes(searchLower) ||
                         authorLower.includes(searchLower) ||
                         categoryLower.includes(searchLower);
    
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = ["সব", ...new Set(news.map(item => item.category).filter(Boolean))];

  // Get featured news (first 3 published news) - but also apply search filter
  const featuredNews = news.filter(item => 
    item.status === "Published" && 
    (selectedCategory === "সব" || item.category === selectedCategory) &&
    (searchTerm === "" || 
     (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
     (item.content || '').toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, 3);
  
  // Get latest news (excluding featured and applying all filters)
  const latestNews = filteredNews.filter(item => !featuredNews.includes(item));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-base text-gray-600">নিউজ লোড হচ্ছে...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center py-16">
            <div className="text-5xl mb-3">❌</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">ত্রুটি!</h2>
            <p className="text-gray-600 text-sm">নিউজ লোড করতে সমস্যা হয়েছে</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Compact Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FaNewspaper className="text-3xl text-blue-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">বগুড়া সংবাদ</h1>
            </div>
            <p className="text-gray-600 text-sm">উত্তরবঙ্গের প্রাণকেন্দ্রের সর্বশেষ খবরাখবর</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Compact Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="নিউজ খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="sm:w-40">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Compact Search Results Indicator */}
          {(searchTerm || selectedCategory !== "সব") && (
            <div className="mt-3 p-2.5 bg-blue-50 rounded-md border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaSearch className="text-blue-600 text-sm" />
                  <span className="text-blue-800 text-sm font-medium">
                    {searchTerm && `"${searchTerm}" এর জন্য`}
                    {searchTerm && selectedCategory !== "সব" && " এবং "}
                    {selectedCategory !== "সব" && `${selectedCategory} ক্যাটাগরিতে`}
                    {" "}মোট {filteredNews.length} টি ফলাফল
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("সব");
                  }}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  সব ফিল্টার মুছুন
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Compact Featured News Section */}
        {featuredNews.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FaFire className="text-xl text-red-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">প্রধান সংবাদ</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {featuredNews.map((item, index) => (
                <div
                  key={item._id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 ${
                    index === 0 ? 'lg:col-span-2' : ''
                  }`}
                >
                  {item.imageUrl && (
                    <div className={`relative overflow-hidden ${index === 0 ? 'h-56' : 'h-36'}`}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          প্রধান সংবাদ
                        </span>
                      </div>
                      {item.status === "Published" && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          প্রকাশিত
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    {item.category && (
                      <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium mb-2">
                        {item.category}
                      </span>
                    )}
                    <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${
                      index === 0 ? 'text-lg' : 'text-base'
                    }`}>
                      <Link
                        to={`/news/${item._id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className={`text-gray-600 mb-3 line-clamp-2 text-sm ${
                      index === 0 ? 'text-sm' : 'text-xs'
                    }`}>
                      {item.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        {item.author && (
                          <div className="flex items-center">
                            <FaUser className="mr-1 text-xs" />
                            <span>{item.author}</span>
                          </div>
                        )}
                        {item.publishDate && (
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1 text-xs" />
                            <span>{new Date(item.publishDate).toLocaleDateString('bn-BD')}</span>
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/news/${item._id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-xs"
                      >
                        পড়ুন <FaArrowRight className="ml-1 text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compact Latest News Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center mb-4">
              <FaClock className="text-lg text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">সর্বশেষ সংবাদ</h2>
            </div>
            
            {latestNews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="text-5xl mb-3">📰</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">কোনো নিউজ পাওয়া যায়নি</h3>
                <p className="text-gray-600 text-sm">অন্য ক্যাটাগরি বা কীওয়ার্ড দিয়ে চেষ্টা করুন</p>
              </div>
            ) : (
              <div className="space-y-4">
                {latestNews.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {item.imageUrl && (
                        <div className="sm:w-1/3 h-32 sm:h-auto">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          {item.category && (
                            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              {item.category}
                            </span>
                          )}
                          <div className="flex items-center space-x-1">
                            <button className="text-gray-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors">
                              <FaBookmark className="text-sm" />
                            </button>
                            <button className="text-gray-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors">
                              <FaShare className="text-sm" />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          <Link
                            to={`/news/${item._id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                          {item.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            {item.author && (
                              <div className="flex items-center">
                                <FaUser className="mr-1 text-xs" />
                                <span>{item.author}</span>
                              </div>
                            )}
                            {item.publishDate && (
                              <div className="flex items-center">
                                <FaCalendarAlt className="mr-1 text-xs" />
                                <span>{new Date(item.publishDate).toLocaleDateString('bn-BD')}</span>
                              </div>
                            )}
                          </div>
                          <Link
                            to={`/news/${item._id}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-xs"
                          >
                            বিস্তারিত পড়ুন <FaArrowRight className="ml-1 text-xs" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compact Sidebar */}
          <div className="space-y-4">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="text-base font-bold text-gray-900 mb-3">ক্যাটাগরি</h3>
              <div className="space-y-1.5">
                {categories.slice(1).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors text-sm ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="text-base font-bold text-gray-900 mb-3">জনপ্রিয় ট্যাগ</h3>
              <div className="flex flex-wrap gap-1.5">
                {['বগুড়া', 'শিক্ষা', 'স্বাস্থ্য', 'খেলাধুলা', 'সংস্কৃতি', 'বাণিজ্য'].map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* News Count */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="text-base font-bold text-gray-900 mb-3">সংবাদ পরিসংখ্যান</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">মোট সংবাদ</span>
                  <span className="font-bold text-blue-600 text-sm">{news.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">প্রকাশিত</span>
                  <span className="font-bold text-green-600 text-sm">{news.filter(item => item.status === "Published").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">ক্যাটাগরি</span>
                  <span className="font-bold text-purple-600 text-sm">{categories.length - 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Footer Stats */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <p className="text-gray-600 text-sm">
              মোট <span className="font-bold text-blue-600">{filteredNews.length}</span> টি সংবাদ পাওয়া গেছে
              {selectedCategory !== "সব" && ` (${selectedCategory} ক্যাটাগরিতে)`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News; 