import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiSearch, FiFilter, FiArrowRight, FiStar, FiClock, FiMap } from 'react-icons/fi';
import { FaHotel, FaMountain, FaUmbrellaBeach, FaMonument, FaTree, FaMosque, FaLandmark } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const DestinationPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosSecure = useAxiosSecure();

  // Load destinations from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/destinations?district=bogura");
        setDestinations(res.data);
        setError(null);
      } catch (error) {
        console.error("ডেটা লোডে সমস্যা:", error);
        setError("গন্তব্যের তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  // Filtered results
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          destination.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          destination.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Historical':
        return <FaLandmark className="text-amber-600" />;
      case 'Natural':
        return <FaTree className="text-green-600" />;
      case 'Religious':
        return <FaMosque className="text-purple-600" />;
      case 'Entertainment':
        return <FaHotel className="text-blue-600" />;
      default:
        return <FiMap className="text-gray-600" />;
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'Historical':
        return 'ঐতিহাসিক';
      case 'Natural':
        return 'প্রাকৃতিক';
      case 'Religious':
        return 'ধর্মীয়';
      case 'Entertainment':
        return 'বিনোদন কেন্দ্র';
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Historical':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Natural':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Religious':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Entertainment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">গন্তব্যের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ত্রুটি</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
            <FiMap className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            বগুড়ার অপরূপ গন্তব্যসমূহ
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            ঐতিহাসিক স্থান থেকে প্রাকৃতিক সৌন্দর্য, বগুড়ার প্রতিটি গন্তব্য আপনাকে মুগ্ধ করবে
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <FiSearch className="w-4 h-4 mr-2 text-blue-600" />
                অনুসন্ধান করুন
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="গন্তব্য, স্থান বা বিবরণ অনুসন্ধান করুন..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center">
                <FiFilter className="w-4 h-4 mr-2 text-blue-600" />
                বিভাগ ফিল্টার
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">সব বিভাগ</option>
                <option value="Historical">ঐতিহাসিক স্থান</option>
                <option value="Natural">প্রাকৃতিক সৌন্দর্য</option>
                <option value="Religious">ধর্মীয় স্থান</option>
                <option value="Entertainment">বিনোদন কেন্দ্র</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                ফলাফল
              </label>
              <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-800 font-medium">
                  {filteredDestinations.length} টি গন্তব্য পাওয়া গেছে
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <div
                key={destination._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(destination.category)}`}>
                      {getCategoryIcon(destination.category)}
                      <span className="ml-1">{getCategoryName(destination.category)}</span>
                    </div>
                  </div>

                  {/* Location Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center">
                      <FiMapPin className="w-3 h-3 mr-1 text-blue-600" />
                      {destination.location}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {destination.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {destination.description || "এই গন্তব্যটি সম্পর্কে বিস্তারিত তথ্য পাওয়া যায়নি।"}
                  </p>

                  {/* Additional Info */}
                  <div className="space-y-2 mb-6">
                    {destination.stayInfo && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaHotel className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="line-clamp-1">থাকার ব্যবস্থা: {destination.stayInfo}</span>
                      </div>
                    )}
                    {destination.travelInfo && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FiMap className="w-4 h-4 mr-2 text-green-600" />
                        <span className="line-clamp-1">যাওয়ার উপায়: {destination.travelInfo}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to={`/destinatonDetails?id=${destination._id}`}
                      className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <FiArrowRight className="w-4 h-4 mr-2" />
                      বিস্তারিত দেখুন
                    </Link>
                    {destination.mapLink && (
                      <a
                        href={destination.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow"
                      >
                        <FiMapPin className="w-4 h-4 mr-2" />
                        মানচিত্রে দেখুন
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">কোন গন্তব্য পাওয়া যায়নি</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              আপনার অনুসন্ধানের সাথে মিলে যায় এমন কোন গন্তব্য পাওয়া যায়নি। 
              অনুগ্রহ করে অন্য শব্দ দিয়ে অনুসন্ধান করুন।
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              সব গন্তব্য দেখুন
            </button>
          </div>
        )}

        {/* Footer Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              বগুড়া জেলার সেরা গন্তব্যসমূহ
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ঐতিহাসিক মহাস্থানগড় থেকে শুরু করে প্রাকৃতিক সৌন্দর্যে ভরপুর বিভিন্ন স্থান, 
              বগুড়া আপনাকে নিয়ে যাবে এক অপরূপ ভ্রমণ অভিজ্ঞতায়।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationPage;
