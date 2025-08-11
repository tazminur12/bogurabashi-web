import React, { useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

const EditEservice = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch existing eservice data
  const {
    data: eservice,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["eservice", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/esheba/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Set form values when data is loaded
  useEffect(() => {
    if (eservice) {
      setValue("title", eservice.title);
      setValue("description", eservice.description);
      setValue("category", eservice.category);
      setValue("subCategory", eservice.subCategory);
      setValue("status", eservice.status);
      setValue("priority", eservice.priority);
      setValue("websiteUrl", eservice.websiteUrl);
      setValue("applicationUrl", eservice.applicationUrl);
      setValue("requirements", eservice.requirements);
      setValue("processingTime", eservice.processingTime);
      setValue("fees", eservice.fees);
      setValue("contactInfo", eservice.contactInfo);
      setValue("officeHours", eservice.officeHours);
      setValue("location", eservice.location);
      setValue("documents", eservice.documents);
      setValue("instructions", eservice.instructions);
      setValue("benefits", eservice.benefits);
      setValue("eligibility", eservice.eligibility);
    }
  }, [eservice, setValue]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        status: formData.status,
        priority: formData.priority,
        websiteUrl: formData.websiteUrl,
        applicationUrl: formData.applicationUrl,
        requirements: formData.requirements,
        processingTime: formData.processingTime,
        fees: formData.fees,
        contactInfo: formData.contactInfo,
        officeHours: formData.officeHours,
        location: formData.location,
        documents: formData.documents,
        instructions: formData.instructions,
        benefits: formData.benefits,
        eligibility: formData.eligibility,
        updatedAt: new Date(),
      };

      await axiosSecure.patch(`/esheba/${id}`, payload);

      Swal.fire({
        icon: "success",
        title: "✅ সফল!",
        text: "ই-সেবা সফলভাবে আপডেট হয়েছে!",
        timer: 2000,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["esheba"] });
      queryClient.invalidateQueries({ queryKey: ["eservice", id] });

      setTimeout(() => {
        navigate("/dashboard/eservice-admin");
      }, 2000);
    } catch (error) {
      console.error("Error updating eservice:", error);
      Swal.fire("❌ ত্রুটি", "ই-সেবা আপডেট করতে সমস্যা হয়েছে", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">লোড হচ্ছে...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">তথ্য পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-sm mb-4">ই-সেবা তথ্য লোড করতে সমস্যা হয়েছে</p>
            <Link
              to="/dashboard/eservice-admin"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              ← ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#333] mb-2">✏️ ই-সেবা সম্পাদনা</h1>
          <p className="text-sm text-gray-600">ই-সেবার তথ্য আপডেট করুন</p>
        </div>

        <div className="mb-5">
          <Link
            to="/dashboard/eservice-admin"
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-200 text-sm font-medium"
          >
            ← সব ই-সেবায় ফিরে যান
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          {/* Current Service Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">📋 বর্তমান সেবা তথ্য</h3>
            <div className="text-sm text-blue-700">
              <p><strong>নাম:</strong> {eservice?.title}</p>
              <p><strong>ক্যাটাগরি:</strong> {eservice?.category}</p>
              <p><strong>স্ট্যাটাস:</strong> {eservice?.status}</p>
              <p><strong>আইডি:</strong> {eservice?._id?.slice(-8)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 মৌলিক তথ্য</h3>
              
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 সেবার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="উদাহরণ: জাতীয় পরিচয়পত্র আবেদন, জন্ম নিবন্ধন, পাসপোর্ট আবেদন"
                  {...register("title", { 
                    required: "সেবার নাম আবশ্যক",
                    minLength: {
                      value: 3,
                      message: "সেবার নাম কমপক্ষে ৩ অক্ষর হতে হবে"
                    }
                  })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                    errors.title ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 সেবার বিস্তারিত বিবরণ <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="সেবার বিস্তারিত বিবরণ লিখুন। যেমন: কীভাবে আবেদন করতে হবে, কী কী কাগজপত্র লাগবে, কত দিন সময় লাগবে ইত্যাদি।"
                  {...register("description", { 
                    required: "বিস্তারিত বিবরণ আবশ্যক",
                    minLength: {
                      value: 10,
                      message: "বিস্তারিত বিবরণ কমপক্ষে ১০ অক্ষর হতে হবে"
                    }
                  })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                    errors.description ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Category and Sub-Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📂 মূল ক্যাটাগরি <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("category", { required: "ক্যাটাগরি নির্বাচন আবশ্যক" })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                      errors.category ? "border-red-400" : "border-gray-300"
                    }`}
                  >
                    <option value="">-- ক্যাটাগরি নির্বাচন করুন --</option>
                    <option value="নাগরিক সংক্রান্ত সেবা">নাগরিক সংক্রান্ত সেবা</option>
                    <option value="ডিজিটাল ও ইন্টারনেট ভিত্তিক সেবা">ডিজিটাল ও ইন্টারনেট ভিত্তিক সেবা</option>
                    <option value="আর্থিক ও ব্যাংকিং সেবা">আর্থিক ও ব্যাংকিং সেবা</option>
                    <option value="শিক্ষা সংক্রান্ত সেবা">শিক্ষা সংক্রান্ত সেবা</option>
                    <option value="স্বাস্থ্য সংক্রান্ত সেবা">স্বাস্থ্য সংক্রান্ত সেবা</option>
                    <option value="অন্যান্য গুরুত্বপূর্ণ সেবা">অন্যান্য গুরুত্বপূর্ণ সেবা</option>
                  </select>
                  {errors.category && (
                    <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📁 উপ-ক্যাটাগরি
                  </label>
                  <select
                    {...register("subCategory")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  >
                    <option value="">-- উপ-ক্যাটাগরি নির্বাচন করুন --</option>
                    <option value="জাতীয় পরিচয়পত্র">জাতীয় পরিচয়পত্র</option>
                    <option value="জন্ম নিবন্ধন">জন্ম নিবন্ধন</option>
                    <option value="পাসপোর্ট">পাসপোর্ট</option>
                    <option value="পুলিশ ক্লিয়ারেন্স">পুলিশ ক্লিয়ারেন্স</option>
                    <option value="নাগরিক সনদ">নাগরিক সনদ</option>
                    <option value="রেশন কার্ড">রেশন কার্ড</option>
                    <option value="মোবাইল ব্যাংকিং">মোবাইল ব্যাংকিং</option>
                    <option value="বিল পরিশোধ">বিল পরিশোধ</option>
                    <option value="টিকিট বুকিং">টিকিট বুকিং</option>
                    <option value="ভর্তি আবেদন">ভর্তি আবেদন</option>
                    <option value="রেজাল্ট ও সার্টিফিকেট">রেজাল্ট ও সার্টিফিকেট</option>
                    <option value="ডাক্তারের অ্যাপয়েন্টমেন্ট">ডাক্তারের অ্যাপয়েন্টমেন্ট</option>
                    <option value="ভূমি সংক্রান্ত সেবা">ভূমি সংক্রান্ত সেবা</option>
                    <option value="ব্যবসা লাইসেন্স">ব্যবসা লাইসেন্স</option>
                  </select>
                </div>
              </div>
            </div>

            {/* URLs Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🌐 ওয়েবসাইট লিংক</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌐 মূল ওয়েবসাইট URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.example.gov.bd"
                    {...register("websiteUrl")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 আবেদন লিংক
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.example.gov.bd/apply"
                    {...register("applicationUrl")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Service Details Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ সেবার বিবরণ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⏱️ প্রক্রিয়াকরণ সময়
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: ৭-১৫ কার্যদিবস"
                    {...register("processingTime")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💰 ফি/চার্জ
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: ৫০০ টাকা"
                    {...register("fees")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📋 প্রয়োজনীয় কাগজপত্র
                </label>
                <textarea
                  rows="3"
                  placeholder="প্রয়োজনীয় কাগজপত্রের তালিকা লিখুন। যেমন: জাতীয় পরিচয়পত্র, জন্ম সনদ, পাসপোর্ট সাইজের ছবি ইত্যাদি।"
                  {...register("documents")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📋 যোগ্যতা
                </label>
                <textarea
                  rows="3"
                  placeholder="সেবা গ্রহণের যোগ্যতা লিখুন। যেমন: বয়স, নাগরিকত্ব, শিক্ষাগত যোগ্যতা ইত্যাদি।"
                  {...register("eligibility")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>
            </div>

            {/* Instructions & Benefits Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📖 নির্দেশনা ও সুবিধা</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 আবেদনের নির্দেশনা
                </label>
                <textarea
                  rows="4"
                  placeholder="আবেদন করার ধাপগুলো লিখুন। যেমন: ১. ওয়েবসাইটে যান, ২. ফর্ম পূরণ করুন, ৩. কাগজপত্র আপলোড করুন ইত্যাদি।"
                  {...register("instructions")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ✅ সেবার সুবিধা
                </label>
                <textarea
                  rows="3"
                  placeholder="এই সেবা থেকে কী কী সুবিধা পাওয়া যায় লিখুন।"
                  {...register("benefits")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>
            </div>

            {/* Contact & Location Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📞 যোগাযোগ ও অবস্থান</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📞 যোগাযোগের তথ্য
                  </label>
                  <textarea
                    rows="3"
                    placeholder="ফোন নম্বর, ইমেইল, হেল্পলাইন ইত্যাদি"
                    {...register("contactInfo")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏢 অফিসের সময়
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: রবি-বৃহস্পতি: সকাল ৯টা-বিকাল ৫টা"
                    {...register("officeHours")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 অফিসের অবস্থান
                </label>
                <textarea
                  rows="2"
                  placeholder="অফিসের ঠিকানা লিখুন"
                  {...register("location")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>
            </div>

            {/* Status & Priority Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ সেটিংস</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🟢 স্ট্যাটাস
                  </label>
                  <select
                    {...register("status")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  >
                    <option value="Active">সক্রিয়</option>
                    <option value="Inactive">নিষ্ক্রিয়</option>
                    <option value="Maintenance">রক্ষণাবেক্ষণ</option>
                    <option value="Coming Soon">শীঘ্রই আসছে</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⚡ অগ্রাধিকার
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  >
                    <option value="Normal">সাধারণ</option>
                    <option value="High">উচ্চ</option>
                    <option value="Urgent">জরুরি</option>
                    <option value="Featured">বৈশিষ্ট্যযুক্ত</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  <>
                    💾 আপডেট করুন
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/eservice-admin")}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
              >
                ❌ বাতিল
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 ই-সেবা ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default EditEservice; 