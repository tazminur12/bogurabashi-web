import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaPhone, FaUser, FaBuilding, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

const MunicipalityAdmin = () => {
  const [municipalities, setMunicipalities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchMunicipalities();
  }, []);

  const fetchMunicipalities = async () => {
    try {
      setIsLoading(true);
      const res = await axiosSecure.get("/municipalities");
      setMunicipalities(res.data);
    } catch (error) {
      console.error("Municipality fetch error:", error);
      Swal.fire("ত্রুটি!", "পৌরসভা তথ্য লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই পৌরসভার তথ্য মুছে ফেলা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "না, বাতিল করুন",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/municipalities/${id}`);
        fetchMunicipalities();
        Swal.fire("মুছে ফেলা হয়েছে!", "পৌরসভা সফলভাবে মুছে ফেলা হয়েছে!", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("ত্রুটি!", "পৌরসভা মুছে ফেলতে সমস্যা হয়েছে", "error");
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
      <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#333] mb-1">🏛️ পৌরসভা ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-600">বগুড়া জেলার পৌরসভার তথ্য পরিচালনা করুন</p>
          </div>
        <Link
          to="/dashboard/add-municipality"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
            <FaPlus />
            ➕ নতুন পৌরসভা যোগ করুন
        </Link>
      </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600 text-sm">লোড হচ্ছে...</span>
            </div>
          ) : municipalities.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো পৌরসভা নেই</h3>
              <p className="text-gray-500 text-sm mb-4">প্রথম পৌরসভা যোগ করে শুরু করুন!</p>
              <Link
                to="/dashboard/add-municipality"
                className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
              >
                ➕ প্রথম পৌরসভা যোগ করুন
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">🏛️ পৌরসভা নাম</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">👨‍💼 মেয়র</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📞 ফোন</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📍 ঠিকানা</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">🏘️ ওয়ার্ড</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📊 অবস্থা</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-gray-700">⚙️ অ্যাকশন</th>
            </tr>
          </thead>
                <tbody className="divide-y divide-gray-200">
                  {municipalities.map((municipality, index) => (
                    <tr key={municipality._id} className="hover:bg-gray-50 transition duration-200">
                      <td className="py-4 px-4">
                        <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{municipality.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <FaBuilding className="text-gray-500 text-sm" />
                            <span className="text-xs text-gray-500">পৌরসভা</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-green-500 text-sm" />
                          <span className="text-gray-700">{municipality.mayor || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-blue-500 text-sm" />
                          <span className="text-gray-700">{municipality.phone || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-red-500 text-sm" />
                          <span className="text-gray-700 text-sm">{municipality.address || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                          {municipality.wards || "N/A"} ওয়ার্ড
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(municipality.status)}`}>
                          {getStatusIcon(municipality.status)} {getStatusLabel(municipality.status)}
                  </span>
                </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                    <Link
                            to={`/dashboard/edit-municipality/${municipality._id}`}
                            className="p-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-lg transition duration-200 flex items-center justify-center"
                            title="সম্পাদনা করুন"
                    >
                            <FaEdit className="text-sm" />
                    </Link>
                    <button
                            onClick={() => handleDelete(municipality._id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 flex items-center justify-center"
                            title="মুছে ফেলুন"
                    >
                            <FaTrash className="text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>📊 মোট পৌরসভা:</span>
              <span className="font-semibold text-blue-600">{municipalities.length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🟢 সক্রিয়:</span>
              <span className="font-semibold text-green-600">{municipalities.filter(m => m.status === "Active").length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🔴 নিষ্ক্রিয়:</span>
              <span className="font-semibold text-red-600">{municipalities.filter(m => m.status === "Inactive").length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🟡 রক্ষণাবেক্ষণ:</span>
              <span className="font-semibold text-yellow-600">{municipalities.filter(m => m.status === "Maintenance").length}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 পৌরসভা ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default MunicipalityAdmin;
