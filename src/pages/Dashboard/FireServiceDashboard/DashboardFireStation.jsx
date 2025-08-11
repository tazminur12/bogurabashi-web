import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiSearch, FiMapPin, FiPhone, FiUser, FiPlus, FiEdit, FiTrash2, FiZap, FiShield, FiAlertTriangle, FiNavigation } from 'react-icons/fi';

const DashboardFireStation = () => {
  const axiosSecure = useAxiosSecure();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchStations = async () => {
    try {
      setLoading(true);
      console.log('Fetching fire stations...');
      const { data } = await axiosSecure.get('/fire-stations');
      console.log('Fire stations data:', data);
      setStations(data);
    } catch (err) {
      console.error('Error fetching fire stations:', err);
      console.error('Error details:', err.response?.data || err.message);
      console.error('Error status:', err.response?.status);
      Swal.fire('ত্রুটি!', 'ফায়ার স্টেশন তথ্য লোড করা যায়নি।', 'error');
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'এই ফায়ার স্টেশনটি মুছে যাবে!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, মুছে দিন!',
      cancelButtonText: 'না',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/fire-stations/${id}`);
        Swal.fire('সফল!', 'ফায়ার স্টেশন মুছে ফেলা হয়েছে।', 'success');
        fetchStations();
      } catch (error) {
        Swal.fire('ত্রুটি!', 'ডিলিট করা যায়নি।', 'error');
      }
    }
  };

  // Filter and search stations
  const filteredStations = stations.filter(station => {
    const matchesSearch = 
      station.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.officer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.contact?.includes(searchTerm);
    
    const matchesFilter = filterType === 'all' || station.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'main': return 'bg-red-100 text-red-800 border-red-200';
      case 'sub': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emergency': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'main': return '🔥';
      case 'sub': return '🚒';
      case 'emergency': return '🚨';
      default: return '🏢';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">ফায়ার স্টেশন তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mb-4">
            <FiZap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ফায়ার স্টেশন ড্যাশবোর্ড</h1>
          <p className="text-gray-600 text-lg">বগুড়া জেলার সব ফায়ার স্টেশনের তথ্য পরিচালনা করুন</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiZap className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">মোট স্টেশন</p>
                <p className="text-2xl font-bold text-gray-900">{stations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiShield className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">মূল স্টেশন</p>
                <p className="text-2xl font-bold text-gray-900">{stations.filter(s => s.type === 'main').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">উপ-স্টেশন</p>
                <p className="text-2xl font-bold text-gray-900">{stations.filter(s => s.type === 'sub').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiNavigation className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">জরুরি স্টেশন</p>
                <p className="text-2xl font-bold text-gray-900">{stations.filter(s => s.type === 'emergency').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="স্টেশনের নাম, ঠিকানা বা অফিসার দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">সব ধরনের স্টেশন</option>
                <option value="main">মূল স্টেশন</option>
                <option value="sub">উপ-স্টেশন</option>
                <option value="emergency">জরুরি স্টেশন</option>
              </select>

              <Link
                to="/dashboard/add-fire-station"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                নতুন স্টেশন যোগ করুন
              </Link>
            </div>
          </div>
        </div>

        {/* Stations Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-red-600 to-orange-600">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">স্টেশন</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">অফিসার</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">ঠিকানা</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">ধরন</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStations.map((station, index) => (
                  <tr key={station._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiZap className="w-4 h-4 text-red-600 mr-2" />
                        <span className="font-medium text-gray-900">{station.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-700">{station.officer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiMapPin className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-gray-700">{station.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getTypeIcon(station.type)}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(station.type)}`}>
                          {station.type === 'main' && 'মূল স্টেশন'}
                          {station.type === 'sub' && 'উপ-স্টেশন'}
                          {station.type === 'emergency' && 'জরুরি স্টেশন'}
                          {!station.type && 'অন্যান্য'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          to={`/dashboard/edit-fire-station/${station._id}`}
                          className="inline-flex items-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <FiEdit className="w-4 h-4 mr-1" />
                          এডিট
                        </Link>
                        <button
                          onClick={() => handleDelete(station._id)}
                          className="inline-flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4 mr-1" />
                          ডিলিট
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStations.length === 0 && (
            <div className="text-center py-12">
              <FiZap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো ফায়ার স্টেশন পাওয়া যায়নি</h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো স্টেশন নেই।' 
                  : 'এখনও কোনো ফায়ার স্টেশন যোগ করা হয়নি।'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <Link
                  to="/dashboard/add-fire-station"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  প্রথম স্টেশন যোগ করুন
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardFireStation;