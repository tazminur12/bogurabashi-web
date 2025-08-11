import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiZap, FiMapPin, FiPhone, FiType, FiUser, FiCalendar } from 'react-icons/fi';

const ElectricityDashboard = () => {
  const [electricities, setElectricities] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // 🔄 Fetch electricity data
  const fetchElectricity = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get('/electricities');
      setElectricities(res.data.data || []);
    } catch {
      Swal.fire('ত্রুটি', 'তথ্য লোড করা যায়নি', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectricity();
  }, []);

  // ❌ Delete electricity
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'এই বিদ্যুৎ কেন্দ্রের তথ্য মুছে যাবে!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
      cancelButtonText: 'না',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/electricities/${id}`);
        if (res.data.success) {
          Swal.fire('সফল!', 'বিদ্যুৎ কেন্দ্রের তথ্য মুছে ফেলা হয়েছে', 'success');
          fetchElectricity();
        }
      } catch {
        Swal.fire('ত্রুটি!', 'ডিলিট ব্যর্থ হয়েছে', 'error');
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
                <FiZap className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">বগুড়া জেলার বিদ্যুৎ কেন্দ্র ড্যাশবোর্ড</h1>
                <p className="text-gray-600 mt-1">বিদ্যুৎ সেবা কেন্দ্র ব্যবস্থাপনা</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/add-electricity')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="text-lg" />
              নতুন বিদ্যুৎ কেন্দ্র যোগ করুন
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">মোট বিদ্যুৎ কেন্দ্র</p>
                <p className="text-3xl font-bold text-gray-800">{electricities.length}</p>
              </div>
              <FiZap className="text-3xl text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">সক্রিয় কেন্দ্র</p>
                <p className="text-3xl font-bold text-gray-800">{electricities.filter(e => e.status === 'active').length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <FiZap className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">মোট উপজেলা</p>
                <p className="text-3xl font-bold text-gray-800">{new Set(electricities.map(e => e.area)).size}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiMapPin className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">মোট ধরণ</p>
                <p className="text-3xl font-bold text-gray-800">{new Set(electricities.map(e => e.type)).size}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiType className="text-2xl text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">বিদ্যুৎ কেন্দ্র তালিকা</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiZap className="text-gray-500" />
                      কেন্দ্রের নাম
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-gray-500" />
                      এলাকা
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiType className="text-gray-500" />
                      ধরণ
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-500" />
                      ব্যবস্থাপক
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
                      <FiCalendar className="text-gray-500" />
                      প্রতিষ্ঠা
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {electricities.length > 0 ? (
                  electricities.map((electricity) => (
                    <tr key={electricity._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {electricity.name?.charAt(0)?.toUpperCase() || 'E'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{electricity.name}</div>
                            <div className="text-sm text-gray-500">
                              {electricity.capacity && `ক্ষমতা: ${electricity.capacity}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{electricity.area || 'নির্ধারিত নয়'}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{electricity.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {electricity.type === 'power_plant' && 'বিদ্যুৎ কেন্দ্র'}
                          {electricity.type === 'substation' && 'সাবস্টেশন'}
                          {electricity.type === 'distribution_center' && 'বিতরণ কেন্দ্র'}
                          {electricity.type === 'customer_service' && 'গ্রাহক সেবা'}
                          {electricity.type === 'billing_office' && 'বিলিং অফিস'}
                          {electricity.type === 'maintenance_center' && 'রক্ষণাবেক্ষণ'}
                          {electricity.type === 'emergency_service' && 'জরুরি সেবা'}
                          {electricity.type === 'regional_office' && 'আঞ্চলিক অফিস'}
                          {!['power_plant', 'substation', 'distribution_center', 'customer_service', 'billing_office', 'maintenance_center', 'emergency_service', 'regional_office'].includes(electricity.type) && electricity.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{electricity.manager || 'নির্ধারিত নয়'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{electricity.contact}</div>
                        {electricity.emergencyContact && (
                          <div className="text-sm text-red-600">জরুরি: {electricity.emergencyContact}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{electricity.establishedYear || 'নির্ধারিত নয়'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/edit-electricity/${electricity._id}`)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
                          >
                            <FiEdit className="mr-1" />
                            এডিট
                          </button>
                          <button
                            onClick={() => handleDelete(electricity._id)}
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
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FiZap className="text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">কোনো বিদ্যুৎ কেন্দ্র পাওয়া যায়নি</p>
                        <p className="text-gray-400 text-sm mt-1">নতুন কেন্দ্র যোগ করতে উপরের বোতামে ক্লিক করুন</p>
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

export default ElectricityDashboard;
