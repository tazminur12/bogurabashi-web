import React, { useState } from 'react';
import { FaPlus, FaArrowLeft, FaUpload, FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useSecureAxios from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const AddContentCreator = () => {
  const navigate = useNavigate();
  const axiosSecure = useSecureAxios();
  const queryClient = useQueryClient();
  const [imageUploading, setImageUploading] = useState(false);

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

  // Image upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'ফাইল সাইজ বড়',
        text: 'অনুগ্রহ করে 5MB এর কম সাইজের ছবি আপলোড করুন'
      });
      return;
    }

    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        Swal.fire({
          icon: 'success',
          title: 'ছবি আপলোড সফল',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ছবি আপলোড ব্যর্থ',
        text: 'অনুগ্রহ করে আবার চেষ্টা করুন'
      });
    } finally {
      setImageUploading(false);
    }
  };

  // Add content creator mutation
  const addCreatorMutation = useMutation({
    mutationFn: (data) => axiosSecure.post('/content-creators', data),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'সফলভাবে যোগ করা হয়েছে!',
        text: 'আপনার কনটেন্ট ক্রিয়েটর প্রোফাইল সফলভাবে যোগ করা হয়েছে',
        timer: 2000,
        showConfirmButton: false
      });
      queryClient.invalidateQueries(['content-creators']);
      navigate('/content-creators');
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: error.response?.data?.message || 'কিছু সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন'
      });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.specialty || !formData.image) {
      Swal.fire({
        icon: 'warning',
        title: 'প্রয়োজনীয় তথ্য দিন',
        text: 'নাম, স্পেশালিটি এবং ছবি অবশ্যই দিতে হবে'
      });
      return;
    }

    addCreatorMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/content-creators"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            কনটেন্ট ক্রিয়েটর তালিকায় ফিরে যান
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">নতুন কনটেন্ট ক্রিয়েটর যোগ করুন</h1>
          <p className="text-gray-600">আপনার প্রোফাইল তৈরি করুন এবং আপনার কাজের সাথে পরিচয় করিয়ে দিন</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
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
                  onChange={handleInputChange}
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                প্রোফাইল ছবি <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                {formData.image ? (
                  <div className="space-y-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ছবি পরিবর্তন করুন
                    </button>
                  </div>
                ) : (
                  <div>
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">ছবি আপলোড করতে ক্লিক করুন</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF (সর্বোচ্চ 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={imageUploading}
                />
                <label
                  htmlFor="image-upload"
                  className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {imageUploading ? 'আপলোড হচ্ছে...' : 'ছবি নির্বাচন করুন'}
                </label>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  ইমেইল
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
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
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+880 1XXX XXX XXX"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">সোশ্যাল মিডিয়া লিংক</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaFacebook className="inline mr-2 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://facebook.com/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaInstagram className="inline mr-2 text-pink-500" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaYoutube className="inline mr-2 text-red-600" />
                    YouTube
                  </label>
                  <input
                    type="url"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaTiktok className="inline mr-2" />
                    TikTok
                  </label>
                  <input
                    type="url"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://tiktok.com/@yourprofile"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  অভিজ্ঞতা
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="উদাহরণ: ৩ বছর"
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
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="বগুড়া সিটি"
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
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                নিজের সম্পর্কে
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="আপনার কাজ, দক্ষতা এবং অভিজ্ঞতা সম্পর্কে লিখুন..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                to="/content-creators"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                বাতিল
              </Link>
              <button
                type="submit"
                disabled={addCreatorMutation.isPending || imageUploading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {addCreatorMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    যোগ করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" />
                    কনটেন্ট ক্রিয়েটর যোগ করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContentCreator; 