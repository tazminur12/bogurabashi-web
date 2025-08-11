import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiWifi, FiMapPin, FiPhone, FiMail, FiGlobe, FiDollarSign, FiUsers, FiClock, FiCalendar, FiStar, FiArrowLeft, FiSave, FiInfo } from 'react-icons/fi';

const AddInternetProviderFront = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    email: '',
    website: '',
    type: '',
    speed: '',
    price: '',
    customers: '',
    establishmentYear: '',
    serviceArea: '',
    features: '',
    officeHours: '',
    holidays: '',
    emergencyContact: '',
    description: '',
    status: 'pending' // Front-end users start with pending status
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.address || !formData.contact) {
      Swal.fire('ত্রুটি', 'প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.post('/internet-providers', formData);
      if (res.data.success) {
        Swal.fire({
          title: 'সফল!',
          text: 'আপনার ইন্টারনেট সেবার তথ্য সফলভাবে যোগ করা হয়েছে। অ্যাডমিন অনুমোদনের পর এটি প্রকাশিত হবে।',
          icon: 'success',
          confirmButtonText: 'ঠিক আছে'
        }).then(() => {
          navigate('/internet');
        });
      }
    } catch (error) {
      console.error('Error adding provider:', error);
      Swal.fire('ত্রুটি', 'তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
            <FiWifi className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">আপনার ইন্টারনেট সেবা যোগ করুন</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            বগুড়া জেলার ইন্টারনেট সেবা প্রদানকারী হিসেবে আপনার সেবার তথ্য যোগ করুন। 
            অ্যাডমিন অনুমোদনের পর এটি প্রকাশিত হবে।
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiWifi className="w-5 h-5 mr-2 text-blue-600" />
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
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="আপনার প্রতিষ্ঠানের নাম লিখুন"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      সেবার ধরন <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">সেবার ধরন নির্বাচন করুন</option>
                      <option value="fiber">ফাইবার অপটিক</option>
                      <option value="cable">কেবল</option>
                      <option value="wireless">ওয়্যারলেস</option>
                      <option value="satellite">স্যাটেলাইট</option>
                      <option value="mobile">মোবাইল ব্রডব্যান্ড</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ঠিকানা <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="বিস্তারিত ঠিকানা লিখুন"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiPhone className="w-5 h-5 mr-2 text-blue-600" />
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
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="01XXXXXXXXX"
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
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="example@provider.com"
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
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://www.provider.com"
                    />
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      জরুরি যোগাযোগ
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="জরুরি নম্বর (ঐচ্ছিক)"
                    />
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiStar className="w-5 h-5 mr-2 text-blue-600" />
                  সেবার বিবরণ
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Speed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ইন্টারনেট গতি
                    </label>
                    <input
                      type="text"
                      name="speed"
                      value={formData.speed}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="যেমন: ১০০ Mbps"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      মূল্য
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="যেমন: ৫০০ টাকা/মাস"
                    />
                  </div>

                  {/* Service Area */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      সেবা এলাকা
                    </label>
                    <input
                      type="text"
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="যেমন: বগুড়া সদর, শিবগঞ্জ, আদমদীঘি"
                    />
                  </div>

                  {/* Features */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      বিশেষ সুবিধা
                    </label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="আপনার সেবার বিশেষ সুবিধা লিখুন..."
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiUsers className="w-5 h-5 mr-2 text-blue-600" />
                  ব্যবসায়িক তথ্য
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Establishment Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      প্রতিষ্ঠার বছর
                    </label>
                    <input
                      type="text"
                      name="establishmentYear"
                      value={formData.establishmentYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="যেমন: ২০২০"
                    />
                  </div>

                  {/* Customers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      গ্রাহকের সংখ্যা
                    </label>
                    <input
                      type="text"
                      name="customers"
                      value={formData.customers}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="যেমন: ১০০০+"
                    />
                  </div>

                  {/* Office Hours */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      অফিসের সময়
                    </label>
                    <input
                      type="text"
                      name="officeHours"
                      value={formData.officeHours}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="যেমন: সকাল ৯টা - বিকাল ৫টা"
                    />
                  </div>

                  {/* Holidays */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ছুটির দিন
                    </label>
                    <input
                      type="text"
                      name="holidays"
                      value={formData.holidays}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="যেমন: শুক্রবার"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  বিস্তারিত বিবরণ
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="আপনার ইন্টারনেট সেবা সম্পর্কে বিস্তারিত বিবরণ লিখুন..."
                />
              </div>

              {/* Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <FiInfo className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>নোট:</strong> আপনার তথ্য যোগ করার পর অ্যাডমিন অনুমোদনের জন্য পাঠানো হবে। 
                      অনুমোদনের পর এটি প্রকাশিত হবে। সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে প্রক্রিয়া সম্পন্ন হয়।
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => navigate('/internet')}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <FiArrowLeft className="w-5 h-5 mr-2" />
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      যোগ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5 mr-2" />
                      সেবা যোগ করুন
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

export default AddInternetProviderFront;
