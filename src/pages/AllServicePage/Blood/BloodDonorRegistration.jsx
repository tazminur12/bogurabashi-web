import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaUser, FaPhone, FaTint, FaCalendarAlt, FaMapMarkerAlt, FaSave, FaHeart } from 'react-icons/fa';
import divisionsData from '../../../data/AllDivision.json';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const BloodDonorRegistration = () => {
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    bloodGroup: '',
    lastDonationDate: '',
    division: '',
    district: ''
  });

  const [divisions, setDivisions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    if (divisionsData.divisions) {
      setDivisions(divisionsData.divisions);
    } else {
      setDivisions(divisionsData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'division' && { district: '' }),
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'নাম প্রয়োজন';
    if (!formData.mobile.trim()) newErrors.mobile = 'মোবাইল নম্বর প্রয়োজন';
    else if (!/^01[3-9]\d{8}$/.test(formData.mobile)) newErrors.mobile = 'সঠিক মোবাইল নম্বর লিখুন';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'রক্তের গ্রুপ নির্বাচন করুন';
    if (!formData.division) newErrors.division = 'বিভাগ নির্বাচন করুন';
    if (!formData.district) newErrors.district = 'জেলা নির্বাচন করুন';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: 'ফর্মে কিছু ত্রুটি আছে, দয়া করে ঠিক করুন।',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosSecure.post('/donors', formData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'সফল!',
          text: 'রক্তদাতা সফলভাবে যোগ হয়েছে!',
        });
        setFormData({
          name: '',
          mobile: '',
          bloodGroup: '',
          lastDonationDate: '',
          division: '',
          district: ''
        });
      }
    } catch (error) {
      console.error("Error saving donor:", error);
      Swal.fire({
        icon: 'error',
        title: 'ব্যর্থ!',
        text: 'রক্তদাতা সংরক্ষণে ব্যর্থ হয়েছে।',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDistricts = () => {
    const selectedDivision = divisions.find(div => div.name === formData.division);
    return selectedDivision ? selectedDivision.districts : [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <FaHeart className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            রক্তদাতা হিসেবে নিবন্ধন করুন
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            আপনার তথ্য প্রদান করে রক্তদাতা হিসেবে যোগ দিন এবং জীবন বাঁচাতে সাহায্য করুন
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <FaUser className="mr-3" />
              ব্যক্তিগত তথ্য
            </h2>
            <p className="text-red-100 mt-2">আপনার তথ্য সুরক্ষিত রাখা হবে</p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <FaUser className="mr-2 text-red-600" />
                  ব্যক্তিগত তথ্য
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      নাম <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        className={`w-full pl-10 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2">
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        placeholder="০১XXXXXXXXX"
                        className={`w-full pl-10 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          errors.mobile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        value={formData.mobile}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Blood Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <FaTint className="mr-2 text-red-600" />
                  রক্তের তথ্য
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Blood Group */}
                  <div className="space-y-2">
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                      রক্তের গ্রুপ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTint className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        className={`w-full pl-10 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 appearance-none bg-white ${
                          errors.bloodGroup ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        value={formData.bloodGroup}
                        onChange={handleChange}
                      >
                        <option value="">রক্তের গ্রুপ নির্বাচন করুন</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {errors.bloodGroup && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.bloodGroup}
                      </p>
                    )}
                  </div>

                  {/* Last Donation Date */}
                  <div className="space-y-2">
                    <label htmlFor="lastDonationDate" className="block text-sm font-medium text-gray-700">
                      সর্বশেষ রক্তদানের তারিখ
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="lastDonationDate"
                        name="lastDonationDate"
                        className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 hover:border-gray-400"
                        value={formData.lastDonationDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-red-600" />
                  অবস্থান
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Division */}
                  <div className="space-y-2">
                    <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                      বিভাগের নাম <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="division"
                        name="division"
                        className={`w-full pl-10 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 appearance-none bg-white ${
                          errors.division ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        value={formData.division}
                        onChange={handleChange}
                      >
                        <option value="">বিভাগ নির্বাচন করুন</option>
                        {divisions.map(division => (
                          <option key={division.name} value={division.name}>{division.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {errors.division && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.division}
                      </p>
                    )}
                  </div>

                  {/* District */}
                  <div className="space-y-2">
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                      জেলার নাম <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="district"
                        name="district"
                        className={`w-full pl-10 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 appearance-none bg-white ${
                          errors.district ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        } ${!formData.division ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        value={formData.district}
                        onChange={handleChange}
                        disabled={!formData.division}
                      >
                        <option value="">জেলা নির্বাচন করুন</option>
                        {getDistricts().map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {errors.district && (
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.district}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      সংরক্ষণ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-3" />
                      সংরক্ষণ করুন
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaHeart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">আপনার তথ্য সুরক্ষিত</h3>
            <div className="space-y-2 text-gray-600">
              <p>✅ আপনার তথ্য গোপন রাখা হবে</p>
              <p>✅ শুধুমাত্র রক্তের প্রয়োজন হলে ব্যবহার করা হবে</p>
              <p>✅ ধন্যবাদ! আপনার এই উদ্যোগ জীবন বাঁচাতে সাহায্য করবে</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodDonorRegistration;
