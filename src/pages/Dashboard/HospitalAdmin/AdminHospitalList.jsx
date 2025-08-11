import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminHospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/hospitals`);
      console.log("Hospitals API response:", res.data); // Debug log
      // Handle both res.data.data and res.data
      let hospitalsData = [];
      if (Array.isArray(res.data)) {
        hospitalsData = res.data;
      } else if (Array.isArray(res.data.data)) {
        hospitalsData = res.data.data;
      } else if (res.data && typeof res.data === 'object') {
        // Try to find an array in any property
        const arr = Object.values(res.data).find(v => Array.isArray(v));
        if (arr) hospitalsData = arr;
      }
      setHospitals(hospitalsData);
    } catch (err) {
      console.error("Failed to fetch hospitals:", err);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "হাসপাতালের তথ্য লোড করতে ব্যর্থ হয়েছে।",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);
  

  // হাসপাতাল ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই হাসপাতালটি মুছে ফেললে আবার ফিরিয়ে আনা যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/hospitals/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("মুছে ফেলা হয়েছে!", "হাসপাতাল সফলভাবে মুছে ফেলা হয়েছে।", "success");
          fetchHospitals();
        } else {
          Swal.fire("ত্রুটি!", "হাসপাতাল মুছে ফেলা যায়নি। আবার চেষ্টা করুন।", "error");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("ত্রুটি!", "হাসপাতাল মুছে ফেলা যায়নি। আবার চেষ্টা করুন।", "error");
      }
    }
  };

  // Filtered hospitals
  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name?.toLowerCase().includes(filter.toLowerCase()) ||
    hospital.address?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded shadow mr-4"
          >
            &larr; Back
          </button>
          <h2 className="text-2xl font-bold text-blue-700">হাসপাতাল তালিকা</h2>
        </div>
        <Link to="/dashboard/add-hospital">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
            নতুন হাসপাতাল যোগ করুন
          </button>
        </Link>
      </div>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="নাম বা ঠিকানা দিয়ে ফিল্টার করুন"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-xs focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>
      {loading ? (
        <p className="text-center text-gray-500">লোড হচ্ছে...</p>
      ) : filteredHospitals.length === 0 ? (
        <p className="text-center text-gray-500">কোনো হাসপাতাল পাওয়া যায়নি</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-4 py-3 text-left">নাম</th>
                <th className="px-4 py-3 text-left">ঠিকানা</th>
                <th className="px-4 py-3 text-center">বেড</th>
                <th className="px-4 py-3 text-center">বিশেষায়িত</th>
                <th className="px-4 py-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hospital) => (
                <tr key={hospital._id} className="border-b">
                  <td className="px-4 py-3">{hospital.name}</td>
                  <td className="px-4 py-3">{hospital.address}</td>
                  <td className="px-4 py-3 text-center">{hospital.beds}</td>
                  <td className="px-4 py-3 text-center">
                    {hospital.specialties?.join(", ") || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <Link to={`/dashboard/edit-hospital/${hospital._id}`}>
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(hospital._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
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

export default AdminHospitalList;
