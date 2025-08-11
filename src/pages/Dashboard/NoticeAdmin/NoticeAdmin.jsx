import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaBell } from "react-icons/fa";

const NoticeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notices from backend
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/notices");
      setNotices(res.data);
    } catch (error) {
      console.error("নোটিশ লোড করতে সমস্যা হয়েছে:", error);
      Swal.fire("ত্রুটি!", "নোটিশ লোড করতে সমস্যা হয়েছে!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই নোটিশটি স্থায়ীভাবে মুছে ফেলা হবে।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল করুন",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/notices/${id}`);
        Swal.fire("মুছে ফেলা হয়েছে!", "নোটিশ সফলভাবে মুছে ফেলা হয়েছে!", "success");
        fetchNotices();
      } catch (error) {
        console.error("নোটিশ মুছতে সমস্যা হয়েছে:", error);
        Swal.fire("ত্রুটি!", "নোটিশ মুছতে সমস্যা হয়েছে।", "error");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "তারিখ উল্লেখ নেই";
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">নোটিশ ব্যবস্থাপনা</h1>
            <p className="text-gray-600">সকল নোটিশ দেখুন, সম্পাদনা করুন এবং পরিচালনা করুন</p>
          </div>
          <Link
            to="/dashboard/add-notice"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 mt-4 sm:mt-0"
          >
            <FaPlus className="mr-2" />
            নতুন নোটিশ যোগ করুন
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaBell className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">মোট নোটিশ</p>
              <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaEye className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">সক্রিয় নোটিশ</p>
              <p className="text-2xl font-bold text-gray-900">
                {notices.filter(notice => notice.publishDate && new Date(notice.publishDate) <= new Date()).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaCalendarAlt className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">আজকের নোটিশ</p>
              <p className="text-2xl font-bold text-gray-900">
                {notices.filter(notice => {
                  if (!notice.publishDate) return false;
                  const today = new Date().toDateString();
                  const publishDate = new Date(notice.publishDate).toDateString();
                  return today === publishDate;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">সকল নোটিশ</h2>
        </div>
        
        <div className="p-6">
          {notices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FaBell className="text-6xl mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">কোন নোটিশ পাওয়া যায়নি</h3>
              <p className="text-gray-500 mb-4">এখনই আপনার প্রথম নোটিশ যোগ করুন</p>
              <Link
                to="/dashboard/add-notice"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <FaPlus className="mr-2" />
                প্রথম নোটিশ যোগ করুন
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {notice.title}
                        </h3>
                        <div className="flex space-x-2 ml-4">
                          <Link
                            to={`/dashboard/edit-notice/${notice._id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            <FaEdit className="mr-1" />
                            সম্পাদনা
                          </Link>
                          <button
                            onClick={() => handleDelete(notice._id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm font-medium transition-colors duration-200"
                          >
                            <FaTrash className="mr-1" />
                            মুছুন
                          </button>
                        </div>
                      </div>
                      
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {notice.description}
                        </p>
                      </div>
                      
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-2" />
                        <span>প্রকাশের তারিখ: {formatDate(notice.publishDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeAdmin;
