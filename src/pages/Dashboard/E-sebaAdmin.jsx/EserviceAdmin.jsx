import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaDesktop, FaClock, FaMoneyBill, FaGlobe, FaExternalLinkAlt } from "react-icons/fa";

const EserviceAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: infoList = [],
    isLoading,
  } = useQuery({
    queryKey: ["esheba"],
    queryFn: async () => {
      const res = await axiosSecure.get("/esheba");
      return res.data;
    },
    refetchInterval: 5000, // Auto refresh every 5 seconds
  });

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই সেবা তথ্য মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "না, বাতিল করুন",
    });
    
    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/esheba/${id}`);
        Swal.fire("মুছে ফেলা হয়েছে!", "সেবা তথ্য সফলভাবে মুছে ফেলা হয়েছে!", "success");
        queryClient.invalidateQueries({ queryKey: ["esheba"] });
      } catch {
        Swal.fire("ত্রুটি!", "সেবা তথ্য মুছে ফেলতে সমস্যা হয়েছে", "error");
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

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#333] mb-1">🖥️ ই-সেবা ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-600">সরকারি ই-সেবার তথ্য পরিচালনা করুন</p>
          </div>
          <Link
            to="/dashboard/add-eservice"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition duration-200 shadow-md hover:shadow-lg"
          >
            ➕ নতুন সেবা যোগ করুন
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600 text-sm">লোড হচ্ছে...</span>
            </div>
          ) : infoList.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🖥️</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো ই-সেবা নেই</h3>
              <p className="text-gray-500 text-sm mb-4">প্রথম ই-সেবা যোগ করে শুরু করুন!</p>
              <Link
                to="/dashboard/add-eservice"
                className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
              >
                ➕ প্রথম সেবা যোগ করুন
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {infoList.map((item, index) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200 bg-gradient-to-r from-blue-50 to-indigo-50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
                          {item.subCategory && (
                            <p className="text-blue-600 text-sm font-medium">{item.subCategory}</p>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="text-gray-600 text-sm leading-relaxed ml-11 mb-3">
                        {item.description}
                      </div>

                      {/* Details Grid */}
                      <div className="ml-11 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                        {item.category && (
                          <div className="flex items-center gap-2 text-sm">
                            <FaDesktop className="text-blue-500" />
                            <span className="text-gray-700">{item.category}</span>
                          </div>
                        )}
                        {item.processingTime && (
                          <div className="flex items-center gap-2 text-sm">
                            <FaClock className="text-orange-500" />
                            <span className="text-gray-700">{item.processingTime}</span>
                          </div>
                        )}
                        {item.fees && (
                          <div className="flex items-center gap-2 text-sm">
                            <FaMoneyBill className="text-green-500" />
                            <span className="text-gray-700">{item.fees}</span>
                          </div>
                        )}
                      </div>

                      {/* Status and Priority */}
                      <div className="flex flex-wrap items-center gap-2 ml-11">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status === "Active" ? "🟢 সক্রিয়" : 
                           item.status === "Inactive" ? "🔴 নিষ্ক্রিয়" : 
                           item.status === "Maintenance" ? "🟡 রক্ষণাবেক্ষণ" : "🟣 শীঘ্রই আসছে"}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority === "Featured" ? "⭐ বৈশিষ্ট্যযুক্ত" : 
                           item.priority === "Urgent" ? "⚡ জরুরি" : 
                           item.priority === "High" ? "🔥 উচ্চ" : "📋 সাধারণ"}
                        </span>
                        <span className="text-gray-500 text-xs">
                          ID: {item._id?.slice(-8)}
                        </span>
                      </div>

                      {/* URLs */}
                      {(item.websiteUrl || item.applicationUrl) && (
                        <div className="flex items-center gap-2 ml-11 mt-2">
                          {item.websiteUrl && (
                            <a
                              href={item.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              <FaGlobe />
                              ওয়েবসাইট
                            </a>
                          )}
                          {item.applicationUrl && (
                            <a
                              href={item.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-green-600 hover:text-green-800 text-xs font-medium"
                            >
                              <FaExternalLinkAlt />
                              আবেদন লিংক
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 lg:items-start mt-2 lg:mt-0">
                      <Link
                        to={`/dashboard/edit-eservice/${item._id}`}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center gap-1"
                      >
                        ✏️ সম্পাদনা
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center gap-1"
                      >
                        🗑️ মুছুন
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>📊 মোট সেবা:</span>
              <span className="font-semibold text-blue-600">{infoList.length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🟢 সক্রিয়:</span>
              <span className="font-semibold text-green-600">{infoList.filter(s => s.status === "Active").length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>⚡ জরুরি:</span>
              <span className="font-semibold text-red-600">{infoList.filter(s => s.priority === "Urgent").length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>⭐ বৈশিষ্ট্যযুক্ত:</span>
              <span className="font-semibold text-indigo-600">{infoList.filter(s => s.priority === "Featured").length}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 ই-সেবা ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default EserviceAdmin;
