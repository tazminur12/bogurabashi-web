import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const DestinationDashboard = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Data load
  const fetchDestinations = async () => {
    try {
      const res = await axiosSecure.get("/destinations?district=bogura");
      setDestinations(res.data);
    } catch {
      Swal.fire("ত্রুটি", "তথ্য লোড করা যায়নি", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই গন্তব্যটি মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে দিন!",
      cancelButtonText: "না, থাক",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/destinations/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "গন্তব্যটি মুছে ফেলা হয়েছে", "success");
          fetchDestinations();
        }
      } catch {
        Swal.fire("ত্রুটি", "ডিলিট করা যায়নি", "error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800">📍 বগুড়া গন্তব্যসমূহ</h2>
        <button
          onClick={() => navigate("/dashboard/add-destination")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
        >
          ➕ নতুন গন্তব্য
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 py-10">🔄 তথ্য লোড হচ্ছে...</div>
      ) : destinations.length === 0 ? (
        <div className="text-center text-gray-500 py-10">😔 কোনো গন্তব্য পাওয়া যায়নি</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-4 font-semibold text-gray-700">নাম</th>
                <th className="p-4 font-semibold text-gray-700">অবস্থান</th>
                <th className="p-4 font-semibold text-gray-700">বিভাগ</th>
                <th className="p-4 font-semibold text-gray-700">ছবি</th>
                <th className="p-4 font-semibold text-gray-700">একশন</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.location}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-24 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">ছবি নেই</span>
                    )}
                  </td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => navigate(`/dashboard/edit-destination/${item._id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      ✏️ এডিট
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      🗑️ ডিলিট
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DestinationDashboard;
