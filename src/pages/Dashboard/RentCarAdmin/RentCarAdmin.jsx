import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaEye, FaPlus, FaCar, FaPhone, FaMapMarkerAlt, FaSearch, FaFilter, FaClock, FaUsers, FaStar, FaMoneyBillWave } from "react-icons/fa";

const RentCarAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch all cars
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/rent-cars");
        setCars(res.data);
        setFilteredCars(res.data);
      } catch (err) {
        console.error("গাড়ি ডাটা ফেচিং ত্রুটি:", err);
        Swal.fire("❌ ত্রুটি", "গাড়ির তথ্য লোড করতে সমস্যা হয়েছে", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  // Search and filter functionality
  useEffect(() => {
    let filtered = cars;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(car =>
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(car => car.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(car => car.type === typeFilter);
    }

    setFilteredCars(filtered);
  }, [searchTerm, statusFilter, typeFilter, cars]);

  // Delete car
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই গাড়িটি মুছে ফেললে ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "না, বাতিল করুন",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/rent-cars/${id}`);
        setCars(prev => prev.filter(car => car._id !== id));
        Swal.fire("✅ সফল!", "গাড়িটি সফলভাবে মুছে ফেলা হয়েছে", "success");
      } catch (err) {
        console.error("Error deleting car:", err);
        Swal.fire("❌ ত্রুটি", "গাড়ি মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Rented":
        return "bg-yellow-100 text-yellow-800";
      case "Maintenance":
        return "bg-red-100 text-red-800";
      case "Reserved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available":
        return "🟢";
      case "Rented":
        return "🟡";
      case "Maintenance":
        return "🔴";
      case "Reserved":
        return "🔵";
      default:
        return "⚪";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Available":
        return "উপলব্ধ";
      case "Rented":
        return "ভাড়া দেওয়া";
      case "Maintenance":
        return "মেরামত";
      case "Reserved":
        return "সংরক্ষিত";
      default:
        return status || "N/A";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Sedan":
        return "🚗";
      case "SUV":
        return "🚙";
      case "Micro":
        return "🚐";
      case "Luxury":
        return "🏎️";
      case "Van":
        return "🚐";
      case "Truck":
        return "🚛";
      default:
        return "🚗";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('bn-BD').format(price);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#333] mb-1">🚗 ভাড়ার গাড়ি ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-600">বগুড়া জেলার ভাড়ার গাড়ির তথ্য পরিচালনা করুন</p>
          </div>
          <Link
            to="/add-rent-car"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <FaPlus />
            ➕ নতুন গাড়ি যোগ করুন
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
                placeholder="গাড়ির মডেল, ব্র্যান্ড বা যোগাযোগ অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              >
                <option value="all">সব অবস্থা</option>
                <option value="Available">উপলব্ধ</option>
                <option value="Rented">ভাড়া দেওয়া</option>
                <option value="Maintenance">মেরামত</option>
                <option value="Reserved">সংরক্ষিত</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              >
                <option value="all">সব ধরন</option>
                <option value="Sedan">🚗 সেডান</option>
                <option value="SUV">🚙 এসইউভি</option>
                <option value="Micro">🚐 মাইক্রো</option>
                <option value="Luxury">🏎️ লাক্সারি</option>
                <option value="Van">🚐 ভ্যান</option>
                <option value="Truck">🚛 ট্রাক</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4">
              <span className="text-sm text-gray-600">
                মোট: <span className="font-semibold text-blue-600">{filteredCars.length}</span> গাড়ি
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600 text-sm">লোড হচ্ছে...</span>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো গাড়ি নেই</h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো গাড়ি নেই।"
                  : "প্রথম গাড়ি যোগ করে শুরু করুন!"
                }
              </p>
              {(searchTerm || statusFilter !== "all" || typeFilter !== "all") ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
                >
                  🔄 সব দেখুন
                </button>
              ) : (
                <Link
                  to="/dashboard/add-rent-car"
                  className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
                >
                  ➕ প্রথম গাড়ি যোগ করুন
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">🚗 গাড়ি</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📍 অবস্থান</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">💰 ভাড়া</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📞 যোগাযোগ</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📊 অবস্থা</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-gray-700">⚙️ অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCars.map((car, index) => (
                    <tr key={car._id} className="hover:bg-gray-50 transition duration-200">
                      <td className="py-4 px-4">
                        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{car.brand} {car.model}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <FaCar className="text-blue-500 text-sm" />
                            <span className="text-xs text-gray-500">{getTypeIcon(car.type)} {car.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-red-500 text-sm" />
                          <span className="text-gray-700 text-sm">{car.location || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaMoneyBillWave className="text-green-500 text-sm" />
                          <span className="text-gray-700 font-medium">৳{formatPrice(car.rentPerDay)}/দিন</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-green-500 text-sm" />
                          <span className="text-gray-700">{car.contact || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                          {getStatusIcon(car.status)} {getStatusLabel(car.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/dashboard/rent-car-details/${car._id}`}
                            className="p-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition duration-200 flex items-center justify-center"
                            title="বিস্তারিত দেখুন"
                          >
                            <FaEye className="text-sm" />
                          </Link>
                          <Link
                            to={`/dashboard/update-rent-car/${car._id}`}
                            className="p-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-lg transition duration-200 flex items-center justify-center"
                            title="সম্পাদনা করুন"
                          >
                            <FaEdit className="text-sm" />
                          </Link>
                          <button
                            onClick={() => handleDelete(car._id)}
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
              <span>🚗 মোট গাড়ি:</span>
              <span className="font-semibold text-blue-600">{cars.length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🟢 উপলব্ধ:</span>
              <span className="font-semibold text-green-600">{cars.filter(c => c.status === "Available").length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🟡 ভাড়া দেওয়া:</span>
              <span className="font-semibold text-yellow-600">{cars.filter(c => c.status === "Rented").length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🔴 মেরামত:</span>
              <span className="font-semibold text-red-600">{cars.filter(c => c.status === "Maintenance").length}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 ভাড়ার গাড়ি ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default RentCarAdmin;
