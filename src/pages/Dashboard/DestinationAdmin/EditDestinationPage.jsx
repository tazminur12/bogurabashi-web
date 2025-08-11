import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const EditDestinationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    image: "",
    mapLink: "",
    district: "bogura",
    stayInfo: "",
    travelInfo: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [originalImage, setOriginalImage] = useState("");
  const [initialData, setInitialData] = useState(null);

  // Fetch destination data
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await axiosSecure.get(`/destinations/${id}`);
        const destination = res.data;
        
        const loaded = {
          name: destination.name || "",
          location: destination.location || "",
          category: destination.category || "",
          image: destination.image || "",
          mapLink: destination.mapLink || "",
          district: destination.district || "bogura",
          stayInfo: destination.stayInfo || "",
          travelInfo: destination.travelInfo || "",
          description: destination.description || "",
        };
        setFormData(loaded);
        setInitialData(loaded);
        
        setOriginalImage(destination.image || "");
        setImagePreview(destination.image || null);
      } catch (error) {
        console.error("Error fetching destination:", error);
        Swal.fire("ত্রুটি", "গন্তব্যের তথ্য লোড করা যায়নি", "error");
        navigate("/dashboard/destinations-list");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id, axiosSecure, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    
    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(originalImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.category) {
      return Swal.fire("ত্রুটি", "সব বাধ্যতামূলক তথ্য পূরণ করুন", "error");
    }

    // Optional validation for Google Map link
    if (formData.mapLink && !/^https?:\/\//i.test(formData.mapLink)) {
      return Swal.fire("ত্রুটি", "সঠিক Google Map লিংক দিন (http/https দিয়ে শুরু)", "error");
    }

    try {
      setIsUpdating(true);

      let finalImageUrl = originalImage;

      // Upload new image if selected
      if (imageFile) {
        const formImage = new FormData();
        formImage.append("image", imageFile);

        const resImg = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: formImage,
        });

        const imgData = await resImg.json();

        if (!imgData.success) {
          throw new Error("ছবি আপলোডে সমস্যা হয়েছে");
        }

        finalImageUrl = imgData.data.url;
      }

      // Update destination data
      const finalData = { ...formData, image: finalImageUrl };

      const res = await axiosSecure.put(`/destinations/${id}`, finalData);

      const pickComparable = (d) => ({
        name: d.name?.trim() || "",
        location: d.location?.trim() || "",
        category: d.category || "",
        image: d.image || "",
        mapLink: (d.mapLink || "").trim(),
        district: d.district || "",
        stayInfo: (d.stayInfo || "").trim(),
        travelInfo: (d.travelInfo || "").trim(),
        description: (d.description || "").trim(),
      });

      const changed = JSON.stringify(pickComparable(finalData)) !== JSON.stringify(pickComparable(initialData || {}));

      if (res?.status === 200 && (res.data?.modifiedCount > 0 || changed)) {
        Swal.fire("সফল", "গন্তব্যের তথ্য সফলভাবে আপডেট হয়েছে!", "success");
        navigate("/dashboard/destinations-list");
      } else if (res?.status === 200 && !changed) {
        Swal.fire("সতর্কতা", "কোনো পরিবর্তন করা হয়নি", "info");
      } else {
        Swal.fire("ত্রুটি", "আপডেট প্রক্রিয়া সম্পন্ন করা যায়নি", "error");
      }

    } catch (error) {
      console.error("Error updating destination:", error);
      Swal.fire("ত্রুটি", "গন্তব্যের তথ্য আপডেট করা যায়নি", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">গন্তব্যের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">গন্তব্য সম্পাদনা করুন</h1>
          <p className="text-gray-600 text-lg">বগুড়া জেলার গন্তব্যের তথ্য আপডেট করুন</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              গন্তব্যের তথ্য সম্পাদনা
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  <svg className="w-5 h-5 inline mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  মূল তথ্য
                </h3>

                {/* নাম */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <span className="text-red-500">*</span> গন্তব্যের নাম
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="যেমন: মহাস্থানগড়"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* অবস্থান */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <span className="text-red-500">*</span> অবস্থান
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="উপজেলা বা এলাকা"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* বিভাগ */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <span className="text-red-500">*</span> বিভাগ
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                      required
                    >
                      <option value="">বাছাই করুন</option>
                      <option value="Historical">ঐতিহাসিক</option>
                      <option value="Natural">প্রাকৃতিক</option>
                      <option value="Religious">ধর্মীয়</option>
                      <option value="Entertainment">বিনোদন কেন্দ্র</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Google Map Link (optional) */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Google Map লিংক (ঐচ্ছিক)
                  </label>
                  <input
                    type="url"
                    name="mapLink"
                    value={formData.mapLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Google Maps এর শেয়ার লিংক পেস্ট করুন"
                  />
                  {formData.mapLink && (
                    <a
                      href={formData.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-yellow-700 text-sm underline inline-flex items-center gap-1"
                    >
                      লিংক খুলুন
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  <svg className="w-5 h-5 inline mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  ছবি আপডেট
                </h3>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    গন্তব্যের ছবি
                  </label>
                  
                  {/* Current Image Display */}
                  {originalImage && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">বর্তমান ছবি:</p>
                      <div className="relative inline-block">
                        <img
                          src={originalImage}
                          alt="Current"
                          className="h-32 w-auto rounded-lg border border-gray-200 shadow-sm"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">নতুন ছবি আপলোড করতে ক্লিক করুন</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF সর্বোচ্চ 10MB</p>
                    </label>
                  </div>

                  {/* New Image Preview */}
                  {imagePreview && imagePreview !== originalImage && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">নতুন ছবির প্রিভিউ:</p>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-auto rounded-lg border border-gray-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(originalImage);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                <svg className="w-5 h-5 inline mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                অতিরিক্ত তথ্য
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* থাকার ব্যবস্থা */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <svg className="w-4 h-4 inline mr-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                    </svg>
                    থাকার ব্যবস্থা
                  </label>
                  <textarea
                    name="stayInfo"
                    value={formData.stayInfo}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="হোটেল, গেস্ট হাউস, যোগাযোগের তথ্য..."
                  />
                </div>

                {/* যাওয়ার উপায় */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    <svg className="w-4 h-4 inline mr-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    যাওয়ার উপায়
                  </label>
                  <textarea
                    name="travelInfo"
                    value={formData.travelInfo}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="বাস, ট্রেন, বা অন্যান্য পরিবহন তথ্য..."
                  />
                </div>
              </div>

              {/* বিবরণ */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 inline mr-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  বিস্তারিত বিবরণ
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                  placeholder="গন্তব্যটি সম্পর্কে আরও বিস্তারিত তথ্য, ইতিহাস, আকর্ষণীয় বিষয়াদি..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard/destinations")}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                ফিরে যান
              </button>
              
              <button
                type="submit"
                disabled={isUpdating}
                className={`px-8 py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center ${
                  isUpdating 
                    ? "bg-gray-400 cursor-not-allowed text-white" 
                    : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white transform hover:scale-105"
                }`}
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    আপডেট করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDestinationPage; 