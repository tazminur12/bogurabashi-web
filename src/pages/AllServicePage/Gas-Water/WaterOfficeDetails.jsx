import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaCreditCard, FaClock, FaTint, FaFire, FaBuilding, FaPrint, FaShare, FaDownload, FaArrowLeft, FaCalendarAlt, FaUser, FaExclamationTriangle } from "react-icons/fa";
import Swal from "sweetalert2";

const WaterOfficeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    data: office,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["water-office-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/water-offices/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

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
        return <FaTint className="text-blue-500 text-2xl" />;
      case "Gas":
        return <FaFire className="text-orange-500 text-2xl" />;
      case "Both":
        return (
          <div className="flex gap-2">
            <FaTint className="text-blue-500 text-2xl" />
            <FaFire className="text-orange-500 text-2xl" />
          </div>
        );
      default:
        return <FaBuilding className="text-gray-500 text-2xl" />;
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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: office?.name,
          text: `${office?.name} - ${office?.address}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      Swal.fire("✅ কপি হয়েছে!", "লিংক ক্লিপবোর্ডে কপি হয়েছে", "success");
    }
  };

  const handleDownload = () => {
    const content = `
গ্যাস ও পানি অফিস তথ্য
========================

অফিস নাম: ${office?.name}
ধরন: ${getTypeLabel(office?.type)}
ঠিকানা: ${office?.address}
ফোন: ${office?.phone}
ইমেইল: ${office?.email || "N/A"}
ওয়েবসাইট: ${office?.website || "N/A"}
অফিস সময়: ${office?.officeHours || "N/A"}
বিল পেমেন্ট: ${office?.billPaymentInfo || "N/A"}
ম্যানেজার: ${office?.managerName || "N/A"}
ম্যানেজার ফোন: ${office?.managerPhone || "N/A"}
জরুরি যোগাযোগ: ${office?.emergencyContact || "N/A"}
সেবাসমূহ: ${office?.services || "N/A"}
পেমেন্ট পদ্ধতি: ${office?.paymentMethods || "N/A"}
স্ট্যাটাস: ${getStatusLabel(office?.status)}

আইডি: ${office?._id}
তারিখ: ${new Date().toLocaleDateString('bn-BD')}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${office?.name}-তথ্য.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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

  if (error || !office) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">অফিস পাওয়া যায়নি</h3>
            <p className="text-gray-500 text-sm mb-4">অনুরোধকৃত অফিস পাওয়া যায়নি।</p>
            <Link
              to="/water-offices"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              ← সব অফিসে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-200 text-sm font-medium"
          >
            <FaArrowLeft />
            ← ফিরে যান
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getOfficeTypeIcon(office.type)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{office.name}</h1>
                  <p className="text-gray-600 mb-2">{getTypeLabel(office.type)}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(office.status)}`}>
                      {getStatusIcon(office.status)} {getStatusLabel(office.status)}
                    </span>
                    <span className="text-xs text-gray-500">ID: {office._id?.slice(-8)}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
                  title="প্রিন্ট করুন"
                >
                  <FaPrint />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200"
                  title="শেয়ার করুন"
                >
                  <FaShare />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition duration-200"
                  title="ডাউনলোড করুন"
                >
                  <FaDownload />
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 মৌলিক তথ্য</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-red-500 text-sm mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">ঠিকানা</p>
                        <p className="text-gray-800">{office.address}</p>
                      </div>
                    </div>
                    
                    {office.phone && (
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-green-500 text-sm flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">ফোন নম্বর</p>
                          <a
                            href={`tel:${office.phone}`}
                            className="text-blue-600 hover:text-blue-800 transition duration-200"
                          >
                            {office.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {office.email && (
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-blue-500 text-sm flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">ইমেইল</p>
                          <a
                            href={`mailto:${office.email}`}
                            className="text-blue-600 hover:text-blue-800 transition duration-200"
                          >
                            {office.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {office.website && (
                      <div className="flex items-center gap-3">
                        <FaGlobe className="text-purple-500 text-sm flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">ওয়েবসাইট</p>
                          <a
                            href={office.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition duration-200"
                          >
                            ওয়েবসাইট দেখুন
                          </a>
                        </div>
                      </div>
                    )}

                    {office.officeHours && (
                      <div className="flex items-center gap-3">
                        <FaClock className="text-orange-500 text-sm flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">অফিস সময়</p>
                          <p className="text-gray-800">{office.officeHours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bill Payment Information */}
                {office.billPaymentInfo && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">💳 বিল পেমেন্ট তথ্য</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <FaCreditCard className="text-purple-500 text-sm mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">পেমেন্ট পদ্ধতি</p>
                          <p className="text-gray-800">{office.billPaymentInfo}</p>
                        </div>
                      </div>
                      
                      {office.paymentMethods && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">গ্রহণযোগ্য পেমেন্ট পদ্ধতি</p>
                          <p className="text-gray-800">{office.paymentMethods}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Management Information */}
                {office.managerName && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">👨‍💼 ব্যবস্থাপনা</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaUser className="text-green-500 text-sm flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">ম্যানেজার</p>
                          <p className="text-gray-800 font-medium">{office.managerName}</p>
                        </div>
                      </div>
                      
                      {office.managerPhone && (
                        <div className="flex items-center gap-3">
                          <FaPhone className="text-green-500 text-sm flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">ম্যানেজার ফোন</p>
                            <a
                              href={`tel:${office.managerPhone}`}
                              className="text-blue-600 hover:text-blue-800 transition duration-200"
                            >
                              {office.managerPhone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {office.emergencyContact && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🚨 জরুরি যোগাযোগ</h3>
                    <div className="flex items-center gap-3">
                      <FaExclamationTriangle className="text-red-500 text-sm flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">জরুরি ফোন নম্বর</p>
                        <a
                          href={`tel:${office.emergencyContact}`}
                          className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                        >
                          {office.emergencyContact}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Services */}
                {office.services && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🔧 প্রদত্ত সেবাসমূহ</h3>
                    <p className="text-gray-800">{office.services}</p>
                  </div>
                )}

                {/* Additional Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 অতিরিক্ত তথ্য</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>স্ট্যাটাস:</strong> {getStatusLabel(office.status)}</p>
                    <p><strong>ধরন:</strong> {getTypeLabel(office.type)}</p>
                    {office.createdAt && (
                      <p><strong>তৈরির তারিখ:</strong> {new Date(office.createdAt).toLocaleDateString('bn-BD')}</p>
                    )}
                    {office.updatedAt && (
                      <p><strong>সর্বশেষ আপডেট:</strong> {new Date(office.updatedAt).toLocaleDateString('bn-BD')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ দ্রুত অ্যাকশন</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`tel:${office.phone}`}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200"
            >
              <FaPhone />
              কল করুন
            </a>
            <a
              href={`mailto:${office.email}`}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
            >
              <FaEnvelope />
              ইমেইল করুন
            </a>
            <Link
              to="/water-offices"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200"
            >
              <FaBuilding />
              সব অফিস দেখুন
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              💡 <strong>টিপ:</strong> বিল পেমেন্টের আগে অফিসের সাথে যোগাযোগ করে সঠিক পদ্ধতি জেনে নিন।
            </p>
          </div>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 গ্যাস ও পানি অফিস তথ্য সেবা | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default WaterOfficeDetails; 