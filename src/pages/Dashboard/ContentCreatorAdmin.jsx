import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaEnvelope, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useSecureAxios from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ContentCreatorAdmin = () => {
  const axiosSecure = useSecureAxios();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    image: '',
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    email: '',
    phone: '',
    description: '',
    experience: '',
    location: '',
    portfolio: ''
  });

  const specialtyOptions = [
    'ভিডিও কনটেন্ট / ইউটিউব',
    'ফটোগ্রাফার',
    'ভয়েস ওভার আর্টিস্ট',
    'গ্রাফিক ডিজাইনার',
    'পডকাস্টার',
    'কনটেন্ট রাইটার',
    'সোশ্যাল মিডিয়া ইনফ্লুয়েন্সার',
    'ভিডিও এডিটর',
    'অ্যানিমেশন আর্টিস্ট',
    'ডিজিটাল মার্কেটার'
  ];

  // Fetch content creators
  const { data: creators = [], isLoading } = useQuery({
    queryKey: ['content-creators'],
    queryFn: async () => {
      const res = await axiosSecure.get('/content-creators');
      return res.data;
    },
  });

  // Filter creators
  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || creator.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCreators = filteredCreators.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);

  // Create or Update mutation
  const mutation = useMutation({
    mutationFn: (data) => {
      if (editId) {
        return axiosSecure.put(`/content-creators/${editId}`, data);
      } else {
        return axiosSecure.post('/content-creators', data);
      }
    },
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: editId ? 'আপডেট সফল!' : 'যোগ করা সফল!',
        text: editId ? 'কনটেন্ট ক্রিয়েটর আপডেট করা হয়েছে' : 'নতুন কনটেন্ট ক্রিয়েটর যোগ করা হয়েছে',
        timer: 2000,
        showConfirmButton: false
      });
      queryClient.invalidateQueries(['content-creators']);
      resetForm();
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: error.response?.data?.message || 'কিছু সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন'
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/content-creators/${id}`),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'মুছে ফেলা সফল!',
        text: 'কনটেন্ট ক্রিয়েটর মুছে ফেলা হয়েছে',
        timer: 2000,
        showConfirmButton: false
      });
      queryClient.invalidateQueries(['content-creators']);
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: 'মুছে ফেলতে সমস্যা হয়েছে'
      });
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: "এই কনটেন্ট ক্রিয়েটর মুছে ফেলা হবে!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন!',
      cancelButtonText: 'বাতিল'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.specialty) {
      Swal.fire({
        icon: 'warning',
        title: 'প্রয়োজনীয় তথ্য দিন',
        text: 'নাম এবং স্পেশালিটি অবশ্যই দিতে হবে'
      });
      return;
    }

    mutation.mutate(formData);
  };

  const handleEdit = (creator) => {
    setFormData(creator);
    setEditId(creator._id);
    setShowForm(true);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const resetForm = () => {
    setEditId(null);
    setShowForm(false);
    setFormData({
      name: '',
      specialty: '',
      image: '',
      facebook: '',
      instagram: '',
      youtube: '',
      tiktok: '',
      email: '',
      phone: '',
      description: '',
      experience: '',
      location: '',
      portfolio: ''
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">কনটেন্ট ক্রিয়েটর ব্যবস্থাপনা</h1>
            <p className="text-gray-600">সব কনটেন্ট ক্রিয়েটরদের তালিকা এবং ব্যবস্থাপনা</p>
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-lg"
          >
            <FaPlus className="mr-2" />
            নতুন ক্রিয়েটর যোগ করুন
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="নাম বা স্পেশালিটি অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">সব স্পেশালিটি</option>
                {specialtyOptions.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <span className="text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                মোট: {filteredCreators.length} জন
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    প্রোফাইল
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    নাম
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    স্পেশালিটি
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    যোগাযোগ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    সোশ্যাল মিডিয়া
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    কর্ম
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCreators.map((creator) => (
                  <tr key={creator._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={creator.image || 'https://via.placeholder.com/40'}
                          alt={creator.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{creator.name}</div>
                        {creator.location && (
                          <div className="text-sm text-gray-500">{creator.location}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {creator.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        {creator.email && (
                          <div className="flex items-center">
                            <FaEnvelope className="mr-2 text-gray-400" />
                            <span className="truncate max-w-32">{creator.email}</span>
                          </div>
                        )}
                        {creator.phone && (
                          <div className="flex items-center">
                            <span className="mr-2">📞</span>
                            <span>{creator.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {creator.facebook && (
                          <a href={creator.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            <FaFacebook size={16} />
                          </a>
                        )}
                        {creator.instagram && (
                          <a href={creator.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700">
                            <FaInstagram size={16} />
                          </a>
                        )}
                        {creator.youtube && (
                          <a href={creator.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
                            <FaYoutube size={16} />
                          </a>
                        )}
                        {creator.tiktok && (
                          <a href={creator.tiktok} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
                            <FaTiktok size={16} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(creator)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                          title="সম্পাদনা করুন"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(creator._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                          title="মুছে ফেলুন"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  আগের
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  পরের
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    দেখানো হচ্ছে <span className="font-medium">{indexOfFirst + 1}</span> থেকে{' '}
                    <span className="font-medium">{Math.min(indexOfLast, filteredCreators.length)}</span> এর{' '}
                    <span className="font-medium">{filteredCreators.length}</span> এর মধ্যে
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {[...Array(totalPages).keys()].map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">
                  {editId ? 'কনটেন্ট ক্রিয়েটর সম্পাদনা করুন' : 'নতুন কনটেন্ট ক্রিয়েটর যোগ করুন'}
                </h3>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      স্পেশালিটি <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">স্পেশালিটি নির্বাচন করুন</option>
                      {specialtyOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ইমেইল
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ফোন নম্বর
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube
                    </label>
                    <input
                      type="url"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TikTok
                    </label>
                    <input
                      type="url"
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      অভিজ্ঞতা
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      অবস্থান
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পোর্টফোলিও লিংক
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    নিজের সম্পর্কে
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editId ? 'আপডেট হচ্ছে...' : 'যোগ করা হচ্ছে...'}
                      </>
                    ) : (
                      <>
                        {editId ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}
                        {editId ? 'আপডেট করুন' : 'যোগ করুন'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCreatorAdmin; 