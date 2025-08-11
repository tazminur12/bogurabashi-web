import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiPackage, FiMapPin, FiPhone, FiUser, FiGlobe, FiSave, FiArrowLeft, FiInfo } from "react-icons/fi";

const AddCourierService = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    type: "domestic",
    description: "",
    email: "",
    website: "",
    workingHours: "",
    services: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const serviceOptions = [
    { value: "domestic", label: "দেশীয় কুরিয়ার", icon: "🏠" },
    { value: "international", label: "আন্তর্জাতিক কুরিয়ার", icon: "🌍" },
    { value: "express", label: "এক্সপ্রেস ডেলিভারি", icon: "⚡" },
    { value: "same_day", label: "সেইম ডে ডেলিভারি", icon: "🚀" },
    { value: "next_day", label: "নেক্সট ডে ডেলিভারি", icon: "📅" },
    { value: "cod", label: "ক্যাশ অন ডেলিভারি", icon: "💰" },
    { value: "tracking", label: "পার্সেল ট্র্যাকিং", icon: "📍" },
    { value: "insurance", label: "পার্সেল ইন্সুরেন্স", icon: "🛡️" }
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

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "কুরিয়ারের নাম প্রয়োজন";
    }

    if (!formData.address.trim()) {
      newErrors.address = "ঠিকানা প্রয়োজন";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "যোগাযোগের নম্বর প্রয়োজন";
    } else if (!/^(\+88|88)?(01[3-9]\d{8})$/.test(formData.contact)) {
      newErrors.contact = "সঠিক বাংলাদেশী মোবাইল নম্বর দিন";
    }

    if (!formData.type) {
      newErrors.type = "কুরিয়ারের ধরন নির্বাচন করুন";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire("ত্রুটি", "সব তথ্য সঠিকভাবে পূরণ করুন", "error");
      return;
    }

    setIsLoading(true);

    try {
      const courierData = {
        ...formData,
        createdAt: new Date().toISOString()
      };

      const res = await axiosSecure.post('/couriers', courierData);
      
      if (res.data.insertedId) {
        Swal.fire({
          title: "সফল!",
          text: "কুরিয়ার সার্ভিস সফলভাবে যোগ করা হয়েছে",
          icon: "success",
          confirmButtonText: "ঠিক আছে"
        }).then(() => {
          navigate('/dashboard/courier-service');
        });
      }
    } catch (error) {
      console.error('Error adding courier:', error);
      Swal.fire("ত্রুটি", "কুরিয়ার যোগ করা যায়নি", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4">
            <FiPackage className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">নতুন কুরিয়ার সার্ভিস যোগ করুন</h1>
          <p className="text-gray-600 text-lg">বগুড়া জেলার কুরিয়ার সার্ভিসের তথ্য যোগ করুন</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2 text-green-600" />
                  মৌলিক তথ্য
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      কুরিয়ারের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="কুরিয়ারের নাম লিখুন"
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
                      কুরিয়ারের ধরন <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="domestic">দেশীয় কুরিয়ার</option>
                      <option value="international">আন্তর্জাতিক কুরিয়ার</option>
                      <option value="both">উভয় ধরনের</option>
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
                  <FiPhone className="w-5 h-5 mr-2 text-green-600" />
                  যোগাযোগের তথ্য
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiMapPin className="w-5 h-5 mr-2 text-green-600" />
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
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

              {/* Services Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiGlobe className="w-5 h-5 mr-2 text-green-600" />
                  সেবাসমূহ
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {serviceOptions.map((service) => (
                    <label key={service.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.value)}
                        onChange={() => handleServiceToggle(service.value)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {service.icon} {service.label}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="সকাল ৯টা - সন্ধ্যা ৬টা"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://example.com"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="কুরিয়ার সার্ভিস সম্পর্কে বিস্তারিত বিবরণ লিখুন..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/courier-service')}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <FiArrowLeft className="w-5 h-5 mr-2" />
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      যোগ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5 mr-2" />
                      কুরিয়ার যোগ করুন
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

export default AddCourierService;
