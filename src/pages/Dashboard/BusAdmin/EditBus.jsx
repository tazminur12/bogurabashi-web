import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const EditBus = () => {
  const { id } = useParams();
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

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bus data
  useEffect(() => {
    const fetchBus = async () => {
      if (!id) {
        setError("বাসের আইডি পাওয়া যায়নি");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await axiosSecure.get(`/buses/${id}`);
        const bus = res.data;
        
        setFormData({
          counterName: bus.counterName || "",
          busName: bus.busName || "",
          route: bus.route || "",
          contactNumber: bus.contactNumber || "",
          operatorName: bus.operatorName || "",
          busType: bus.busType || "",
          fare: bus.fare || "",
          district: bus.district || "bogura",
          description: bus.description || "",
          facilities: bus.facilities || "",
        });
        
        setError(null);
      } catch (error) {
        console.error("Error fetching bus:", error);
        setError("বাসের তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBus();
  }, [id, axiosSecure]);

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
      setIsUpdating(true);
      const res = await axiosSecure.put(`/buses/${id}`, formData);
      
      if (res.data.modifiedCount > 0) {
        Swal.fire("সফল", "বাসের তথ্য সফলভাবে আপডেট হয়েছে!", "success");
        navigate("/dashboard/bus-admin");
      } else {
        Swal.fire("সতর্কতা", "কোনো পরিবর্তন করা হয়নি", "info");
      }
    } catch (error) {
      console.error("Error updating bus:", error);
      Swal.fire("ত্রুটি", "বাসের তথ্য আপডেট করা যায়নি", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-4">
            <FiTruck />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">বাসের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !formData.busName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl mb-4">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">বাস পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-6">{error || "এই বাসটি পাওয়া যায়নি"}</p>
          <button 
            onClick={() => navigate("/dashboard/bus-admin")}
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            <FiNavigation className="mr-2 rotate-180" />
            বাস তালিকায় ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center text-white text-2xl">
            <FiTruck />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">বাসের তথ্য সম্পাদনা করুন</h1>
          <p className="text-gray-600">বগুড়া জেলার বাস কাউন্টারের তথ্য আপডেট করুন</p>
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

          {/* Facilities */}
          <TextAreaField
            label="সুবিধাসমূহ"
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
            placeholder="যেমন: এসি, ওয়াইফাই, খাবার সেবা..."
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
              disabled={isUpdating}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center text-white transition-all duration-200 ${isUpdating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path fill="white" d="M4 12a8 8 0 018-8V0C5 0 0 5 0 12h4z" />
                  </svg>
                  আপডেট হচ্ছে...
                </>
              ) : (
                <>
                  <FiTruck className="mr-2" />
                  আপডেট করুন
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

export default EditBus; 