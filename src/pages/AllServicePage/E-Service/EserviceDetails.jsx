import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FaDesktop, 
  FaClock, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaExternalLinkAlt, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaGlobe, 
  FaArrowLeft,
  FaFileAlt,
  FaUserCheck,
  FaListOl,
  FaStar,
  FaPrint,
  FaShare,
  FaDownload
} from "react-icons/fa";

const EserviceDetails = () => {
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: service,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["eservice-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/esheba/${id}`);
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
      case "Coming Soon":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Normal":
        return "bg-blue-100 text-blue-800";
      case "Featured":
        return "bg-indigo-100 text-indigo-800";
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
      case "Coming Soon":
        return "🟣";
      default:
        return "⚪";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.title,
          text: service?.description,
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
ই-সেবা বিবরণ
================

সেবার নাম: ${service?.title}
ক্যাটাগরি: ${service?.category}
উপ-ক্যাটাগরি: ${service?.subCategory || 'N/A'}
স্ট্যাটাস: ${service?.status}
প্রক্রিয়াকরণ সময়: ${service?.processingTime || 'N/A'}
ফি/চার্জ: ${service?.fees || 'N/A'}

বিস্তারিত বিবরণ:
${service?.description}

প্রয়োজনীয় কাগজপত্র:
${service?.documents || 'N/A'}

যোগ্যতা:
${service?.eligibility || 'N/A'}

আবেদনের নির্দেশনা:
${service?.instructions || 'N/A'}

সেবার সুবিধা:
${service?.benefits || 'N/A'}

যোগাযোগের তথ্য:
${service?.contactInfo || 'N/A'}

অফিসের সময়:
${service?.officeHours || 'N/A'}

অফিসের অবস্থান:
${service?.location || 'N/A'}

ওয়েবসাইট: ${service?.websiteUrl || 'N/A'}
আবেদন লিংক: ${service?.applicationUrl || 'N/A'}

সংগ্রহের তারিখ: ${new Date().toLocaleDateString('bn-BD')}
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${service?.title || 'eservice'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600 text-lg">সেবার তথ্য লোড হচ্ছে...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">সেবা পাওয়া যায়নি</h3>
            <p className="text-gray-500 mb-4">অনুরোধকৃত ই-সেবা পাওয়া যায়নি।</p>
            <Link
              to="/eservice"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              ← সব ই-সেবায় ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-sm font-medium shadow-md"
          >
            <FaArrowLeft />
            ← ফিরে যান
          </button>
        </div>

        {/* Service Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaDesktop className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{service.title}</h1>
                  {service.subCategory && (
                    <p className="text-blue-600 font-medium">{service.subCategory}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                  {getStatusIcon(service.status)} {service.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(service.priority)}`}>
                  {service.priority === "Featured" ? "⭐ বৈশিষ্ট্যযুক্ত" : 
                   service.priority === "Urgent" ? "⚡ জরুরি" : 
                   service.priority === "High" ? "🔥 উচ্চ" : "📋 সাধারণ"}
                </span>
                {service.category && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {service.category}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition duration-200 flex items-center gap-2"
              >
                <FaPrint />
                প্রিন্ট
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200 flex items-center gap-2"
              >
                <FaShare />
                শেয়ার
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition duration-200 flex items-center gap-2"
              >
                <FaDownload />
                ডাউনলোড
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" />
                সেবার বিবরণ
              </h2>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>

            {/* Instructions */}
            {service.instructions && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaListOl className="text-green-500" />
                  আবেদনের নির্দেশনা
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.instructions}
                </div>
              </div>
            )}

            {/* Benefits */}
            {service.benefits && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  সেবার সুবিধা
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.benefits}
                </div>
              </div>
            )}

            {/* Documents */}
            {service.documents && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaFileAlt className="text-purple-500" />
                  প্রয়োজনীয় কাগজপত্র
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.documents}
                </div>
              </div>
            )}

            {/* Eligibility */}
            {service.eligibility && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUserCheck className="text-indigo-500" />
                  যোগ্যতা
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {service.eligibility}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 দ্রুত তথ্য</h3>
              <div className="space-y-3">
                {service.processingTime && (
                  <div className="flex items-center gap-2">
                    <FaClock className="text-orange-500" />
                    <span className="text-sm text-gray-600">প্রক্রিয়াকরণ সময়:</span>
                    <span className="text-sm font-medium">{service.processingTime}</span>
                  </div>
                )}
                {service.fees && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">💰</span>
                    <span className="text-sm text-gray-600">ফি/চার্জ:</span>
                    <span className="text-sm font-medium">{service.fees}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-sm text-gray-600">স্ট্যাটাস:</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            {(service.contactInfo || service.officeHours || service.location) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📞 যোগাযোগ</h3>
                <div className="space-y-3">
                  {service.contactInfo && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaPhone className="text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">যোগাযোগের তথ্য</span>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{service.contactInfo}</p>
                    </div>
                  )}
                  {service.officeHours && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaClock className="text-green-500" />
                        <span className="text-sm font-medium text-gray-700">অফিসের সময়</span>
                      </div>
                      <p className="text-sm text-gray-600">{service.officeHours}</p>
                    </div>
                  )}
                  {service.location && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="text-sm font-medium text-gray-700">অফিসের অবস্থান</span>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{service.location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 দ্রুত পদক্ষেপ</h3>
              <div className="space-y-3">
                {service.applicationUrl && (
                  <a
                    href={service.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FaExternalLinkAlt />
                    আবেদন করুন
                  </a>
                )}
                {service.websiteUrl && (
                  <a
                    href={service.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FaGlobe />
                    ওয়েবসাইট দেখুন
                  </a>
                )}
                <Link
                  to="/eservice"
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
                >
                  <FaDesktop />
                  সব ই-সেবা দেখুন
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          © 2025 সরকারি ই-সেবা পোর্টাল | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default EserviceDetails; 