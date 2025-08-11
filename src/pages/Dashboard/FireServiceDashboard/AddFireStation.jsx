import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiZap, FiMapPin, FiPhone, FiUser, FiSave, FiArrowLeft, FiInfo, FiShield } from "react-icons/fi";

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddFireStation = () => {
  const [formData, setFormData] = useState({
    name: '',
    officer: '',
    address: '',
    contact: '',
    type: 'main',
    email: '',
    description: '',
    workingHours: '',
    emergencyContact: '',
    equipment: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const equipmentOptions = [
    { value: 'fire_truck', label: 'ফায়ার ট্রাক', icon: '🚒' },
    { value: 'water_tank', label: 'জল ট্যাংক', icon: '💧' },
    { value: 'ladder', label: 'মই', icon: '🪜' },
    { value: 'hose', label: 'হোস পাইপ', icon: '🔗' },
    { value: 'axe', label: 'কুঠার', icon: '🪓' },
    { value: 'oxygen_tank', label: 'অক্সিজেন ট্যাংক', icon: '🫧' },
    { value: 'first_aid', label: 'প্রাথমিক চিকিৎসা', icon: '🏥' },
    { value: 'communication', label: 'যোগাযোগ সরঞ্জাম', icon: '📻' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleEquipmentToggle = (equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'স্টেশনের নাম প্রয়োজন';
    }

    if (!formData.officer.trim()) {
      newErrors.officer = 'অফিসারের নাম প্রয়োজন';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'ঠিকানা প্রয়োজন';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'যোগাযোগের নম্বর প্রয়োজন';
    } else if (!/^(\+88|88)?(01[3-9]\d{8})$/.test(formData.contact)) {
      newErrors.contact = 'সঠিক বাংলাদেশী মোবাইল নম্বর দিন';
    }

    if (!formData.type) {
      newErrors.type = 'স্টেশনের ধরন নির্বাচন করুন';
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
      const stationData = {
        ...formData,
        createdAt: new Date().toISOString()
      };

      const res = await axiosSecure.post('/fire-stations', stationData);
      
      if (res.data.insertedId) {
        Swal.fire({
          title: 'সফল!',
          text: 'ফায়ার স্টেশন সফলভাবে যোগ করা হয়েছে',
          icon: 'success',
          confirmButtonText: 'ঠিক আছে'
        }).then(() => {
          navigate('/dashboard/fire-station');
        });
      }
    } catch (error) {
      console.error('Error adding fire station:', error);
      Swal.fire('ত্রুটি', 'ফায়ার স্টেশন যোগ করা যায়নি', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mb-4">
            <FiZap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">নতুন ফায়ার স্টেশন যোগ করুন</h1>
          <p className="text-gray-600 text-lg">বগুড়া জেলার ফায়ার স্টেশনের তথ্য যোগ করুন</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiShield className="w-5 h-5 mr-2 text-red-600" />
                  মৌলিক তথ্য
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      স্টেশনের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ফায়ার স্টেশনের নাম লিখুন"
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
                      স্টেশনের ধরন <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="main">মূল স্টেশন</option>
                      <option value="sub">উপ-স্টেশন</option>
                      <option value="emergency">জরুরি স্টেশন</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiInfo className="w-4 h-4 mr-1" />
                        {errors.type}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiPhone className="w-5 h-5 mr-2 text-red-600" />
                  যোগাযোগের তথ্য
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Officer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      অফিসারের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="officer"
                      value={formData.officer}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                        errors.officer ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="অফিসারের নাম লিখুন"
                    />
                    {errors.officer && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiInfo className="w-4 h-4 mr-1" />
                        {errors.officer}
                      </p>
                    )}
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      যোগাযোগের নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
                        errors.contact ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="01XXXXXXXXX"
                    />
                    {errors.contact && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiInfo className="w-4 h-4 mr-1" />
                        {errors.contact}
                      </p>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    জরুরি যোগাযোগের নম্বর
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="জরুরি নম্বর (ঐচ্ছিক)"
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiMapPin className="w-5 h-5 mr-2 text-red-600" />
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
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

              {/* Equipment Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiZap className="w-5 h-5 mr-2 text-red-600" />
                  সরঞ্জামসমূহ
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {equipmentOptions.map((equipment) => (
                    <label key={equipment.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.equipment.includes(equipment.value)}
                        onChange={() => handleEquipmentToggle(equipment.value)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {equipment.icon} {equipment.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Working Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      কর্মঘণ্টা
                    </label>
                    <input
                      type="text"
                      name="workingHours"
                      value={formData.workingHours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="২৪ ঘণ্টা সেবা"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="example@firestation.com"
                    />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="ফায়ার স্টেশন সম্পর্কে বিস্তারিত বিবরণ লিখুন..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/fire-station')}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <FiArrowLeft className="w-5 h-5 mr-2" />
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      যোগ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5 mr-2" />
                      স্টেশন যোগ করুন
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

export default AddFireStation;
