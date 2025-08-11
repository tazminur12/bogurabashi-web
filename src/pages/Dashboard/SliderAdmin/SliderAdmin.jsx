import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaImage, FaLink, FaSave, FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const SliderAdmin = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileInputRef, setFileInputRef] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cta: '',
    link: '',
    image: '',
    isActive: true
  });

  const axiosSecure = useAxiosSecure();

  // ImgBB API Key from environment variable (with demo fallback)
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  // Fetch sliders
  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/sliders');
      setSliders(response.data);
    } catch (error) {
      console.error('Error fetching sliders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle button click to open file selector
  const handleUploadClick = () => {
    if (fileInputRef && !uploading) {
      fileInputRef.click();
    }
  };

  // Handle image upload to ImgBB
  const handleImageUpload = async (file) => {
    if (!file) return;

    // Check if API key is available
    if (!IMGBB_API_KEY) {
      alert('ImgBB API Key সেট করা হয়নি। .env ফাইলে VITE_IMGBB_API_KEY যোগ করুন।');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ফাইল সাইজ ৫ এমবি এর কম হতে হবে');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          image: data.data.url
        }));
      } else {
        alert('ইমেজ আপলোড করতে সমস্যা হয়েছে: ' + (data.error?.message || 'অজানা ত্রুটি'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('ইমেজ আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploading(false);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle drag and drop
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
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlider) {
        // Update existing slider
        await axiosSecure.put(`/sliders/${editingSlider._id}`, formData);
      } else {
        // Create new slider
        await axiosSecure.post('/sliders', formData);
      }
      
      setShowModal(false);
      setEditingSlider(null);
      setFormData({
        title: '',
        subtitle: '',
        cta: '',
        link: '',
        image: '',
        isActive: true
      });
      fetchSliders();
    } catch (error) {
      console.error('Error saving slider:', error);
    }
  };

  // Handle edit
  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle,
      cta: slider.cta,
      link: slider.link || '',
      image: slider.image,
      isActive: slider.isActive !== false
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('আপনি কি এই স্লাইডারটি মুছে ফেলতে চান?')) {
      try {
        await axiosSecure.delete(`/sliders/${id}`);
        fetchSliders();
      } catch (error) {
        console.error('Error deleting slider:', error);
      }
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axiosSecure.patch(`/sliders/${id}`, { isActive: !currentStatus });
      fetchSliders();
    } catch (error) {
      console.error('Error toggling slider status:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      cta: '',
      link: '',
      image: '',
      isActive: true
    });
    setEditingSlider(null);
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
          <h1 className="text-2xl font-bold text-gray-900">স্লাইডার ব্যবস্থাপনা</h1>
          <p className="text-gray-600">হোম পেজের স্লাইডার যোগ, সম্পাদনা এবং মুছুন</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          নতুন স্লাইডার যোগ করুন
        </button>
      </div>

      {/* ImgBB API Key Warning */}
      {!IMGBB_API_KEY && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaImage className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                ImgBB API Key প্রয়োজন
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>ইমেজ আপলোড করার জন্য ImgBB API Key সেট করতে হবে।</p>
                <p className="mt-1">
                  1. <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline">imgbb.com</a> এ যান<br/>
                  2. ফ্রি অ্যাকাউন্ট তৈরি করুন<br/>
                  3. API Key কপি করে .env ফাইলে VITE_IMGBB_API_KEY=your_api_key_here যোগ করুন
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map((slider) => (
          <div key={slider._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
              {slider.image ? (
                <img
                  src={slider.image}
                  alt={slider.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaImage className="text-4xl text-gray-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  slider.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {slider.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{slider.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{slider.subtitle}</p>
              
              {slider.link && (
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FaLink className="mr-1" />
                  <span className="truncate">{slider.link}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-600">{slider.cta}</span>
                
                <div className="flex items-center space-x-2">
                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggleActive(slider._id, slider.isActive)}
                    className={`p-2 rounded-md transition-colors ${
                      slider.isActive 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                    title={slider.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                  >
                    <FaEye className="text-sm" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(slider)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                    title="সম্পাদনা করুন"
                  >
                    <FaEdit className="text-sm" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(slider._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                    title="মুছুন"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sliders.length === 0 && (
        <div className="text-center py-12">
          <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো স্লাইডার নেই</h3>
          <p className="text-gray-600 mb-4">প্রথম স্লাইডার যোগ করে শুরু করুন</p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            স্লাইডার যোগ করুন
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSlider ? 'স্লাইডার সম্পাদনা করুন' : 'নতুন স্লাইডার যোগ করুন'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  শিরোনাম *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="স্লাইডারের শিরোনাম"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  উপশিরোনাম
                </label>
                <textarea
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="স্লাইডারের বিবরণ"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বোতামের লেখা *
                  </label>
                  <input
                    type="text"
                    name="cta"
                    value={formData.cta}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="যেমন: আরও জানুন"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    লিংক (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="যেমন: /services (খালি রাখতে পারেন)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ছবি *
                </label>
                
                {/* Image Upload */}
                <div className="space-y-3">
                  {/* Drag and Drop Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOver 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      ref={(ref) => setFileInputRef(ref)}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                      disabled={uploading}
                    />
                    
                    <div className="space-y-3">
                      <FaUpload className="mx-auto text-3xl text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          ছবি এখানে ড্র্যাগ করে দিন অথবা
                        </p>
                        <button
                          type="button"
                          onClick={handleUploadClick}
                          disabled={uploading}
                          className={`mt-2 inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                            uploading 
                              ? 'bg-gray-400 text-white cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                          }`}
                        >
                          {uploading ? (
                            <FaSpinner className="mr-2 animate-spin" />
                          ) : (
                            <FaUpload className="mr-2" />
                          )}
                          {uploading ? 'আপলোড হচ্ছে...' : 'ফাইল নির্বাচন করুন'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        সর্বোচ্চ ৫ এমবি (JPG, PNG, GIF)
                      </p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        title="ছবি সরান"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}

                  {/* Manual URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      অথবা ছবির URL দিন
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  স্লাইডার সক্রিয় করুন
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaSave className="mr-2" />
                  {editingSlider ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderAdmin; 