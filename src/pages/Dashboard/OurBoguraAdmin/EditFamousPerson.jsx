import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSecureAxios from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const EditFamousPerson = () => {
  const axiosSecure = useSecureAxios();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    profession: "",
    born: "",
    website: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await axiosSecure.get(`/famous/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error(err);
        Swal.fire("ভুল হয়েছে!", "তথ্য আনতে ব্যর্থ", "error");
        navigate("/dashboard/bogura-intro");
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [axiosSecure, id, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Remove _id from the payload
    const { _id, ...dataToUpdate } = formData;
    try {
      await axiosSecure.put(`/famous/${id}`, dataToUpdate);
      Swal.fire("সফল!", "ব্যক্তি তথ্য আপডেট হয়েছে।", "success");
      navigate("/dashboard/bogura-intro");
    } catch (err) {
      console.error("Update error:", err);
      if (err.response) {
        Swal.fire(
          "ভুল হয়েছে!",
          `আপডেট করতে ব্যর্থ।\n${err.response.data?.error || err.response.statusText}`,
          "error"
        );
      } else {
        Swal.fire("ভুল হয়েছে!", "আপডেট করতে ব্যর্থ।", "error");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">লোড হচ্ছে...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">ব্যক্তি তথ্য সম্পাদনা করুন</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="নাম" name="name" value={formData.name} onChange={handleChange} required />
        <Input label="ছবি URL" name="image" value={formData.image} onChange={handleChange} required />
        <Input label="পেশা" name="profession" value={formData.profession} onChange={handleChange} />
        <Input label="জন্ম সাল" name="born" value={formData.born} onChange={handleChange} />
        <Input label="ওয়েবসাইট (URL)" name="website" value={formData.website} onChange={handleChange} />
        <Textarea label="বিবরণ" name="description" value={formData.description} onChange={handleChange} required />
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/admin/famous")}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            আপডেট করুন
          </button>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      rows={4}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

export default EditFamousPerson;
