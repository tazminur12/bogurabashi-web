import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSecureAxios from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AddFamousPerson = () => {
  const axiosSecure = useSecureAxios();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    profession: "",
    born: "",
    website: "",
  });

  const [uploading, setUploading] = useState(false);

  // Environment variable for imgBB API key
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formDataImg,
        }
      );
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        Swal.fire("সফল!", "ছবি আপলোড হয়েছে।", "success");
      } else {
        Swal.fire("ভুল!", "ছবি আপলোড ব্যর্থ!", "error");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Swal.fire("ভুল!", "ছবি আপলোড করতে সমস্যা হয়েছে।", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      Swal.fire("ভুল!", "অনুগ্রহ করে ছবি আপলোড করুন।", "warning");
      return;
    }

    try {
      await axiosSecure.post("/famous", formData);
      Swal.fire("সফল!", "ব্যক্তি যোগ করা হয়েছে।", "success");
      navigate("/dashboard/bogura-intro");
    } catch (err) {
      console.error(err);
      Swal.fire("ভুল হয়েছে!", "যোগ করতে ব্যর্থ।", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 mb-8 text-center">
          নতুন বিখ্যাত ব্যক্তি যোগ করুন
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="নাম"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="পূর্ণ নাম লিখুন"
          />

          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
              ছবি আপলোড করুন
            </label>

            <div
              className={`relative flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
                ${
                  uploading
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400"
                }
                transition-colors duration-300`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />

              {uploading ? (
                <div className="flex flex-col items-center text-blue-600 dark:text-blue-400">
                  <svg
                    className="animate-spin h-10 w-10 mb-3 text-blue-600 dark:text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <p className="text-lg font-medium">ছবি আপলোড হচ্ছে...</p>
                </div>
              ) : formData.image ? (
                <img
                  src={formData.image}
                  alt="Uploaded Preview"
                  className="max-h-44 object-contain rounded-lg shadow-md"
                />
              ) : (
                <p className="text-gray-400 dark:text-gray-500 select-none pointer-events-none text-center">
                  এখানে ক্লিক করে ছবি আপলোড করুন অথবা ড্র্যাগ করুন
                </p>
              )}
            </div>

            {formData.image && !uploading && (
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, image: "" }))
                }
                className="mt-2 px-4 py-1 text-sm font-medium text-red-600 hover:underline"
              >
                ছবি মুছুন
              </button>
            )}
          </div>

          <Input
            label="পেশা"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="উদাহরণ: সাহিত্যিক, শিল্পী"
          />

          <Input
            label="জন্ম সাল"
            name="born"
            value={formData.born}
            onChange={handleChange}
            placeholder="উদাহরণ: ১৯৪৮"
          />

          <Input
            label="ওয়েবসাইট (URL)"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />

          <Textarea
            label="বিবরণ"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="ব্যক্তির সম্পর্কে সংক্ষিপ্ত বিবরণ"
          />

          <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/dashboard/bogura-intro")}
              className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition"
            >
              যোগ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      {...props}
      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <textarea
      {...props}
      rows={4}
      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-200"
    />
  </div>
);

export default AddFamousPerson;
