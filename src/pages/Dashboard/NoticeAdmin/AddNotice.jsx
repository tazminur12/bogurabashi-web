import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaArrowLeft, FaSave, FaTimes, FaBell, FaCalendarAlt, FaFileAlt } from "react-icons/fa";

const AddNotice = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm();

  const watchPublishDate = watch("publishDate");

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Validate publish date
      if (data.publishDate) {
        const publishDate = new Date(data.publishDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (publishDate < today) {
          Swal.fire("ত্রুটি!", "প্রকাশের তারিখ আজকের তারিখের আগে হতে পারে না!", "error");
          return;
        }
      }

      await axiosSecure.post("/notices", data);
      
      Swal.fire({
        title: "সফল!",
        text: "নোটিশ সফলভাবে যোগ করা হয়েছে!",
        icon: "success",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/dashboard/notice");
      });
      
      reset();
    } catch (error) {
      console.error("নোটিশ যোগ করতে সমস্যা হয়েছে:", error);
      Swal.fire("ত্রুটি!", "নোটিশ যোগ করতে সমস্যা হয়েছে!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "সকল তথ্য মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, বাতিল করুন",
      cancelButtonText: "না, ফিরে যান",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/dashboard/notice");
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/dashboard/notice")}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">নতুন নোটিশ যোগ করুন</h1>
              <p className="text-gray-600 mt-1">নতুন নোটিশের তথ্য দিন</p>
            </div>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <FaBell className="text-blue-600 text-xl" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaFileAlt className="mr-2 text-blue-600" />
            নোটিশের তথ্য
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              নোটিশের শিরোনাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("title", {
                required: "শিরোনাম আবশ্যক",
                minLength: {
                  value: 5,
                  message: "শিরোনাম কমপক্ষে ৫ অক্ষরের হতে হবে"
                },
                maxLength: {
                  value: 200,
                  message: "শিরোনাম সর্বোচ্চ ২০০ অক্ষরের হতে পারে"
                }
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="নোটিশের শিরোনাম লিখুন..."
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              নোটিশের বিবরণ <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description", {
                required: "বিবরণ আবশ্যক",
                minLength: {
                  value: 10,
                  message: "বিবরণ কমপক্ষে ১০ অক্ষরের হতে হবে"
                },
                maxLength: {
                  value: 2000,
                  message: "বিবরণ সর্বোচ্চ ২০০০ অক্ষরের হতে পারে"
                }
              })}
              rows={8}
              className={`w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <FaTimes className="mr-1" />
                {errors.description.message}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              {watch("description")?.length || 0}/2000 অক্ষর
            </p>
          </div>

          {/* Publish Date Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              প্রকাশের তারিখ
            </label>
            <div className="relative">
              <input
                type="date"
                {...register("publishDate")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                min={new Date().toISOString().split('T')[0]}
              />
              <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              যদি তারিখ না দেওয়া হয়, তাহলে নোটিশ এখনই প্রকাশিত হবে
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  নোটিশ সংরক্ষণ করুন
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <FaTimes className="mr-2" />
              বাতিল করুন
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      {watch("title") || watch("description") ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">পূর্বরূপ</h3>
          </div>
          <div className="p-6">
            {watch("title") && (
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                {watch("title")}
              </h4>
            )}
            {watch("description") && (
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {watch("description")}
              </p>
            )}
            {watch("publishDate") && (
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <FaCalendarAlt className="mr-2" />
                <span>
                  প্রকাশের তারিখ: {new Date(watch("publishDate")).toLocaleDateString('bn-BD')}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AddNotice; 