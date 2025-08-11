import React, { useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { FaMapMarkerAlt, FaBuilding, FaPhone, FaEnvelope, FaGlobe, FaCreditCard, FaClock, FaTint, FaFire } from "react-icons/fa";

const EditWaterOffice = () => {
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

  // Fetch existing office data
  const {
    data: office,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["water-office", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/water-offices/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Set form values when data is loaded
  useEffect(() => {
    if (office) {
      setValue("name", office.name);
      setValue("type", office.type);
      setValue("address", office.address);
      setValue("phone", office.phone);
      setValue("email", office.email);
      setValue("website", office.website);
      setValue("billPaymentInfo", office.billPaymentInfo);
      setValue("officeHours", office.officeHours);
      setValue("managerName", office.managerName);
      setValue("managerPhone", office.managerPhone);
      setValue("emergencyContact", office.emergencyContact);
      setValue("services", office.services);
      setValue("paymentMethods", office.paymentMethods);
      setValue("status", office.status);
    }
  }, [office, setValue]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        billPaymentInfo: formData.billPaymentInfo,
        officeHours: formData.officeHours,
        managerName: formData.managerName,
        managerPhone: formData.managerPhone,
        emergencyContact: formData.emergencyContact,
        services: formData.services,
        paymentMethods: formData.paymentMethods,
        status: formData.status,
        updatedAt: new Date(),
      };

      await axiosSecure.patch(`/water-offices/${id}`, payload);

      Swal.fire({
        icon: "success",
        title: "✅ সফল!",
        text: "অফিস সফলভাবে আপডেট হয়েছে!",
        timer: 2000,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["water-offices"] });
      queryClient.invalidateQueries({ queryKey: ["water-office", id] });

      setTimeout(() => {
        navigate("/dashboard/water-admin");
      }, 2000);
    } catch (error) {
      console.error("Error updating office:", error);
      Swal.fire("❌ ত্রুটি", "অফিস আপডেট করতে সমস্যা হয়েছে", "error");
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

  if (error || !office) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">অফিস পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-sm mb-4">অনুরোধকৃত অফিস পাওয়া যায়নি।</p>
            <Link
              to="/dashboard/water-admin"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              ← সব অফিসে ফিরে যান
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
          <h1 className="text-3xl font-bold text-[#333] mb-2">✏️ গ্যাস ও পানি অফিস সম্পাদনা</h1>
          <p className="text-sm text-gray-600">অফিসের তথ্য আপডেট করুন</p>
        </div>

        <div className="mb-5">
          <Link
            to="/dashboard/water-admin"
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-200 text-sm font-medium"
          >
            ← সব অফিসে ফিরে যান
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          {/* Current Office Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">📋 বর্তমান অফিস তথ্য</h3>
            <div className="text-sm text-blue-700">
              <p><strong>নাম:</strong> {office?.name}</p>
              <p><strong>ধরন:</strong> {office?.type}</p>
              <p><strong>ঠিকানা:</strong> {office?.address}</p>
              <p><strong>স্ট্যাটাস:</strong> {office?.status}</p>
              <p><strong>আইডি:</strong> {office?._id?.slice(-8)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 মৌলিক তথ্য</h3>
              
              {/* Office Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏢 অফিস নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="উদাহরণ: বগুড়া ওয়াসা অফিস, টিজিডিসিএল অফিস"
                  {...register("name", { 
                    required: "অফিস নাম আবশ্যক",
                    minLength: {
                      value: 3,
                      message: "অফিস নাম কমপক্ষে ৩ অক্ষর হতে হবে"
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

              {/* Office Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏢 অফিসের ধরন <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("type", { required: "অফিসের ধরন নির্বাচন আবশ্যক" })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                    errors.type ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">-- অফিসের ধরন নির্বাচন করুন --</option>
                  <option value="Water">পানি অফিস</option>
                  <option value="Gas">গ্যাস অফিস</option>
                  <option value="Both">পানি ও গ্যাস উভয়</option>
                </select>
                {errors.type && (
                  <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 অফিসের ঠিকানা <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="অফিসের সম্পূর্ণ ঠিকানা লিখুন"
                  {...register("address", { required: "অফিসের ঠিকানা আবশ্যক" })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                    errors.address ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📞 যোগাযোগের তথ্য</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📞 ফোন নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="উদাহরণ: 051-123456"
                    {...register("phone", { 
                      required: "ফোন নম্বর আবশ্যক",
                      pattern: {
                        value: /^[0-9\-\+\(\)\s]+$/,
                        message: "সঠিক ফোন নম্বর দিন"
                      }
                    })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 ${
                      errors.phone ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📧 ইমেইল
                  </label>
                  <input
                    type="email"
                    placeholder="উদাহরণ: office@example.com"
                    {...register("email")}
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

            {/* Bill Payment Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💳 বিল পেমেন্ট তথ্য</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💳 বিল পেমেন্টের তথ্য
                </label>
                <textarea
                  rows="3"
                  placeholder="বিল পেমেন্টের পদ্ধতি, সময়সূচী, এবং অন্যান্য গুরুত্বপূর্ণ তথ্য লিখুন"
                  {...register("billPaymentInfo")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💰 পেমেন্ট পদ্ধতি
                  </label>
                  <select
                    {...register("paymentMethods")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  >
                    <option value="">-- পেমেন্ট পদ্ধতি নির্বাচন করুন --</option>
                    <option value="Cash">নগদ</option>
                    <option value="Card">কার্ড</option>
                    <option value="Mobile Banking">মোবাইল ব্যাংকিং</option>
                    <option value="Internet Banking">ইন্টারনেট ব্যাংকিং</option>
                    <option value="All">সব পদ্ধতি</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🕐 অফিস সময়
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: সকাল ৯টা - বিকাল ৫টা"
                    {...register("officeHours")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Management Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 ব্যবস্থাপনা</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👨‍💼 ম্যানেজারের নাম
                  </label>
                  <input
                    type="text"
                    placeholder="ম্যানেজারের পূর্ণ নাম"
                    {...register("managerName")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📞 ম্যানেজারের ফোন
                  </label>
                  <input
                    type="tel"
                    placeholder="উদাহরণ: 01712345678"
                    {...register("managerPhone")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚨 জরুরি যোগাযোগ
                </label>
                <input
                  type="tel"
                  placeholder="জরুরি ফোন নম্বর"
                  {...register("emergencyContact")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>
            </div>

            {/* Services Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔧 সেবাসমূহ</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🛠️ প্রদত্ত সেবাসমূহ
                </label>
                <textarea
                  rows="3"
                  placeholder="অফিসে প্রদত্ত সেবাসমূহের তালিকা লিখুন"
                  {...register("services")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
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
                  <option value="Maintenance">রক্ষণাবেক্ষণ</option>
                </select>
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
                onClick={() => navigate("/dashboard/water-admin")}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
              >
                ❌ বাতিল
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 গ্যাস ও পানি অফিস ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default EditWaterOffice; 