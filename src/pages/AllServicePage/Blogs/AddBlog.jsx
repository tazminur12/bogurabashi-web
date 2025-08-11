import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaUpload, FaTimes, FaArrowLeft, FaSave } from "react-icons/fa";

const AddBlog = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [blogData, setBlogData] = useState({
    title: "",
    author: "",
    content: "",
    tags: "",
    category: "",
    image: "",
    summary: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  // ImgBB API Key from environment variables
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire("ত্রুটি!", "শুধুমাত্র ছবি আপলোড করা যাবে", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("ত্রুটি!", "ছবির আকার ৫ মেগাবাইটের কম হতে হবে", "error");
      return;
    }

    // Check if API key is available
    if (!imgbbApiKey) {
      Swal.fire("ত্রুটি!", "ImgBB API কী সেট করা হয়নি। দয়া করে .env ফাইলে VITE_IMGBB_API_KEY সেট করুন।", "error");
      return;
    }

    setImageLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Upload to ImgBB
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setBlogData((prev) => ({ ...prev, image: data.data.url }));
        setImagePreview(data.data.url);
        Swal.fire("✅ সফল!", "ছবি আপলোড হয়েছে", "success");
      } else {
        throw new Error(data.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Swal.fire("❌ ত্রুটি", "ছবি আপলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।", "error");
    } finally {
      setImageLoading(false);
    }
  };

  // Remove image
  const removeImage = () => {
    setBlogData((prev) => ({ ...prev, image: "" }));
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!blogData.title || !blogData.author || !blogData.content) {
      return Swal.fire("সতর্কতা", "শিরোনাম, লেখক এবং বিষয়বস্তু অবশ্যই পূরণ করতে হবে", "warning");
    }

    setLoading(true);

    try {
      // Convert tags string to array
      const tagsArray = blogData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload = {
        title: blogData.title,
        author: blogData.author,
        content: blogData.content,
        summary: blogData.summary,
        tags: tagsArray,
        category: blogData.category,
        image: blogData.image,
        createdAt: new Date(),
      };

      await axiosSecure.post("/blogs", payload);

      Swal.fire({
        title: "✅ সফল!",
        text: "নতুন ব্লগ যোগ হয়েছে",
        icon: "success",
        confirmButtonText: "ঠিক আছে",
      }).then(() => {
        navigate("/blogs");
      });
    } catch (error) {
      console.error("Blog creation error:", error);
      Swal.fire("❌ ত্রুটি", "ব্লগ যোগ করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/blogs")}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">নতুন ব্লগ যোগ করুন</h1>
                <p className="text-sm text-gray-600">আপনার নতুন ব্লগ পোস্ট তৈরি করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">ব্লগ তথ্য</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  শিরোনাম *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="ব্লগের শিরোনাম লিখুন"
                  value={blogData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  লেখকের নাম *
                </label>
                <input
                  type="text"
                  name="author"
                  placeholder="লেখকের নাম লিখুন"
                  value={blogData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  বিভাগ
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="ব্লগের বিভাগ (যেমন: প্রযুক্তি, স্বাস্থ্য, শিক্ষা)"
                  value={blogData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ট্যাগ
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="ট্যাগ (কমা দিয়ে আলাদা করুন)"
                  value={blogData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                সংক্ষিপ্ত বিবরণ
              </label>
              <textarea
                name="summary"
                placeholder="ব্লগের সংক্ষিপ্ত বিবরণ লিখুন (অপশনাল)"
                value={blogData.summary}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ফিচার ইমেজ
              </label>
              <div className="space-y-4">
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={imageLoading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      {imageLoading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      ) : (
                        <FaUpload className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm text-gray-600">
                          {imageLoading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করতে ক্লিক করুন"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF সর্বোচ্চ ৫ মেগাবাইট
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                বিষয়বস্তু *
              </label>
              <textarea
                name="content"
                placeholder="ব্লগের বিষয়বস্তু লিখুন..."
                value={blogData.content}
                onChange={handleChange}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/blogs")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    সেভ হচ্ছে...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    ব্লগ প্রকাশ করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Important Note */}
        {!imgbbApiKey && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  ImgBB API কী সেট করা হয়নি
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>ছবি আপলোড করার জন্য আপনার .env ফাইলে VITE_IMGBB_API_KEY সেট করতে হবে।</p>
                  <p className="mt-1">উদাহরণ: VITE_IMGBB_API_KEY=your_imgbb_api_key_here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBlog; 