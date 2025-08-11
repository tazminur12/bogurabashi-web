import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import imageCompression from "browser-image-compression";

const HospitalForm = () => {
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    emergency: "",
    beds: "",
    specialties: "",
    image: ""
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      axiosSecure.get(`/hospitals/${id}`)
        .then(({ data }) => {
          setFormData({
            name: data.name || "",
            address: data.address || "",
            contact: data.contact || "",
            emergency: data.emergency || "",
            beds: data.beds || "",
            specialties: data.specialties ? data.specialties.join(", ") : "",
            image: data.image || "",
          });
        })
        .catch(() => {
          Swal.fire("ত্রুটি!", "হাসপাতালের তথ্য লোড করা সম্ভব হয়নি!", "error");
        });
    }
  }, [id, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // Image Compression Options
      const options = {
        maxSizeMB: 1,           // সর্বোচ্চ 1MB
        maxWidthOrHeight: 1024, // সর্বোচ্চ প্রস্থ/উচ্চতা 1024px
        useWebWorker: true,
      };

      // কমপ্রেস করা ছবি
      const compressedFile = await imageCompression(file, options);

      const formDataImg = new FormData();
      formDataImg.append("image", compressedFile);

      // ইমগবিবি API কল
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
        method: "POST",
        body: formDataImg
      });

      const data = await res.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        Swal.fire("সফল!", "ছবি সফলভাবে আপলোড হয়েছে!", "success");
      } else {
        Swal.fire("ত্রুটি!", "ছবি আপলোড ব্যর্থ হয়েছে!", "error");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Swal.fire("ত্রুটি!", "ছবি আপলোড ব্যর্থ হয়েছে!", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      beds: formData.beds ? parseInt(formData.beds) : 0,
      specialties: formData.specialties
        ? formData.specialties.split(",").map(s => s.trim())
        : [],
    };

    try {
      let res;
      if (id) {
        res = await axiosSecure.put(`/hospitals/${id}`, payload);
      } else {
        res = await axiosSecure.post("/hospitals", payload);
      }

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: "success",
          title: id ? "আপডেট সফল!" : "যোগ সফল!",
          text: id ? "হাসপাতাল আপডেট হয়েছে।" : "নতুন হাসপাতাল যোগ হয়েছে।",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/dashboard/addHospital");
      } else {
        Swal.fire("ত্রুটি!", "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
      }
    } catch (error) {
      console.error("Error saving hospital:", error);
      Swal.fire("ত্রুটি!", "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded shadow"
      >
        &larr; Back
      </button>
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        {id ? "হাসপাতাল আপডেট করুন" : "নতুন হাসপাতাল যোগ করুন"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">নাম</label>
          <input
            type="text"
            name="name"
            className="w-full p-3 border border-gray-300 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">ঠিকানা</label>
          <input
            type="text"
            name="address"
            className="w-full p-3 border border-gray-300 rounded"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">যোগাযোগ নম্বর</label>
            <input
              type="text"
              name="contact"
              className="w-full p-3 border border-gray-300 rounded"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">জরুরী নম্বর</label>
            <input
              type="text"
              name="emergency"
              className="w-full p-3 border border-gray-300 rounded"
              value={formData.emergency}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">বেড সংখ্যা</label>
          <input
            type="text"
            name="beds"
            className="w-full p-3 border border-gray-300 rounded"
            value={formData.beds}
            onChange={handleChange}
            inputMode="numeric"
            pattern="[0-9০-৯]*"
            placeholder="শুধু সংখ্যা লিখুন (বাংলা/ইংরেজি)"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">বিশেষায়িত সেবা (কমা দিয়ে আলাদা করুন)</label>
          <input
            type="text"
            name="specialties"
            placeholder="কার্ডিওলজি, সার্জারি, গাইনি"
            className="w-full p-3 border border-gray-300 rounded"
            value={formData.specialties}
            onChange={handleChange}
          />
        </div>

        {/* Image Upload Input */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">ছবি আপলোড করুন</label>

          <label
            htmlFor="imageUpload"
            className={`inline-block cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "আপলোড হচ্ছে..." : "ছবি সিলেক্ট করুন"}
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />

          {uploading && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div className="bg-blue-600 h-2.5 animate-pulse" style={{ width: "100%" }}></div>
            </div>
          )}

          {formData.image && (
            <div className="relative mt-4 inline-block">
              <img
                src={formData.image}
                alt="Uploaded"
                className="w-64 h-40 object-cover rounded-lg shadow-md border border-gray-300"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                title="ছবি মুছে ফেলুন"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-300"
        >
          {id ? "আপডেট করুন" : "যোগ করুন"}
        </button>
      </form>
    </div>
  );
};

export default HospitalForm;
