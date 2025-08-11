import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { 
  FiTruck, 
  FiMapPin, 
  FiClock, 
  FiPhone, 
  FiSearch, 
  FiFilter, 
  FiNavigation, 
  FiUser, 
  FiDollarSign,
  FiCalendar,
  FiStar,
  FiInfo
} from 'react-icons/fi';

const BusTicketPage = () => {
  const axiosSecure = useAxiosSecure();
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusType, setSelectedBusType] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedCounter, setSelectedCounter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Load bus data from backend
  const fetchBusData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosSecure.get('/buses');
      setBuses(res.data);
    } catch (error) {
      console.error('বাসের তথ্য লোড করতে সমস্যা হয়েছে', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusData();
  }, []);

  // Get unique values for filters
  const uniqueBusTypes = [...new Set(buses.map(bus => bus.busType).filter(Boolean))];
  const uniqueRoutes = [...new Set(buses.map(bus => bus.route).filter(Boolean))];
  const uniqueCounters = [...new Set(buses.map(bus => bus.counterName).filter(Boolean))];

  // Filter buses based on search and filters
  const filteredBuses = buses.filter(bus => {
    const matchesSearch = 
      bus.busName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.counterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.route?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.contactNumber?.includes(searchTerm);
    
    const matchesBusType = selectedBusType === 'all' || bus.busType === selectedBusType;
    const matchesRoute = selectedRoute === 'all' || bus.route === selectedRoute;
    const matchesCounter = selectedCounter === 'all' || bus.counterName === selectedCounter;
    
    return matchesSearch && matchesBusType && matchesRoute && matchesCounter;
  });

  const getBusTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'ac': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'non-ac': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'luxury': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'local': return 'bg-green-100 text-green-800 border-green-200';
      case 'express': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBusTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'ac': return '❄️';
      case 'non-ac': return '🚌';
      case 'luxury': return '⭐';
      case 'local': return '🚐';
      case 'express': return '🚀';
      default: return '🚌';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBusType('all');
    setSelectedRoute('all');
    setSelectedCounter('all');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-4">
            <FiTruck />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">বাসের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white text-2xl">
            <FiTruck />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">বগুড়া বাস টিকিট</h1>
          <p className="text-gray-600">বগুড়া জেলার সব বাস কাউন্টারের তথ্য ও সময়সূচী</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiTruck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">মোট বাস</p>
                <p className="text-2xl font-bold text-gray-900">{buses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiMapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">কাউন্টার</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueCounters.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiNavigation className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">রুট</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueRoutes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">আজকের বাস</p>
                <p className="text-2xl font-bold text-gray-900">{buses.filter(bus => bus.departureTime).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="বাসের নাম, কাউন্টার, রুট বা নম্বর দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
            >
              <FiFilter className="mr-2" />
              ফিল্টার {showFilters ? 'ছাড়ুন' : 'দেখুন'}
            </button>
            {(searchTerm || selectedBusType !== 'all' || selectedRoute !== 'all' || selectedCounter !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                সব ফিল্টার মুছুন
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Bus Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">বাসের ধরন</label>
                <select
                  value={selectedBusType}
                  onChange={(e) => setSelectedBusType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="all">সব ধরনের বাস</option>
                  {uniqueBusTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Route Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">রুট</label>
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="all">সব রুট</option>
                  {uniqueRoutes.map(route => (
                    <option key={route} value={route}>{route}</option>
                  ))}
                </select>
              </div>

              {/* Counter Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">কাউন্টার</label>
                <select
                  value={selectedCounter}
                  onChange={(e) => setSelectedCounter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="all">সব কাউন্টার</option>
                  {uniqueCounters.map(counter => (
                    <option key={counter} value={counter}>{counter}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredBuses.length}টি বাস পাওয়া গেছে
            {(searchTerm || selectedBusType !== 'all' || selectedRoute !== 'all' || selectedCounter !== 'all') && 
              ` (${buses.length}টি থেকে ফিল্টার করা)`
            }
          </p>
        </div>

        {/* Buses Grid */}
        {filteredBuses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl mb-4">
              <FiTruck />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">কোন বাস পাওয়া যায়নি</h3>
            <p className="text-gray-600">আপনার অনুসন্ধানের সাথে মিলে এমন কোন বাস নেই।</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
            >
              সব ফিল্টার মুছুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuses.map((bus) => (
              <div key={bus._id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getBusTypeIcon(bus.busType)}</span>
                      <h3 className="text-white font-semibold text-lg">{bus.busName}</h3>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBusTypeColor(bus.busType)}`}>
                      {bus.busType || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Counter */}
                  <div className="flex items-center">
                    <FiMapPin className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">কাউন্টার</p>
                      <p className="font-medium text-gray-900">{bus.counterName}</p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center">
                    <FiNavigation className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">রুট</p>
                      <p className="font-medium text-gray-900">{bus.route}</p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center">
                    <FiClock className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">সময়</p>
                      <p className="font-medium text-gray-900">
                        {bus.departureTime} {bus.arrivalTime && `- ${bus.arrivalTime}`}
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center">
                    <FiPhone className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">যোগাযোগ</p>
                      <p className="font-bold text-lg text-green-600">{bus.contactNumber}</p>
                    </div>
                  </div>

                  {/* Operator */}
                  {bus.operatorName && (
                    <div className="flex items-center">
                      <FiUser className="w-5 h-5 text-indigo-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">অপারেটর</p>
                        <p className="font-medium text-gray-900">{bus.operatorName}</p>
                      </div>
                    </div>
                  )}

                  {/* Fare */}
                  {bus.fare && (
                    <div className="flex items-center">
                      <FiDollarSign className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">ভাড়া</p>
                        <p className="font-medium text-gray-900">৳{bus.fare}</p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {bus.description && (
                    <div className="flex items-start">
                      <FiInfo className="w-5 h-5 text-gray-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">বিবরণ</p>
                        <p className="text-sm text-gray-700">{bus.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Facilities */}
                  {bus.facilities && (
                    <div className="flex items-start">
                      <FiStar className="w-5 h-5 text-yellow-600 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">সুবিধা</p>
                        <p className="text-sm text-gray-700">{bus.facilities}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-center">
                    <span className="text-xs text-gray-500">
                      {bus.updatedAt || bus.createdAt ? 
                        `আপডেট: ${new Date(bus.updatedAt || bus.createdAt).toLocaleDateString('bn-BD')}` : 
                        'নতুন যোগ করা হয়েছে'
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusTicketPage;
