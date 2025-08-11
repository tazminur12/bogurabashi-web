import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaEnvelope, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useSecureAxios from '../../hooks/useAxiosSecure';

const ContentCreatorPage = () => {
  const axiosSecure = useSecureAxios();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Fetch content creators from backend
  const { data: contentCreators = [], isLoading, error } = useQuery({
    queryKey: ['content-creators'],
    queryFn: async () => {
      const res = await axiosSecure.get('/content-creators');
      return res.data;
    },
  });

  // Filter creators based on search and specialty
  const filteredCreators = contentCreators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || creator.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Get unique specialties for filter
  const specialties = [...new Set(contentCreators.map(creator => creator.specialty))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">ডেটা লোড করতে সমস্যা হয়েছে</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-0">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">বগুড়ার কনটেন্ট ক্রিয়েটর</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            ভিডিও, ফটো, ডিজাইন, ভয়েস ওভার, সোশ্যাল মিডিয়া ও আরও অনেক কনটেন্ট ক্রিয়েটরদের তালিকা।
          </p>
          <Link
            to="/add-content-creator"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FaPlus className="mr-2" />
            কনটেন্ট ক্রিয়েটর যোগ করুন
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="নাম বা স্পেশালিটি অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Specialty Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">সব স্পেশালিটি</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center md:justify-end">
              <span className="text-gray-600">
                {filteredCreators.length} জন কনটেন্ট ক্রিয়েটর পাওয়া গেছে
              </span>
            </div>
          </div>
        </div>

        {/* Content Creators Grid */}
        {filteredCreators.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">কোন কনটেন্ট ক্রিয়েটর পাওয়া যায়নি</h3>
            <p className="text-gray-500">অনুগ্রহ করে আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCreators.map(creator => (
              <div key={creator._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center group">
                <div className="relative mb-4">
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow group-hover:border-blue-200 transition-colors duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                  {creator.name}
                </h3>
                
                <p className="text-blue-600 font-medium mb-3 px-3 py-1 bg-blue-50 rounded-full text-sm">
                  {creator.specialty}
                </p>
                
                <div className="flex space-x-3 justify-center mb-4">
                  {creator.facebook && (
                    <a 
                      href={creator.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
                      title="Facebook"
                    >
                      <FaFacebook size={18} />
                    </a>
                  )}
                  {creator.instagram && (
                    <a 
                      href={creator.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-pink-500 hover:text-pink-700 transition-colors duration-200 p-2 rounded-full hover:bg-pink-50"
                      title="Instagram"
                    >
                      <FaInstagram size={18} />
                    </a>
                  )}
                  {creator.youtube && (
                    <a 
                      href={creator.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                      title="YouTube"
                    >
                      <FaYoutube size={18} />
                    </a>
                  )}
                  {creator.tiktok && (
                    <a 
                      href={creator.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-black hover:text-gray-700 transition-colors duration-200 p-2 rounded-full hover:bg-gray-50"
                      title="TikTok"
                    >
                      <FaTiktok size={18} />
                    </a>
                  )}
                  {creator.email && (
                    <a 
                      href={`mailto:${creator.email}`} 
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-50"
                      title="Email"
                    >
                      <FaEnvelope size={18} />
                    </a>
                  )}
                </div>

                <Link
                  to={`/content-creator/${creator._id}`}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-sm"
                >
                  বিস্তারিত দেখুন
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCreatorPage; 