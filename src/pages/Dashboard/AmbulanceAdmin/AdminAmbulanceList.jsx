import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaAmbulance, FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaPhone, FaExclamationTriangle, FaSpinner, FaSearch, FaFilter } from "react-icons/fa";

const AdminAmbulanceList = () => {
  const axiosSecure = useAxiosSecure();
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch ambulance data securely
  const fetchAmbulances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosSecure.get("/ambulances");
      setAmbulances(response.data);
    } catch (error) {
      setError("ডাটা লোডিংয়ে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  // Delete ambulance with confirmation dialog
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই সার্ভিসটি মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে দিন",
      cancelButtonText: "না",
    });

    if (result.isConfirmed) {
      setDeletingId(id);
      try {
        const res = await axiosSecure.delete(`/ambulances/${id}`);
        if (res.data.deletedCount > 0) {
          setAmbulances((prev) => prev.filter((a) => a._id !== id));
          Swal.fire("মুছে ফেলা হয়েছে!", "সার্ভিস সফলভাবে মুছে গেছে।", "success");
        } else {
          Swal.fire("ত্রুটি", "সার্ভিস মুছে ফেলা সম্ভব হয়নি।", "error");
        }
      } catch (error) {
        Swal.fire("ত্রুটি", "সার্ভিস মুছে ফেলা সম্ভব হয়নি।", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Filter and search ambulances
  const filteredAmbulances = ambulances.filter((ambulance) => {
    const matchesSearch = ambulance.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambulance.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambulance.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "available" && ambulance.availability) ||
                         (filterStatus === "unavailable" && !ambulance.availability);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (availability) => {
    return availability 
      ? "bg-gradient-to-r from-green-500 to-green-600" 
      : "bg-gradient-to-r from-red-500 to-red-600";
  };

  const getStatusText = (availability) => {
    return availability ? "প্রস্তুত" : "অপ্রস্তুত";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4">
            <FaAmbulance className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            অ্যাম্বুলেন্স সার্ভিস তালিকা
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            সব অ্যাম্বুলেন্স সার্ভিসের তালিকা এবং ব্যবস্থাপনা
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-full inline-block mb-3">
              <FaAmbulance className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{ambulances.length}</h3>
            <p className="text-gray-600 text-sm font-medium">মোট সার্ভিস</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-full inline-block mb-3">
              <FaPhone className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {ambulances.filter(a => a.availability).length}
            </h3>
            <p className="text-gray-600 text-sm font-medium">প্রস্তুত সার্ভিস</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-full inline-block mb-3">
              <FaExclamationTriangle className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {ambulances.filter(a => !a.availability).length}
            </h3>
            <p className="text-gray-600 text-sm font-medium">অপ্রস্তুত সার্ভিস</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-full inline-block mb-3">
              <FaMapMarkerAlt className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {new Set(ambulances.map(a => a.area)).size}
            </h3>
            <p className="text-gray-600 text-sm font-medium">এলাকা</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="সার্ভিস, এলাকা বা ধরণ খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-sm"
                />
              </div>
              
              {/* Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 cursor-pointer text-sm"
                >
                  <option value="all">সব স্ট্যাটাস</option>
                  <option value="available">প্রস্তুত</option>
                  <option value="unavailable">অপ্রস্তুত</option>
                </select>
              </div>
            </div>
            
            {/* Add Button */}
            <Link to="/dashboard/add-ambulance">
              <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center text-sm">
                <FaPlus className="mr-2" />
                নতুন অ্যাম্বুলেন্স যোগ করুন
              </button>
            </Link>
          </div>
        </div>

        {/* Loading and Error Handling */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-200 border-t-blue-600 mx-auto mb-3"></div>
              <p className="text-blue-600 font-semibold text-lg">তথ্য লোড হচ্ছে...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="text-red-500 text-4xl mb-3">⚠️</div>
            <p className="text-red-600 font-semibold text-lg mb-3">{error}</p>
            <button
              onClick={fetchAmbulances}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-sm"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 text-center">
              <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-md border border-gray-100">
                <FaSearch className="text-blue-600 mr-2 text-sm" />
                <span className="text-gray-700 text-sm">
                  <span className="font-bold text-blue-600">{filteredAmbulances.length}</span> টি সার্ভিস পাওয়া গেছে
                </span>
              </div>
            </div>

            {/* Ambulance Cards */}
            {filteredAmbulances.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-lg border border-gray-100">
                <div className="text-gray-400 text-4xl mb-3">🚑</div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">কোনো সার্ভিস খুঁজে পাওয়া যায়নি</h3>
                <p className="text-gray-500 text-sm mb-4">অনুগ্রহ করে অন্য শব্দ দিয়ে খুঁজুন</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-sm"
                >
                  সব ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAmbulances.map((ambulance) => (
                  <div
                    key={ambulance._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-red-500 to-blue-600 p-4 text-white text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                        <FaAmbulance className="text-white text-lg" />
                      </div>
                      <h3 className="text-lg font-bold mb-1">{ambulance.serviceName}</h3>
                      <div className="flex items-center justify-center text-blue-100 text-sm">
                        <FaMapMarkerAlt className="mr-2" />
                        {ambulance.area}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      {/* Type */}
                      <div className="mb-3">
                        <span className="text-xs text-gray-500 font-medium">ধরণ</span>
                        <p className="text-base font-semibold text-gray-800">{ambulance.type}</p>
                      </div>

                      {/* Status */}
                      <div className="mb-3">
                        <span className="text-xs text-gray-500 font-medium">স্ট্যাটাস</span>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(ambulance.availability)}`}>
                            {getStatusText(ambulance.availability)}
                          </span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mb-4 space-y-1">
                        <div className="flex items-center text-gray-600">
                          <FaPhone className="mr-2 text-blue-500 text-sm" />
                          <span className="text-xs">{ambulance.contact}</span>
                        </div>
                        {ambulance.emergencyNumber && (
                          <div className="flex items-center text-gray-600">
                            <FaExclamationTriangle className="mr-2 text-red-500 text-sm" />
                            <span className="text-xs">{ambulance.emergencyNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      {ambulance.features && ambulance.features.length > 0 && (
                        <div className="mb-4">
                          <span className="text-xs text-gray-500 font-medium block mb-1">সুবিধাসমূহ</span>
                          <div className="flex flex-wrap gap-1">
                            {ambulance.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {feature}
                              </span>
                            ))}
                            {ambulance.features.length > 3 && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                +{ambulance.features.length - 3} আরও
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link to={`/dashboard/edit-ambulance/${ambulance._id}`} className="flex-1">
                          <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm">
                            <FaEdit className="mr-1" />
                            এডিট
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(ambulance._id)}
                          disabled={deletingId === ambulance._id}
                          className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center text-sm ${
                            deletingId === ambulance._id
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                          }`}
                        >
                          {deletingId === ambulance._id ? (
                            <>
                              <FaSpinner className="animate-spin mr-1" />
                              মুছে চলছে...
                            </>
                          ) : (
                            <>
                              <FaTrash className="mr-1" />
                              ডিলিট
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer Note */}
        {!loading && !error && filteredAmbulances.length > 0 && (
          <div className="mt-8 text-center p-4 bg-white rounded-lg shadow-lg border border-gray-100">
            <p className="text-gray-600 text-xs">
              সর্বশেষ আপডেট: {new Date().toLocaleDateString('bn-BD')} | 
              মোট <span className="font-semibold text-blue-600">{ambulances.length}</span> টি অ্যাম্বুলেন্স সার্ভিস
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAmbulanceList;
