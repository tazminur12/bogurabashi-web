import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaAmbulance, FaMapMarkerAlt, FaPhone, FaExclamationTriangle, FaPlus, FaTimes, FaUpload, FaCheck, FaSpinner } from "react-icons/fa";

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddAmbulance = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    serviceName: "",
    area: "",
    type: "",
    availability: false,
    contact: "",
    emergencyNumber: "",
    features: [],
    imageUrl: "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle features add
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    setImgUploading(true);

    const formDataImg = new FormData();
    formDataImg.append("image", imageFile);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formDataImg,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.data.url }));
        Swal.fire("সফল!", "ছবি সফলভাবে আপলোড হয়েছে।", "success");
      } else {
        Swal.fire("ত্রুটি!", "ছবি আপলোড করতে সমস্যা হয়েছে।", "error");
      }
    } catch (error) {
      Swal.fire("ত্রুটি!", "ছবি আপলোড করতে সমস্যা হয়েছে।", "error");
    } finally {
      setImgUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      Swal.fire("দ্রষ্টব্য!", "একটি ছবি আপলোড করুন।", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.post("/ambulances", formData);
      if (res.data.insertedId) {
        Swal.fire("সফল!", "নতুন অ্যাম্বুলেন্স সফলভাবে যোগ হয়েছে।", "success");
        navigate("/dashboard/adminAmbulance");
      }
    } catch (error) {
      Swal.fire("ত্রুটি!", "অ্যাম্বুলেন্স যোগ করতে সমস্যা হয়েছে।", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6">
            <FaAmbulance className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            নতুন অ্যাম্বুলেন্স যোগ করুন
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            জরুরী চিকিৎসা সেবার জন্য নতুন অ্যাম্বুলেন্স সার্ভিস যোগ করুন
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-blue-600 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <FaAmbulance className="mr-3" />
              অ্যাম্বুলেন্স তথ্য
            </h2>
            <p className="text-red-100 mt-2">সব তথ্য সঠিকভাবে পূরণ করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaAmbulance className="mr-2 text-red-500" />
                  সার্ভিসের নাম
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                  placeholder="যেমন: বগুড়া এ্যাম্বুলেন্স সার্ভিস"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300 text-lg"
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  এলাকা
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  placeholder="যেমন: সাতমাথা"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaAmbulance className="mr-2 text-green-500" />
                  ধরণ
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  placeholder="যেমন: ICU / নরমাল"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-lg"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaPhone className="mr-2 text-purple-500" />
                  যোগাযোগ নম্বর
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="যেমন: 017XXXXXXXX"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 text-lg"
                />
              </div>

              {/* Emergency Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaExclamationTriangle className="mr-2 text-red-500" />
                  জরুরি নম্বর
                </label>
                <input
                  type="text"
                  name="emergencyNumber"
                  value={formData.emergencyNumber}
                  onChange={handleChange}
                  required
                  placeholder="যেমন: 018XXXXXXXX"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300 text-lg"
                />
              </div>

              {/* Availability */}
              <div className="md:col-span-2">
                <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <input
                    type="checkbox"
                    name="availability"
                    id="availability"
                    checked={formData.availability}
                    onChange={handleChange}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="availability" className="ml-3 text-lg font-semibold text-gray-700">
                    বর্তমানে সার্ভিস প্রস্তুত
                  </label>
                </div>
              </div>

              {/* Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaPlus className="mr-2 text-indigo-500" />
                  সুবিধাসমূহ
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="যেমন: অক্সিজেন, স্ট্রেচার"
                    className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 text-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    যোগ করুন
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center border border-indigo-200"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FaUpload className="mr-2 text-orange-500" />
                  ছবি আপলোড
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imgUploading}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <FaUpload className="mx-auto text-3xl text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-2">
                      {imgUploading ? "ছবি আপলোড হচ্ছে..." : "ছবি নির্বাচন করুন বা এখানে ড্রপ করুন"}
                    </p>
                    {imgUploading && (
                      <div className="flex items-center justify-center">
                        <FaSpinner className="animate-spin text-orange-500 mr-2" />
                        <span className="text-orange-600">আপলোড হচ্ছে...</span>
                      </div>
                    )}
                  </label>
                </div>
                {formData.imageUrl && (
                  <div className="mt-4 text-center">
                    <img
                      src={formData.imageUrl}
                      alt="Uploaded"
                      className="mx-auto w-48 h-32 object-cover rounded-xl shadow-lg border-4 border-green-200"
                    />
                    <p className="text-green-600 mt-2 flex items-center justify-center">
                      <FaCheck className="mr-2" />
                      ছবি সফলভাবে আপলোড হয়েছে
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={loading || imgUploading}
                className={`${
                  loading || imgUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105"
                } text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 text-lg shadow-lg flex items-center mx-auto`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    যোগ হচ্ছে...
                  </>
                ) : (
                  <>
                    <FaAmbulance className="mr-3" />
                    অ্যাম্বুলেন্স যোগ করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-red-600">দ্রষ্টব্য:</span> সব তথ্য সঠিকভাবে পূরণ করুন। 
            জরুরী চিকিৎসা সেবার জন্য অ্যাম্বুলেন্স সার্ভিস গুরুত্বপূর্ণ।
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddAmbulance;
