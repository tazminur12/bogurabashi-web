import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSecureAxios from "../../../hooks/useAxiosSecure";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const OurBoguraAdmin = () => {
  const axiosSecure = useSecureAxios();
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/famous");
      setPeople(res.data);
    } catch (err) {
      console.error("Error fetching famous people:", err);
      Swal.fire("Error", "তথ্য আনার সময় সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "একবার ডিলিট করলে তথ্য আর ফিরে পাবেন না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/famous/${id}`);
        Swal.fire("Deleted!", "ব্যক্তি সফলভাবে ডিলিট হয়েছে।", "success");
        fetchPeople();
      } catch (err) {
        console.error("Delete Error:", err);
        Swal.fire("Error", "ডিলিট করতে ব্যর্থ", "error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-blue-800">
          বিখ্যাত ব্যক্তিত্ব
        </h2>
        <button
          onClick={() => navigate("/dashboard/add-famous-person")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          aria-label="Add new person"
        >
          <FaPlus /> নতুন যোগ করুন
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">লোড হচ্ছে...</p>
      ) : people.length === 0 ? (
        <p className="text-center text-gray-500">কোনো তথ্য পাওয়া যায়নি।</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {people.map((person) => (
            <div
              key={person._id}
              className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col"
              role="article"
              aria-label={person.name}
            >
              <img
                src={person.image}
                alt={person.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-blue-900 mb-1">{person.name}</h3>
                <p className="text-sm text-gray-600 font-medium">{person.profession || "অজানা পেশা"}</p>
                <p className="text-sm text-gray-500 mb-2">
                  জন্ম: {person.born || "অজানা"}
                </p>
                <p className="text-gray-700 flex-1 line-clamp-3">{person.description}</p>
                {person.website && (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-blue-600 hover:underline font-medium"
                    aria-label={`বিস্তারিত জানুন ${person.name}`}
                  >
                    বিস্তারিত দেখুন &rarr;
                  </a>
                )}
              </div>

              <div className="flex border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => navigate(`/dashboard/famous-edit/${person._id}`)}
                  className="flex flex-1 items-center justify-center gap-2 py-3 text-blue-600 hover:bg-blue-100 transition font-semibold"
                  aria-label={`এডিট করুন ${person.name}`}
                >
                  <FaEdit /> এডিট
                </button>
                <button
                  onClick={() => handleDelete(person._id)}
                  className="flex flex-1 items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-100 transition font-semibold"
                  aria-label={`ডিলিট করুন ${person.name}`}
                >
                  <FaTrash /> ডিলিট
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OurBoguraAdmin;
