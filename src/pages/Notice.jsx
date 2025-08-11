import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaBullhorn, 
  FaCalendarAlt, 
  FaArrowRight, 
  FaSearch, 
  FaFilter, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaClock, 
  FaEye, 
  FaBell,
  FaStar,
  FaBookmark,
  FaShare,
  FaDownload
} from 'react-icons/fa';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Navbar from '../components/Navbar';

const Notice = () => {
  const axiosSecure = useAxiosSecure();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Fetch notices from backend
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosSecure.get("/notices");
        setNotices(res.data);
      } catch (error) {
        console.error("নোটিশ লোড করতে সমস্যা হয়েছে:", error);
        setError("নোটিশ লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [axiosSecure]);

  // Filter and sort notices
  const filteredNotices = notices
    .filter(notice => {
      const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notice.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || notice.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.publishDate || b.createdAt) - new Date(a.publishDate || a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.publishDate || a.createdAt) - new Date(b.publishDate || b.createdAt);
      }
      return 0;
    });

  const formatDate = (dateString) => {
    if (!dateString) return "তারিখ উল্লেখ নেই";
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "কয়েক মিনিট আগে";
    if (diffInHours < 24) return `${diffInHours} ঘণ্টা আগে`;
    if (diffInHours < 48) return "গতকাল";
    return formatDate(dateString);
  };

  const isUrgent = (notice) => {
    if (!notice.publishDate) return false;
    const publishDate = new Date(notice.publishDate);
    const now = new Date();
    const diffInDays = Math.floor((publishDate - now) / (1000 * 60 * 60 * 24));
    return diffInDays <= 3 && diffInDays >= 0;
  };

  const isNew = (notice) => {
    if (!notice.createdAt) return false;
    const createdAt = new Date(notice.createdAt);
    const now = new Date();
    const diffInHours = Math.floor((now - createdAt) / (1000 * 60 * 60));
    return diffInHours < 24;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'সরকারি বিজ্ঞপ্তি': 'bg-red-100 text-red-800 border-red-200',
      'স্বাস্থ্য সেবা': 'bg-green-100 text-green-800 border-green-200',
      'ডিজিটাল সেবা': 'bg-blue-100 text-blue-800 border-blue-200',
      'শিক্ষা': 'bg-purple-100 text-purple-800 border-purple-200',
      'পরিবহন': 'bg-orange-100 text-orange-800 border-orange-200',
      'সাধারণ': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors['সাধারণ'];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">নোটিশ লোড হচ্ছে...</h3>
          <p className="text-gray-600 text-sm">অনুগ্রহ করে অপেক্ষা করুন</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-4">
            <FaExclamationTriangle className="text-4xl text-red-500 mx-auto" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-600 rounded-full blur-xl opacity-20"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">ত্রুটি</h3>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-lg">
                <FaBullhorn size={24} />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              নোটিশ বোর্ড
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
              বগুড়া সম্পর্কিত সকল প্রাতিষ্ঠানিক নোটিশ, বিজ্ঞপ্তি ও গুরুত্বপূর্ণ তথ্য একসাথে
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-white rounded-lg p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-3 mx-auto">
                  <FaEye className="text-blue-600 text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{notices.length}</h3>
                <p className="text-gray-600 text-sm">মোট নোটিশ</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-white rounded-lg p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mb-3 mx-auto">
                  <FaBell className="text-red-600 text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {notices.filter(notice => isUrgent(notice)).length}
                </h3>
                <p className="text-gray-600 text-sm">জরুরি নোটিশ</p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-white rounded-lg p-4 shadow-md border border-gray-100"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-3 mx-auto">
                  <FaClock className="text-green-600 text-lg" />
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  {notices.length > 0 ? getTimeAgo(notices[0].updatedAt || notices[0].createdAt) : "কোন তথ্য নেই"}
                </h3>
                <p className="text-gray-600 text-sm">সর্বশেষ আপডেট</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Search and Filter Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg border border-gray-100 p-5 mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="নোটিশ খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 appearance-none bg-white text-sm"
                >
                  <option value="all">সকল বিভাগ</option>
                  <option value="সরকারি বিজ্ঞপ্তি">সরকারি বিজ্ঞপ্তি</option>
                  <option value="স্বাস্থ্য সেবা">স্বাস্থ্য সেবা</option>
                  <option value="ডিজিটাল সেবা">ডিজিটাল সেবা</option>
                  <option value="শিক্ষা">শিক্ষা</option>
                  <option value="পরিবহন">পরিবহন</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 appearance-none bg-white text-sm"
                >
                  <option value="latest">সর্বশেষ প্রথম</option>
                  <option value="oldest">পুরোনো প্রথম</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Notice Board */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}`}
          >
            {filteredNotices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="relative mb-6">
                  <FaBullhorn className="text-5xl text-gray-300 mx-auto" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur-xl opacity-20"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-600 mb-3">কোন নোটিশ পাওয়া যায়নি</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  {searchTerm || filterCategory !== 'all' 
                    ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোন নোটিশ নেই" 
                    : "এখনও কোন নোটিশ প্রকাশ করা হয়নি"}
                </p>
              </motion.div>
            ) : (
              filteredNotices.map(notice => (
                <motion.div
                  key={notice._id}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    isUrgent(notice) ? 'ring-2 ring-red-200' : ''
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(notice.category)}`}>
                          {notice.category || "সাধারণ"}
                        </span>
                        {isUrgent(notice) && (
                          <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full animate-pulse font-semibold">
                            জরুরি
                          </span>
                        )}
                        {isNew(notice) && (
                          <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full font-semibold">
                            নতুন
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <FaBookmark className="text-sm" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <FaShare className="text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className={`text-base font-bold mb-2 leading-tight ${
                      isUrgent(notice) ? "text-red-700" : "text-gray-800"
                    }`}>
                      {notice.title}
                    </h3>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <FaCalendarAlt className="mr-1" />
                      {formatDate(notice.publishDate)}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                        {notice.description.length > 120 
                          ? `${notice.description.substring(0, 120)}...` 
                          : notice.description
                        }
                      </p>
                    </div>
                    
                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <Link
                        to={`/notice/${notice._id}`}
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group text-sm"
                      >
                        বিস্তারিত দেখুন
                        <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform text-xs" />
                      </Link>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{getTimeAgo(notice.updatedAt || notice.createdAt)}</span>
                        {notice.attachments && notice.attachments.length > 0 && (
                          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <FaDownload className="text-xs" />
                            <span>{notice.attachments.length}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Enhanced Load More Button */}
          {filteredNotices.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-sm transform hover:-translate-y-1"
              >
                আরও নোটিশ দেখুন
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Notice;