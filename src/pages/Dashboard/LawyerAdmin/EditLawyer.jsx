import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // adjust the path as needed

const EditLawyer = () => {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await axiosSecure.get(`/lawyers/${id}`);
        setLawyer(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "তথ্য লোড করতে ব্যর্থ", "error");
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [id, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLawyer({ ...lawyer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.put(`/lawyers/${id}`, lawyer);
      Swal.fire("সফল", "তথ্য আপডেট হয়েছে!", "success");
      navigate("/dashboard/lawyers");
    } catch (error) {
      console.error(error);
      Swal.fire("ত্রুটি", "আপডেট ব্যর্থ হয়েছে", "error");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-500">লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">আইনজীবীর তথ্য সম্পাদনা</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="নাম" value={lawyer.name || ""} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="category" placeholder="আইনের ক্ষেত্র" value={lawyer.category || ""} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="contact" placeholder="যোগাযোগ" value={lawyer.contact || ""} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="chamber" placeholder="চেম্বার" value={lawyer.chamber || ""} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="experience" placeholder="অভিজ্ঞতা" value={lawyer.experience || ""} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="consultationFee" placeholder="ফি" value={lawyer.consultationFee || ""} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="availability" placeholder="সময়" value={lawyer.availability || ""} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="image" placeholder="ছবি URL" value={lawyer.image || ""} onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">আপডেট করুন</button>
      </form>
    </div>
  );
};

export default EditLawyer;
