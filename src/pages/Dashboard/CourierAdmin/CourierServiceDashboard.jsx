import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiTruck, FiMapPin, FiClock, FiPhone, FiUser, FiNavigation, FiPlus, FiEdit, FiTrash2, FiSearch, FiPackage, FiGlobe } from "react-icons/fi";

const CourierServiceDashboard = () => {
  const [couriers, setCouriers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // 🔄 Fetch all courier data
  const fetchCouriers = async () => {
    try {
      setIsLoading(true);
      const res = await axiosSecure.get('/couriers');
      setCouriers(res.data);
    } catch (error) {
      console.error('Error fetching couriers:', error);
      Swal.fire("ত্রুটি", "কুরিয়ার তথ্য লোড করা যায়নি", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  // ❌ Delete handler
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই কুরিয়ার সার্ভিসটি মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে দিন!",
      cancelButtonText: "না",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/couriers/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("সফল!", "কুরিয়ার সার্ভিস মুছে ফেলা হয়েছে", "success");
          fetchCouriers();
        }
      } catch (error) {
        console.error('Error deleting courier:', error);
        Swal.fire("ত্রুটি!", "ডিলিট করা যায়নি", "error");
      }
    }
  };

  // Filter and search couriers
  const filteredCouriers = couriers.filter(courier => {
    const matchesSearch = 
      courier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courier.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courier.contact?.includes(searchTerm);
    
    const matchesFilter = filterType === 'all' || courier.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'domestic': return 'bg-green-100 text-green-800 border-green-200';
      case 'international': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'both': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'domestic': return '🏠';
      case 'international': return '🌍';
      case 'both': return '🌐';
      default: return '📦';
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4">
            <FiPackage className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">কুরিয়ার সার্ভিস ড্যাশবোর্ড</h1>
          <p className="text-gray-600 text-lg">বগুড়া জেলার সব কুরিয়ার সার্ভিসের তথ্য পরিচালনা করুন</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiPackage className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">মোট কুরিয়ার</p>
                <p className="text-2xl font-bold text-gray-900">{couriers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiMapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">দেশীয়</p>
                <p className="text-2xl font-bold text-gray-900">{couriers.filter(c => c.type === 'domestic').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiGlobe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">আন্তর্জাতিক</p>
                <p className="text-2xl font-bold text-gray-900">{couriers.filter(c => c.type === 'international').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiNavigation className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">উভয়</p>
                <p className="text-2xl font-bold text-gray-900">{couriers.filter(c => c.type === 'both').length}</p>
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
                  placeholder="কুরিয়ারের নাম, ঠিকানা বা নম্বর দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">সব ধরনের কুরিয়ার</option>
                <option value="domestic">দেশীয়</option>
                <option value="international">আন্তর্জাতিক</option>
                <option value="both">উভয়</option>
              </select>

              <button
                onClick={() => navigate('/dashboard/add-courier')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                নতুন কুরিয়ার যোগ করুন
              </button>
            </div>
          </div>
        </div>

        {/* Couriers Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-green-600 to-emerald-600">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">কুরিয়ার</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">ঠিকানা</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">যোগাযোগ</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">ধরন</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCouriers.map((courier, index) => (
                  <tr key={courier._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiPackage className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="font-medium text-gray-900">{courier.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiMapPin className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-gray-700">{courier.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiPhone className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-gray-700">{courier.contact}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getTypeIcon(courier.type)}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(courier.type)}`}>
                          {courier.type === 'domestic' && 'দেশীয়'}
                          {courier.type === 'international' && 'আন্তর্জাতিক'}
                          {courier.type === 'both' && 'উভয়'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => navigate(`/dashboard/edit-courier/${courier._id}`)}
                          className="inline-flex items-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <FiEdit className="w-4 h-4 mr-1" />
                          এডিট
                        </button>
                        <button
                          onClick={() => handleDelete(courier._id)}
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

          {filteredCouriers.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো কুরিয়ার পাওয়া যায়নি</h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো কুরিয়ার নেই।' 
                  : 'এখনও কোনো কুরিয়ার যোগ করা হয়নি।'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <button
                  onClick={() => navigate('/dashboard/add-courier')}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  প্রথম কুরিয়ার যোগ করুন
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourierServiceDashboard;
