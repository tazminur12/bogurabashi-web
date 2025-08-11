import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaExclamationTriangle, FaEye, FaTrash, FaEdit, FaCheck, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';
import Swal from 'sweetalert2';

const DisasterAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch all reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['disaster-reports'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/disaster-reports');
        console.log('Backend response:', res.data); // Debug log
        
        // Backend returns { total, page, limit, totalPages, reports }
        // We need to extract the reports array
        if (res.data && res.data.reports) {
          return res.data.reports;
        } else if (Array.isArray(res.data)) {
          return res.data;
        } else {
          console.warn('Unexpected response structure:', res.data);
          return [];
        }
      } catch (error) {
        console.error('Error fetching disaster reports:', error);
        return [];
      }
    },
  });

  // Update report status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/disaster-reports/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['disaster-reports']);
      const statusText = getStatusText(variables.status);
      Swal.fire('সফল!', `রিপোর্টের স্ট্যাটাস "${statusText}" করা হয়েছে!`, 'success');
    },
    onError: (error) => {
      console.error('Status update error:', error);
      Swal.fire('ত্রুটি!', 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে!', 'error');
    }
  });

  // Delete report mutation
  const deleteReportMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/disaster-reports/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['disaster-reports']);
      Swal.fire('সফল!', 'রিপোর্ট সফলভাবে মুছে ফেলা হয়েছে!', 'success');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      Swal.fire('ত্রুটি!', 'রিপোর্ট মুছতে সমস্যা হয়েছে!', 'error');
    }
  });

  // Filter reports based on search and filters
  const filteredReports = Array.isArray(reports) ? reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  }) : [];

  const handleStatusUpdate = async (id, newStatus) => {
    const statusText = getStatusText(newStatus);
    const result = await Swal.fire({
      title: 'স্ট্যাটাস আপডেট',
      text: `আপনি কি নিশ্চিত যে এই রিপোর্টের স্ট্যাটাস "${statusText}" করতে চান?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, আপডেট করুন',
      cancelButtonText: 'না, বাতিল করুন'
    });

    if (result.isConfirmed) {
      updateStatusMutation.mutate({ id, status: newStatus });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'রিপোর্ট মুছুন',
      text: 'আপনি কি নিশ্চিত যে এই রিপোর্টটি মুছতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'হ্যাঁ, মুছুন',
      cancelButtonText: 'না, বাতিল করুন'
    });

    if (result.isConfirmed) {
      try {
        // First try the normal delete
        deleteReportMutation.mutate(id);
      } catch (error) {
        console.error('Delete failed, trying fallback:', error);
        
        // If normal delete fails, try to mark as deleted or show alternative
        Swal.fire({
          title: 'সতর্কতা',
          text: 'রিপোর্ট মুছতে সমস্যা হয়েছে। আপনি কি এটি "প্রত্যাখ্যাত" হিসেবে মার্ক করতে চান?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'হ্যাঁ, প্রত্যাখ্যাত করুন',
          cancelButtonText: 'না, বাতিল করুন'
        }).then((result) => {
          if (result.isConfirmed) {
            // Mark as rejected instead of deleting
            updateStatusMutation.mutate({ id, status: 'rejected' });
          }
        });
      }
    }
  };

  const handleView = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'corruption': return 'bg-red-100 text-red-800';
      case 'disaster': return 'bg-orange-100 text-orange-800';
      case 'injustice': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'অপেক্ষমান';
      case 'investigating': return 'তদন্তাধীন';
      case 'resolved': return 'সমাধান হয়েছে';
      case 'rejected': return 'প্রত্যাখ্যাত';
      default: return status;
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'corruption': return 'দুর্নীতি';
      case 'disaster': return 'দুর্যোগ';
      case 'injustice': return 'অন্যায়';
      case 'other': return 'অন্যান্য';
      default: return category;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'উচ্চ';
      case 'medium': return 'মাঝারি';
      case 'low': return 'নিম্ন';
      default: return priority;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">দুর্নীতি ও অন্যায় রিপোর্ট ব্যবস্থাপনা</h1>
        <p className="text-gray-600">সকল রিপোর্ট দেখুন এবং ব্যবস্থাপনা করুন</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট রিপোর্ট</p>
              <p className="text-2xl font-bold text-gray-900">{Array.isArray(reports) ? reports.length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">অপেক্ষমান</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(reports) ? reports.filter(r => r.status === 'pending').length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">তদন্তাধীন</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(reports) ? reports.filter(r => r.status === 'investigating').length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaExclamationTriangle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">সমাধান হয়েছে</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(reports) ? reports.filter(r => r.status === 'resolved').length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">অনুসন্ধান</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="রিপোর্ট খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">স্ট্যাটাস</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">সব স্ট্যাটাস</option>
              <option value="pending">অপেক্ষমান</option>
              <option value="investigating">তদন্তাধীন</option>
              <option value="resolved">সমাধান হয়েছে</option>
              <option value="rejected">প্রত্যাখ্যাত</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">বিভাগ</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">সব বিভাগ</option>
              <option value="corruption">দুর্নীতি</option>
              <option value="disaster">দুর্যোগ</option>
              <option value="injustice">অন্যায়</option>
              <option value="other">অন্যান্য</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ফিল্টার রিসেট
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  রিপোর্ট
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  বিভাগ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  অগ্রাধিকার
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  স্ট্যাটাস
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  তারিখ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  কর্ম
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
                      <span className="ml-2 text-gray-600">রিপোর্ট লোড হচ্ছে...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {report.description}
                        </div>
                        {report.location && (
                          <div className="text-xs text-gray-400 mt-1">
                            📍 {report.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                        {getCategoryText(report.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                        {getPriorityText(report.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(report)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="দেখুন"
                        >
                          <FaEye />
                        </button>
                        
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(report._id, 'investigating')}
                              disabled={updateStatusMutation.isPending}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="তদন্ত শুরু করুন"
                            >
                              {updateStatusMutation.isPending ? (
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <FaCheck />
                              )}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(report._id, 'rejected')}
                              disabled={updateStatusMutation.isPending}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="প্রত্যাখ্যান করুন"
                            >
                              {updateStatusMutation.isPending ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <FaTimes />
                              )}
                            </button>
                          </>
                        )}

                        {report.status === 'investigating' && (
                          <button
                            onClick={() => handleStatusUpdate(report._id, 'resolved')}
                            disabled={updateStatusMutation.isPending}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="সমাধান হয়েছে"
                          >
                            {updateStatusMutation.isPending ? (
                              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(report._id)}
                          disabled={deleteReportMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="মুছুন"
                        >
                          {deleteReportMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    কোনো রিপোর্ট পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Report Modal */}
      {isViewModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">রিপোর্টের বিস্তারিত</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">শিরোনাম</label>
                  <p className="text-gray-900 font-medium">{selectedReport.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ</label>
                  <p className="text-gray-900">{selectedReport.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">বিভাগ</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedReport.category)}`}>
                      {getCategoryText(selectedReport.category)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">অগ্রাধিকার</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedReport.priority)}`}>
                      {getPriorityText(selectedReport.priority)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">স্ট্যাটাস</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                      {getStatusText(selectedReport.status)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">তারিখ</label>
                    <p className="text-gray-900">{new Date(selectedReport.createdAt).toLocaleDateString('bn-BD')}</p>
                  </div>
                </div>

                {selectedReport.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">অবস্থান</label>
                    <p className="text-gray-900">{selectedReport.location}</p>
                  </div>
                )}

                {selectedReport.evidence && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">প্রমাণ/সাক্ষ্য</label>
                    <p className="text-gray-900">{selectedReport.evidence}</p>
                  </div>
                )}

                {selectedReport.contactInfo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">যোগাযোগের তথ্য</label>
                    <p className="text-gray-900">{selectedReport.contactInfo}</p>
                  </div>
                )}

                {/* Images Display */}
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">সংযুক্ত ছবি</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedReport.images.map((image, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={image.url} 
                            alt={`${selectedReport.title} - Image ${index + 1}`}
                            className="w-full h-24 object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="hidden w-full h-24 bg-gray-100 items-center justify-center"
                            style={{ display: 'none' }}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-1">📷</div>
                              <p className="text-xs text-gray-500">ছবি লোড হয়নি</p>
                            </div>
                          </div>
                          <div className="p-2 bg-white">
                            <p className="text-xs text-gray-600 text-center">ছবি {index + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback for old attachments */}
                {(!selectedReport.images || selectedReport.images.length === 0) && selectedReport.attachments && selectedReport.attachments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">সংযুক্ত ফাইল</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedReport.attachments.map((attachment, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center">
                            <div className="text-gray-500 mr-3">📎</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{attachment.originalName}</p>
                              <p className="text-xs text-gray-500">
                                {(attachment.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No attachments message */}
                {(!selectedReport.images || selectedReport.images.length === 0) && (!selectedReport.attachments || selectedReport.attachments.length === 0) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">সংযুক্ত ফাইল</label>
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-1">📷</div>
                      <p className="text-sm text-gray-500">কোনো ফাইল সংযুক্ত করা হয়নি</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterAdmin;
