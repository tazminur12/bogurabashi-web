import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEye, FaPlus, FaMapMarkerAlt, FaPhone, FaUtensils, FaStar, FaClock, FaUsers, FaSearch, FaFilter } from "react-icons/fa";

const RestaurantAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // রেস্টুরেন্ট ডেটা ফেচ
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/restaurants");
        setRestaurants(res.data);
        setFilteredRestaurants(res.data);
      } catch (err) {
        console.error("❌ রেস্টুরেন্ট লোড করতে সমস্যা হয়েছে:", err);
        Swal.fire("❌ ত্রুটি", "রেস্টুরেন্ট তথ্য লোড করতে সমস্যা হয়েছে", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  // Search and filter functionality
  useEffect(() => {
    let filtered = restaurants;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(restaurant => restaurant.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(restaurant => restaurant.type === typeFilter);
    }

    setFilteredRestaurants(filtered);
  }, [searchTerm, statusFilter, typeFilter, restaurants]);

  // ডিলিট ফাংশন
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই রেস্টুরেন্টটি মুছে ফেললে ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "না, বাতিল করুন",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/restaurants/${id}`);
        setRestaurants((prev) => prev.filter((r) => r._id !== id));
        Swal.fire("✅ সফল!", "রেস্টুরেন্টটি সফলভাবে মুছে ফেলা হয়েছে", "success");
      } catch (err) {
        console.error("❌ ডিলিট ত্রুটি:", err);
        Swal.fire("❌ ত্রুটি", "রেস্টুরেন্ট মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return "🟢";
      case "Inactive":
        return "🔴";
      case "Maintenance":
        return "🟡";
      default:
        return "⚪";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Active":
        return "সক্রিয়";
      case "Inactive":
        return "নিষ্ক্রিয়";
      case "Maintenance":
        return "রক্ষণাবেক্ষণ";
      default:
        return status || "N/A";
    }
  };

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
      default:
        return "🍴";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#333] mb-1">🍽️ রেস্টুরেন্ট ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-600">বগুড়া জেলার রেস্টুরেন্টের তথ্য পরিচালনা করুন</p>
          </div>
          <Link
            to="/add-restaurant"
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <FaPlus />
            ➕ নতুন রেস্টুরেন্ট যোগ করুন
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="রেস্টুরেন্ট, ঠিকানা বা ধরণ অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="Active">সক্রিয়</option>
                <option value="Inactive">নিষ্ক্রিয়</option>
                <option value="Maintenance">রক্ষণাবেক্ষণ</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition duration-200"
              >
                <option value="all">সব ধরণ</option>
                <option value="Fast Food">ফাস্ট ফুড</option>
                <option value="Fine Dining">ফাইন ডাইনিং</option>
                <option value="Cafe">ক্যাফে</option>
                <option value="Street Food">স্ট্রিট ফুড</option>
                <option value="Bakery">বেকারি</option>
                <option value="Chinese">চাইনিজ</option>
                <option value="Indian">ইন্ডিয়ান</option>
                <option value="Thai">থাই</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4">
              <span className="text-sm text-gray-600">
                মোট: <span className="font-semibold text-orange-600">{filteredRestaurants.length}</span> রেস্টুরেন্ট
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600 text-sm">লোড হচ্ছে...</span>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো রেস্টুরেন্ট নেই</h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো রেস্টুরেন্ট নেই।"
                  : "প্রথম রেস্টুরেন্ট যোগ করে শুরু করুন!"
                }
              </p>
              {(searchTerm || statusFilter !== "all" || typeFilter !== "all") ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition duration-200"
                >
                  🔄 সব দেখুন
                </button>
              ) : (
                <Link
                  to="/dashboard/add-restaurant"
                  className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition duration-200"
                >
                  ➕ প্রথম রেস্টুরেন্ট যোগ করুন
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">🍽️ রেস্টুরেন্ট</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📍 ঠিকানা</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📞 যোগাযোগ</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">🍴 ধরণ</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">⭐ রেটিং</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📊 অবস্থা</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-gray-700">⚙️ অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRestaurants.map((restaurant, index) => (
                    <tr key={restaurant._id} className="hover:bg-gray-50 transition duration-200">
                      <td className="py-4 px-4">
                        <span className="bg-orange-100 text-orange-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{restaurant.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <FaUtensils className="text-orange-500 text-sm" />
                            <span className="text-xs text-gray-500">রেস্টুরেন্ট</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-red-500 text-sm" />
                          <span className="text-gray-700 text-sm">{restaurant.address || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-blue-500 text-sm" />
                          <span className="text-gray-700">{restaurant.phone || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                          {getTypeIcon(restaurant.type)} {restaurant.type || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500 text-sm" />
                          <span className="text-gray-700">{restaurant.rating || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(restaurant.status)}`}>
                          {getStatusIcon(restaurant.status)} {getStatusLabel(restaurant.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/dashboard/restaurant-details/${restaurant._id}`}
                            className="p-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition duration-200 flex items-center justify-center"
                            title="বিস্তারিত দেখুন"
                          >
                            <FaEye className="text-sm" />
                          </Link>
                          <Link
                            to={`/dashboard/edit-restaurant/${restaurant._id}`}
                            className="p-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-lg transition duration-200 flex items-center justify-center"
                            title="সম্পাদনা করুন"
                          >
                            <FaEdit className="text-sm" />
                          </Link>
                          <button
                            onClick={() => handleDelete(restaurant._id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 flex items-center justify-center"
                            title="মুছে ফেলুন"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🍽️ মোট রেস্টুরেন্ট:</span>
              <span className="font-semibold text-orange-600">{restaurants.length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🟢 সক্রিয়:</span>
              <span className="font-semibold text-green-600">{restaurants.filter(r => r.status === "Active").length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🔴 নিষ্ক্রিয়:</span>
              <span className="font-semibold text-red-600">{restaurants.filter(r => r.status === "Inactive").length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🟡 রক্ষণাবেক্ষণ:</span>
              <span className="font-semibold text-yellow-600">{restaurants.filter(r => r.status === "Maintenance").length}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 রেস্টুরেন্ট ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdmin;
