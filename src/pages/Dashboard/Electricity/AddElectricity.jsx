import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiZap, FiSave, FiArrowLeft, FiMapPin, FiPhone, FiType, FiFileText, FiGlobe } from 'react-icons/fi';

const AddElectricity = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    type: '',
    description: '',
    email: '',
    website: '',
    workingHours: '',
    emergencyContact: '',
    area: '',
    capacity: '',
    manager: '',
    establishedYear: '',
    serviceArea: '',
    billingSystem: '',
    paymentMethods: '',
    complaintsNumber: '',
    officeHours: '',
    holidayInfo: '',
    specialServices: ''
  });

  const electricityTypes = [
    { value: 'power_plant', label: 'বিদ্যুৎ কেন্দ্র' },
    { value: 'substation', label: 'সাবস্টেশন' },
    { value: 'distribution_center', label: 'বিতরণ কেন্দ্র' },
    { value: 'customer_service', label: 'গ্রাহক সেবা কেন্দ্র' },
    { value: 'billing_office', label: 'বিলিং অফিস' },
    { value: 'maintenance_center', label: 'রক্ষণাবেক্ষণ কেন্দ্র' },
    { value: 'emergency_service', label: 'জরুরি সেবা কেন্দ্র' },
    { value: 'regional_office', label: 'আঞ্চলিক অফিস' }
  ];

  const boguraAreas = [
    'বগুড়া সদর',
    'শিবগঞ্জ',
    'ধুনট',
    'আদমদীঘি',
    'নন্দীগ্রাম',
    'সারিয়াকান্দি',
    'শাজাহানপুর',
    'গাবতলী',
    'কাহালু',
    'দুপচাঁচিয়া',
    'সোনাতলা',
    'শেরপুর'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.address || !formData.contact || !formData.type || !formData.area) {
      Swal.fire('ত্রুটি', 'সব প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.post('/electricities', formData);
      
      if (res.data.success) {
        Swal.fire({
          title: 'সফল!',
          text: 'বগুড়া জেলার বিদ্যুৎ কেন্দ্র সফলভাবে যোগ করা হয়েছে',
          icon: 'success',
          confirmButtonText: 'ঠিক আছে'
        }).then(() => {
          navigate('/dashboard/electricity');
        });
      }
    } catch (error) {
      console.error('Error adding electricity:', error);
      Swal.fire('ত্রুটি', 'তথ্য যোগ করা যায়নি', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard/electricity')}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FiArrowLeft className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <FiZap className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">বগুড়া জেলার বিদ্যুৎ কেন্দ্র যোগ করুন</h1>
                  <p className="text-gray-600 mt-1">নতুন বিদ্যুৎ সেবা কেন্দ্রের তথ্য দিন</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiZap className="text-blue-600" />
                মৌলিক তথ্য
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিদ্যুৎ কেন্দ্রের নাম *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="যেমন: বগুড়া বিদ্যুৎ কেন্দ্র"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    কেন্দ্রের ধরণ *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">ধরণ নির্বাচন করুন</option>
                    {electricityTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    এলাকা/উপজেলা *
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">এলাকা নির্বাচন করুন</option>
                    {boguraAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    কেন্দ্রের ক্ষমতা (মেগাওয়াট)
                  </label>
                  <input
                    type="text"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="যেমন: ৫০ মেগাওয়াট"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    কেন্দ্র ব্যবস্থাপক
                  </label>
                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="ব্যবস্থাপকের নাম"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    প্রতিষ্ঠার বছর
                  </label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="যেমন: ১৯৮৫"
                    min="1900"
                    max="2024"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiPhone className="text-green-600" />
                যোগাযোগের তথ্য
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    প্রধান ফোন নম্বর *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="০৫১-৬২৩৪৫৬"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    জরুরি যোগাযোগ নম্বর
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="জরুরি ফোন নম্বর"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    অভিযোগ নম্বর
                  </label>
                  <input
                    type="tel"
                    name="complaintsNumber"
                    value={formData.complaintsNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="অভিযোগের জন্য ফোন নম্বর"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ইমেইল ঠিকানা
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="info@bogura-electricity.gov.bd"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ওয়েবসাইট
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://www.bogura-electricity.gov.bd"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiMapPin className="text-red-600" />
                অবস্থান ও সেবা এলাকা
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    সম্পূর্ণ ঠিকানা *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="বিস্তারিত ঠিকানা দিন (গ্রাম, পোস্ট অফিস, জেলা)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    সেবা প্রদান এলাকা
                  </label>
                  <textarea
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="কোন কোন এলাকায় সেবা প্রদান করে"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিশেষ সেবাসমূহ
                  </label>
                  <textarea
                    name="specialServices"
                    value={formData.specialServices}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="বিশেষ সেবা বা সুবিধা"
                  />
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiGlobe className="text-purple-600" />
                সেবা তথ্য
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    অফিস সময়
                  </label>
                  <input
                    type="text"
                    name="officeHours"
                    value={formData.officeHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="সকাল ৯টা - বিকাল ৫টা"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ছুটির দিনের তথ্য
                  </label>
                  <input
                    type="text"
                    name="holidayInfo"
                    value={formData.holidayInfo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="শুক্র-শনি বন্ধ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিলিং সিস্টেম
                  </label>
                  <input
                    type="text"
                    name="billingSystem"
                    value={formData.billingSystem}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="মাসিক/দ্বিমাসিক বিলিং"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পেমেন্ট পদ্ধতি
                  </label>
                  <input
                    type="text"
                    name="paymentMethods"
                    value={formData.paymentMethods}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="নগদ/ব্যাংক/মোবাইল ব্যাংকিং"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiFileText className="text-purple-600" />
                অতিরিক্ত তথ্য
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  কেন্দ্রের বিবরণ
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="কেন্দ্রের বিস্তারিত বিবরণ, ইতিহাস, বিশেষত্ব ইত্যাদি"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <FiSave className="text-lg" />
                )}
                {loading ? 'সংরক্ষণ হচ্ছে...' : 'বিদ্যুৎ কেন্দ্র যোগ করুন'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/dashboard/electricity')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                বাতিল করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddElectricity; 