import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaClock, FaStar, FaUsers, FaMoneyBillWave, FaParking, FaWifi, FaCar, FaUtensils, FaPrint, FaShare, FaDownload, FaArrowLeft, FaHeart, FaShareAlt } from "react-icons/fa";

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

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

  const getTypeIcon = (type) => {
    switch (type) {
      case "Fast Food":
        return "🍔";
      case "Fine Dining":
        return "🍽️";
      case "Cafe":
        return "☕";
      case "Street Food":
        return "🌮";
      case "Bakery":
        return "🥐";
      case "Chinese":
        return "🥢";
      case "Indian":
        return "🍛";
      case "Thai":
        return "🍜";
      case "Local":
        return "🍲";
      case "Seafood":
        return "🐟";
      case "Vegetarian":
        return "🥬";
      default:
        return "🍴";
    }
  };

  const getPriceLabel = (priceRange) => {
    switch (priceRange) {
      case "Low":
        return "💰 সস্তা (১০০-৩০০ টাকা)";
      case "Medium":
        return "💰💰 মাঝারি (৩০০-৮০০ টাকা)";
      case "High":
        return "💰💰💰 ব্যয়বহুল (৮০০+ টাকা)";
      default:
        return "💰 মূল্য নির্ধারণ করা হয়নি";
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const ratingNum = parseInt(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-lg ${i <= ratingNum ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant?.name,
          text: `${restaurant?.name} - ${restaurant?.address}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('লিংক কপি হয়েছে!');
    }
  };

  const handleDownload = () => {
    const content = `
রেস্টুরেন্ট তথ্য
================

নাম: ${restaurant?.name}
ধরণ: ${restaurant?.type}
ঠিকানা: ${restaurant?.address}
ফোন: ${restaurant?.phone || 'N/A'}
ইমেইল: ${restaurant?.email || 'N/A'}
ওয়েবসাইট: ${restaurant?.website || 'N/A'}
রেটিং: ${restaurant?.rating || 'N/A'}
মূল্য পরিসর: ${getPriceLabel(restaurant?.priceRange)}
রান্নার ধরণ: ${restaurant?.cuisine || 'N/A'}
ধারণক্ষমতা: ${restaurant?.capacity || 'N/A'} জন
খোলার সময়: ${restaurant?.openingHours || 'N/A'}
বন্ধের সময়: ${restaurant?.closingHours || 'N/A'}

বিশেষ খাবার: ${restaurant?.specialties || 'N/A'}
অতিরিক্ত সুবিধা: ${restaurant?.features || 'N/A'}

সেবার ধরণ:
- ডাইন-ইন: ${restaurant?.dineIn ? 'হ্যাঁ' : 'না'}
- টেকঅ্যাওয়ে: ${restaurant?.takeaway ? 'হ্যাঁ' : 'না'}
- হোম ডেলিভারি: ${restaurant?.delivery ? 'হ্যাঁ' : 'না'}

সুবিধা:
- পার্কিং: ${restaurant?.parking || 'N/A'}
- ওয়াইফাই: ${restaurant?.wifi || 'N/A'}

তথ্য সংগ্রহ: ${new Date().toLocaleDateString('bn-BD')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${restaurant?.name}-তথ্য.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">রেস্টুরেন্ট পাওয়া যায়নি</h3>
          <p className="text-gray-500 text-sm mb-4">অনুরোধকৃত রেস্টুরেন্ট পাওয়া যায়নি।</p>
          <Link
            to="/restaurants"
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition duration-200"
          >
            ← সব রেস্টুরেন্টে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <FaArrowLeft />
              <span>ফিরে যান</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-gray-800 transition duration-200"
                title="প্রিন্ট করুন"
              >
                <FaPrint />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-800 transition duration-200"
                title="শেয়ার করুন"
              >
                <FaShareAlt />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-gray-800 transition duration-200"
                title="ডাউনলোড করুন"
              >
                <FaDownload />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Restaurant Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Hero Image */}
          <div className="h-64 bg-gradient-to-br from-orange-400 to-red-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaUtensils className="text-8xl text-white opacity-80" />
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-white bg-opacity-90 text-orange-600 px-4 py-2 rounded-full text-sm font-medium">
                {getTypeIcon(restaurant.type)} {restaurant.type}
              </span>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {restaurant.name}
                </h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span className="text-gray-600">{restaurant.address}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {getRatingStars(restaurant.rating)}
                  </div>
                  <span className="text-gray-600">
                    {restaurant.rating || "N/A"} রেটিং
                  </span>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <span className="text-lg text-gray-700">
                    {getPriceLabel(restaurant.priceRange)}
                  </span>
                </div>

                {/* Description */}
                {restaurant.description && (
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {restaurant.description}
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="lg:w-80">
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">দ্রুত অ্যাকশন</h3>
                  
                  {restaurant.phone && (
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2 mb-3"
                    >
                      <FaPhone />
                      কল করুন
                    </a>
                  )}

                  {restaurant.website && (
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2 mb-3"
                    >
                      <FaGlobe />
                      ওয়েবসাইট দেখুন
                    </a>
                  )}

                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2">
                    <FaHeart />
                    পছন্দ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaPhone className="text-blue-500" />
              যোগাযোগের তথ্য
            </h3>
            
            <div className="space-y-4">
              {restaurant.phone && (
                <div className="flex items-center gap-3">
                  <FaPhone className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">ফোন নম্বর</p>
                    <p className="text-gray-900 font-medium">{restaurant.phone}</p>
                  </div>
                </div>
              )}

              {restaurant.email && (
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">ইমেইল</p>
                    <p className="text-gray-900 font-medium">{restaurant.email}</p>
                  </div>
                </div>
              )}

              {restaurant.website && (
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">ওয়েবসাইট</p>
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {restaurant.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaClock className="text-green-500" />
              কর্মসময়
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaClock className="text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">খোলার সময়</p>
                  <p className="text-gray-900 font-medium">
                    {restaurant.openingHours || "নির্ধারণ করা হয়নি"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaClock className="text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">বন্ধের সময়</p>
                  <p className="text-gray-900 font-medium">
                    {restaurant.closingHours || "নির্ধারণ করা হয়নি"}
                  </p>
                </div>
              </div>

              {restaurant.capacity && (
                <div className="flex items-center gap-3">
                  <FaUsers className="text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">ধারণক্ষমতা</p>
                    <p className="text-gray-900 font-medium">{restaurant.capacity} জন</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cuisine & Specialties */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaUtensils className="text-orange-500" />
              রান্না ও বিশেষ খাবার
            </h3>
            
            <div className="space-y-4">
              {restaurant.cuisine && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">রান্নার ধরণ</p>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    🍲 {restaurant.cuisine}
                  </span>
                </div>
              )}

              {restaurant.specialties && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">বিশেষ খাবার</p>
                  <p className="text-gray-900">{restaurant.specialties}</p>
                </div>
              )}
            </div>
          </div>

          {/* Services & Features */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaCar className="text-green-500" />
              সেবা ও সুবিধা
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-3">সেবার ধরণ</p>
                <div className="flex flex-wrap gap-2">
                  {restaurant.dineIn && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      🍽️ ডাইন-ইন
                    </span>
                  )}
                  {restaurant.takeaway && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      📦 টেকঅ্যাওয়ে
                    </span>
                  )}
                  {restaurant.delivery && (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                      🚚 হোম ডেলিভারি
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">সুবিধা</p>
                <div className="flex flex-wrap gap-2">
                  {restaurant.parking === "Available" && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      🅿️ পার্কিং
                    </span>
                  )}
                  {restaurant.wifi === "Available" && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      📶 ওয়াইফাই
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        {restaurant.features && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">✨ অতিরিক্ত সুবিধা</h3>
            <p className="text-gray-700 leading-relaxed">{restaurant.features}</p>
          </div>
        )}

        {/* Location */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            অবস্থান
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">সম্পূর্ণ ঠিকানা</p>
              <p className="text-gray-900 font-medium">{restaurant.address}</p>
            </div>

            {restaurant.location?.area && (
              <div>
                <p className="text-sm text-gray-500 mb-2">এলাকা</p>
                <p className="text-gray-900">{restaurant.location.area}</p>
              </div>
            )}

            {restaurant.location?.landmark && (
              <div>
                <p className="text-sm text-gray-500 mb-2">ল্যান্ডমার্ক</p>
                <p className="text-gray-900">{restaurant.location.landmark}</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              এই রেস্টুরেন্ট সম্পর্কে মতামত দিন
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              আপনার অভিজ্ঞতা শেয়ার করে অন্য দের সাহায্য করুন
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/restaurants"
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300"
              >
                ← সব রেস্টুরেন্ট দেখুন
              </Link>
              <Link
                to="/dashboard/restaurant-admin"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300"
              >
                রেস্টুরেন্ট যোগ করুন
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © 2025 বগুড়া রেস্টুরেন্ট গাইড | Developed by BoguraBashi
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails; 