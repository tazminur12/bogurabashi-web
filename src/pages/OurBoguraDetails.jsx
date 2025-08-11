import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useSecureAxios from "../hooks/useAxiosSecure";
import { 
  FaArrowLeft, 
  FaExternalLinkAlt, 
  FaBirthdayCake, 
  FaBriefcase, 
  FaMapMarkerAlt,
  FaStar,
  FaAward,
  FaHeart,
  FaShare,
  FaBookmark,
  FaSpinner,
  FaExclamationTriangle,
  FaUser,
  FaHistory,
  FaGlobe
} from "react-icons/fa";
import { Skeleton } from "@mui/material";

const OurBoguraDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useSecureAxios();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosSecure.get(`/famous/${id}`);
        setPerson(res.data);
      } catch (err) {
        setError("তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id, axiosSecure]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center">
            <Skeleton variant="rectangular" width={300} height={350} animation="wave" className="rounded-2xl mb-6" />
            <Skeleton variant="text" width="60%" height={40} animation="wave" />
            <Skeleton variant="text" width="40%" height={30} animation="wave" className="mt-3" />
            <Skeleton variant="text" width="100%" height={80} animation="wave" className="mt-6" />
            <Skeleton variant="text" width="100%" height={80} animation="wave" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="text-center">
              <div className="relative mb-4">
                <FaExclamationTriangle className="text-4xl text-red-500 mx-auto" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-600 rounded-full blur-lg opacity-20"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">ডাটা লোড করতে ব্যর্থ</h3>
              <p className="text-gray-600 mb-6 text-sm">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium text-sm"
                >
                  <FaArrowLeft className="mr-2 inline text-sm" />
                  ফিরে যান
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                >
                  আবার চেষ্টা করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="relative mb-4">
              <FaUser className="text-4xl text-gray-400 mx-auto" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur-lg opacity-20"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">কোনো তথ্য পাওয়া যায়নি</h3>
            <p className="text-gray-600 mb-6 text-sm">
              অনুগ্রহ করে অন্য কোনো ব্যক্তিত্ব নির্বাচন করুন
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium text-sm"
            >
              <FaArrowLeft className="mr-2 inline text-sm" />
              ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Compact Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-all duration-200 group text-sm"
        >
          <FaArrowLeft className="mr-2 text-sm group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">সকল ব্যক্তিত্বের তালিকায় ফিরে যান</span>
        </motion.button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Compact Hero Section */}
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
            
            {/* Compact Professional Image Card */}
            <div className="relative flex flex-col items-center pt-8 pb-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative group mb-6"
              >
                {/* Main Image Container */}
                <div className="relative w-48 h-60 md:w-56 md:h-72 overflow-hidden rounded-2xl shadow-lg border-4 border-white transform rotate-1 group-hover:rotate-0 transition-all duration-300">
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <FaSpinner className="animate-spin text-2xl text-gray-400" />
                    </div>
                  )}
                  <img
                    src={person.image}
                    alt={person.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    } group-hover:scale-105`}
                    onLoad={handleImageLoad}
                    onError={(e) => {
                      e.target.src = '/placeholder-person.jpg';
                      e.target.className = 'w-full h-full object-cover bg-gray-100';
                      setImageLoaded(true);
                    }}
                  />
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                
                {/* Compact Floating Badges */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center transform rotate-6">
                  <FaStar className="mr-1.5 text-yellow-300 text-xs" />
                  <span className="text-xs font-bold">বগুড়ার গর্ব</span>
                </div>
                
                <div className="absolute -bottom-3 -left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center transform -rotate-6">
                  <FaAward className="mr-1.5 text-xs" />
                  <span className="text-xs font-bold">প্রতিভাবান</span>
                </div>
              </motion.div>

              {/* Name and Title */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6 px-4"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight">
                  {person.name}
                </h1>
                {person.profession && (
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200 shadow-md">
                    <FaBriefcase className="mr-2 text-sm" />
                    {person.profession}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
          
          {/* Compact Content Section */}
          <div className="px-6 pb-8">
            
            {/* Compact Info Cards */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid md:grid-cols-2 gap-4 mb-6 pt-4"
            >
              {person.born && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 flex items-center border border-blue-100 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-3">
                    <FaBirthdayCake className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-1">জন্ম সাল</h3>
                    <p className="text-base text-gray-800 font-semibold">{person.born}</p>
                  </div>
                </div>
              )}
              
              {person.profession && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-center border border-green-100 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-3">
                    <FaBriefcase className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-1">পেশা</h3>
                    <p className="text-base text-gray-800 font-semibold">{person.profession}</p>
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Compact Biography Section */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100 shadow-lg"
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg mr-3">
                  <FaHistory className="text-white text-sm" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">জীবনী</h3>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-sm text-justify whitespace-pre-line">
                  {person.description}
                </p>
              </div>
            </motion.div>
            
            {/* Compact Action Buttons */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              {person.website && (
                <a
                  href={person.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-2.5 border-2 border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  <FaGlobe className="mr-2 text-sm" />
                  Wikipedia পৃষ্ঠা দেখুন
                </a>
              )}
              
              <button className="inline-flex items-center px-5 py-2.5 border-2 border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-md">
                <FaShare className="mr-2 text-sm" />
                শেয়ার করুন
              </button>
              
              <button className="inline-flex items-center px-5 py-2.5 border-2 border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-md">
                <FaBookmark className="mr-2 text-sm" />
                বুকমার্ক
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurBoguraDetails;