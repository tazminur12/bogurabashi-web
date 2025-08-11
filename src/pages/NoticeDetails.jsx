import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBullhorn, 
  FaCalendarAlt, 
  FaArrowLeft, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaClock, 
  FaEye, 
  FaShare, 
  FaPrint, 
  FaDownload,
  FaTag,
  FaUser,
  FaBuilding
} from 'react-icons/fa';
import useAxiosSecure from '../hooks/useAxiosSecure';

const NoticeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedNotices, setRelatedNotices] = useState([]);

  // Fetch notice details
  useEffect(() => {
    const fetchNoticeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosSecure.get(`/notices/${id}`);
        setNotice(res.data);
        
        // Fetch related notices
        const relatedRes = await axiosSecure.get(`/notices?category=${res.data.category}&limit=3&exclude=${id}`);
        setRelatedNotices(relatedRes.data);
      } catch (error) {
        console.error("নোটিশ লোড করতে সমস্যা হয়েছে:", error);
        setError("নোটিশ লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNoticeDetails();
    }
  }, [id, axiosSecure]);

  const formatDate = (dateString) => {
    if (!dateString) return "তারিখ উল্লেখ নেই";
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
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
    if (!notice?.publishDate) return false;
    const publishDate = new Date(notice.publishDate);
    const now = new Date();
    const diffInDays = Math.floor((publishDate - now) / (1000 * 60 * 60 * 24));
    return diffInDays <= 3 && diffInDays >= 0;
  };

  const isFuture = (notice) => {
    if (!notice?.publishDate) return false;
    const publishDate = new Date(notice.publishDate);
    const now = new Date();
    return publishDate > now;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: notice.title,
        text: notice.description.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('লিংক কপি করা হয়েছে!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([`
      নোটিশ: ${notice.title}
      
      প্রকাশের তারিখ: ${formatDate(notice.publishDate)}
      বিভাগ: ${notice.category || 'সাধারণ'}
      
      বিবরণ:
      ${notice.description}
      
      প্রকাশক: বগুড়া বাসি ওয়েবসাইট
      তারিখ: ${new Date().toLocaleDateString('bn-BD')}
    `], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${notice.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">নোটিশ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">নোটিশ পাওয়া যায়নি</h3>
          <p className="text-gray-600 mb-4">{error || "অনুরোধকৃত নোটিশ পাওয়া যায়নি"}</p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/notice')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              নোটিশ বোর্ডে ফিরে যান
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/notice')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            নোটিশ বোর্ডে ফিরে যান
          </button>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2  bg-opacity-20 rounded-lg">
                  <FaBullhorn size={24} />
                </div>
                <div>
                  <span className="text-sm font-medium  bg-opacity-20 px-3 py-1 rounded-full">
                    {notice.category || "সাধারণ"}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isUrgent(notice) && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full animate-pulse">
                    জরুরি
                  </span>
                )}
                {isFuture(notice) && (
                  <span className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">
                    ভবিষ্যতের
                  </span>
                )}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{notice.title}</h1>
            <div className="flex items-center space-x-4 text-sm opacity-90">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>প্রকাশের তারিখ: {formatDate(notice.publishDate)}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2" />
                <span>{getTimeAgo(notice.updatedAt || notice.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaEye className="mr-1" />
                <span>দেখা হয়েছে</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FaShare className="mr-1" />
                  শেয়ার করুন
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaPrint className="mr-1" />
                  প্রিন্ট করুন
                </button>
                
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <FaDownload className="mr-1" />
                  ডাউনলোড করুন
                </button>
                
              </div>
            </div>

            {/* Notice Description */}
            <div className="prose max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">নোটিশের বিবরণ</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {notice.description}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaTag className="mr-2 text-blue-600" />
                  নোটিশের তথ্য
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">বিভাগ:</span>
                    <span className="font-medium">{notice.category || "সাধারণ"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">প্রকাশের তারিখ:</span>
                    <span className="font-medium">{formatDate(notice.publishDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">শেষ আপডেট:</span>
                    <span className="font-medium">{getTimeAgo(notice.updatedAt || notice.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaBuilding className="mr-2 text-blue-600" />
                  প্রকাশক তথ্য
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">প্রকাশক:</span>
                    <span className="font-medium">বগুড়া বাসি ওয়েবসাইট</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ওয়েবসাইট:</span>
                    <span className="font-medium">www.bogurabashi.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">যোগাযোগ:</span>
                    <span className="font-medium">info@bogurabashi.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Notices */}
        {relatedNotices.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">সম্পর্কিত নোটিশ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNotices.map((relatedNotice) => (
                <motion.div
                  key={relatedNotice._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {relatedNotice.category || "সাধারণ"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(relatedNotice.updatedAt || relatedNotice.createdAt)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {relatedNotice.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {relatedNotice.description.substring(0, 100)}...
                  </p>
                  <Link
                    to={`/notice/${relatedNotice._id}`}
                    className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    বিস্তারিত দেখুন
                    <FaArrowLeft className="ml-1 transform rotate-180" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Notice Board */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            to="/notice"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FaArrowLeft className="mr-2" />
            সকল নোটিশ দেখুন
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NoticeDetails; 