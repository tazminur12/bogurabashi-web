import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaUsers, FaBuilding, FaCode, FaCalendarAlt, FaSearch, FaFilter } from "react-icons/fa";

const UnionPage = () => {
  const axiosSecure = useAxiosSecure();
  const [unions, setUnions] = useState([]);
  const [filteredUnions, setFilteredUnions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch unions data
  useEffect(() => {
    const fetchUnions = async () => {
      try {
        setIsLoading(true);
        const res = await axiosSecure.get("/unions");
        setUnions(res.data);
        setFilteredUnions(res.data);
      } catch (error) {
        console.error("Error loading unions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnions();
  }, [axiosSecure]);

  // Filter unions based on search and filters
  useEffect(() => {
    let filtered = unions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(union =>
        union.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        union.upazila.toLowerCase().includes(searchTerm.toLowerCase()) ||
        union.code.includes(searchTerm)
      );
    }

    // Upazila filter
    if (selectedUpazila) {
      filtered = filtered.filter(union => union.upazila === selectedUpazila);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(union => union.status === selectedStatus);
    }

    setFilteredUnions(filtered);
  }, [unions, searchTerm, selectedUpazila, selectedStatus]);

  // Get unique upazilas for filter
  const upazilas = [...new Set(unions.map(union => union.upazila))].sort();

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return "🟢";
      case "Inactive":
        return "🔴";
      case "Pending":
        return "🟡";
      default:
        return "⚪";
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedUpazila("");
    setSelectedStatus("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">লোড হচ্ছে...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🏛️ বগুড়া জেলার ইউনিয়ন পরিষদসমূহ</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            বগুড়া জেলার সকল ইউনিয়ন পরিষদের তথ্য, যোগাযোগের ঠিকানা এবং সেবাসমূহ সম্পর্কে জানুন
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{unions.length}</div>
            <div className="text-sm text-gray-600">মোট ইউনিয়ন</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {unions.filter(u => u.status === "Active").length}
            </div>
            <div className="text-sm text-gray-600">সক্রিয় ইউনিয়ন</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {unions.filter(u => u.status === "Pending").length}
            </div>
            <div className="text-sm text-gray-600">অপেক্ষমান</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {unions.filter(u => u.status === "Inactive").length}
            </div>
            <div className="text-sm text-gray-600">নিষ্ক্রিয়</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ইউনিয়ন নাম, উপজেলা বা কোড দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Upazila Filter */}
            <div>
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">সব উপজেলা</option>
                {upazilas.map(upazila => (
                  <option key={upazila} value={upazila}>{upazila}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">সব স্ট্যাটাস</option>
                <option value="Active">সক্রিয়</option>
                <option value="Inactive">নিষ্ক্রিয়</option>
                <option value="Pending">অপেক্ষমান</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <FaFilter />
              ফিল্টার মুছুন
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredUnions.length} টি ইউনিয়ন পাওয়া গেছে
            {(searchTerm || selectedUpazila || selectedStatus) && (
              <span className="text-sm text-gray-500">
                (ফিল্টার প্রয়োগ করা হয়েছে)
              </span>
            )}
          </p>
        </div>

        {/* Unions Grid */}
        {filteredUnions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো ইউনিয়ন পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-sm mb-4">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ইউনিয়ন নেই।
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              সব ফিল্টার মুছুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnions.map((union) => (
              <div key={union._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{union.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(union.status)}`}>
                      {getStatusIcon(union.status)} {union.status === "Active" ? "সক্রিয়" : 
                       union.status === "Inactive" ? "নিষ্ক্রিয়" : "অপেক্ষমান"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt />
                    <span>{union.upazila}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Code */}
                  <div className="flex items-center gap-2 mb-3">
                    <FaCode className="text-blue-500" />
                    <span className="text-sm text-gray-600">কোড: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{union.code}</span></span>
                  </div>

                  {/* Description */}
                  {union.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{union.description}</p>
                  )}

                  {/* Demographics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {union.population && (
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-green-500 text-sm" />
                        <span className="text-xs text-gray-600">জনসংখ্যা: {union.population.toLocaleString()}</span>
                      </div>
                    )}
                    {union.area && (
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-purple-500 text-sm" />
                        <span className="text-xs text-gray-600">আয়তন: {union.area} বর্গ কিমি</span>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {union.officePhone && (
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-green-500 text-sm" />
                        <span className="text-xs text-gray-600">{union.officePhone}</span>
                      </div>
                    )}
                    {union.officeEmail && (
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-blue-500 text-sm" />
                        <span className="text-xs text-gray-600">{union.officeEmail}</span>
                      </div>
                    )}
                    {union.website && (
                      <div className="flex items-center gap-2">
                        <FaGlobe className="text-purple-500 text-sm" />
                        <a 
                          href={union.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          ওয়েবসাইট দেখুন
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Leadership */}
                  {(union.chairmanName || union.secretaryName) && (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">নেতৃত্ব</h4>
                      <div className="space-y-1">
                        {union.chairmanName && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">চেয়ারম্যান:</span> {union.chairmanName}
                            {union.chairmanPhone && ` (${union.chairmanPhone})`}
                          </div>
                        )}
                        {union.secretaryName && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">সচিব:</span> {union.secretaryName}
                            {union.secretaryPhone && ` (${union.secretaryPhone})`}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Establishment Date */}
                  {union.establishmentDate && (
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-orange-500 text-sm" />
                        <span className="text-xs text-gray-600">
                          প্রতিষ্ঠার তারিখ: {new Date(union.establishmentDate).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      আইডি: {union._id?.slice(-8)}
                    </span>
                    <Link
                      to={`/union/${union._id}`}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-200"
                    >
                      বিস্তারিত দেখুন
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🏛️ ইউনিয়ন পরিষদ সম্পর্কে</h3>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              ইউনিয়ন পরিষদ বাংলাদেশের স্থানীয় সরকার ব্যবস্থার সর্বনিম্ন স্তর। প্রতিটি ইউনিয়ন পরিষদ 
              তার এলাকার উন্নয়ন, জনসেবা এবং প্রশাসনিক কার্যক্রম পরিচালনা করে। এখানে আপনি বগুড়া জেলার 
              সকল ইউনিয়ন পরিষদের তথ্য পেতে পারেন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnionPage; 