import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaBuilding, FaCode, FaPhone, FaEnvelope, FaGlobe, FaUsers, FaCalendarAlt } from "react-icons/fa";

const AddUnion = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        upazila: formData.upazila,
        code: formData.code,
        status: formData.status || "Active",
        chairmanName: formData.chairmanName,
        chairmanPhone: formData.chairmanPhone,
        secretaryName: formData.secretaryName,
        secretaryPhone: formData.secretaryPhone,
        officeAddress: formData.officeAddress,
        officePhone: formData.officePhone,
        officeEmail: formData.officeEmail,
        website: formData.website,
        population: formData.population,
        area: formData.area,
        wardCount: formData.wardCount,
        villageCount: formData.villageCount,
        establishmentDate: formData.establishmentDate,
        createdAt: new Date(),
      };

      await axiosSecure.post("/unions", payload);

      Swal.fire({
        icon: "success",
        title: "✅ সফল!",
        text: "নতুন ইউনিয়ন সফলভাবে যোগ হয়েছে!",
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
      setTimeout(() => {
        navigate("/dashboard/union-digital");
      }, 2000);
    } catch (error) {
      console.error("Error adding union:", error);
      Swal.fire("❌ ত্রুটি", "ইউনিয়ন যোগ করতে সমস্যা হয়েছে", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#333] mb-2">🏛️ নতুন ইউনিয়ন যোগ করুন</h1>
          <p className="text-sm text-gray-600">বগুড়া জেলার ইউনিয়ন পরিষদের তথ্য সাবমিট করুন</p>
        </div>

        <div className="mb-5">
          <Link
            to="/dashboard/union-digital"
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-200 text-sm font-medium"
          >
            ← সব ইউনিয়নে ফিরে যান
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 মৌলিক তথ্য</h3>
              
              {/* Union Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏛️ ইউনিয়ন নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="উদাহরণ: বগুড়া সদর ইউনিয়ন, শেরপুর ইউনিয়ন"
                  {...register("name", { 
                    required: "ইউনিয়ন নাম আবশ্যক",
                    minLength: {
                      value: 3,
                      message: "ইউনিয়ন নাম কমপক্ষে ৩ অক্ষর হতে হবে"
                    }
                  })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                    errors.name ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 ইউনিয়নের বিবরণ
                </label>
                <textarea
                  rows="3"
                  placeholder="ইউনিয়নের সংক্ষিপ্ত বিবরণ লিখুন। যেমন: অবস্থান, বিশেষত্ব, ইতিহাস ইত্যাদি।"
                  {...register("description")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>

              {/* Upazila and Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 উপজেলা <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("upazila", { required: "উপজেলা নির্বাচন আবশ্যক" })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                      errors.upazila ? "border-red-400" : "border-gray-300"
                    }`}
                  >
                    <option value="">-- উপজেলা নির্বাচন করুন --</option>
                    <option value="বগুড়া সদর">বগুড়া সদর</option>
                    <option value="শেরপুর">শেরপুর</option>
                    <option value="ধুনট">ধুনট</option>
                    <option value="সারিয়াকান্দি">সারিয়াকান্দি</option>
                    <option value="শিবগঞ্জ">শিবগঞ্জ</option>
                    <option value="কাহালু">কাহালু</option>
                    <option value="নন্দীগ্রাম">নন্দীগ্রাম</option>
                    <option value="আদমদীঘি">আদমদীঘি</option>
                    <option value="দুপচাঁচিয়া">দুপচাঁচিয়া</option>
                    <option value="গাবতলী">গাবতলী</option>
                    <option value="সোনাতলা">সোনাতলা</option>
                  </select>
                  {errors.upazila && (
                    <p className="text-xs text-red-500 mt-1">{errors.upazila.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔢 ইউনিয়ন কোড <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: 123456"
                    {...register("code", { 
                      required: "ইউনিয়ন কোড আবশ্যক",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "শুধুমাত্র সংখ্যা ব্যবহার করুন"
                      }
                    })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                      errors.code ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.code && (
                    <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Leadership Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 নেতৃত্ব</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👨‍💼 চেয়ারম্যানের নাম
                  </label>
                  <input
                    type="text"
                    placeholder="চেয়ারম্যানের পূর্ণ নাম"
                    {...register("chairmanName")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📞 চেয়ারম্যানের ফোন
                  </label>
                  <input
                    type="tel"
                    placeholder="উদাহরণ: 01712345678"
                    {...register("chairmanPhone")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👨‍💼 সচিবের নাম
                  </label>
                  <input
                    type="text"
                    placeholder="সচিবের পূর্ণ নাম"
                    {...register("secretaryName")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📞 সচিবের ফোন
                  </label>
                  <input
                    type="tel"
                    placeholder="উদাহরণ: 01712345678"
                    {...register("secretaryPhone")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Office Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🏢 অফিসের তথ্য</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 অফিসের ঠিকানা
                </label>
                <textarea
                  rows="3"
                  placeholder="ইউনিয়ন পরিষদ অফিসের সম্পূর্ণ ঠিকানা"
                  {...register("officeAddress")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📞 অফিস ফোন
                  </label>
                  <input
                    type="tel"
                    placeholder="উদাহরণ: 051-123456"
                    {...register("officePhone")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📧 অফিস ইমেইল
                  </label>
                  <input
                    type="email"
                    placeholder="উদাহরণ: union@example.com"
                    {...register("officeEmail")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌐 ওয়েবসাইট
                </label>
                <input
                  type="url"
                  placeholder="https://www.example.com"
                  {...register("website")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>
            </div>

            {/* Demographics Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 জনসংখ্যা ও ভূগোল</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👥 জনসংখ্যা
                  </label>
                  <input
                    type="number"
                    placeholder="উদাহরণ: 25000"
                    {...register("population")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📏 আয়তন (বর্গ কিমি)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="উদাহরণ: 15.5"
                    {...register("area")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏘️ ওয়ার্ড সংখ্যা
                  </label>
                  <input
                    type="number"
                    placeholder="উদাহরণ: 9"
                    {...register("wardCount")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏘️ গ্রাম সংখ্যা
                  </label>
                  <input
                    type="number"
                    placeholder="উদাহরণ: 25"
                    {...register("villageCount")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 প্রতিষ্ঠার তারিখ
                </label>
                <input
                  type="date"
                  {...register("establishmentDate")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>
            </div>

            {/* Status Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ সেটিংস</h3>
              
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
                  <option value="Pending">অপেক্ষমান</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    যোগ হচ্ছে...
                  </>
                ) : (
                  <>
                    ➕ ইউনিয়ন যোগ করুন
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
              >
                🔄 রিসেট
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 ইউনিয়ন ডিজিটাল ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default AddUnion; 