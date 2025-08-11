import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaCreditCard, FaClock, FaTint, FaFire, FaSearch, FaFilter, FaBuilding } from "react-icons/fa";

const WaterOfficePage = () => {
  const axiosSecure = useAxiosSecure();
  const [offices, setOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch all offices
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        setIsLoading(true);
        const response = await axiosSecure.get("/water-offices");
        setOffices(response.data);
        setFilteredOffices(response.data);
      } catch (error) {
        console.error("Error fetching offices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffices();
  }, [axiosSecure]);

  // Filter offices based on search and filters
  useEffect(() => {
    let filtered = offices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(office =>
        office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        office.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        office.phone.includes(searchTerm)
      );
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(office => office.type === selectedType);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(office => office.status === selectedStatus);
    }

    setFilteredOffices(filtered);
  }, [offices, searchTerm, selectedType, selectedStatus]);

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

  const getOfficeTypeIcon = (type) => {
    switch (type) {
      case "Water":
        return <FaTint className="text-blue-500 text-lg" />;
      case "Gas":
        return <FaFire className="text-orange-500 text-lg" />;
      case "Both":
        return (
          <div className="flex gap-1">
            <FaTint className="text-blue-500 text-lg" />
            <FaFire className="text-orange-500 text-lg" />
          </div>
        );
      default:
        return <FaBuilding className="text-gray-500 text-lg" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "Water":
        return "পানি অফিস";
      case "Gas":
        return "গ্যাস অফিস";
      case "Both":
        return "পানি ও গ্যাস উভয়";
      default:
        return type || "N/A";
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-5xl">💧</div>
            <div>
              <h1 className="text-3xl font-bold text-[#333]">গ্যাস ও পানি অফিস</h1>
              <p className="text-gray-600 mt-1">বগুড়া জেলার গ্যাস ও পানি অফিসের তথ্য</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>💡 টিপ:</strong> আপনার এলাকার গ্যাস ও পানি অফিস খুঁজুন, বিল পেমেন্টের তথ্য দেখুন এবং যোগাযোগ করুন।
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 খুঁজুন
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="অফিস নাম, ঠিকানা বা ফোন নম্বর দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 ধরন
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              >
                <option value="">সব ধরন</option>
                <option value="Water">পানি অফিস</option>
                <option value="Gas">গ্যাস অফিস</option>
                <option value="Both">পানি ও গ্যাস উভয়</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🟢 অবস্থা
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              >
                <option value="">সব অবস্থা</option>
                <option value="Active">সক্রিয়</option>
                <option value="Inactive">নিষ্ক্রিয়</option>
                <option value="Maintenance">রক্ষণাবেক্ষণ</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              📊 মোট {filteredOffices.length}টি অফিস পাওয়া গেছে
              {searchTerm && ` "${searchTerm}" এর জন্য`}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">লোড হচ্ছে...</span>
          </div>
        ) : filteredOffices.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো অফিস পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-sm mb-4">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো অফিস নেই। অনুগ্রহ করে অন্য শব্দ দিয়ে চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("");
                setSelectedStatus("");
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              🔄 সব ফিল্টার মুছুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffices.map((office) => (
              <div
                key={office._id}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-200 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getOfficeTypeIcon(office.type)}
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{office.name}</h3>
                        <p className="text-sm text-gray-600">{getTypeLabel(office.type)}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(office.status)}`}>
                      {getStatusIcon(office.status)} {getStatusLabel(office.status)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Address */}
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-red-500 text-sm mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{office.address}</p>
                  </div>

                  {/* Phone */}
                  {office.phone && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-green-500 text-sm flex-shrink-0" />
                      <a
                        href={`tel:${office.phone}`}
                        className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                      >
                        {office.phone}
                      </a>
                    </div>
                  )}

                  {/* Email */}
                  {office.email && (
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-blue-500 text-sm flex-shrink-0" />
                      <a
                        href={`mailto:${office.email}`}
                        className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                      >
                        {office.email}
                      </a>
                    </div>
                  )}

                  {/* Website */}
                  {office.website && (
                    <div className="flex items-center gap-2">
                      <FaGlobe className="text-purple-500 text-sm flex-shrink-0" />
                      <a
                        href={office.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                      >
                        ওয়েবসাইট দেখুন
                      </a>
                    </div>
                  )}

                  {/* Office Hours */}
                  {office.officeHours && (
                    <div className="flex items-center gap-2">
                      <FaClock className="text-orange-500 text-sm flex-shrink-0" />
                      <p className="text-sm text-gray-700">{office.officeHours}</p>
                    </div>
                  )}

                  {/* Bill Payment Info */}
                  {office.billPaymentInfo && (
                    <div className="flex items-start gap-2">
                      <FaCreditCard className="text-purple-500 text-sm mt-1 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{office.billPaymentInfo}</p>
                    </div>
                  )}

                  {/* Manager Info */}
                  {office.managerName && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">👨‍💼 ম্যানেজার</p>
                      <p className="text-sm font-medium text-gray-800">{office.managerName}</p>
                      {office.managerPhone && (
                        <a
                          href={`tel:${office.managerPhone}`}
                          className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                        >
                          {office.managerPhone}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Emergency Contact */}
                  {office.emergencyContact && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-xs text-red-600 mb-1">🚨 জরুরি যোগাযোগ</p>
                      <a
                        href={`tel:${office.emergencyContact}`}
                        className="text-sm font-medium text-red-700 hover:text-red-800 transition duration-200"
                      >
                        {office.emergencyContact}
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      ID: {office._id?.slice(-8)}
                    </span>
                    <Link
                      to={`/water-office/${office._id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                    >
                      বিস্তারিত দেখুন →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{offices.length}</div>
            <div className="text-sm text-gray-600">মোট অফিস</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {offices.filter(o => o.status === "Active").length}
            </div>
            <div className="text-sm text-gray-600">সক্রিয় অফিস</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">
              {offices.filter(o => o.type === "Water").length}
            </div>
            <div className="text-sm text-gray-600">পানি অফিস</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-500 mb-1">
              {offices.filter(o => o.type === "Gas").length}
            </div>
            <div className="text-sm text-gray-600">গ্যাস অফিস</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 সহায়তা</h3>
            <p className="text-sm text-gray-600 mb-4">
              আপনার এলাকার গ্যাস ও পানি অফিস খুঁজে পেতে উপরের সার্চ বক্স ব্যবহার করুন। 
              অফিসের সাথে যোগাযোগ করে বিল পেমেন্টের সঠিক পদ্ধতি জেনে নিন।
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <span>📞 জরুরি: ১৬১২৩</span>
              <span>🌐 ওয়াসা: www.wasa.gov.bd</span>
              <span>🔥 টিজিডিসিএল: www.titasgas.org.bd</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 গ্যাস ও পানি অফিস তথ্য সেবা | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default WaterOfficePage; 