import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaFilter, 
  FaAd, 
  FaCalendarAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaExternalLinkAlt,
  FaTimes,
  FaCheck,
  FaSpinner
} from 'react-icons/fa';
import AddAd from './AddAd';
import EditAd from './EditAd';

const AdsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  // Fetch all ads
  const {
    data: ads = [],
    isLoading: adsLoading,
    error: adsError,
  } = useQuery({
    queryKey: ["admin-ads"],
    queryFn: async () => {
      const res = await axiosSecure.get("/ads");
      return res.data;
    },
  });

  // Delete ad mutation
  const deleteAdMutation = useMutation({
    mutationFn: async (adId) => {
      const res = await axiosSecure.delete(`/ads/${adId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-ads"]);
      Swal.fire({
        icon: 'success',
        title: 'বিজ্ঞাপন সফলভাবে মুছে ফেলা হয়েছে',
        showConfirmButton: false,
        timer: 1500
      });
    },
    onError: (error) => {
      console.error("Delete error:", error);
      Swal.fire({
        icon: 'error',
        title: 'বিজ্ঞাপন মুছতে সমস্যা হয়েছে',
        showConfirmButton: true,
      });
    },
  });

  // Filter ads
  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || ad.status === selectedStatus;
    const matchesType = !selectedType || ad.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "featured":
        return "bg-purple-100 text-purple-800";
      case "premium":
        return "bg-yellow-100 text-yellow-800";
      case "sponsored":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (ad) => {
    setSelectedAd(ad);
    setShowEditModal(true);
  };

  const handleDelete = (adId) => {
    Swal.fire({
      title: 'আপনি কি নিশ্চিত যে আপনি এই বিজ্ঞাপনটি মুছতে চান?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, মুছুন!',
      cancelButtonText: 'না, বাতিল করুন',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAdMutation.mutate(adId);
      }
    });
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    queryClient.invalidateQueries(["admin-ads"]);
    Swal.fire({
      icon: 'success',
      title: 'বিজ্ঞাপন সফলভাবে যোগ করা হয়েছে',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedAd(null);
    queryClient.invalidateQueries(["admin-ads"]);
    Swal.fire({
      icon: 'success',
      title: 'বিজ্ঞাপন সফলভাবে সম্পাদনা করা হয়েছে',
      showConfirmButton: false,
      timer: 1500
    });
  };

  if (adsError) {
    Swal.fire({
      icon: 'error',
      title: 'ত্রুটি!',
      text: 'বিজ্ঞাপন লোড করতে সমস্যা হয়েছে',
      showConfirmButton: true,
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">বিজ্ঞাপন ব্যবস্থাপনা</h1>
          <p className="text-gray-600 mt-1">সব বিজ্ঞাপন দেখুন, সম্পাদনা করুন এবং মুছুন</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <FaPlus className="mr-2" />
          নতুন বিজ্ঞাপন যোগ করুন
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaAd className="text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">মোট বিজ্ঞাপন</p>
              <p className="text-2xl font-bold text-gray-900">{ads.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheck className="text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">সক্রিয়</p>
              <p className="text-2xl font-bold text-gray-900">
                {ads.filter(ad => ad.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaAd className="text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">প্রিমিয়াম</p>
              <p className="text-2xl font-bold text-gray-900">
                {ads.filter(ad => ad.type === 'premium').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaTimes className="text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">মেয়াদোত্তীর্ণ</p>
              <p className="text-2xl font-bold text-gray-900">
                {ads.filter(ad => ad.status === 'expired').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2" />
              অনুসন্ধান
            </label>
            <input
              type="text"
              placeholder="বিজ্ঞাপন খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-2" />
              অবস্থা
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">সব অবস্থা</option>
              <option value="active">সক্রিয়</option>
              <option value="inactive">নিষ্ক্রিয়</option>
              <option value="expired">মেয়াদোত্তীর্ণ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaFilter className="inline mr-2" />
              ধরন
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">সব ধরন</option>
              <option value="featured">ফিচার্ড</option>
              <option value="premium">প্রিমিয়াম</option>
              <option value="sponsored">স্পনসরড</option>
              <option value="regular">নিয়মিত</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ads Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            বিজ্ঞাপন তালিকা ({filteredAds.length})
          </h3>
        </div>
        
        {adsLoading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-2xl text-blue-600 mr-3" />
            <span className="text-gray-600">বিজ্ঞাপন লোড হচ্ছে...</span>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-12">
            <FaAd className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">কোনো বিজ্ঞাপন পাওয়া যায়নি</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedStatus || selectedType ? 
                "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো বিজ্ঞাপন নেই" : 
                "এখনও কোনো বিজ্ঞাপন যোগ করা হয়নি"
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              প্রথম বিজ্ঞাপন যোগ করুন
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    বিজ্ঞাপন
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    কোম্পানি
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    অবস্থা
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ধরন
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    মূল্য
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    মেয়াদ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ক্রিয়া
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAds.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {ad.image ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={ad.image}
                              alt={ad.title}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80';
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <FaAd className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {ad.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {ad.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{ad.company || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{ad.location || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ad.status)}`}>
                        {ad.status === 'active' ? 'সক্রিয়' : ad.status === 'inactive' ? 'নিষ্ক্রিয়' : 'মেয়াদোত্তীর্ণ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(ad.type)}`}>
                        {ad.type === 'featured' ? 'ফিচার্ড' : ad.type === 'premium' ? 'প্রিমিয়াম' : ad.type === 'sponsored' ? 'স্পনসরড' : 'নিয়মিত'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ad.price ? `৳${ad.price.toLocaleString()}` : 'N/A'}
                      </div>
                      {ad.discount && (
                        <div className="text-xs text-red-600">
                          {ad.discount}% ছাড়
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ad.validUntil ? formatDate(ad.validUntil) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(ad)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="সম্পাদনা করুন"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="মুছুন"
                          disabled={deleteAdMutation.isPending}
                        >
                          {deleteAdMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                        </button>
                        {ad.link && (
                          <a
                            href={ad.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="দেখুন"
                          >
                            <FaExternalLinkAlt />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Ad Modal */}
      {showAddModal && (
        <AddAd
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* Edit Ad Modal */}
      {showEditModal && selectedAd && (
        <EditAd
          ad={selectedAd}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default AdsAdmin; 