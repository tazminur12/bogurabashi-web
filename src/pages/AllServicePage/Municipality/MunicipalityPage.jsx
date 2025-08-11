import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaUser, FaBuilding, FaUsers, FaCalendarAlt, FaClock, FaFilter, FaEye } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MunicipalityPage = () => {
  const [municipalities, setMunicipalities] = useState([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchMunicipalities();
  }, []);

  const fetchMunicipalities = async () => {
    try {
      setIsLoading(true);
      const res = await axiosSecure.get("/municipalities");
      setMunicipalities(res.data);
      setFilteredMunicipalities(res.data);
    } catch (error) {
      console.error("Municipality fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = municipalities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(municipality =>
        municipality.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        municipality.mayor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        municipality.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(municipality => municipality.status === statusFilter);
    }

    setFilteredMunicipalities(filtered);
  }, [searchTerm, statusFilter, municipalities]);

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

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#333] mb-3">🏛️ পৌরসভা সেবা</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            বগুড়া জেলার সকল পৌরসভার তথ্য, যোগাযোগের ঠিকানা এবং সেবাসমূহ
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="পৌরসভা, মেয়র বা ঠিকানা অনুসন্ধান করুন..."
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
                <option value="all">সব স্ট্যাটাস</option>
                <option value="Active">সক্রিয়</option>
                <option value="Inactive">নিষ্ক্রিয়</option>
                <option value="Maintenance">রক্ষণাবেক্ষণ</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4">
              <span className="text-sm text-gray-600">
                মোট: <span className="font-semibold text-blue-600">{filteredMunicipalities.length}</span> পৌরসভা
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">লোড হচ্ছে...</span>
          </div>
        ) : filteredMunicipalities.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো পৌরসভা পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পৌরসভা নেই।" 
                : "বর্তমানে কোনো পৌরসভা তথ্য নেই।"
              }
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
              >
                🔄 সব দেখুন
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMunicipalities.map((municipality) => (
              <div
                key={municipality._id}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{municipality.name}</h3>
                      <p className="text-blue-100 text-sm">পৌরসভা</p>
                    </div>
                    <div className="text-2xl">🏛️</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Mayor */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUser className="text-green-500 text-sm" />
                    <span className="text-sm">
                      <span className="font-medium">মেয়র:</span> {municipality.mayor || "N/A"}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-gray-700">
                    <FaMapMarkerAlt className="text-red-500 text-sm mt-0.5" />
                    <span className="text-sm">
                      <span className="font-medium">ঠিকানা:</span> {municipality.address || "N/A"}
                    </span>
                  </div>

                  {/* Phone */}
                  {municipality.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaPhone className="text-blue-500 text-sm" />
                      <span className="text-sm">
                        <span className="font-medium">ফোন:</span> {municipality.phone}
                      </span>
                    </div>
                  )}

                  {/* Email */}
                  {municipality.email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaEnvelope className="text-purple-500 text-sm" />
                      <span className="text-sm">
                        <span className="font-medium">ইমেইল:</span> {municipality.email}
                      </span>
                    </div>
                  )}

                  {/* Website */}
                  {municipality.website && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaGlobe className="text-indigo-500 text-sm" />
                      <span className="text-sm">
                        <span className="font-medium">ওয়েবসাইট:</span> {municipality.website}
                      </span>
                    </div>
                  )}

                  {/* Wards */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaBuilding className="text-orange-500 text-sm" />
                    <span className="text-sm">
                      <span className="font-medium">ওয়ার্ড:</span> {municipality.wards || "N/A"}
                    </span>
                  </div>

                  {/* Population */}
                  {municipality.population && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaUsers className="text-teal-500 text-sm" />
                      <span className="text-sm">
                        <span className="font-medium">জনসংখ্যা:</span> {municipality.population.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Office Hours */}
                  {municipality.officeHours && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaClock className="text-yellow-500 text-sm" />
                      <span className="text-sm">
                        <span className="font-medium">অফিস সময়:</span> {municipality.officeHours}
                      </span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="pt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(municipality.status)}`}>
                      {getStatusIcon(municipality.status)} {getStatusLabel(municipality.status)}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <Link
                    to={`/municipality/${municipality._id}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    বিস্তারিত দেখুন
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{municipalities.length}</div>
            <div className="text-sm text-gray-600">মোট পৌরসভা</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {municipalities.filter(m => m.status === "Active").length}
            </div>
            <div className="text-sm text-gray-600">সক্রিয়</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {municipalities.filter(m => m.status === "Inactive").length}
            </div>
            <div className="text-sm text-gray-600">নিষ্ক্রিয়</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {municipalities.filter(m => m.status === "Maintenance").length}
            </div>
            <div className="text-sm text-gray-600">রক্ষণাবেক্ষণ</div>
          </div>
        </div>

        <div className="mt-8 text-gray-500 text-xs text-center">
          © 2025 পৌরসভা সেবা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default MunicipalityPage; 