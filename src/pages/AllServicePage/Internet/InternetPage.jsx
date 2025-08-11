import React, { useState, useEffect } from 'react';
import { FiWifi, FiMapPin, FiPhone, FiMail, FiGlobe, FiDollarSign, FiUsers, FiClock, FiStar, FiSearch, FiFilter, FiGrid, FiList, FiHeart, FiShare2, FiExternalLink, FiRefreshCw, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const InternetPage = () => {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 items per page for 3x3 grid
  const axiosSecure = useAxiosSecure();

  // Fetch providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching internet providers...');
        console.log('API Base URL:', axiosSecure.defaults.baseURL);
        
        const res = await axiosSecure.get('/internet-providers');
        console.log('API Response:', res.data);
        
        if (res.data && res.data.success) {
          setProviders(res.data.data || []);
          setFilteredProviders(res.data.data || []);
          console.log('Providers loaded:', res.data.data);
        } else if (Array.isArray(res.data)) {
          // Fallback: if API returns array directly
          setProviders(res.data);
          setFilteredProviders(res.data);
          console.log('Providers loaded (array format):', res.data);
        } else {
          console.error('API response format error:', res.data);
          setProviders([]);
          setFilteredProviders([]);
          setError('API রেসপন্স ফরম্যাট ভুল');
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
        setProviders([]);
        setFilteredProviders([]);
        
        if (error.response?.status === 404) {
          setError('API এন্ডপয়েন্ট পাওয়া যায়নি (404)');
        } else if (error.response?.status === 500) {
          setError('সার্ভার ত্রুটি (500)');
        } else if (error.code === 'ECONNREFUSED') {
          setError('সার্ভার সংযোগ করা যায়নি');
        } else {
          setError(`তথ্য লোড করা যায়নি: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    console.log('InternetPage mounted, fetching providers...');
    fetchProviders();
  }, [axiosSecure]);

  // Filter providers
  useEffect(() => {
    let filtered = providers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.contact?.includes(searchTerm) ||
        provider.serviceArea?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter(provider => provider.type === selectedType);
    }

    setFilteredProviders(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [providers, searchTerm, selectedType]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);

  // Toggle favorite
  const toggleFavorite = (providerId) => {
    setFavorites(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  // Share provider
  const shareProvider = async (provider) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: provider.name,
          text: `${provider.name} - ${provider.address}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${provider.name}\n${provider.address}\n${provider.contact}`;
      navigator.clipboard.writeText(text);
      alert('তথ্য কপি করা হয়েছে!');
    }
  };

  // Get type label
  const getTypeLabel = (type) => {
    const typeLabels = {
      fiber: 'ফাইবার অপটিক',
      cable: 'কেবল',
      wireless: 'ওয়্যারলেস',
      satellite: 'স্যাটেলাইট',
      mobile: 'মোবাইল ব্রডব্যান্ড'
    };
    return typeLabels[type] || type;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ইন্টারনেট প্রোভাইডার লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <FiWifi className="text-6xl mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">বগুড়ার ইন্টারনেট সেবা</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              বগুড়া জেলার সকল ইন্টারনেট সেবা প্রদানকারীর বিস্তারিত তথ্য। আপনার এলাকার সেরা ইন্টারনেট সেবা খুঁজে নিন।
            </p>
          </div>
          
          {/* Add Provider Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => window.location.href = '/add-internet-provider'}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FiWifi className="w-5 h-5 mr-2" />
              আপনার ইন্টারনেট সেবা যোগ করুন
            </button>
            <p className="text-blue-200 text-sm">
              ইন্টারনেট প্রোভাইডার? আপনার সেবার তথ্য যোগ করুন
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="প্রোভাইডার নাম, ঠিকানা বা যোগাযোগ নম্বর দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results with Pagination */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            <span className="font-semibold">{filteredProviders.length}</span>টি প্রোভাইডার পাওয়া গেছে
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">দেখার ধরন:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Providers Grid/List */}
        {filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <FiWifi className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">কোনো প্রোভাইডার পাওয়া যায়নি</h3>
            <p className="text-gray-500">আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ইন্টারনেট প্রোভাইডার নেই</p>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8' : 'space-y-6 mb-8'}>
              {currentProviders.map((provider) => (
                <div key={provider._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Provider Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{provider.name}</h3>
                        <div className="flex items-center gap-2 text-blue-100">
                          <FiWifi className="w-4 h-4" />
                          <span className="text-sm">{getTypeLabel(provider.type)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(provider._id)}
                          className={`p-2 rounded-full transition-colors ${
                            favorites.includes(provider._id) ? 'bg-red-500 text-white' : 'bg-white bg-opacity-20 text-white hover:bg-red-500'
                          }`}
                        >
                          <FiHeart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => shareProvider(provider)}
                          className="p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-colors"
                        >
                          <FiShare2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Provider Content */}
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{provider.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{provider.contact}</span>
                      </div>
                      
                      {provider.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiMail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{provider.email}</span>
                        </div>
                      )}
                      
                      {provider.website && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiGlobe className="w-4 h-4 text-gray-400" />
                          <a 
                            href={provider.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            ওয়েবসাইট দেখুন
                          </a>
                        </div>
                      )}
                      
                      {provider.speed && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiStar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">গতি: {provider.speed}</span>
                        </div>
                      )}
                      
                      {provider.price && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiDollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">মূল্য: {provider.price}</span>
                        </div>
                      )}
                      
                      {provider.serviceArea && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiMapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">সেবা এলাকা: {provider.serviceArea}</span>
                        </div>
                      )}
                    </div>
                    
                    {provider.description && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-600 text-sm line-clamp-3">{provider.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center gap-4">
              {/* Pagination Info */}
              <div className="text-center text-gray-600">
                <p>
                  পৃষ্ঠা <span className="font-semibold">{currentPage}</span> এর <span className="font-semibold">{currentProviders.length}</span>টি প্রোভাইডার দেখানো হচ্ছে
                  {totalPages > 1 && (
                    <> (মোট <span className="font-semibold">{totalPages}</span> পৃষ্ঠা)</>
                  )}
                </p>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                >
                  <FiArrowLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                    </>
                  )}
                  
                  {/* Show current page and surrounding pages */}
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-md transition-colors ${
                            currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  {/* Show last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages || filteredProviders.length === 0}
                >
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InternetPage; 