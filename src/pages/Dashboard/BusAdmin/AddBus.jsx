import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FiTruck,
  FiMapPin,
  FiClock,
  FiPhone,
  FiUser,
  FiNavigation,
} from "react-icons/fi";

const AddBus = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    counterName: "",
    busName: "",
    route: "",
    contactNumber: "",
    operatorName: "",
    busType: "",
    fare: "",
    district: "bogura",
    description: "",
    facilities: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.counterName || !formData.busName || !formData.route || !formData.contactNumber) {
      return Swal.fire("ত্রুটি", "সব বাধ্যতামূলক তথ্য পূরণ করুন", "error");
    }

    try {
      setIsSubmitting(true);
      const res = await axiosSecure.post("/buses", formData);
      if (res.data.insertedId) {
        Swal.fire("সফল", "নতুন বাসের তথ্য সফলভাবে যোগ হয়েছে!", "success");
        navigate("/dashboard/bus-admin");
      }
    } catch (error) {
      Swal.fire("ত্রুটি", "বাসের তথ্য যোগ করা যায়নি", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white text-2xl">
            <FiTruck />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">নতুন বাস যোগ করুন</h1>
          <p className="text-gray-600">বগুড়া জেলার বাস কাউন্টারের তথ্য</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Counter Name */}
          <InputField
            label="কাউন্টারের নাম"
            icon={<FiMapPin />}
            name="counterName"
            value={formData.counterName}
            onChange={handleChange}
            placeholder="যেমন: বগুড়া বাস স্ট্যান্ড"
            required
          />

          {/* Contact Number */}
          <InputField
            label="যোগাযোগের নম্বর"
            icon={<FiPhone />}
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="যেমন: ০১৭১১-XXXXXX"
            required
          />

          {/* Bus Name */}
          <InputField
            label="বাসের নাম"
            icon={<FiTruck />}
            name="busName"
            value={formData.busName}
            onChange={handleChange}
            placeholder="যেমন: গ্রীন লাইন"
            required
          />

          {/* Operator Name */}
          <InputField
            label="অপারেটরের নাম"
            icon={<FiUser />}
            name="operatorName"
            value={formData.operatorName}
            onChange={handleChange}
            placeholder="বাস অপারেটরের নাম"
          />

          {/* Bus Type */}
          <InputField
            label="বাসের ধরন"
            icon={<FiTruck />}
            name="busType"
            value={formData.busType}
            onChange={handleChange}
            placeholder="যেমন: এসি, লোকাল"
          />

          {/* Fare */}
          <InputField
            label="ভাড়া (টাকা)"
            name="fare"
            value={formData.fare}
            onChange={handleChange}
            placeholder="যেমন: ৫০০ (AC), ৩০০ (Non-AC)"
            rightSymbol="৳"
            type="text"
          />

          {/* Route */}
          <TextAreaField
            label="রুট ও সময়সূচী"
            name="route"
            value={formData.route}
            onChange={handleChange}
            placeholder="যেমন: বগুড়া - ঢাকা | সকাল ৭টা"
            required
          />

          {/* Description */}
          <TextAreaField
            label="বিবরণ"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="বাস সম্পর্কে অতিরিক্ত তথ্য..."
          />

          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/bus-admin")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FiNavigation className="mr-2 rotate-180" /> ফিরে যান
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center text-white transition-all duration-200 ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path fill="white" d="M4 12a8 8 0 018-8V0C5 0 0 5 0 12h4z" />
                  </svg>
                  যোগ হচ্ছে...
                </>
              ) : (
                <>
                  <FiTruck className="mr-2" />
                  বাস যোগ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 🔹 Reusable InputField component
const InputField = ({ label, name, value, onChange, placeholder, icon, required, rightSymbol, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700">
      {required && <span className="text-red-500">*</span>} {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50 hover:bg-white transition-all"
        placeholder={placeholder}
        required={required}
      />
      {icon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      {rightSymbol && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          <span>{rightSymbol}</span>
        </div>
      )}
    </div>
  </div>
);

// 🔹 Reusable TextAreaField component
const TextAreaField = ({ label, name, value, onChange, placeholder, required }) => (
  <div className="space-y-2 md:col-span-2">
    <label className="text-sm font-semibold text-gray-700">
      {required && <span className="text-red-500">*</span>} {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows="4"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50 hover:bg-white resize-none transition-all"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default AddBus;
