import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const AddNews = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  // Image upload handler to ImgBB
  const uploadImageToImgBB = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setIsUploading(false);

      if (data.success) {
        return data.data.url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch {
      setIsUploading(false);
      Swal.fire("Error", "ছবি আপলোডে সমস্যা হয়েছে!", "error");
      return null;
    }
  };

  const onSubmit = async (formData) => {
    try {
      let imageUrl = "";

      if (formData.image && formData.image.length > 0) {
        const uploadedUrl = await uploadImageToImgBB(formData.image[0]);
        if (!uploadedUrl) {
          setError("image", {
            type: "manual",
            message: "ছবি আপলোড ব্যর্থ হয়েছে",
          });
          return;
        }
        imageUrl = uploadedUrl;
      }

      // Prepare tags array (comma separated string to array)
      const tagsArray = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      // Prepare payload
      const payload = {
        title: formData.title,
        content: formData.content,
        imageUrl,
        category: formData.category,
        author: formData.author,
        publishDate: formData.publishDate ? new Date(formData.publishDate) : new Date(),
        status: formData.status || "Draft",
        tags: tagsArray,
      };

      await axiosSecure.post("/news", payload);

      Swal.fire("✅ সফল", "নতুন নিউজ যুক্ত হয়েছে!", "success");
      reset();
      queryClient.invalidateQueries({ queryKey: ["news"] });

      setTimeout(() => {
        navigate("/dashboard/news-admin");
      }, 1200);
    } catch (error) {
      console.error(error);
      Swal.fire("❌ ত্রুটি", "নিউজ যোগ করতে সমস্যা হয়েছে", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#333] mb-1">📰 নিউজ সংযোজন ফর্ম</h1>
          <p className="text-sm text-gray-600">আপনার সংবাদের তথ্য সাবমিট করুন</p>
        </div>

        <div className="mb-5">
          <Link
            to="/dashboard/news-admin"
            className="inline-block px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-200 text-sm font-medium"
          >
            ← সব নিউজে ফিরে যান
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📝 নিউজের শিরোনাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="উদাহরণ: গোবিন্দগঞ্জে নতুন হাসপাতাল উদ্বোধন"
                {...register("title", { required: "শিরোনাম আবশ্যক" })}
                className={`w-full border text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  errors.title ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📄 বিস্তারিত বিবরণ <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="7"
                placeholder="নিউজের বিস্তারিত লিখুন, যেমন কবে ঘটেছে, কে ছিল, কী ঘটেছে ইত্যাদি।"
                {...register("content", { required: "বিবরণ আবশ্যক" })}
                className={`w-full border text-sm px-4 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  errors.content ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.content && (
                <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🖼️ ছবি আপলোড (ঐচ্ছিক)
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-100 file:text-blue-700
                  hover:file:bg-blue-200
                  cursor-pointer"
              />
              {errors.image && (
                <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>
              )}
              {isUploading && (
                <p className="text-xs text-blue-600 mt-1">ছবি আপলোড হচ্ছে, দয়া করে অপেক্ষা করুন...</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📂 ক্যাটাগরি <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", { required: "ক্যাটাগরি নির্বাচন আবশ্যক" })}
                className={`w-full border text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  errors.category ? "border-red-400" : "border-gray-300"
                }`}
              >
                <option value="">-- ক্যাটাগরি নির্বাচন করুন --</option>
                <option value="রাজনীতি">রাজনীতি</option>
                <option value="খেলাধুলা">খেলাধুলা</option>
                <option value="প্রযুক্তি">প্রযুক্তি</option>
                <option value="বিনোদন">বিনোদন</option>
                <option value="স্বাস্থ্য">স্বাস্থ্য</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ✍️ লেখকের নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="লেখকের নাম লিখুন"
                {...register("author", { required: "লেখকের নাম আবশ্যক" })}
                className={`w-full border text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  errors.author ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.author && (
                <p className="text-xs text-red-500 mt-1">{errors.author.message}</p>
              )}
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🗓️ প্রকাশের তারিখ ও সময়
              </label>
              <input
                type="datetime-local"
                {...register("publishDate")}
                className="w-full border text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-gray-500 mt-1">যদি না দেন, তাহলে এখনই হবে</p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🏷️ ট্যাগস (কমা দিয়ে আলাদা করুন)
              </label>
              <input
                type="text"
                placeholder="রাজনীতি, নির্বাচন, ঢাকা"
                {...register("tags")}
                className="w-full border text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                স্ট্যাটাস
              </label>
              <select
                {...register("status")}
                className="w-full border text-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                defaultValue="Draft"
              >
                <option value="Draft">ড্রাফট</option>
                <option value="Published">প্রকাশিত</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✅ সংরক্ষণ করুন
              </button>
              <button
                type="button"
                onClick={() => reset()}
                disabled={isUploading}
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm px-5 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 রিসেট
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-gray-500 text-xs">
          © 2025 আপনার নিউজ সাইট | Developed by YourName
        </div>
      </div>
    </div>
  );
};

export default AddNews;
