import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const defaultCandidate = {
  id: null,
  name: "",
  party: "",
  isIndependent: false,
  symbol: "",
  symbolImageUrl: "",
  imageUrl: "",
  constituency: "",
  seatNumber: "",
  phone: "",
  email: "",
  bio: "",
  education: "",
  experience: "",
  achievements: "",
  manifesto: "",
  electionExpense: "",
  facebookLink: "",
  website: "",
  address: "",
  status: "Active",
  createdAt: "",
  updatedAt: "",
};

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

export default function EditCandidate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [form, setForm] = useState(defaultCandidate);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingSymbol, setUploadingSymbol] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setIsLoading(true);
        const res = await axiosSecure.get(`/candidates/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error("Error fetching candidate:", err);
        Swal.fire("ত্রুটি!", "প্রার্থী পাওয়া যায়নি", "error").then(() => {
          navigate("/dashboard/election-candidates-list");
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCandidate();
    }
  }, [id, axiosSecure, navigate]);

  // Upload image to ImgBB
  const uploadImageToImgBB = async (file, type = "profile") => {
    if (!file) return null;

    if (!file.type.startsWith("image/")) {
      Swal.fire("ত্রুটি!", "শুধুমাত্র ছবি আপলোড করা যাবে", "error");
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("ত্রুটি!", "ছবির আকার ৫ মেগাবাইটের কম হতে হবে", "error");
      return null;
    }

    if (!imgbbApiKey) {
      Swal.fire("ত্রুটি!", "ImgBB API কী সেট করা হয়নি", "error");
      return null;
    }

    if (type === "profile") {
      setUploadingProfile(true);
    } else {
      setUploadingSymbol(true);
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("✅ সফল!", "ছবি আপলোড হয়েছে", "success");
        return data.data.url;
      } else {
        throw new Error(data.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Swal.fire("❌ ত্রুটি", "ছবি আপলোড করতে সমস্যা হয়েছে", "error");
      return null;
    } finally {
      if (type === "profile") {
        setUploadingProfile(false);
      } else {
        setUploadingSymbol(false);
      }
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImageToImgBB(file, "profile");
    if (url) {
      setForm((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  const handleSymbolImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImageToImgBB(file, "symbol");
    if (url) {
      setForm((prev) => ({ ...prev, symbolImageUrl: url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.constituency.trim()) {
      Swal.fire("ত্রুটি!", "পূর্ণ নাম এবং নির্বাচনী এলাকা আবশ্যক", "error");
      return;
    }

    try {
      setIsUpdating(true);
      // Prepare update data (remove id, createdAt, _id from update)
      const { id: _formId, _id: __id, createdAt: _createdAt, ...updateData } = form;
      const timestamp = new Date().toISOString();

      await axiosSecure.put(`/candidates/${id}`, {
        ...updateData,
        updatedAt: timestamp,
      });

      Swal.fire("✅ সফল!", "প্রার্থী আপডেট সফল হয়েছে", "success").then(() => {
        navigate("/dashboard/election-candidates-list");
      });
    } catch (err) {
      console.error("Error updating candidate:", err);
      const errorMessage = err.response?.data?.message || err.message || "প্রার্থী আপডেট করতে সমস্যা হয়েছে";
      Swal.fire("❌ ত্রুটি", errorMessage, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">লোড হচ্ছে...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard/election-candidates-list")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div>
              <h2 className="text-3xl font-bold mb-2">প্রার্থী সম্পাদনা</h2>
              <p className="text-orange-100 text-lg">{form.name || "প্রার্থীর নাম"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 rounded-2xl shadow-xl p-8 mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-orange-200">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">1</div>
              <h4 className="text-lg font-bold text-gray-800">মৌলিক তথ্য</h4>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              <span className="text-red-500">*</span> পূর্ণ নাম
            </label>
            <input
              className="w-full border-2 border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <label className="block text-sm font-semibold text-gray-800 mb-2">স্ট্যাটাস</label>
            <select
              className="w-full border-2 border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">দল/স্বতন্ত্র</label>
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isIndependent}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      isIndependent: e.target.checked,
                      party: e.target.checked ? "" : p.party,
                    }))
                  }
                />
                <span className="text-sm">স্বতন্ত্র</span>
              </label>
            </div>
            <input
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="দলের নাম"
              value={form.party}
              onChange={(e) => setForm((p) => ({ ...p, party: e.target.value }))}
              disabled={form.isIndependent}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">প্রতীক নাম</label>
            <input
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.symbol}
              onChange={(e) => setForm((p) => ({ ...p, symbol: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">প্রতীক ছবি</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSymbolImageUpload}
              className="w-full border-2 rounded-lg px-4 py-2"
              disabled={uploadingSymbol}
            />
            {uploadingSymbol && <p className="text-xs text-blue-600 mt-1">আপলোড হচ্ছে...</p>}
            {form.symbolImageUrl && (
              <div className="mt-2">
                <img src={form.symbolImageUrl} alt="Symbol" className="w-16 h-16 object-cover rounded border" />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, symbolImageUrl: "" }))}
                  className="text-xs text-red-600 mt-1"
                >
                  ছবি সরান
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">ছবি</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="w-full border-2 rounded-lg px-4 py-2"
              disabled={uploadingProfile}
            />
            {uploadingProfile && <p className="text-xs text-blue-600 mt-1">আপলোড হচ্ছে...</p>}
            {form.imageUrl && (
              <div className="mt-2">
                <img src={form.imageUrl} alt="Profile" className="w-16 h-16 object-cover rounded-full border" />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, imageUrl: "" }))}
                  className="text-xs text-red-600 mt-1"
                >
                  ছবি সরান
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              <span className="text-red-500">*</span> নির্বাচনী এলাকা
            </label>
            <input
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.constituency}
              onChange={(e) => setForm((p) => ({ ...p, constituency: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">সিট নম্বর</label>
            <input
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.seatNumber}
              onChange={(e) => setForm((p) => ({ ...p, seatNumber: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">মোবাইল</label>
            <input
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">ইমেইল</label>
            <input
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          {/* Detailed Information */}
          <div className="md:col-span-2 mt-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-purple-200">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">2</div>
              <h4 className="text-lg font-bold text-gray-800">বিস্তারিত তথ্য</h4>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">সংক্ষিপ্ত জীবনী</label>
            <textarea
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">শিক্ষাগত যোগ্যতা</label>
            <textarea
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={form.education}
              onChange={(e) => setForm((p) => ({ ...p, education: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">রাজনৈতিক অভিজ্ঞতা / পেশা</label>
            <textarea
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={form.experience}
              onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">পূর্বের অর্জন বা দায়িত্ব</label>
            <textarea
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={form.achievements}
              onChange={(e) => setForm((p) => ({ ...p, achievements: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">নির্বাচনী অঙ্গীকার / প্রতিশ্রুতি</label>
            <textarea
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={form.manifesto}
              onChange={(e) => setForm((p) => ({ ...p, manifesto: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">নির্বাচনী খরচ</label>
            <input
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              value={form.electionExpense}
              onChange={(e) => setForm((p) => ({ ...p, electionExpense: e.target.value }))}
            />
          </div>

          {/* Social Media / Contact */}
          <div className="md:col-span-2 mt-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-pink-200">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-bold">3</div>
              <h4 className="text-lg font-bold text-gray-800">সোশ্যাল মিডিয়া / যোগাযোগ</h4>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">ফেসবুক লিংক</label>
            <input
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="url"
              value={form.facebookLink}
              onChange={(e) => setForm((p) => ({ ...p, facebookLink: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">ওয়েবসাইট</label>
            <input
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="url"
              value={form.website}
              onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-800 mb-2">যোগাযোগের ঠিকানা</label>
            <textarea
              className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-4 pt-6 mt-4 border-t-2 border-gray-200">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              disabled={uploadingProfile || uploadingSymbol || isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="animate-spin">⏳</span> প্রক্রিয়া হচ্ছে...
                </>
              ) : (
                <>
                  <FaSave /> আপডেট করুন
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/election-candidates-list")}
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg font-medium text-gray-700 transition-all shadow-sm"
            >
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

