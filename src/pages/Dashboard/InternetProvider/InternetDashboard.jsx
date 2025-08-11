import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiPlus, FiEdit, FiTrash2, FiWifi, FiMapPin, FiPhone, FiType, FiGlobe, FiUsers, FiActivity, FiRefreshCw } from 'react-icons/fi';

const InternetDashboard = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // 🔄 Load all data
  const fetchProviders = async () => {
    try {
      setLoading(true);
      
      const res = await axiosSecure.get('/internet-providers');
      
      if (res.data && res.data.success) {
        setProviders(res.data.data || []);
      } else if (Array.isArray(res.data)) {
        // Fallback: if API returns array directly
        setProviders(res.data);
      } else {
        setProviders([]);
        setError('API রেসপন্স ফরম্যাট ভুল');
        Swal.fire('ত্রুটি', 'API রেসপন্স ফরম্যাট ভুল', 'error');
      }
    } catch (error) {
      setProviders([]);
      
      if (error.response?.status === 404) {
        setError('API এন্ডপয়েন্ট পাওয়া যায়নি (404)');
        Swal.fire('ত্রুটি', 'API এন্ডপয়েন্ট পাওয়া যায়নি (404)', 'error');
      } else if (error.response?.status === 500) {
        setError('সার্ভার ত্রুটি (500)');
        Swal.fire('ত্রুটি', 'সার্ভার ত্রুটি (500)', 'error');
      } else if (error.code === 'ECONNREFUSED') {
        setError('সার্ভার সংযোগ করা যায়নি');
        Swal.fire('ত্রুটি', 'সার্ভার সংযোগ করা যায়নি', 'error');
      } else {
        setError(`তথ্য লোড করা যায়নি: ${error.message}`);
        Swal.fire('ত্রুটি', `তথ্য লোড করা যায়নি: ${error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // ❌ Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'এই ইন্টারনেট প্রোভাইডারের তথ্য মুছে যাবে!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
      cancelButtonText: 'না',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/internet-providers/${id}`);
        if (res.data.success) {
          Swal.fire('সফল!', 'ইন্টারনেট প্রোভাইডারের তথ্য মুছে ফেলা হয়েছে', 'success');
          fetchProviders();
        }
      } catch {
        Swal.fire('ত্রুটি!', 'ডিলিট করা যায়নি', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <FiWifi className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">ইন্টারনেট প্রোভাইডার ড্যাশবোর্ড</h1>
                <p className="text-gray-600 mt-1">ইন্টারনেট সেবা প্রদানকারী ব্যবস্থাপনা</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchProviders}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiRefreshCw className="text-lg" />
                )}
                রিফ্রেশ
              </button>
              <button
                onClick={() => navigate('/dashboard/add-internet')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="text-lg" />
                নতুন প্রোভাইডার যোগ করুন
              </button>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        {import.meta.env.DEV && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">ডিবাগ তথ্য:</h4>
            <p className="text-sm text-yellow-700">লোডিং: {loading ? 'হ্যাঁ' : 'না'}</p>
            <p className="text-sm text-yellow-700">প্রোভাইডার সংখ্যা: {providers.length}</p>
            <p className="text-sm text-yellow-700">API URL: {axiosSecure.defaults.baseURL}/internet-providers</p>
            {error && <p className="text-sm text-red-700">ত্রুটি: {error}</p>}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">মোট প্রোভাইডার</p>
                <p className="text-3xl font-bold text-gray-800">{providers.length}</p>
              </div>
              <FiWifi className="text-3xl text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">সক্রিয় সেবা</p>
                <p className="text-3xl font-bold text-gray-800">{providers.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <FiActivity className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">সেবার ধরণ</p>
                <p className="text-3xl font-bold text-gray-800">{new Set(providers.map(p => p.type)).size}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiType className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">গ্রাহক সংখ্যা</p>
                <p className="text-3xl font-bold text-gray-800">{providers.reduce((sum, p) => sum + (p.customers || 0), 0)}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiUsers className="text-2xl text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">ইন্টারনেট প্রোভাইডার তালিকা</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiWifi className="text-gray-500" />
                      প্রোভাইডার নাম
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-gray-500" />
                      ঠিকানা
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-500" />
                      যোগাযোগ
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiType className="text-gray-500" />
                      সেবার ধরণ
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {providers.length > 0 ? (
                  providers.map((provider) => (
                    <tr key={provider._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {provider.name?.charAt(0)?.toUpperCase() || 'I'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                            <div className="text-sm text-gray-500">ID: {provider._id?.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{provider.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{provider.contact}</div>
                        {provider.email && (
                          <div className="text-sm text-gray-500">{provider.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {provider.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/edit-internet/${provider._id}`)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
                          >
                            <FiEdit className="mr-1" />
                            এডিট
                          </button>
                          <button
                            onClick={() => handleDelete(provider._id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                          >
                            <FiTrash2 className="mr-1" />
                            ডিলিট
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FiWifi className="text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">কোনো ইন্টারনেট প্রোভাইডার পাওয়া যায়নি</p>
                        <p className="text-gray-400 text-sm mt-1">নতুন প্রোভাইডার যোগ করতে উপরের বোতামে ক্লিক করুন</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternetDashboard;
