import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaCar, FaPhone, FaMapMarkerAlt, FaMoneyBillWave, FaSearch, FaFilter, FaEye, FaStar, FaShieldAlt, FaGasPump, FaCog, FaUsers, FaCalendarAlt } from "react-icons/fa";

const RentCarPage = () => {
  const axiosSecure = useAxiosSecure();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // Fetch all cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get("/rent-cars");
        setCars(response.data);
        setFilteredCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [axiosSecure]);

  // Search and filter functionality
  useEffect(() => {
    let filtered = cars;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(car =>
        car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Price filter
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      filtered = filtered.filter(car => {
        const price = car.rentPerDay;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    setFilteredCars(filtered);
  }, [searchTerm, statusFilter, typeFilter, priceFilter, cars]);

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
      case "Pickup":
        return "🛻";
      case "Bus":
        return "🚌";
      default:
        return "🚗";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('bn-BD').format(price);
  };

  const handleCall = (contact) => {
    if (contact) {
      window.location.href = `tel:${contact}`;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setPriceFilter("all");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#333] mb-2">🚗 ভাড়ার গাড়ি</h1>
          <p className="text-gray-600">বগুড়া জেলার সব ভাড়ার গাড়ি একসাথে দেখুন</p>
          <div className="mt-6">
            <Link
              to="/add-rent-car"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg"
            >
              <FaCar />
              ➕ নতুন গাড়ি যোগ করুন
            </Link>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="গাড়ি, ব্র্যান্ড বা অবস্থান অনুসন্ধান করুন..."
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
                <option value="Available">🟢 উপলব্ধ</option>
                <option value="Rented">🟡 ভাড়া দেওয়া</option>
                <option value="Maintenance">🔴 মেরামত</option>
                <option value="Reserved">🔵 সংরক্ষিত</option>
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
                <option value="Pickup">🛻 পিকআপ</option>
                <option value="Bus">🚌 বাস</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              >
                <option value="all">সব দাম</option>
                <option value="0-1000">৳০ - ৳১,০০০</option>
                <option value="1000-2000">৳১,০০০ - ৳২,০০০</option>
                <option value="2000-3000">৳২,০০০ - ৳৩,০০০</option>
                <option value="3000-5000">৳৩,০০০ - ৳৫,০০০</option>
                <option value="5000-999999">৳৫,০০০+</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <FaFilter />
                ফিল্টার মুছুন
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              মোট: <span className="font-semibold text-blue-600">{filteredCars.length}</span> গাড়ি পাওয়া গেছে
            </span>
            {cars.length > 0 && (
              <span className="text-sm text-gray-600">
                গড় দাম: <span className="font-semibold text-green-600">
                  ৳{formatPrice(Math.round(cars.reduce((sum, car) => sum + car.rentPerDay, 0) / cars.length))}
                </span>/দিন
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">গাড়ির তালিকা লোড হচ্ছে...</p>
            </div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো গাড়ি নেই</h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" || priceFilter !== "all"
                ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো গাড়ি নেই।"
                : "এখনও কোনো গাড়ি যোগ করা হয়নি।"
              }
            </p>
            {(searchTerm || statusFilter !== "all" || typeFilter !== "all" || priceFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
              >
                🔄 সব দেখুন
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <div key={car._id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden">
                {/* Car Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-6xl">{getTypeIcon(car.type)}</div>
                </div>

                {/* Car Info */}
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-sm text-gray-600">{car.year} • {car.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                      {getStatusIcon(car.status)} {getStatusLabel(car.status)}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-500" />
                      <span className="text-xl font-bold text-green-600">৳{formatPrice(car.rentPerDay)}</span>
                      <span className="text-sm text-gray-500">/দিন</span>
                    </div>
                    {car.rentPerWeek && (
                      <p className="text-xs text-gray-500 mt-1">
                        সাপ্তাহিক: ৳{formatPrice(car.rentPerWeek)}
                      </p>
                    )}
                  </div>

                  {/* Car Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCog className="text-purple-500" />
                      <span>{car.transmission || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaGasPump className="text-orange-500" />
                      <span>{car.fuelType || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaUsers className="text-indigo-500" />
                      <span>{car.seats || 'N/A'} আসন</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>{car.location}</span>
                    </div>
                  </div>

                  {/* Features Preview */}
                  {car.features && car.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaShieldAlt className="text-purple-500 text-sm" />
                        <span className="text-xs font-medium text-gray-700">সুবিধাসমূহ</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {car.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                        {car.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                            +{car.features.length - 3} আরও
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/rent-car-details/${car._id}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center gap-1"
                    >
                      <FaEye />
                      বিস্তারিত
                    </Link>
                    {car.contact && (
                      <button
                        onClick={() => handleCall(car.contact)}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center"
                        title="কল করুন"
                      >
                        <FaPhone />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {cars.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{cars.length}</div>
              <div className="text-sm text-gray-600">মোট গাড়ি</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {cars.filter(c => c.status === "Available").length}
              </div>
              <div className="text-sm text-gray-600">উপলব্ধ গাড়ি</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {cars.filter(c => c.status === "Rented").length}
              </div>
              <div className="text-sm text-gray-600">ভাড়া দেওয়া</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                ৳{formatPrice(Math.round(cars.reduce((sum, car) => sum + car.rentPerDay, 0) / cars.length))}
              </div>
              <div className="text-sm text-gray-600">গড় দৈনিক ভাড়া</div>
            </div>
          </div>
        )}

        <div className="mt-8 text-gray-500 text-xs text-center">
          © 2025 বগুড়া ভাড়ার গাড়ি সেবা | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default RentCarPage; 