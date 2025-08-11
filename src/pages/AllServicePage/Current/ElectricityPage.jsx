import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiZap, FiSearch, FiMapPin, FiPhone, FiMail, FiGlobe, FiUser, FiCalendar, FiFilter, FiGrid, FiList, FiStar, FiShare2, FiClock, FiAlertCircle } from 'react-icons/fi';

const ElectricityPage = () => {
  const [electricities, setElectricities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  const axiosSecure = useAxiosSecure();

  const boguraAreas = [
    'সব এলাকা',
    'বগুড়া সদর',
    'শিবগঞ্জ',
    'ধুনট',
    'আদমদীঘি',
    'নন্দীগ্রাম',
    'সারিয়াকান্দি',
    'শাজাহানপুর',
    'গাবতলী',
    'কাহালু',
    'দুপচাঁচিয়া',
    'সোনাতলা',
    'শেরপুর'
  ];

  const electricityTypes = [
    'সব ধরণ',
    'বিদ্যুৎ কেন্দ্র',
    'সাবস্টেশন',
    'বিতরণ কেন্দ্র',
    'গ্রাহক সেবা কেন্দ্র',
    'বিলিং অফিস',
    'রক্ষণাবেক্ষণ কেন্দ্র',
    'জরুরি সেবা কেন্দ্র',
    'আঞ্চলিক অফিস'
  ];

  // Fetch electricity data
  useEffect(() => {
    const fetchElectricities = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get('/electricities');
        if (res.data && res.data.data) {
          setElectricities(res.data.data);
        } else {
          setElectricities([]);
        }
      } catch (error) {
        console.error('Error fetching electricities:', error);
        setElectricities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchElectricities();
  }, [axiosSecure]);

  // Filter electricities based on search and filters
  const filteredElectricities = electricities.filter(electricity => {
    try {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
                           (electricity.name && electricity.name.toLowerCase().includes(searchLower)) ||
                           (electricity.address && electricity.address.toLowerCase().includes(searchLower)) ||
                           (electricity.manager && electricity.manager.toLowerCase().includes(searchLower));
      
      // Area filter
      const matchesArea = !selectedArea || selectedArea === 'সব এলাকা' || electricity.area === selectedArea;
      
      // Type filter
      const matchesType = !selectedType || selectedType === 'সব ধরণ' || 
                         getTypeLabel(electricity.type) === selectedType;

      return matchesSearch && matchesArea && matchesType;
    } catch (error) {
      console.error('Error filtering electricity:', error);
      return true; // Show all if there's an error
    }
  });

  const getTypeLabel = (type) => {
    try {
      if (!type) return 'অজানা';
      
      const typeMap = {
        'power_plant': 'বিদ্যুৎ কেন্দ্র',
        'substation': 'সাবস্টেশন',
        'distribution_center': 'বিতরণ কেন্দ্র',
        'customer_service': 'গ্রাহক সেবা কেন্দ্র',
        'billing_office': 'বিলিং অফিস',
        'maintenance_center': 'রক্ষণাবেক্ষণ কেন্দ্র',
        'emergency_service': 'জরুরি সেবা কেন্দ্র',
        'regional_office': 'আঞ্চলিক অফিস'
      };
      return typeMap[type] || type;
    } catch (error) {
      console.error('Error getting type label:', error);
      return type || 'অজানা';
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const shareCenter = (electricity) => {
    const text = `${electricity.name} - ${electricity.address}`;
    if (navigator.share) {
      navigator.share({
        title: electricity.name,
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('তথ্য কপি করা হয়েছে!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">বিদ্যুৎ কেন্দ্রের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-opacity-20 rounded-full">
                <FiZap className="text-4xl" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              বগুড়া জেলার বিদ্যুৎ কেন্দ্রসমূহ
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              বগুড়া জেলার সব বিদ্যুৎ সেবা কেন্দ্রের তথ্য, যোগাযোগের নম্বর এবং সেবার বিবরণ
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="বিদ্যুৎ কেন্দ্রের নাম, ঠিকানা বা ব্যবস্থাপক খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Area Filter */}
            <div>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {boguraAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {electricityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredElectricities.length}টি কেন্দ্র পাওয়া গেছে
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiGrid className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FiList className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {filteredElectricities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FiAlertCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              কোনো বিদ্যুৎ কেন্দ্র পাওয়া যায়নি
            </h3>
            <p className="text-gray-500">
              অনুসন্ধানের শব্দ পরিবর্তন করে আবার চেষ্টা করুন
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredElectricities.map((electricity) => (
              <div
                key={electricity._id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Card Header */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                        <FiZap className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {electricity.name}
                        </h3>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getTypeLabel(electricity.type)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(electricity._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          favorites.includes(electricity._id)
                            ? 'text-yellow-500 bg-yellow-50'
                            : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                        }`}
                      >
                        <FiStar className={favorites.includes(electricity._id) ? 'fill-current' : ''} />
                      </button>
                      <button
                        onClick={() => shareCenter(electricity)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiShare2 />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{electricity.area}</p>
                        <p className="text-sm text-gray-600">{electricity.address}</p>
                      </div>
                    </div>

                    {electricity.manager && (
                      <div className="flex items-center gap-3">
                        <FiUser className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">ব্যবস্থাপক:</span> {electricity.manager}
                        </p>
                      </div>
                    )}

                    {electricity.establishedYear && (
                      <div className="flex items-center gap-3">
                        <FiCalendar className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">প্রতিষ্ঠা:</span> {electricity.establishedYear}
                        </p>
                      </div>
                    )}

                    {electricity.capacity && (
                      <div className="flex items-center gap-3">
                        <FiZap className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">ক্ষমতা:</span> {electricity.capacity}
                        </p>
                      </div>
                    )}

                    {electricity.officeHours && (
                      <div className="flex items-center gap-3">
                        <FiClock className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">সময়:</span> {electricity.officeHours}
                        </p>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <FiPhone className="text-gray-400" />
                        <a
                          href={`tel:${electricity.contact}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {electricity.contact}
                        </a>
                      </div>

                      {electricity.emergencyContact && (
                        <div className="flex items-center gap-3 mb-2">
                          <FiAlertCircle className="text-red-400" />
                          <a
                            href={`tel:${electricity.emergencyContact}`}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            জরুরি: {electricity.emergencyContact}
                          </a>
                        </div>
                      )}

                      {electricity.email && (
                        <div className="flex items-center gap-3 mb-2">
                          <FiMail className="text-gray-400" />
                          <a
                            href={`mailto:${electricity.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {electricity.email}
                          </a>
                        </div>
                      )}

                      {electricity.website && (
                        <div className="flex items-center gap-3">
                          <FiGlobe className="text-gray-400" />
                          <a
                            href={electricity.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            ওয়েবসাইট দেখুন
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer for List View */}
                {viewMode === 'list' && (
                  <div className="p-6 bg-gray-50 border-l border-gray-200 flex flex-col justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {electricity.serviceArea && `সেবা এলাকা: ${electricity.serviceArea}`}
                      </p>
                      {electricity.description && (
                        <p className="text-sm text-gray-500 line-clamp-3">
                          {electricity.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FiZap className="text-3xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">{electricities?.length || 0}</h3>
            <p className="text-gray-600">মোট বিদ্যুৎ কেন্দ্র</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FiMapPin className="text-3xl text-green-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">
              {electricities?.length ? new Set(electricities.filter(e => e.area).map(e => e.area)).size : 0}
            </h3>
            <p className="text-gray-600">সেবা প্রদানকারী এলাকা</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FiPhone className="text-3xl text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">
              {electricities?.filter(e => e.emergencyContact)?.length || 0}
            </h3>
            <p className="text-gray-600">জরুরি সেবা কেন্দ্র</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FiClock className="text-3xl text-orange-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">২৪/৭</h3>
            <p className="text-gray-600">সেবা সহজলভ্য</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricityPage;