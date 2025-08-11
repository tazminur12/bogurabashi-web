import React, { useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { FaMapMarkerAlt, FaUtensils, FaPhone, FaEnvelope, FaGlobe, FaClock, FaStar, FaUsers, FaMoneyBillWave, FaParking, FaWifi, FaCar } from "react-icons/fa";

const EditRestaurant = () => {
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

  // Fetch existing restaurant data
  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/restaurants/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Set form values when data is loaded
  useEffect(() => {
    if (restaurant) {
      setValue("name", restaurant.name);
      setValue("type", restaurant.type);
      setValue("address", restaurant.address);
      setValue("phone", restaurant.phone);
      setValue("email", restaurant.email);
      setValue("website", restaurant.website);
      setValue("description", restaurant.description);
      setValue("cuisine", restaurant.cuisine);
      setValue("priceRange", restaurant.priceRange);
      setValue("rating", restaurant.rating);
      setValue("capacity", restaurant.capacity);
      setValue("openingHours", restaurant.openingHours);
      setValue("closingHours", restaurant.closingHours);
      setValue("features", restaurant.features);
      setValue("specialties", restaurant.specialties);
      setValue("parking", restaurant.parking);
      setValue("wifi", restaurant.wifi);
      setValue("delivery", restaurant.delivery);
      setValue("takeaway", restaurant.takeaway);
      setValue("dineIn", restaurant.dineIn);
      setValue("status", restaurant.status);
      setValue("area", restaurant.location?.area);
      setValue("landmark", restaurant.location?.landmark);
    }
  }, [restaurant, setValue]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        description: formData.description,
        cuisine: formData.cuisine,
        priceRange: formData.priceRange,
        rating: formData.rating,
        capacity: formData.capacity,
        openingHours: formData.openingHours,
        closingHours: formData.closingHours,
        features: formData.features,
        specialties: formData.specialties,
        parking: formData.parking,
        wifi: formData.wifi,
        delivery: formData.delivery,
        takeaway: formData.takeaway,
        dineIn: formData.dineIn,
        status: formData.status,
        location: {
          area: formData.area,
          landmark: formData.landmark,
          city: "বগুড়া",
          district: "বগুড়া",
          division: "রাজশাহী"
        },
        updatedAt: new Date(),
      };

      await axiosSecure.patch(`/restaurants/${id}`, payload);

      Swal.fire({
        icon: "success",
        title: "✅ সফল!",
        text: "রেস্টুরেন্ট সফলভাবে আপডেট হয়েছে!",
        timer: 2000,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", id] });

      setTimeout(() => {
        navigate("/dashboard/restaurant-admin");
      }, 2000);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      Swal.fire("❌ ত্রুটি", "রেস্টুরেন্ট আপডেট করতে সমস্যা হয়েছে", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">লোড হচ্ছে...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">রেস্টুরেন্ট পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-sm mb-4">অনুরোধকৃত রেস্টুরেন্ট পাওয়া যায়নি।</p>
            <Link
              to="/dashboard/restaurant-admin"
              className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              ← সব রেস্টুরেন্টে ফিরে যান
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
          <h1 className="text-3xl font-bold text-[#333] mb-2">✏️ রেস্টুরেন্ট সম্পাদনা</h1>
          <p className="text-sm text-gray-600">রেস্টুরেন্টের তথ্য আপডেট করুন</p>
        </div>

        <div className="mb-5">
          <Link
            to="/dashboard/restaurant-admin"
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-200 text-sm font-medium"
          >
            ← সব রেস্টুরেন্টে ফিরে যান
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          {/* Current Restaurant Info */}
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-sm font-medium text-orange-800 mb-2">📋 বর্তমান রেস্টুরেন্ট তথ্য</h3>
            <div className="text-sm text-orange-700">
              <p><strong>নাম:</strong> {restaurant?.name}</p>
              <p><strong>ধরণ:</strong> {restaurant?.type}</p>
              <p><strong>ঠিকানা:</strong> {restaurant?.address}</p>
              <p><strong>স্ট্যাটাস:</strong> {restaurant?.status}</p>
              <p><strong>আইডি:</strong> {restaurant?._id?.slice(-8)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 মৌলিক তথ্য</h3>
              
              {/* Restaurant Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🍽️ রেস্টুরেন্টের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="উদাহরণ: স্পাইসি চিকেন হাউস, গোল্ডেন ডাইনিং"
                  {...register("name", { 
                    required: "রেস্টুরেন্টের নাম আবশ্যক",
                    minLength: {
                      value: 3,
                      message: "রেস্টুরেন্টের নাম কমপক্ষে ৩ অক্ষর হতে হবে"
                    }
                  })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200 ${
                    errors.name ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Restaurant Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🍴 রেস্টুরেন্টের ধরণ <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("type", { required: "রেস্টুরেন্টের ধরণ আবশ্যক" })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200 ${
                    errors.type ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">ধরণ নির্বাচন করুন</option>
                  <option value="Fast Food">🍔 ফাস্ট ফুড</option>
                  <option value="Fine Dining">🍽️ ফাইন ডাইনিং</option>
                  <option value="Cafe">☕ ক্যাফে</option>
                  <option value="Street Food">🌮 স্ট্রিট ফুড</option>
                  <option value="Bakery">🥐 বেকারি</option>
                  <option value="Chinese">🥢 চাইনিজ</option>
                  <option value="Indian">🍛 ইন্ডিয়ান</option>
                  <option value="Thai">🍜 থাই</option>
                  <option value="Local">🍲 লোকাল</option>
                  <option value="Seafood">🐟 সীফুড</option>
                  <option value="Vegetarian">🥬 ভেজিটেরিয়ান</option>
                </select>
                {errors.type && (
                  <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 বিবরণ
                </label>
                <textarea
                  rows="3"
                  placeholder="রেস্টুরেন্ট সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন"
                  {...register("description")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                />
              </div>
            </div>

            {/* Location Information Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 অবস্থান তথ্য</h3>
              
              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="রেস্টুরেন্টের সম্পূর্ণ ঠিকানা লিখুন"
                  {...register("address", { required: "ঠিকানা আবশ্যক" })}
                  className={`w-full border text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200 ${
                    errors.address ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                )}
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
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
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
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>
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
                    className={`w-full border text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200 ${
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
                    placeholder="উদাহরণ: info@restaurant.com"
                    {...register("email")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌐 ওয়েবসাইট
                </label>
                <input
                  type="url"
                  placeholder="https://www.restaurant.com"
                  {...register("website")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                />
              </div>
            </div>

            {/* Restaurant Details Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🍽️ রেস্টুরেন্টের বিবরণ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🍲 রান্নার ধরণ
                  </label>
                  <input
                    type="text"
                    placeholder="উদাহরণ: বাংলা, চাইনিজ, ইন্ডিয়ান"
                    {...register("cuisine")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💰 মূল্য পরিসর
                  </label>
                  <select
                    {...register("priceRange")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  >
                    <option value="">মূল্য নির্বাচন করুন</option>
                    <option value="Low">💰 সস্তা (১০০-৩০০ টাকা)</option>
                    <option value="Medium">💰💰 মাঝারি (৩০০-৮০০ টাকা)</option>
                    <option value="High">💰💰💰 ব্যয়বহুল (৮০০+ টাকা)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⭐ রেটিং
                  </label>
                  <select
                    {...register("rating")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  >
                    <option value="">রেটিং নির্বাচন করুন</option>
                    <option value="1">⭐ ১</option>
                    <option value="2">⭐⭐ ২</option>
                    <option value="3">⭐⭐⭐ ৩</option>
                    <option value="4">⭐⭐⭐⭐ ৪</option>
                    <option value="5">⭐⭐⭐⭐⭐ ৫</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👥 ধারণক্ষমতা
                </label>
                <input
                  type="number"
                  placeholder="উদাহরণ: ৫০ জন"
                  {...register("capacity")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                />
              </div>
            </div>

            {/* Operating Hours Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🕐 কর্মসময়</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌅 খোলার সময়
                  </label>
                  <input
                    type="time"
                    {...register("openingHours")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌆 বন্ধের সময়
                  </label>
                  <input
                    type="time"
                    {...register("closingHours")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">✨ বিশেষ সুবিধা</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🚗 পার্কিং
                  </label>
                  <select
                    {...register("parking")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  >
                    <option value="">পার্কিং নির্বাচন করুন</option>
                    <option value="Available">✅ উপলব্ধ</option>
                    <option value="Not Available">❌ নেই</option>
                    <option value="Street Parking">🅿️ সড়ক পার্কিং</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📶 ওয়াইফাই
                  </label>
                  <select
                    {...register("wifi")}
                    className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                  >
                    <option value="">ওয়াইফাই নির্বাচন করুন</option>
                    <option value="Available">✅ উপলব্ধ</option>
                    <option value="Not Available">❌ নেই</option>
                    <option value="Paid">💰 পেইড</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🍽️ সেবার ধরণ
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register("dineIn")}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">🍽️ ডাইন-ইন</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register("takeaway")}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">📦 টেকঅ্যাওয়ে</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register("delivery")}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">🚚 হোম ডেলিভারি</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Specialties Section */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🌟 বিশেষ খাবার</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🍽️ বিশেষ খাবারসমূহ
                </label>
                <textarea
                  rows="3"
                  placeholder="রেস্টুরেন্টের বিশেষ খাবারসমূহের তালিকা লিখুন"
                  {...register("specialties")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ✨ অতিরিক্ত সুবিধা
                </label>
                <textarea
                  rows="3"
                  placeholder="অতিরিক্ত সুবিধাসমূহ লিখুন"
                  {...register("features")}
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
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
                  className="w-full border border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
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
                onClick={() => navigate("/dashboard/restaurant-admin")}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
              >
                ❌ বাতিল
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 রেস্টুরেন্ট ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default EditRestaurant; 