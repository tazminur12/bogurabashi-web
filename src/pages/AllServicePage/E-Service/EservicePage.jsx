import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaDesktop, FaClock, FaCheckCircle, FaInfoCircle, FaExternalLinkAlt, FaMapMarkerAlt, FaPhone, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";

const EservicePage = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: eservices = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["public-esheba"],
    queryFn: async () => {
      const res = await axiosSecure.get("/esheba");
      return res.data;
    },
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600 text-lg">ই-সেবা লোড হচ্ছে...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">তথ্য লোড করতে সমস্যা</h3>
            <p className="text-gray-500">ই-সেবা তথ্য লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <FaDesktop className="text-4xl text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">🖥️ সরকারি ই-সেবা</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ডিজিটাল বাংলাদেশের লক্ষ্যে সরকারি সেবাসমূহ অনলাইনে পাওয়া যায়। 
            আপনার প্রয়োজনীয় সেবা নির্বাচন করে সহজেই আবেদন করুন।
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{eservices.length}</div>
            <div className="text-gray-600">মোট ই-সেবা</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {eservices.filter(s => s.status === "Active").length}
            </div>
            <div className="text-gray-600">সক্রিয় সেবা</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {eservices.filter(s => s.priority === "Urgent").length}
            </div>
            <div className="text-gray-600">জরুরি সেবা</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {eservices.filter(s => s.priority === "Featured").length}
            </div>
            <div className="text-gray-600">বৈশিষ্ট্যযুক্ত</div>
          </div>
        </div>

        {/* Services Grid */}
        {eservices.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🖥️</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো ই-সেবা নেই</h3>
            <p className="text-gray-500">বর্তমানে কোনো ই-সেবা উপলব্ধ নেই।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eservices.map((service, index) => (
              <Link
                key={service._id}
                to={`/eservice/${service._id}`}
                className="block"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden border border-gray-200 h-full">
                  {/* Service Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-medium">
                        #{index + 1}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)} {service.status === "Active" ? "সক্রিয়" : 
                         service.status === "Inactive" ? "নিষ্ক্রিয়" : 
                         service.status === "Maintenance" ? "রক্ষণাবেক্ষণ" : "শীঘ্রই আসছে"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    {service.subCategory && (
                      <p className="text-blue-100 text-sm mt-1">{service.subCategory}</p>
                    )}
                  </div>

                  {/* Service Content */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {service.description}
                    </p>

                    {/* Service Details */}
                    <div className="space-y-2 mb-4">
                      {service.category && (
                        <div className="flex items-center text-sm">
                          <FaInfoCircle className="text-blue-500 mr-2" />
                          <span className="text-gray-700">{service.category}</span>
                        </div>
                      )}
                      {service.processingTime && (
                        <div className="flex items-center text-sm">
                          <FaClock className="text-orange-500 mr-2" />
                          <span className="text-gray-700">{service.processingTime}</span>
                        </div>
                      )}
                      {service.fees && (
                        <div className="flex items-center text-sm">
                          <span className="text-green-600 mr-2">💰</span>
                          <span className="text-gray-700">{service.fees}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition duration-200 flex items-center justify-center gap-1">
                        <FaExternalLinkAlt className="text-xs" />
                        বিস্তারিত দেখুন
                      </button>
                      {service.websiteUrl && (
                        <a
                          href={service.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-md transition duration-200 flex items-center justify-center gap-1"
                        >
                          <FaGlobe className="text-xs" />
                          ওয়েবসাইট
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Priority Badge */}
                  {service.priority === "Urgent" && (
                    <div className="bg-red-500 text-white text-xs font-medium px-3 py-1 text-center">
                      ⚡ জরুরি সেবা
                    </div>
                  )}
                  {service.priority === "Featured" && (
                    <div className="bg-indigo-500 text-white text-xs font-medium px-3 py-1 text-center">
                      ⭐ বৈশিষ্ট্যযুক্ত সেবা
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 ই-সেবা ব্যবহারের টিপস</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                প্রয়োজনীয় কাগজপত্র প্রস্তুত রাখুন
              </div>
              <div className="flex items-center justify-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                সঠিক তথ্য দিয়ে আবেদন করুন
              </div>
              <div className="flex items-center justify-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                আবেদনের স্ট্যাটাস নিয়মিত চেক করুন
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

export default EservicePage; 