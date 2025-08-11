import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { 
  FiBookOpen, FiMapPin, FiPhone, FiUser, FiSave, FiArrowLeft, 
  FiInfo, FiMail, FiCalendar, FiUsers, FiGlobe, FiEdit3,
  FiImage, FiUpload, FiX, FiEye
} from "react-icons/fi";

const EditEducation = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    type: 'school',
    level: 'primary',
    address: '',
    phone: '',
    email: '',
    principal: '',
    established: '',
    students: '',
    description: '',
    website: '',
    district: 'bogura',
    upazila: '',
    facilities: [],
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // ImgBB API Key - Replace with your actual API key
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const facilityOptions = [
    { value: 'library', label: 'গ্রন্থাগার', icon: '📚' },
    { value: 'laboratory', label: 'ল্যাবরেটরি', icon: '🧪' },
    { value: 'computer_lab', label: 'কম্পিউটার ল্যাব', icon: '💻' },
    { value: 'playground', label: 'খেলার মাঠ', icon: '⚽' },
    { value: 'canteen', label: 'ক্যান্টিন', icon: '🍽️' },
    { value: 'transport', label: 'পরিবহন', icon: '🚌' },
    { value: 'hostel', label: 'হোস্টেল', icon: '🏠' },
    { value: 'medical', label: 'চিকিৎসা কেন্দ্র', icon: '🏥' },
    { value: 'sports', label: 'ক্রীড়া সুবিধা', icon: '🏃' },
    { value: 'auditorium', label: 'অডিটোরিয়াম', icon: '🎭' }
  ];

  // Fetch education institute data
  useEffect(() => {
    const fetchInstitute = async () => {
      try {
        setIsFetching(true);
        const res = await axiosSecure.get(`/educations/${id}`);
        console.log('API response:', res.data);
        // Handle both { data: {...} } and flat {...} response
        const institute = res.data.data ? res.data.data : res.data;
        setFormData({
          name: institute.name || '',
          type: institute.type || 'school',
          level: institute.level || 'primary',
          address: institute.address || '',
          phone: institute.phone || '',
          email: institute.email || '',
          principal: institute.principal || '',
          established: institute.established || '',
          students: institute.students || '',
          description: institute.description || '',
          website: institute.website || '',
          district: institute.district || 'bogura',
          upazila: institute.upazila || '',
          facilities: institute.facilities || [],
          images: institute.images || []
        });
      } catch (error) {
        console.error('Error fetching institute:', error);
        let errorMessage = 'শিক্ষা প্রতিষ্ঠানের তথ্য লোড করা যায়নি';
        if (error.response?.status === 404) {
          errorMessage = 'শিক্ষা প্রতিষ্ঠান পাওয়া যায়নি';
        }
        Swal.fire('ত্রুটি', errorMessage, 'error').then(() => {
          navigate('/dashboard/education');
        });
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchInstitute();
    }
  }, [id, axiosSecure, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFacilityToggle = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  // Image upload functions
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          url: data.data.url,
          delete_url: data.data.delete_url,
          title: data.data.title,
          time: data.data.time
        };
      } else {
        throw new Error(data.error?.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      Swal.fire('ত্রুটি', 'আপলোড করার জন্য একটি ছবি নির্বাচন করুন', 'error');
      return;
    }

    setImageUploading(true);

    try {
      const uploadedImage = await uploadImageToImgBB(selectedFile);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, uploadedImage]
      }));

      // Clear selection
      setSelectedFile(null);
      setImagePreview(null);
      
      Swal.fire({
        title: 'সফল!',
        text: 'ছবি সফলভাবে আপলোড হয়েছে',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire('ত্রুটি', 'ছবি আপলোড করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'প্রতিষ্ঠানের নাম প্রয়োজন';
    }

    if (!formData.principal.trim()) {
      newErrors.principal = 'অধ্যক্ষের নাম প্রয়োজন';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'ঠিকানা প্রয়োজন';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'যোগাযোগের নম্বর প্রয়োজন';
    } else if (!/^(\+88|88)?(01[3-9]\d{8})$/.test(formData.phone)) {
      newErrors.phone = 'সঠিক বাংলাদেশী মোবাইল নম্বর দিন';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'সঠিক ইমেইল ঠিকানা দিন';
    }

    if (!formData.type) {
      newErrors.type = 'প্রতিষ্ঠানের ধরন নির্বাচন করুন';
    }

    if (!formData.level) {
      newErrors.level = 'শিক্ষার স্তর নির্বাচন করুন';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire('ত্রুটি', 'সব তথ্য সঠিকভাবে পূরণ করুন', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const instituteData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      const res = await axiosSecure.put(`/educations/${id}`, instituteData);
      
      if (res.data.modifiedCount > 0 || res.data.message === 'Updated successfully') {
        Swal.fire({
          title: 'সফল!',
          text: 'শিক্ষা প্রতিষ্ঠানের তথ্য সফলভাবে আপডেট করা হয়েছে',
          icon: 'success',
          confirmButtonText: 'ঠিক আছে'
        }).then(() => {
          navigate('/dashboard/education');
        });
      }
    } catch (error) {
      console.error('Error updating institute:', error);
      let errorMessage = 'শিক্ষা প্রতিষ্ঠান আপডেট করা যায়নি';
      if (error.response?.status === 404) {
        errorMessage = 'শিক্ষা প্রতিষ্ঠান পাওয়া যায়নি';
      }
      Swal.fire('ত্রুটি', errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">শিক্ষা প্রতিষ্ঠানের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <FiEdit3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">শিক্ষা প্রতিষ্ঠান সম্পাদনা করুন</h1>
          <p className="text-gray-600 text-lg">শিক্ষা প্রতিষ্ঠানের তথ্য আপডেট করুন</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiBookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  মৌলিক তথ্য
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="শিক্ষা প্রতিষ্ঠানের নাম লিখুন"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiInfo className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      প্রতিষ্ঠানের ধরন <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="school">স্কুল</option>
                      <option value="college">কলেজ</option>
                      <option value="school_and_college">স্কুল এবং কলেজ</option>
                      <option value="university">বিশ্ববিদ্যালয়</option>
                      <option value="medical">মেডিকেল</option>
                      <option value="madrasa">মাদ্রাসা</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiInfo className="w-4 h-4 mr-1" />
                        {errors.type}
                      </p>
                    )}
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      শিক্ষার স্তর <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.level ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="primary">প্রাথমিক</option>
                      <option value="secondary">মাধ্যমিক</option>
                      <option value="higher_secondary">উচ্চ মাধ্যমিক</option>
                      <option value="primary_secondary_higher">প্রাথমিক, মাধ্যমিক এবং উচ্চ</option>
                      <option value="secondary_higher">মাধ্যমিক এবং উচ্চ</option>
                      <option value="school_and_college">স্কুল এবং কলেজ</option>
                      <option value="university">বিশ্ববিদ্যালয়</option>
                      <option value="medical">মেডিকেল</option>
                    </select>
                    {errors.level && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiInfo className="w-4 h-4 mr-1" />
                        {errors.level}
                      </p>
                    )}
                  </div>

                  {/* Upazila */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      উপজেলা
                    </label>
                    <input
                      type="text"
                      name="upazila"
                      value={formData.upazila}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="উপজেলার নাম"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiImage className="w-5 h-5 mr-2 text-blue-600" />
                  প্রতিষ্ঠানের ছবি
                </h3>
                
                <div className="space-y-6">
                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <div className="space-y-4">
                      <FiUpload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          ছবি আপলোড করুন
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          JPG, PNG, GIF ফাইল (সর্বোচ্চ ৫ মেগাবাইট)
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          <FiUpload className="w-4 h-4 mr-2" />
                          ছবি নির্বাচন করুন
                        </label>
                        
                        {selectedFile && (
                          <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={imageUploading}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {imageUploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                আপলোড হচ্ছে...
                              </>
                            ) : (
                              <>
                                <FiUpload className="w-4 h-4 mr-2" />
                                আপলোড করুন
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">প্রিভিউ</h4>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Uploaded Images */}
                  {formData.images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        আপলোডকৃত ছবি ({formData.images.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => window.open(image.url, '_blank')}
                                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                  title="দেখুন"
                                >
                                  <FiEye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                  title="মুছুন"
                                >
                                  <FiX className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiPhone className="w-5 h-5 mr-2 text-blue-600" />
                  যোগাযোগের তথ্য
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Principal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      অধ্যক্ষের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="principal"
                      value={formData.principal}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.principal ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="অধ্যক্ষের নাম লিখুন"
                    />
                    {errors.principal && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiInfo className="w-4 h-4 mr-1" />
                        {errors.principal}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      যোগাযোগের নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="01XXXXXXXXX"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiInfo className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ইমেইল
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@institute.edu.bd"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiInfo className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ওয়েবসাইট
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://www.institute.edu.bd"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiMapPin className="w-5 h-5 mr-2 text-blue-600" />
                  ঠিকানা
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="বিস্তারিত ঠিকানা লিখুন"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiInfo className="w-4 h-4 mr-1" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiCalendar className="w-5 h-5 mr-2 text-blue-600" />
                  অতিরিক্ত তথ্য
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Established */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      প্রতিষ্ঠার বছর
                    </label>
                    <input
                      type="text"
                      name="established"
                      value={formData.established}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="১৯৬২"
                    />
                  </div>

                  {/* Students */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      শিক্ষার্থীর সংখ্যা
                    </label>
                    <input
                      type="text"
                      name="students"
                      value={formData.students}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="৫০০০+"
                    />
                  </div>
                </div>
              </div>

              {/* Facilities Section */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiUsers className="w-5 h-5 mr-2 text-blue-600" />
                  সুবিধা সমূহ
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {facilityOptions.map((facility) => (
                    <label key={facility.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(facility.value)}
                        onChange={() => handleFacilityToggle(facility.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {facility.icon} {facility.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  বিবরণ
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="শিক্ষা প্রতিষ্ঠান সম্পর্কে বিস্তারিত বিবরণ লিখুন..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/education')}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <FiArrowLeft className="w-5 h-5 mr-2" />
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      আপডেট হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5 mr-2" />
                      আপডেট করুন
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEducation; 