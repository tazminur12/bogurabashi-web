import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaUser, FaBuilding, FaUsers, FaCalendarAlt, FaClock, FaPrint, FaShare, FaDownload, FaArrowLeft, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MunicipalityDetails = () => {
  const { id } = useParams();
  const [municipality, setMunicipality] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchMunicipality();
  }, [id]);

  const fetchMunicipality = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosSecure.get(`/municipalities/${id}`);
      setMunicipality(res.data);
    } catch (error) {
      console.error("Municipality fetch error:", error);
      setError("পৌরসভা তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setIsLoading(false);
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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${municipality?.name} - পৌরসভা তথ্য`,
          text: `${municipality?.name} পৌরসভার বিস্তারিত তথ্য দেখুন`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("লিংক কপি হয়েছে!");
    }
  };

  const handleDownload = () => {
    if (!municipality) return;

    const content = `
পৌরসভা তথ্য - ${municipality.name}
=====================================

🏛️ পৌরসভার নাম: ${municipality.name}
👨‍💼 মেয়র: ${municipality.mayor || "N/A"}
📍 ঠিকানা: ${municipality.address || "N/A"}
📞 ফোন: ${municipality.phone || "N/A"}
📧 ইমেইল: ${municipality.email || "N/A"}
🌐 ওয়েবসাইট: ${municipality.website || "N/A"}
🏘️ ওয়ার্ড সংখ্যা: ${municipality.wards || "N/A"}
👥 জনসংখ্যা: ${municipality.population || "N/A"}
📏 আয়তন: ${municipality.area || "N/A"} বর্গ কিমি
📅 প্রতিষ্ঠার বছর: ${municipality.established || "N/A"}
🕐 অফিস সময়: ${municipality.officeHours || "N/A"}
🚨 জরুরি যোগাযোগ: ${municipality.emergencyContact || "N/A"}
🛠️ সেবাসমূহ: ${municipality.services || "N/A"}
📊 স্ট্যাটাস: ${getStatusLabel(municipality.status)}

ডাউনলোডের তারিখ: ${new Date().toLocaleDateString('bn-BD')}
সূত্র: BoguraBashi - বগুড়া বাসী
    `;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${municipality.name}-পৌরসভা-তথ্য.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">লোড হচ্ছে...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !municipality) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">পৌরসভা পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-sm mb-4">{error || "অনুরোধকৃত পৌরসভা পাওয়া যায়নি।"}</p>
            <Link
              to="/municipalities"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              ← সব পৌরসভায় ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/municipalities"
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-200 text-sm font-medium"
          >
            <FaArrowLeft />
            ← সব পৌরসভায় ফিরে যান
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#333] mb-2">{municipality.name}</h1>
              <p className="text-gray-600">বগুড়া জেলার পৌরসভা</p>
            </div>
            <div className="text-4xl">🏛️</div>
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(municipality.status)}`}>
              {getStatusIcon(municipality.status)} {getStatusLabel(municipality.status)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              <FaPrint />
              প্রিন্ট করুন
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              <FaShare />
              শেয়ার করুন
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              <FaDownload />
              ডাউনলোড করুন
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 মৌলিক তথ্য</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="text-green-500 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">মেয়র:</span>
                    <span className="ml-2 text-gray-600">{municipality.mayor || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-red-500 text-lg mt-1" />
                  <div>
                    <span className="font-medium text-gray-700">ঠিকানা:</span>
                    <span className="ml-2 text-gray-600">{municipality.address || "N/A"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-orange-500 text-lg" />
                  <div>
                    <span className="font-medium text-gray-700">ওয়ার্ড সংখ্যা:</span>
                    <span className="ml-2 text-gray-600">{municipality.wards || "N/A"}</span>
                  </div>
                </div>
                {municipality.population && (
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-teal-500 text-lg" />
                    <div>
                      <span className="font-medium text-gray-700">জনসংখ্যা:</span>
                      <span className="ml-2 text-gray-600">{municipality.population.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                {municipality.area && (
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-blue-500 text-lg" />
                    <div>
                      <span className="font-medium text-gray-700">আয়তন:</span>
                      <span className="ml-2 text-gray-600">{municipality.area} বর্গ কিলোমিটার</span>
                    </div>
                  </div>
                )}
                {municipality.established && (
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-purple-500 text-lg" />
                    <div>
                      <span className="font-medium text-gray-700">প্রতিষ্ঠার বছর:</span>
                      <span className="ml-2 text-gray-600">{municipality.established}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">📞 যোগাযোগের তথ্য</h2>
              <div className="space-y-4">
                {municipality.phone && (
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-blue-500 text-lg" />
                    <div>
                      <span className="font-medium text-gray-700">ফোন:</span>
                      <span className="ml-2 text-gray-600">{municipality.phone}</span>
                    </div>
                  </div>
                )}
                {municipality.email && (
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-purple-500 text-lg" />
                    <div>
                      <span className="font-medium text-gray-700">ইমেইল:</span>
                      <span className="ml-2 text-gray-600">{municipality.email}</span>
                    </div>
                  </div>
                )}
                {municipality.website && (
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-indigo-500 text-lg" />
                    <div>
                      <span className="font-medium text-gray-700">ওয়েবসাইট:</span>
                      <a 
                        href={municipality.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:underline"
                      >
                        {municipality.website}
                      </a>
                    </div>
                  </div>
                )}
                {municipality.emergencyContact && (
                  <div className="flex items-center gap-3">
                    <FaExclamationTriangle className="text-red-500 text-lg" />
                    <div>
                      <span className="font-medium text-gray-700">জরুরি যোগাযোগ:</span>
                      <span className="ml-2 text-gray-600">{municipality.emergencyContact}</span>
                    </div>
                  </div>
                )}
                {municipality.officeHours && (
                  <div className="flex items-center gap-3">
                    <FaClock className="text-yellow-500 text-lg" />
                    <div>
                      <span className="font-medium text-gray-700">অফিস সময়:</span>
                      <span className="ml-2 text-gray-600">{municipality.officeHours}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            {municipality.services && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">🛠️ প্রদত্ত সেবাসমূহ</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">{municipality.services}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 দ্রুত তথ্য</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">স্ট্যাটাস:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(municipality.status)}`}>
                    {getStatusIcon(municipality.status)} {getStatusLabel(municipality.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ওয়ার্ড:</span>
                  <span className="font-medium">{municipality.wards || "N/A"}</span>
                </div>
                {municipality.population && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">জনসংখ্যা:</span>
                    <span className="font-medium">{municipality.population.toLocaleString()}</span>
                  </div>
                )}
                {municipality.area && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">আয়তন:</span>
                    <span className="font-medium">{municipality.area} বর্গ কিমি</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Actions */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📞 দ্রুত যোগাযোগ</h3>
              <div className="space-y-3">
                {municipality.phone && (
                  <a
                    href={`tel:${municipality.phone}`}
                    className="flex items-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
                  >
                    <FaPhone />
                    কল করুন
                  </a>
                )}
                {municipality.email && (
                  <a
                    href={`mailto:${municipality.email}`}
                    className="flex items-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
                  >
                    <FaEnvelope />
                    ইমেইল করুন
                  </a>
                )}
                {municipality.website && (
                  <a
                    href={municipality.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
                  >
                    <FaGlobe />
                    ওয়েবসাইট দেখুন
                  </a>
                )}
              </div>
            </div>

            {/* Last Updated */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 text-center">
                সর্বশেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-gray-500 text-xs text-center">
          © 2025 পৌরসভা সেবা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default MunicipalityDetails; 