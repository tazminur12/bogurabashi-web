import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaGlobe, FaClock, FaUsers, FaMoneyBillWave, FaImage, FaInfoCircle } from "react-icons/fa";

const AddEvent = () => {
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
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        organizer: formData.organizer,
        organizerPhone: formData.organizerPhone,
        organizerEmail: formData.organizerEmail,
        organizerWebsite: formData.organizerWebsite,
        capacity: formData.capacity,
        entryFee: formData.entryFee,
        isFree: formData.isFree,
        targetAudience: formData.targetAudience,
        highlights: formData.highlights,
        requirements: formData.requirements,
        contactInfo: formData.contactInfo,
        socialMedia: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          twitter: formData.twitter
        },
        status: formData.status || "Upcoming",
        locationDetails: {
          address: formData.address,
          area: formData.area,
          landmark: formData.landmark,
          city: "বগুড়া",
          district: "বগুড়া",
          division: "রাজশাহী"
        },
        createdAt: new Date(),
      };

      await axiosSecure.post("/events", payload);

      Swal.fire({
        icon: "success",
        title: "✅ সফল!",
        text: "নতুন ইভেন্ট সফলভাবে যোগ হয়েছে!",
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
      setTimeout(() => {
        navigate("/dashboard/event-admin");
      }, 2000);
    } catch (error) {
      console.error("Error adding event:", error);
      Swal.fire("❌ ত্রুটি", "ইভেন্ট যোগ করতে সমস্যা হয়েছে", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#333] mb-2">📅 নতুন ইভেন্ট যোগ করুন</h1>
          <p className="text-sm text-gray-600">বগুড়া জেলার ইভেন্টের তথ্য সাবমিট করুন</p>
        </div>

        <div className="mb-5">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-200 text-sm font-medium"
          >
            ← সব ইভেন্টে ফিরে যান
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 মৌলিক তথ্য</h3>
              
              {/* Event Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 ইভেন্টের শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="উদাহরণ: বগুড়া সাহিত্য উৎসব ২০২৫, বগুড়া ক্রিকেট লিগ"
                  {...register("title", { 
                    required: "ইভেন্টের শিরোনাম আবশ্যক",
                    minLength: {
                      value: 5,
                      message: "শিরোনাম কমপক্ষে ৫ অক্ষর হতে হবে"
                    }
                  })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 ${
                    errors.title ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Event Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎭 ইভেন্টের ক্যাটাগরি <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category", { required: "ক্যাটাগরি আবশ্যক" })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 ${
                    errors.category ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                  <option value="Cultural">🎭 সাংস্কৃতিক</option>
                  <option value="Sports">⚽ খেলাধুলা</option>
                  <option value="Educational">📚 শিক্ষামূলক</option>
                  <option value="Business">💼 ব্যবসায়িক</option>
                  <option value="Religious">🕊️ ধর্মীয়</option>
                  <option value="Social">👥 সামাজিক</option>
                  <option value="Entertainment">🎪 বিনোদন</option>
                  <option value="Technology">💻 প্রযুক্তি</option>
                  <option value="Health">🏥 স্বাস্থ্য</option>
                  <option value="Environment">🌱 পরিবেশ</option>
                </select>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 ইভেন্টের বিবরণ
                </label>
                <textarea
                  rows="4"
                  placeholder="ইভেন্ট সম্পর্কে বিস্তারিত বিবরণ লিখুন"
                  {...register("description")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                />
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🕐 তারিখ ও সময়</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 তারিখ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("date", { required: "তারিখ আবশ্যক" })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 ${
                      errors.date ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.date && (
                    <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🕐 সময়
                  </label>
                  <input
                    type="time"
                    {...register("time")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 অবস্থান তথ্য</h3>
              
              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 ইভেন্টের স্থান <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="উদাহরণ: বগুড়া জেলা প্রশাসকের কার্যালয়, বগুড়া স্টেডিয়াম"
                  {...register("location", { required: "স্থান আবশ্যক" })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 ${
                    errors.location ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.location && (
                  <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏠 সম্পূর্ণ ঠিকানা
                </label>
                <textarea
                  rows="3"
                  placeholder="ইভেন্টের সম্পূর্ণ ঠিকানা লিখুন"
                  {...register("address")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏘️ এলাকা
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: বগুড়া সদর, শেরপুর"
                    {...register("area")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏛️ ল্যান্ডমার্ক
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: বগুড়া জেলা প্রশাসকের কার্যালয়ের কাছে"
                    {...register("landmark")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Organizer Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 আয়োজকের তথ্য</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 আয়োজকের নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: বগুড়া সাহিত্য পরিষদ, বগুড়া ক্রিকেট অ্যাসোসিয়েশন"
                    {...register("organizer", { required: "আয়োজকের নাম আবশ্যক" })}
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200 ${
                      errors.organizer ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.organizer && (
                    <p className="text-xs text-red-500 mt-1">{errors.organizer.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📞 ফোন নম্বর
                  </label>
                  <input
                    type="tel"
                    placeholder="উদাহরণ: 051-123456"
                    {...register("organizerPhone")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📧 ইমেইল
                  </label>
                  <input
                    type="email"
                    placeholder="উদাহরণ: info@event.com"
                    {...register("organizerEmail")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌐 ওয়েবসাইট
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.event.com"
                    {...register("organizerWebsite")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 ইভেন্টের বিবরণ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👥 ধারণক্ষমতা
                  </label>
                  <input
                    type="number"
                    placeholder="উদাহরণ: ৫০০ জন"
                    {...register("capacity")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 লক্ষ্য দর্শক
                  </label>
                  <select
                    {...register("targetAudience")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  >
                    <option value="">লক্ষ্য দর্শক নির্বাচন করুন</option>
                    <option value="All Ages">সব বয়সের</option>
                    <option value="Children">শিশু</option>
                    <option value="Youth">যুবক</option>
                    <option value="Adults">প্রাপ্তবয়স্ক</option>
                    <option value="Students">ছাত্র-ছাত্রী</option>
                    <option value="Professionals">পেশাজীবী</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💰 প্রবেশ ফি
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="টাকা"
                      {...register("entryFee")}
                      className="flex-1 border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        {...register("isFree")}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      বিনামূল্যে
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">✨ অতিরিক্ত তথ্য</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⭐ বিশেষ আকর্ষণ
                </label>
                <textarea
                  rows="3"
                  placeholder="ইভেন্টের বিশেষ আকর্ষণসমূহ লিখুন"
                  {...register("highlights")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📋 প্রয়োজনীয়তা
                </label>
                <textarea
                  rows="3"
                  placeholder="ইভেন্টে অংশগ্রহণের জন্য প্রয়োজনীয়তা লিখুন"
                  {...register("requirements")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📞 যোগাযোগের তথ্য
                </label>
                <textarea
                  rows="3"
                  placeholder="অতিরিক্ত যোগাযোগের তথ্য লিখুন"
                  {...register("contactInfo")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                />
              </div>
            </div>

            {/* Social Media Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📱 সোশ্যাল মিডিয়া</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📘 ফেসবুক
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/event"
                    {...register("facebook")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📷 ইনস্টাগ্রাম
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/event"
                    {...register("instagram")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🐦 টুইটার
                  </label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/event"
                    {...register("twitter")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                  />
                </div>
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
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
                >
                  <option value="Upcoming">আসন্ন</option>
                  <option value="Ongoing">চলমান</option>
                  <option value="Completed">সম্পন্ন</option>
                  <option value="Cancelled">বাতিল</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    যোগ হচ্ছে...
                  </>
                ) : (
                  <>
                    ➕ ইভেন্ট যোগ করুন
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
          © 2025 ইভেন্ট ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default AddEvent; 