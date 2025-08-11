import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // Adjust path accordingly

const LawyerDashboard = () => {
  const [lawyers, setLawyers] = useState([]);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Backend থেকে সব আইনজীবী লোড করা
  const fetchLawyers = async () => {
    try {
      const res = await axiosSecure.get("/lawyers");
      setLawyers(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "তথ্য লোড করতে ব্যর্থ", "error");
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  // মুছে ফেলা হ্যান্ডলার
  const handleDelete = (id) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই আইনজীবীর তথ্য মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে দিন!",
      cancelButtonText: "না, বাতিল করুন",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/lawyers/${id}`);
          if (res.data.deletedCount > 0) {
            Swal.fire("ডিলিট হয়েছে!", "তথ্য সফলভাবে মুছে ফেলা হয়েছে", "success");
            setLawyers((prev) => prev.filter((lawyer) => lawyer._id !== id));
          } else {
            Swal.fire("ত্রুটি", "আইনজীবী পাওয়া যায়নি", "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("ত্রুটি", "ডিলিট ব্যর্থ হয়েছে", "error");
        }
      }
    });
  };

  // Approve হ্যান্ডলার
  const handleApprove = (id) => {
    Swal.fire({
      title: "অনুমোদন নিশ্চিত করুন",
      text: "আপনি কি এই আইনজীবীকে অনুমোদন করতে চান?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, অনুমোদন দিন",
      cancelButtonText: "না",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/lawyers/${id}`, { approved: true });
          if (res.data.modifiedCount > 0 || res.data.success) {
            Swal.fire("সফল!", "আইনজীবী অনুমোদিত হয়েছেন", "success");
            fetchLawyers();
          } else {
            Swal.fire("ত্রুটি", "অনুমোদন ব্যর্থ হয়েছে", "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("ত্রুটি", "অনুমোদন ব্যর্থ হয়েছে", "error");
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">আইনজীবী ড্যাশবোর্ড</h2>
        <button
          onClick={() => navigate("/add-lawyer")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          নতুন আইনজীবী যোগ করুন
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">নাম</th>
              <th className="p-4">বিভাগ</th>
              <th className="p-4">অবস্থান</th>
              <th className="p-4">যোগাযোগ</th>
              <th className="p-4">স্ট্যাটাস</th>
              <th className="p-4">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {lawyers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  কোনো আইনজীবী পাওয়া যায়নি
                </td>
              </tr>
            )}
            {lawyers.map((lawyer) => (
              <tr key={lawyer._id} className="border-b">
                <td className="p-4">{lawyer.name}</td>
                <td className="p-4">{lawyer.category}</td>
                <td className="p-4">{lawyer.chamber}</td>
                <td className="p-4">{lawyer.contact}</td>
                <td className="p-4">
                  {lawyer.approved ? (
                    <span className="text-green-600 font-semibold">Approved</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Pending</span>
                  )}
                </td>
                <td className="p-4 space-x-2">
                  {!lawyer.approved && (
                    <button
                      onClick={() => handleApprove(lawyer._id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/dashboard/edit-lawyer/${lawyer._id}`)}
                    className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(lawyer._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    ডিলিট
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LawyerDashboard;
