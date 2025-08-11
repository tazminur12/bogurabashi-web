import React, { useState, useEffect } from 'react';
import { FiSearch, FiPhone, FiMapPin, FiClock, FiMail, FiGlobe, FiPackage, FiCopy, FiNavigation } from 'react-icons/fi';
import { FaMotorcycle, FaShippingFast, FaBoxOpen } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const CourierServicePage = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [courierServices, setCourierServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosSecure.get('/couriers');
        console.log("Fetched data:", res.data); // Debug line
        setCourierServices(res.data);
      } catch (error) {
        console.error('Error fetching courier services:', error);
        Swal.fire('ত্রুটি', 'কুরিয়ার তথ্য লোড করা যায়নি', 'error');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  // 🔍 Filter logic
  const filteredServices = courierServices.filter(service => {
    const matchesSearch = service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.contact?.includes(searchTerm);
    const matchesType = activeTab === 'all' ||
                        (activeTab === 'domestic' && service.type === 'domestic') ||
                        (activeTab === 'international' && service.type === 'international') ||
                        (activeTab === 'both' && service.type === 'both');
    return matchesSearch && matchesType;
  });

  const getServiceTypeBadge = (type) => {
    switch(type) {
      case 'domestic': 
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            🏠 দেশীয়
          </span>
        );
      case 'international': 
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            🌍 আন্তর্জাতিক
          </span>
        );
      case 'both': 
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            🌐 উভয়
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            📦 অন্যান্য
          </span>
        );
    }
  };

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleCopyPhone = async (phoneNumber) => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      Swal.fire({
        title: 'কপি হয়েছে!',
        text: 'ফোন নম্বর ক্লিপবোর্ডে কপি করা হয়েছে',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch {
      Swal.fire('ত্রুটি', 'ফোন নম্বর কপি করা যায়নি', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">কুরিয়ার তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-6">
            <FiPackage className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">বগুড়ার কুরিয়ার সার্ভিসসমূহ</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            বগুড়া জেলার সকল বিশ্বস্ত কুরিয়ার সার্ভিসের তথ্য। দেশীয় ও আন্তর্জাতিক কুরিয়ার সেবা পেতে এখনই যোগাযোগ করুন।
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaMotorcycle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">মোট কুরিয়ার</p>
                <p className="text-2xl font-bold text-gray-900">{courierServices.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaShippingFast className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">দেশীয় সার্ভিস</p>
                <p className="text-2xl font-bold text-gray-900">{courierServices.filter(s => s.type === 'domestic').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaBoxOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">আন্তর্জাতিক</p>
                <p className="text-2xl font-bold text-gray-900">{courierServices.filter(s => s.type === 'international').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiNavigation className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">উভয় ধরনের</p>
                <p className="text-2xl font-bold text-gray-900">{courierServices.filter(s => s.type === 'both').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                কুরিয়ার সার্চ করুন
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="search"
                  placeholder="কুরিয়ারের নাম, ঠিকানা বা নম্বর দিয়ে খুঁজুন..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                সার্ভিসের ধরন
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'সব কুরিয়ার', color: 'bg-gray-600 hover:bg-gray-700' },
                  { key: 'domestic', label: 'দেশীয়', color: 'bg-green-600 hover:bg-green-700' },
                  { key: 'international', label: 'আন্তর্জাতিক', color: 'bg-blue-600 hover:bg-blue-700' },
                  { key: 'both', label: 'উভয়', color: 'bg-purple-600 hover:bg-purple-700' }
                ].map(type => (
                  <button
                    key={type.key}
                    onClick={() => setActiveTab(type.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 transform hover:scale-105 ${
                      activeTab === type.key ? type.color : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courier Services List */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredServices.map((service) => (
              <div 
                key={service._id} 
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                    <div className="flex items-center mb-4 lg:mb-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                        <FiPackage className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{service.name}</h3>
                        {getServiceTypeBadge(service.type)}
                      </div>
                    </div>
                    
                    {/* Contact Actions */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleCall(service.contact)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
                      >
                        <FiPhone className="w-4 h-4 mr-2" />
                        📞 কল করুন
                      </button>
                      <button
                        onClick={() => handleCopyPhone(service.contact)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
                      >
                        <FiCopy className="w-4 h-4 mr-2" />
                        📋 কপি করুন
                      </button>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <FiMapPin className="w-5 h-5 text-green-600 mr-3" />
                        <span className="font-medium">ঠিকানা:</span>
                        <span className="ml-2">{service.address}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <FiPhone className="w-5 h-5 text-green-600 mr-3" />
                        <span className="font-medium">ফোন:</span>
                        <span className="ml-2 text-lg font-semibold text-green-600">{service.contact}</span>
                      </div>

                      {service.workingHours && (
                        <div className="flex items-center text-gray-700">
                          <FiClock className="w-5 h-5 text-green-600 mr-3" />
                          <span className="font-medium">কর্মঘণ্টা:</span>
                          <span className="ml-2">{service.workingHours}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {service.email && (
                        <div className="flex items-center text-gray-700">
                          <FiMail className="w-5 h-5 text-green-600 mr-3" />
                          <span className="font-medium">ইমেইল:</span>
                          <a 
                            href={`mailto:${service.email}`} 
                            className="ml-2 text-blue-600 hover:text-blue-800 underline"
                          >
                            {service.email}
                          </a>
                        </div>
                      )}

                      {service.website && (
                        <div className="flex items-center text-gray-700">
                          <FiGlobe className="w-5 h-5 text-green-600 mr-3" />
                          <span className="font-medium">ওয়েবসাইট:</span>
                          <a 
                            href={service.website.startsWith('http') ? service.website : `https://${service.website}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:text-blue-800 underline"
                          >
                            {service.website}
                          </a>
                        </div>
                      )}

                      {service.description && (
                        <div className="text-gray-600 text-sm leading-relaxed">
                          <span className="font-medium">বিবরণ:</span> {service.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Services Offered */}
                  {service.services && service.services.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">সেবাসমূহ:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.services.map((serviceType, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border"
                          >
                            {serviceType === 'domestic' && '🏠 দেশীয়'}
                            {serviceType === 'international' && '🌍 আন্তর্জাতিক'}
                            {serviceType === 'express' && '⚡ এক্সপ্রেস'}
                            {serviceType === 'same_day' && '🚀 সেইম ডে'}
                            {serviceType === 'next_day' && '📅 নেক্সট ডে'}
                            {serviceType === 'cod' && '💰 ক্যাশ অন ডেলিভারি'}
                            {serviceType === 'tracking' && '📍 ট্র্যাকিং'}
                            {serviceType === 'insurance' && '🛡️ ইন্সুরেন্স'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-medium text-gray-900 mb-2">কোনো কুরিয়ার সার্ভিস পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-lg">
              {searchTerm || activeTab !== 'all' 
                ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো কুরিয়ার সার্ভিস নেই।' 
                : 'এখনও কোনো কুরিয়ার সার্ভিস যোগ করা হয়নি।'
              }
            </p>
            {(searchTerm || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                }}
                className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                সব কুরিয়ার দেখুন
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourierServicePage;
