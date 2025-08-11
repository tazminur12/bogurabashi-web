import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminBloodDonorList = () => {
  const [donors, setDonors] = useState([]);
  const axiosSecure = useAxiosSecure();

  // Fetch all donors
  const fetchDonors = async () => {
    try {
      const res = await axiosSecure.get(`/donors`);
      const donorList = Array.isArray(res.data?.data) ? res.data.data : [];
      setDonors(donorList);
    } catch (error) {
      console.error("Error fetching donors:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "রক্তদাতাদের তথ্য লোড করতে ব্যর্থ হয়েছে।",
      });
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // Delete Donor
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই রক্তদাতাকে মুছে ফেললে আবার ফিরিয়ে আনা যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/donors/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("মুছে ফেলা হয়েছে!", "রক্তদাতা সফলভাবে মুছে ফেলা হয়েছে।", "success");
          fetchDonors();
        } else {
          Swal.fire("ত্রুটি!", "রক্তদাতা মুছে ফেলা যায়নি। আবার চেষ্টা করুন।", "error");
        }
      } catch (error) {
        console.error("Error deleting donor:", error);
        Swal.fire("ত্রুটি!", "রক্তদাতা মুছে ফেলা যায়নি।", "error");
      }
    }
  };

  const handleEdit = (donor) => {
    console.log("Edit donor:", donor);
    // Edit Modal বা Routing এখানে যুক্ত করতে পারো
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">রক্তদাতার তালিকা (ড্যাশবোর্ড)</h2>

      {donors.length === 0 ? (
        <p className="text-gray-500 text-center">কোন রক্তদাতা পাওয়া যায়নি</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-red-100 text-red-800">
              <tr>
                <th className="px-4 py-3 text-left">নাম</th>
                <th className="px-4 py-3">মোবাইল</th>
                <th className="px-4 py-3">ঠিকানা</th>
                <th className="px-4 py-3">রক্তের গ্রুপ</th>
                <th className="px-4 py-3">শেষ রক্তদান</th>
                <th className="px-4 py-3">স্ট্যাটাস</th>
                <th className="px-4 py-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor) => (
                <tr key={donor._id} className="border-b">
                  <td className="px-4 py-3">{donor.name}</td>
                  <td className="px-4 py-3">{donor.mobile}</td>
                  <td className="px-4 py-3">{donor.address || "N/A"}</td>
                  <td className="px-4 py-3 font-bold text-center">{donor.bloodGroup}</td>
                  <td className="px-4 py-3 text-center">
                    {donor.lastDonationDate
                      ? new Date(donor.lastDonationDate).toLocaleDateString("bn-BD")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium ${
                        donor.canDonate
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {donor.canDonate ? "দিতে পারবেন" : "সময় হয়নি"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(donor)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(donor._id)}
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

export default AdminBloodDonorList;
