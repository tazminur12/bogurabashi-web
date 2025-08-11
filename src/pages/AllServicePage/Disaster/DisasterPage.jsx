import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaExclamationTriangle, FaEye, FaPlus, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const DisasterPage = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'corruption',
    priority: 'medium',
    evidence: '',
    contactInfo: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all reports
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['disaster-reports'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/disaster-reports');
        console.log('DisasterPage - Backend response:', res.data); // Debug log
        
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
        // Return empty array if backend is not available
        return [];
      }
    },
    // Don't retry if backend is not available
    retry: false,
    // Don't show error if backend is not available
    onError: () => {
      console.log('Backend not available, showing empty state');
    }
  });

  // Add new report mutation
  const addReportMutation = useMutation({
    mutationFn: async (formData) => {
      try {
        console.log('Submitting form data:', formData);
        console.log('Selected files:', selectedFiles);
        
        const res = await axiosSecure.post('/disaster-reports', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return res.data;
      } catch (error) {
        console.log('Full error:', error);
        console.log('Error response:', error.response);
        console.log('Error data:', error.response?.data);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['disaster-reports']);
      Swal.fire('সফল!', 'রিপোর্ট সফলভাবে যোগ হয়েছে!', 'success');
      setIsModalOpen(false);
      setIsSubmitting(false);
      resetForm();
    },
    onError: (error) => {
      console.log('Error details:', {
        code: error.code,
        status: error.response?.status,
        message: error.message,
        response: error.response?.data
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'রিপোর্ট যোগ করতে সমস্যা হয়েছে!';
      Swal.fire('ত্রুটি', errorMessage, 'error');
      console.error('Full error details:', error);
      setIsSubmitting(false);
    }
  });



  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      category: 'corruption',
      priority: 'medium',
      evidence: '',
      contactInfo: ''
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    // Only images, up to 5 files, max 5MB each
    const validFiles = [];
    const previews = [];
    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      const under5mb = file.size <= 5 * 1024 * 1024;
      if (!isImage) {
        Swal.fire('ত্রুটি', 'শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে', 'error');
        continue;
      }
      if (!under5mb) {
        Swal.fire('ত্রুটি', 'প্রতি ইমেজ সর্বোচ্চ 5MB হতে পারবে', 'error');
        continue;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
      if (validFiles.length >= 5) break;
    }
    setSelectedFiles(validFiles);
    setPreviewUrls(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // For testing without backend
    if (!formData.title || !formData.description) {
      Swal.fire('ত্রুটি', 'শিরোনাম এবং বিবরণ প্রয়োজন', 'error');
      setIsSubmitting(false);
      return;
    }
    
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('location', formData.location);
    form.append('category', formData.category);
    form.append('priority', formData.priority);
    form.append('evidence', formData.evidence);
    form.append('contactInfo', formData.contactInfo);
    form.append('status', 'pending');
    form.append('createdAt', new Date().toISOString());
    // Append files as attachments[]
    selectedFiles.forEach((file) => form.append('attachments', file));

    addReportMutation.mutate(form);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FaExclamationTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">দুর্নীতি ও অন্যায় রিপোর্ট</h1>
          <p className="text-lg text-gray-600">বগুড়া জেলার দুর্নীতি, দুর্যোগ ও অন্যায়ের বিরুদ্ধে রিপোর্ট করুন</p>
        </div>

        {/* Add Report Button */}
        <div className="text-center mb-8">
          <Link
            to="/disaster-report/add"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <FaPlus className="mr-2" />
            নতুন রিপোর্ট যোগ করুন
          </Link>
        </div>

        {/* Reports Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">রিপোর্ট লোড হচ্ছে...</span>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {report.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                          {report.category === 'corruption' ? 'দুর্নীতি' : 
                           report.category === 'disaster' ? 'দুর্যোগ' : 
                           report.category === 'injustice' ? 'অন্যায়' : 'অন্যান্য'}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority === 'high' ? 'উচ্চ' : 
                           report.priority === 'medium' ? 'মাঝারি' : 'নিম্ন'}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status === 'pending' ? 'অপেক্ষমান' : 
                           report.status === 'investigating' ? 'তদন্তাধীন' : 
                           report.status === 'resolved' ? 'সমাধান হয়েছে' : 'প্রত্যাখ্যাত'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {report.description}
                  </p>

                  {/* Location */}
                  {report.location && (
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{report.location}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaCalendarAlt className="mr-2" />
                    <span>{new Date(report.createdAt).toLocaleDateString('bn-BD')}</span>
                  </div>

                  {/* Images Preview */}
                  {report.images && report.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {report.images.slice(0, 3).map((image, idx) => {
                          const src = typeof image === 'string' ? image : image.url;
                          return (
                            <div key={idx} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                              <img 
                                src={src} 
                                alt={`${report.title} - Image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        })}
                        {report.images.length > 3 && (
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                            +{report.images.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* No Images Message */}
                  {(!report.images || report.images.length === 0) && (
                    <div className="mb-4">
                      <div className="text-center py-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl mb-1">📷</div>
                        <p className="text-xs text-gray-500">কোনো ছবি নেই</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end">
                    <Link
                      to={`/disaster-report/${report._id}`}
                      className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      <FaEye className="mr-2" />
                      বিস্তারিত দেখুন
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">কোনো রিপোর্ট পাওয়া যায়নি</p>
            <p className="text-gray-400 text-sm">প্রথম রিপোর্টটি যোগ করুন</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    নতুন রিপোর্ট যোগ করুন
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      শিরোনাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                      placeholder="রিপোর্টের শিরোনাম লিখুন"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      বিবরণ *
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                      placeholder="বিস্তারিত বিবরণ লিখুন"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      অবস্থান
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                      placeholder="ঘটনার অবস্থান"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        বিভাগ *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                      >
                        <option value="corruption">দুর্নীতি</option>
                        <option value="disaster">দুর্যোগ</option>
                        <option value="injustice">অন্যায়</option>
                        <option value="other">অন্যান্য</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        অগ্রাধিকার *
                      </label>
                      <select
                        required
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                      >
                        <option value="low">নিম্ন</option>
                        <option value="medium">মাঝারি</option>
                        <option value="high">উচ্চ</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      প্রমাণ/সাক্ষ্য
                    </label>
                    <textarea
                      rows="3"
                      value={formData.evidence}
                      onChange={(e) => setFormData({...formData, evidence: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                      placeholder="প্রমাণ বা সাক্ষ্যের বিবরণ (ঐচ্ছিক)"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ছবি আপলোড (সর্বোচ্চ ৫টি, প্রতি ছবি ৫MB)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                    />
                    {previewUrls.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {previewUrls.map((src, idx) => (
                          <div key={idx} className="relative w-full h-24 rounded-md overflow-hidden border">
                            <img src={src} alt={`attachment-${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      যোগাযোগের তথ্য
                    </label>
                    <input
                      type="text"
                      value={formData.contactInfo}
                      onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                      placeholder="ফোন নম্বর বা ইমেইল (ঐচ্ছিক)"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || addReportMutation.isPending}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting || addReportMutation.isPending ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisasterPage;
