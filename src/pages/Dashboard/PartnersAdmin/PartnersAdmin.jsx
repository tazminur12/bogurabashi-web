import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  FaPlus, FaEdit, FaTrash, FaLink, FaImage, FaTimes, FaSave, FaEye, FaSpinner, FaUpload,
} from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PartnersAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    link: '',
    isActive: true,
    order: 0,
  });

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  // Fetch partners data
  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get('/partners');
      setPartners(res.data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Reset form data
  const resetForm = () => {
    setFormData({ name: '', logo: '', link: '', isActive: true, order: 0 });
    setEditingPartner(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Submit form for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPartner) {
        await axiosSecure.put(`/partners/${editingPartner._id}`, formData);
      } else {
        await axiosSecure.post('/partners', formData);
      }
      setShowModal(false);
      resetForm();
      fetchPartners();
      queryClient.invalidateQueries({ queryKey: ['home-partners'] });
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('ডেটা সংরক্ষণে সমস্যা হয়েছে');
    }
  };

  // Edit partner - load data into form
  const handleEdit = (partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name || '',
      logo: partner.logo || '',
      link: partner.link || '',
      isActive: partner.isActive !== false,
      order: partner.order || 0,
    });
    setShowModal(true);
  };

  // Delete partner
  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি এই পার্টনারটি মুছে ফেলতে চান?')) return;
    try {
      await axiosSecure.delete(`/partners/${id}`);
      fetchPartners();
      queryClient.invalidateQueries({ queryKey: ['home-partners'] });
    } catch (error) {
      console.error('Error deleting partner:', error);
      alert('মুছতে সমস্যা হয়েছে');
    }
  };

  // Toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axiosSecure.patch(`/partners/${id}`, { isActive: !currentStatus });
      fetchPartners();
      queryClient.invalidateQueries({ queryKey: ['home-partners'] });
    } catch (error) {
      console.error('Error toggling partner:', error);
    }
  };

  // Image upload handlers
  const handleUploadClick = () => {
    if (fileInputRef.current && !uploading) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!IMGBB_API_KEY) {
      alert('ImgBB API Key সেট করা হয়নি। .env এ VITE_IMGBB_API_KEY যোগ করুন।');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('ফাইল সাইজ ৫ এমবি এর কম হতে হবে');
      return;
    }
    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, logo: data.data.url }));
      } else {
        alert('ইমেজ আপলোড সমস্যা: ' + (data.error?.message || 'অজানা ত্রুটি'));
      }
    } catch (error) {
      console.error('Upload error', error);
      alert('ইমেজ আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">পার্টনারস ব্যবস্থাপনা</h1>
          <p className="text-gray-600">হোম পেজের Our Partners সেকশনের ডেটা যোগ, সম্পাদনা এবং মুছুন</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          type="button"
        >
          <FaPlus className="mr-2" /> নতুন পার্টনার যোগ করুন
        </button>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.length > 0 ? (
          partners.map((partner) => (
            <div key={partner._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="w-14 h-14 object-contain" />
                  ) : (
                    <FaImage className="text-2xl text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{partner.name}</h3>
                  {partner.link && (
                    <div className="text-sm text-gray-500 flex items-center mt-1 truncate">
                      <FaLink className="mr-1" />
                      <span className="truncate">{partner.link}</span>
                    </div>
                  )}
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      partner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {partner.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </div>
              </div>

              <div className="px-4 pb-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">ক্রম: {partner.order ?? 0}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(partner._id, partner.isActive)}
                    className={`p-2 rounded-md transition-colors ${
                      partner.isActive ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                    title={partner.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                    type="button"
                  >
                    <FaEye className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleEdit(partner)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                    title="সম্পাদনা করুন"
                    type="button"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(partner._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                    title="মুছুন"
                    type="button"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 col-span-full">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো পার্টনার নেই</h3>
            <p className="text-gray-600 mb-4">প্রথম পার্টনার যোগ করে শুরু করুন</p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              type="button"
            >
              পার্টনার যোগ করুন
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingPartner ? 'পার্টনার সম্পাদনা' : 'নতুন পার্টনার'}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  নাম *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="পার্টনারের নাম"
                />
              </div>

              {/* Link */}
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                  লিংক (ঐচ্ছিক)
                </label>
                <input
                  id="link"
                  name="link"
                  type="url"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">লোগো *</label>
                {!IMGBB_API_KEY && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700 mb-3">
                    ইমেজ আপলোডের জন্য .env এ VITE_IMGBB_API_KEY সেট করুন, অথবা নিচে সরাসরি ইমেজ URL দিন।
                  </div>
                )}

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="space-y-3">
                    <FaUpload className="mx-auto text-3xl text-gray-400" />
                    <p className="text-sm text-gray-600">লোগো এখানে ড্র্যাগ করে দিন অথবা</p>
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      disabled={uploading}
                      className={`mt-2 inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                        uploading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                      }`}
                    >
                      {uploading ? <FaSpinner className="mr-2 animate-spin" /> : <FaUpload className="mr-2" />}
                      {uploading ? 'আপলোড হচ্ছে...' : 'ফাইল নির্বাচন করুন'}
                    </button>
                  </div>
                </div>

                {formData.logo && (
                  <div className="relative mt-3">
                    <img
                      src={formData.logo}
                      alt="Logo Preview"
                      className="w-full h-40 object-contain bg-gray-50 rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, logo: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      title="ছবি সরান"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}

                <div className="mt-3">
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                    অথবা লোগোর URL
                  </label>
                  <input
                    id="logo"
                    name="logo"
                    type="url"
                    value={formData.logo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              {/* Order and Active */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                    ক্রম (ঐচ্ছিক)
                  </label>
                  <input
                    id="order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    সক্রিয় করুন
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <FaSave className="mr-2" />
                  {editingPartner ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersAdmin;
