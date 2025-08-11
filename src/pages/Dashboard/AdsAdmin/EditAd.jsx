import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { 
  FaTimes, 
  FaUpload, 
  FaSpinner, 
  FaSave, 
  FaAd,
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaLink,
  FaCalendarAlt,
  FaTag,
  FaDollarSign,
  FaPercent
} from 'react-icons/fa';

const EditAd = ({ ad, onClose, onSuccess }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'regular',
    status: 'active',
    price: '',
    originalPrice: '',
    discount: '',
    company: '',
    location: '',
    phone: '',
    link: '',
    validUntil: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Initialize form data when ad prop changes
  useEffect(() => {
    if (ad) {
      setFormData({
        title: ad.title || '',
        description: ad.description || '',
        category: ad.category || '',
        type: ad.type || 'regular',
        status: ad.status || 'active',
        price: ad.price || '',
        originalPrice: ad.originalPrice || '',
        discount: ad.discount || '',
        company: ad.company || '',
        location: ad.location || '',
        phone: ad.phone || '',
        link: ad.link || '',
        validUntil: ad.validUntil ? ad.validUntil.split('T')[0] : '',
        image: ad.image || null
      });
      setImagePreview(ad.image || null);
    }
  }, [ad]);

  // Update ad mutation
  const updateAdMutation = useMutation({
    mutationFn: async (adData) => {
      const res = await axiosSecure.put(`/ads/${ad._id}`, adData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-ads"]);
      onSuccess();
    },
    onError: (error) => {
      console.error("Update ad error:", error);
      alert("বিজ্ঞাপন আপডেট করতে সমস্যা হয়েছে");
    },
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('শুধুমাত্র ছবি আপলোড করুন');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির আকার 5MB এর কম হতে হবে');
      return;
    }

    setImageUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    try {
      // Upload to ImgBB
      const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (!imgbbApiKey) {
        alert('ImgBB API key পাওয়া যায়নি। ছবি আপলোড করা যাবে না।');
        setImageUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({ 
          ...prev, 
          image: result.data.url 
        }));
        setImagePreview(result.data.url);
      } else {
        alert('ছবি আপলোড করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setImageUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert('শিরোনাম প্রয়োজন');
      return;
    }

    if (!formData.description.trim()) {
      alert('বিবরণ প্রয়োজন');
      return;
    }

    if (!formData.category.trim()) {
      alert('বিভাগ প্রয়োজন');
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      discount: formData.discount ? parseFloat(formData.discount) : null,
    };

    updateAdMutation.mutate(submitData);
  };

  if (!ad) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FaAd className="text-blue-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">বিজ্ঞাপন সম্পাদনা করুন</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaAd className="inline mr-2" />
                শিরোনাম *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="বিজ্ঞাপনের শিরোনাম লিখুন"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিবরণ *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="বিজ্ঞাপনের বিস্তারিত বিবরণ লিখুন"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaTag className="inline mr-2" />
                বিভাগ *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">বিভাগ নির্বাচন করুন</option>
                <option value="বাণিজ্যিক">বাণিজ্যিক</option>
                <option value="শিক্ষা">শিক্ষা</option>
                <option value="স্বাস্থ্য">স্বাস্থ্য</option>
                <option value="পর্যটন">পর্যটন</option>
                <option value="খাদ্য">খাদ্য</option>
                <option value="পরিবহন">পরিবহন</option>
                <option value="বিনোদন">বিনোদন</option>
                <option value="প্রযুক্তি">প্রযুক্তি</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaAd className="inline mr-2" />
                ধরন
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="regular">নিয়মিত</option>
                <option value="featured">ফিচার্ড</option>
                <option value="premium">প্রিমিয়াম</option>
                <option value="sponsored">স্পনসরড</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                অবস্থা
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">সক্রিয়</option>
                <option value="inactive">নিষ্ক্রিয়</option>
                <option value="expired">মেয়াদোত্তীর্ণ</option>
              </select>
            </div>

            {/* Valid Until */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                মেয়াদ শেষ
              </label>
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaDollarSign className="inline mr-2" />
                মূল্য
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="মূল্য লিখুন"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaDollarSign className="inline mr-2" />
                আসল মূল্য
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="আসল মূল্য লিখুন"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPercent className="inline mr-2" />
                ছাড় (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="ছাড়ের শতকরা হার"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBuilding className="inline mr-2" />
                কোম্পানি
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="কোম্পানির নাম"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                অবস্থান
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="অবস্থান"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="inline mr-2" />
                ফোন নম্বর
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="ফোন নম্বর"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLink className="inline mr-2" />
                ওয়েবসাইট লিংক
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUpload className="inline mr-2" />
              বিজ্ঞাপনের ছবি
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>ছবি আপলোড করুন</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                          disabled={imageUploading}
                        />
                      </label>
                      <p className="pl-1">অথবা এখানে টেনে আনুন</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF সর্বোচ্চ 5MB</p>
                  </>
                )}
                {imageUploading && (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">ছবি আপলোড হচ্ছে...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={updateAdMutation.isPending}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {updateAdMutation.isPending ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  আপডেট হচ্ছে...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  আপডেট করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAd; 