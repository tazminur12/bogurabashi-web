import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiDollarSign, FiStar, FiArrowLeft, FiShare2, FiHeart, FiCalendar, FiInfo, FiMap, FiPhone, FiMail } from 'react-icons/fi';
import { FaHotel, FaTree, FaMosque, FaLandmark, FaRegHeart, FaHeart, FaWhatsapp, FaFacebook, FaTwitter } from 'react-icons/fa';
import { IoIosPeople, IoIosCar } from 'react-icons/io';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const DestinationDetailPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [destination, setDestination] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchDestination = async () => {
      if (!id) {
        setError("গন্তব্যের আইডি পাওয়া যায়নি");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axiosSecure.get(`/destinations/${id}`);
        setDestination(res.data);
        setError(null);
      } catch (error) {
        console.error("গন্তব্যের তথ্য লোডে সমস্যা:", error);
        setError("গন্তব্যের তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id, axiosSecure]);

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
        return <FiMapPin className="text-gray-600" />;
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'Historical':
        return 'ঐতিহাসিক স্থান';
      case 'Natural':
        return 'প্রাকৃতিক সৌন্দর্য';
      case 'Religious':
        return 'ধর্মীয় স্থান';
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

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">গন্তব্য পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-6">{error || "এই গন্তব্যটি পাওয়া যায়নি"}</p>
          <Link 
            to="/destinationData" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            সব গন্তব্য দেখুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link 
              to="/destinationData" 
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              <FiArrowLeft className="mr-2" />
              সব গন্তব্য
            </Link>
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsFavorite(!isFavorite)} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title={isFavorite ? "প্রিয় থেকে সরান" : "প্রিয়তে যোগ করুন"}
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500" size={20} />
                ) : (
                  <FaRegHeart className="text-gray-500" size={20} />
                )}
              </button>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="শেয়ার করুন"
              >
                <FiShare2 className="text-gray-500" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Destination Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(destination.category)}`}>
              {getCategoryIcon(destination.category)}
              <span className="ml-2">{getCategoryName(destination.category)}</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{destination.name}</h1>
          
          <div className="flex items-center text-gray-600 mb-4">
            <FiMapPin className="mr-2 text-blue-600" />
            <span className="font-medium">{destination.location}</span>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            {destination.description || "এই গন্তব্যটি সম্পর্কে বিস্তারিত তথ্য পাওয়া যায়নি।"}
          </p>
        </div>

        {/* Main Image */}
        <div className="mb-8">
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{destination.name}</h2>
                <p className="text-gray-600">{destination.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'overview' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiInfo className="inline mr-2" />
                বিবরণ
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'info' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiMap className="inline mr-2" />
                তথ্য
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'contact' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiPhone className="inline mr-2" />
                যোগাযোগ
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">গন্তব্য সম্পর্কে</h3>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {destination.description || "এই গন্তব্যটি সম্পর্কে বিস্তারিত তথ্য পাওয়া যায়নি।"}
                        </p>
                      </div>
                    </div>

                    {destination.stayInfo && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                          <FaHotel className="mr-2 text-blue-600" />
                          থাকার ব্যবস্থা
                        </h3>
                        <div className="bg-blue-50 rounded-xl p-6">
                          <p className="text-gray-700">{destination.stayInfo}</p>
                        </div>
                      </div>
                    )}

                    {destination.travelInfo && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                          <IoIosCar className="mr-2 text-green-600" />
                          যাওয়ার উপায়
                        </h3>
                        <div className="bg-green-50 rounded-xl p-6">
                          <p className="text-gray-700">{destination.travelInfo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <FiMapPin className="mr-2 text-blue-600" />
                          অবস্থান
                        </h3>
                        <p className="text-gray-700">{destination.location}</p>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <FaLandmark className="mr-2 text-amber-600" />
                          বিভাগ
                        </h3>
                        <p className="text-gray-700">{getCategoryName(destination.category)}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">গুরুত্বপূর্ণ তথ্য</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <FiClock className="text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">সেরা সময়</p>
                            <p className="text-gray-600">সারা বছর</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <IoIosPeople className="text-green-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">উপযুক্ত</p>
                            <p className="text-gray-600">সব বয়সের জন্য</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">যোগাযোগের তথ্য</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <FiPhone className="text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">ফোন</p>
                            <p className="text-gray-600">+৮৮০ ১৭১১-XXXXXX</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FiMail className="text-green-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">ইমেইল</p>
                            <p className="text-gray-600">info@bogurabashi.com</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">সামাজিক যোগাযোগ</h3>
                      <div className="flex space-x-4">
                        <button className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                          <FaWhatsapp className="mr-2" />
                          WhatsApp
                        </button>
                        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                          <FaFacebook className="mr-2" />
                          Facebook
                        </button>
                        <button className="flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                          <FaTwitter className="mr-2" />
                          Twitter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Info Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">দ্রুত তথ্য</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">বিভাগ</span>
                      <span className="font-semibold text-gray-800">{getCategoryName(destination.category)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">অবস্থান</span>
                      <span className="font-semibold text-gray-800">{destination.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">জেলা</span>
                      <span className="font-semibold text-gray-800">বগুড়া</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {destination.mapLink ? (
                      <a
                        href={destination.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-center w-full mt-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-xl transition-colors"
                      >
                        মানচিত্রে দেখুন
                      </a>
                    ) : (
                      <button
                        className="w-full mt-3 border-2 border-gray-300 text-gray-400 cursor-not-allowed font-semibold py-3 px-4 rounded-xl"
                        disabled
                        title="মানচিত্রের লিংক নেই"
                      >
                        মানচিত্রের লিংক নেই
                      </button>
                    )}
                  </div>
                </div>

                {/* Travel Tips Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FiInfo className="mr-2 text-amber-600" />
                    ভ্রমণ টিপস
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">সকালে বা বিকেলে যাওয়া ভালো</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">স্থানীয় গাইড নিন</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">ক্যামেরা সঙ্গে রাখুন</p>
                    </div>
                  </div>
                </div>

                {/* Weather Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FiCalendar className="mr-2 text-blue-600" />
                    আবহাওয়া
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">২৫°C</div>
                    <p className="text-gray-600 text-sm">আজকের তাপমাত্রা</p>
                    <p className="text-gray-500 text-xs mt-1">সূর্যালোক, আর্দ্রতা ৭০%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Destinations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">অন্যান্য গন্তব্য</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-gray-600">আরও গন্তব্য দেখতে</p>
              <Link 
                to="/destinationData"
                className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                সব গন্তব্য দেখুন
                <FiArrowLeft className="ml-1 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;