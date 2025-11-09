import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";

const EditNews = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch news data
  const {
    data: newsItem,
    isLoading,
  } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/news/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (newsItem) {
      setValue("title", newsItem.title);
      setValue("content", newsItem.content);
      setValue("category", newsItem.category || "");
      setValue("author", newsItem.author || "");
      setValue("publishDate", newsItem.publishDate ? new Date(newsItem.publishDate).toISOString().slice(0, 16) : "");
      setValue("status", newsItem.status || "Draft");
      setValue("tags", newsItem.tags ? newsItem.tags.join(", ") : "");
    }
  }, [newsItem, setValue]);

  const onSubmit = async (formData) => {
    try {
      // Prepare tags array
      const tagsArray = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];
      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        publishDate: formData.publishDate ? new Date(formData.publishDate) : new Date(),
        status: formData.status || "Draft",
        tags: tagsArray,
      };
      await axiosSecure.patch(`/news/${id}`, payload);
      Swal.fire("✅ সফল", "নিউজ আপডেট হয়েছে!", "success");
      queryClient.invalidateQueries({ queryKey: ["news"] });
      setTimeout(() => {
        navigate("/dashboard/news-admin");
      }, 1200);
    } catch (error) {
      console.error(error);
      Swal.fire("❌ ত্রুটি", "নিউজ আপডেট করতে সমস্যা হয়েছে", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-base text-gray-600 font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-[#333] mb-1">✏️ নিউজ এডিট করুন</h1>
          <p className="text-sm text-gray-600">নিউজের তথ্য পরিবর্তন করুন</p>
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
                {...register("content", { required: "বিবরণ আবশ্যক" })}
                className={`w-full border text-sm px-4 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                  errors.content ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.content && (
                <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
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
                <option value="নির্বাচন">নির্বাচন</option>
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
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-md transition duration-200"
              >
                ✅ সংরক্ষণ করুন
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/news-admin")}
                className="border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm px-5 py-2 rounded-md"
              >
                ❌ বাতিল
              </button>
            </div>
          </form>
        </div>
        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 আপনার নিউজ সাইট | Developed by YourName
        </div>
      </div>
    </div>
  );
};

export default EditNews;