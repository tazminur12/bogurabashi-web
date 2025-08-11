import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaStar, FaClock, FaUtensils, FaSearch, FaFilter, FaParking, FaWifi, FaCar } from "react-icons/fa";

const RestaurantPage = () => {
  const axiosSecure = useAxiosSecure();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/restaurants");
        const activeRestaurants = res.data.filter(r => r.status === "Active");
        setRestaurants(activeRestaurants);
        setFilteredRestaurants(activeRestaurants);
      } catch (err) {
        console.error("❌ রেস্টুরেন্ট লোড করতে সমস্যা হয়েছে:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  useEffect(() => {
    let filtered = restaurants;

    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(restaurant => restaurant.type === typeFilter);
    }

    if (priceFilter !== "all") {
      filtered = filtered.filter(restaurant => restaurant.priceRange === priceFilter);
    }

    setFilteredRestaurants(filtered);
  }, [searchTerm, typeFilter, priceFilter, restaurants]);

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
        return "💰 সস্তা";
      case "Medium":
        return "💰💰 মাঝারি";
      case "High":
        return "💰💰💰 ব্যয়বহুল";
      default:
        return "💰";
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const ratingNum = parseInt(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-sm ${i <= ratingNum ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              🍽️ বগুড়ার রেস্টুরেন্ট
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              বগুড়া জেলার সেরা রেস্টুরেন্ট ও খাবারের দোকানের তালিকা
            </p>
            <div className="mt-8 flex justify-center">
              <div className=" bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-2">
                <span className="text-white font-medium">
                  {restaurants.length}টি রেস্টুরেন্ট
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="রেস্টুরেন্ট, ঠিকানা বা খাবার অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
              >
                <option value="all">সব ধরণ</option>
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
            </div>

            {/* Price Filter */}
            <div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
              >
                <option value="all">সব মূল্য</option>
                <option value="Low">💰 সস্তা</option>
                <option value="Medium">💰💰 মাঝারি</option>
                <option value="High">💰💰💰 ব্যয়বহুল</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-orange-50 rounded-lg px-4">
              <span className="text-sm text-orange-700">
                মোট: <span className="font-semibold">{filteredRestaurants.length}</span> রেস্টুরেন্ট
              </span>
            </div>
          </div>
        </div>

        {/* Restaurants Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">লোড হচ্ছে...</span>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো রেস্টুরেন্ট নেই</h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm || typeFilter !== "all" || priceFilter !== "all"
                ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো রেস্টুরেন্ট নেই।"
                : "এখনও কোনো রেস্টুরেন্ট যোগ করা হয়নি।"
              }
            </p>
            {(searchTerm || typeFilter !== "all" || priceFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setPriceFilter("all");
                }}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition duration-200"
              >
                🔄 সব দেখুন
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2">
                {/* Restaurant Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaUtensils className="text-6xl text-white opacity-80" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white bg-opacity-90 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                      {getTypeIcon(restaurant.type)} {restaurant.type}
                    </span>
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <FaMapMarkerAlt className="text-red-500 text-sm" />
                    <span className="text-gray-600 text-sm">{restaurant.address}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {getRatingStars(restaurant.rating)}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {restaurant.rating || "N/A"} রেটিং
                    </span>
                  </div>

                  {/* Price Range */}
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">
                      {getPriceLabel(restaurant.priceRange)}
                    </span>
                  </div>

                  {/* Cuisine */}
                  {restaurant.cuisine && (
                    <div className="mb-3">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                        🍲 {restaurant.cuisine}
                      </span>
                    </div>
                  )}

                  {/* Features */}
                  <div className="flex items-center gap-3 mb-4">
                    {restaurant.parking === "Available" && (
                      <span className="text-green-600 text-sm" title="পার্কিং">
                        <FaParking />
                      </span>
                    )}
                    {restaurant.wifi === "Available" && (
                      <span className="text-blue-600 text-sm" title="ওয়াইফাই">
                        <FaWifi />
                      </span>
                    )}
                    {restaurant.delivery && (
                      <span className="text-orange-600 text-sm" title="হোম ডেলিভারি">
                        <FaCar />
                      </span>
                    )}
                  </div>

                  {/* Contact */}
                  {restaurant.phone && (
                    <div className="flex items-center gap-2 mb-4">
                      <FaPhone className="text-blue-500 text-sm" />
                      <span className="text-gray-700 text-sm">{restaurant.phone}</span>
                    </div>
                  )}

                  {/* Operating Hours */}
                  {(restaurant.openingHours || restaurant.closingHours) && (
                    <div className="flex items-center gap-2 mb-4">
                      <FaClock className="text-gray-500 text-sm" />
                      <span className="text-gray-600 text-sm">
                        {restaurant.openingHours} - {restaurant.closingHours}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/restaurant/${restaurant._id}`}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
                    >
                      বিস্তারিত দেখুন
                    </Link>
                    {restaurant.phone && (
                      <a
                        href={`tel:${restaurant.phone}`}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
                        title="কল করুন"
                      >
                        📞
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              আপনার রেস্টুরেন্ট যোগ করতে চান?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              বগুড়া জেলার রেস্টুরেন্ট ব্যবস্থাপনা সিস্টেমে আপনার রেস্টুরেন্ট যোগ করুন
            </p>
            <Link
              to="/add-restaurant"
              className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-full font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              রেস্টুরেন্ট যোগ করুন
            </Link>
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

export default RestaurantPage; 