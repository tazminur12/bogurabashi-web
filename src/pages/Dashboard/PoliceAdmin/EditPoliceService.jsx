import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // ঠিক path দাও

const EditPoliceService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  // ফর্মের ডাটা লোড
  useEffect(() => {
    const getStation = async () => {
      try {
        const res = await axiosSecure.get(`/policestations/${id}`);
        setStation(res.data);
        setImageURL(res.data?.image || "");
        setImagePreview(res.data?.image || null);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch station", error);
        setLoading(false);
      }
    };
    getStation();
  }, [axiosSecure, id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // লোকালি প্রিভিউ দেখানো
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      if (!IMGBB_API_KEY) {
        throw new Error("ImgBB API Key missing. Set VITE_IMGBB_API_KEY in .env");
      }

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data?.data?.url) {
        setImageURL(data.data.url);
        Swal.fire("সফল", "ছবি আপলোড হয়েছে", "success");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("ত্রুটি", "ছবি আপলোড ব্যর্থ হয়েছে", "error");
      // পুরানো ছবি থাকলে সেটাই প্রিভিউতে রাখা
      setImagePreview(station?.image || null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedStation = {
      name: form.name.value,
      phone: form.phone.value,
      address: form.address.value,
      officer: form.officer.value,
      image: imageURL || station?.image || "",
      services: Array.from(form.services)
        .filter((input) => input.checked)
        .map((input) => input.value),
    };

    try {
      const res = await axiosSecure.put(`/policestations/${id}`, updatedStation);
      if (res.data?.message === "Station updated successfully") {
        Swal.fire("সফলভাবে হালনাগাদ হয়েছে!", "", "success");
        navigate("/admin/policestations");
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("হালনাগাদ ব্যর্থ হয়েছে", "", "error");
    }
  };

  if (loading) return <p>লোড হচ্ছে...</p>;
  if (!station) return <p>তথ্য পাওয়া যায়নি।</p>;

  const serviceOptions = [
    "জরুরী সহায়তা",
    "এফআইআর",
    "সাধারণ অভিযোগ",
    "নারী ও শিশু সহায়তা",
    "অপরাধ রিপোর্ট",
    "ট্রাফিক ম্যানেজমেন্ট",
    "সাইবার ক্রাইম",
    "সামাজিক নিরাপত্তা",
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">থানা হালনাগাদ করুন</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">থানার নাম *</label>
          <input
            type="text"
            name="name"
            defaultValue={station.name}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">ফোন নম্বর *</label>
          <input
            type="text"
            name="phone"
            defaultValue={station.phone}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">ঠিকানা *</label>
          <input
            type="text"
            name="address"
            defaultValue={station.address}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">অফিসারের নাম *</label>
          <input
            type="text"
            name="officer"
            defaultValue={station.officer}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">ছবি আপলোড করুন</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="input input-bordered w-full"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-blue-500 text-sm mt-1">ছবি আপলোড হচ্ছে...</p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-48 h-32 object-cover rounded shadow"
            />
          )}
          {!uploading && !imagePreview && station?.image && (
            <img
              src={station.image}
              alt={station.name}
              className="mt-2 w-48 h-32 object-cover rounded shadow"
            />
          )}
        </div>
        <div>
          <label className="block font-semibold mb-2">সেবাসমূহ</label>
          <div className="grid grid-cols-2 gap-2">
            {serviceOptions.map((service) => (
              <label key={service} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  defaultChecked={station.services?.includes(service)}
                  className="checkbox checkbox-sm"
                />
                {service}
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(-1)}
          >
            ফিরে যান
          </button>
          <button type="submit" className="btn btn-primary">
            হালনাগাদ করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPoliceService;
