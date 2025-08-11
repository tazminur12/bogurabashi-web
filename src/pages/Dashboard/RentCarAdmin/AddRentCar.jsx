import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaCar, FaSave, FaArrowLeft, FaPhone, FaMapMarkerAlt, FaMoneyBillWave, FaInfoCircle, FaCalendarAlt, FaUser, FaShieldAlt } from "react-icons/fa";

const AddRentCar = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    type: "",
    color: "",
    transmission: "",
    fuelType: "",
    seats: "",
    rentPerDay: "",
    rentPerWeek: "",
    rentPerMonth: "",
    location: "",
    contact: "",
    ownerName: "",
    description: "",
    features: [],
    images: [],
    status: "Available",
    insurance: "",
    registrationNumber: "",
    mileage: "",
    condition: "",
    additionalInfo: ""
  });

  const [errors, setErrors] = useState({});

  const carTypes = [
    { value: "Sedan", label: "🚗 সেডান", icon: "🚗" },
    { value: "SUV", label: "🚙 এসইউভি", icon: "🚙" },
    { value: "Micro", label: "🚐 মাইক্রো", icon: "🚐" },
    { value: "Luxury", label: "🏎️ লাক্সারি", icon: "🏎️" },
    { value: "Van", label: "🚐 ভ্যান", icon: "🚐" },
    { value: "Truck", label: "🚛 ট্রাক", icon: "🚛" },
    { value: "Pickup", label: "🛻 পিকআপ", icon: "🛻" },
    { value: "Bus", label: "🚌 বাস", icon: "🚌" }
  ];

  const transmissionTypes = [
    { value: "Manual", label: "ম্যানুয়াল" },
    { value: "Automatic", label: "অটোমেটিক" },
    { value: "CVT", label: "সিভিটি" }
  ];

  const fuelTypes = [
    { value: "Petrol", label: "পেট্রোল" },
    { value: "Diesel", label: "ডিজেল" },
    { value: "CNG", label: "সিএনজি" },
    { value: "Electric", label: "ইলেকট্রিক" },
    { value: "Hybrid", label: "হাইব্রিড" }
  ];

  const conditions = [
    { value: "Excellent", label: "চমৎকার" },
    { value: "Good", label: "ভালো" },
    { value: "Fair", label: "মাঝারি" },
    { value: "Poor", label: "খারাপ" }
  ];

  const availableFeatures = [
    "AC", "Power Steering", "Power Windows", "Central Locking", "Music System",
    "GPS Navigation", "Bluetooth", "USB Charger", "Backup Camera", "Airbags",
    "ABS", "Cruise Control", "Leather Seats", "Sunroof", "Alloy Wheels"
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

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand?.trim()) {
      newErrors.brand = "ব্র্যান্ড প্রয়োজন";
    }
    if (!formData.model?.trim()) {
      newErrors.model = "মডেল প্রয়োজন";
    }
    if (!formData.year?.trim()) {
      newErrors.year = "বছর প্রয়োজন";
    } else if (formData.year < 1990 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = "সঠিক বছর দিন";
    }
    if (!formData.type?.trim()) {
      newErrors.type = "গাড়ির ধরন নির্বাচন করুন";
    }
    if (!formData.rentPerDay?.trim()) {
      newErrors.rentPerDay = "দৈনিক ভাড়ার দাম প্রয়োজন";
    } else if (formData.rentPerDay <= 0) {
      newErrors.rentPerDay = "ভাড়ার দাম ০ এর চেয়ে বেশি হতে হবে";
    }
    if (!formData.location?.trim()) {
      newErrors.location = "অবস্থান প্রয়োজন";
    }
    if (!formData.contact?.trim()) {
      newErrors.contact = "যোগাযোগের নম্বর প্রয়োজন";
    } else if (!/^(\+88|88)?(01[3-9]\d{8})$/.test(formData.contact)) {
      newErrors.contact = "সঠিক মোবাইল নম্বর দিন";
    }
    if (!formData.ownerName?.trim()) {
      newErrors.ownerName = "মালিকের নাম প্রয়োজন";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire("❌ ত্রুটি", "সব প্রয়োজনীয় তথ্য পূরণ করুন", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosSecure.post("/rent-cars", formData);
      
      if (response.data.insertedId) {
        Swal.fire({
          title: "✅ সফল!",
          text: "গাড়িটি সফলভাবে যোগ করা হয়েছে",
          icon: "success",
          confirmButtonText: "ঠিক আছে"
        }).then(() => {
          navigate("/rent-cars");
        });
      }
    } catch (error) {
      console.error("Error adding car:", error);
      Swal.fire("❌ ত্রুটি", "গাড়ি যোগ করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('bn-BD').format(price);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#333] mb-1">🚗 নতুন গাড়ি যোগ করুন</h1>
            <p className="text-sm text-gray-600">ভাড়ার জন্য নতুন গাড়ির তথ্য যোগ করুন</p>
          </div>
          <Link
            to="/rent-cars"
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-200 text-sm font-medium"
          >
            <FaArrowLeft />
            ফিরে যান
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaCar className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">মৌলিক তথ্য</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ব্র্যান্ড <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="যেমন: Toyota, Honda, BMW"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.brand ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  মডেল <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="যেমন: Corolla, Civic, X5"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.model ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  বছর <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="যেমন: 2020"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.year ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  গাড়ির ধরন <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.type ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                >
                  <option value="">ধরন নির্বাচন করুন</option>
                  {carTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  রং
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="যেমন: সাদা, কালো, লাল"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ট্রান্সমিশন
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                >
                  <option value="">ট্রান্সমিশন নির্বাচন করুন</option>
                  {transmissionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  জ্বালানির ধরন
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                >
                  <option value="">জ্বালানির ধরন নির্বাচন করুন</option>
                  {fuelTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  আসনের সংখ্যা
                </label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  placeholder="যেমন: 4, 5, 7"
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaMoneyBillWave className="text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">ভাড়ার তথ্য</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  দৈনিক ভাড়া (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="rentPerDay"
                  value={formData.rentPerDay}
                  onChange={handleInputChange}
                  placeholder="যেমন: 1500"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.rentPerDay ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                {errors.rentPerDay && <p className="text-red-500 text-xs mt-1">{errors.rentPerDay}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  সাপ্তাহিক ভাড়া (৳)
                </label>
                <input
                  type="number"
                  name="rentPerWeek"
                  value={formData.rentPerWeek}
                  onChange={handleInputChange}
                  placeholder="যেমন: 9000"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  মাসিক ভাড়া (৳)
                </label>
                <input
                  type="number"
                  name="rentPerMonth"
                  value={formData.rentPerMonth}
                  onChange={handleInputChange}
                  placeholder="যেমন: 35000"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>
            </div>
          </div>

          {/* Location and Contact */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaMapMarkerAlt className="text-red-500" />
              <h2 className="text-xl font-semibold text-gray-800">অবস্থান ও যোগাযোগ</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  অবস্থান <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="যেমন: বগুড়া সদর, শেরপুর, আদমদীঘি"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.location ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  যোগাযোগের নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="যেমন: 01712345678"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.contact ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  মালিকের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="গাড়ির মালিকের নাম"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.ownerName ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  অবস্থা
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                >
                  <option value="Available">🟢 উপলব্ধ</option>
                  <option value="Rented">🟡 ভাড়া দেওয়া</option>
                  <option value="Maintenance">🔴 মেরামত</option>
                  <option value="Reserved">🔵 সংরক্ষিত</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaInfoCircle className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">অতিরিক্ত তথ্য</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  রেজিস্ট্রেশন নম্বর
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="যেমন: ঢাকা-মেট্রো-গ-১২-৩৪৫৬"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  মাইলেজ (কিমি)
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="যেমন: 50000"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  গাড়ির অবস্থা
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                >
                  <option value="">অবস্থা নির্বাচন করুন</option>
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  বীমা
                </label>
                <input
                  type="text"
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleInputChange}
                  placeholder="বীমার তথ্য"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিবরণ
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="গাড়ির বিস্তারিত বিবরণ লিখুন..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                অতিরিক্ত তথ্য
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows="2"
                placeholder="অতিরিক্ত তথ্য বা শর্তাবলী..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              />
            </div>
          </div>

          {/* Features */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaShieldAlt className="text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-800">গাড়ির সুবিধাসমূহ</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableFeatures.map(feature => (
                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              to="/dashboard/rent-car-admin"
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition duration-200"
            >
              বাতিল করুন
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  যোগ হচ্ছে...
                </>
              ) : (
                <>
                  <FaSave />
                  গাড়ি যোগ করুন
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-gray-500 text-xs text-center">
          © 2025 ভাড়ার গাড়ি ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default AddRentCar; 