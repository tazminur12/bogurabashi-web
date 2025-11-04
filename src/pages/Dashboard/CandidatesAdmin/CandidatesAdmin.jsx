import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

export default function CandidatesAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultCandidate);
  const [editingId, setEditingId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingSymbol, setUploadingSymbol] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Axios Secure instance
  const axiosSecure = useAxiosSecure();

  // Check for edit candidate from navigation state
  useEffect(() => {
    if (location.state?.editCandidate) {
      const candidate = location.state.editCandidate;
      setForm(candidate);
      setEditingId(candidate.id || candidate._id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.state]);

  const addNotification = (text) => setNotifications((prev) => [{ id: Date.now(), text }, ...prev].slice(0, 6));

  // Upload image to ImgBB
  const uploadImageToImgBB = async (file, type = "profile") => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire("ত্রুটি!", "শুধুমাত্র ছবি আপলোড করা যাবে", "error");
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("ত্রুটি!", "ছবির আকার ৫ মেগাবাইটের কম হতে হবে", "error");
      return null;
    }

    if (!imgbbApiKey) {
      Swal.fire("ত্রুটি!", "ImgBB API কী সেট করা হয়নি। দয়া করে .env ফাইলে VITE_IMGBB_API_KEY সেট করুন।", "error");
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
      Swal.fire("❌ ত্রুটি", "ছবি আপলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।", "error");
      return null;
    } finally {
      if (type === "profile") {
        setUploadingProfile(false);
      } else {
        setUploadingSymbol(false);
      }
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImageToImgBB(file, "profile");
    if (url) {
      setForm((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  // Handle symbol image upload
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

    setIsSubmitting(true);

    try {
      // Prepare candidate data (remove id for create, keep for update)
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...candidateData } = form;
      const timestamp = new Date().toISOString();
      
      if (editingId) {
        // Update existing candidate
        const res = await axiosSecure.put(`/candidates/${editingId}`, {
          ...candidateData,
          updatedAt: timestamp,
        });

        if (res.data.modifiedCount > 0 || res.data.message === 'Updated successfully' || res.data.success) {
          Swal.fire("✅ সফল!", "প্রার্থী আপডেট সফল হয়েছে", "success");
          addNotification("প্রার্থী আপডেট সফল");
          setEditingId(null);
          setForm(defaultCandidate);
        } else {
          throw new Error('Update failed');
        }
      } else {
        // Create new candidate
        const res = await axiosSecure.post('/candidates', {
          ...candidateData,
          createdAt: timestamp,
          updatedAt: timestamp,
          status: candidateData.status || 'Active',
        });

        if (res.data.insertedId || res.data.acknowledged || res.data.success) {
          Swal.fire("✅ সফল!", "নতুন প্রার্থী যোগ করা হয়েছে", "success");
          addNotification("নতুন প্রার্থী যোগ করা হয়েছে");
          setForm(defaultCandidate);
        } else {
          throw new Error('Create failed');
        }
      }
    } catch (error) {
      console.error('Error submitting candidate:', error);
      const errorMessage = error.response?.data?.message || error.message || 'প্রার্থী যোগ/আপডেট করতে সমস্যা হয়েছে';
      Swal.fire("❌ ত্রুটি", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(defaultCandidate);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">প্রার্থী তথ্য (Candidate Admin)</h2>
            <p className="text-indigo-100 text-lg">প্রার্থী যুক্ত, সম্পাদনা ও ম্যানেজ করুন</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/election-candidates-list")}
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
          >
            📋 তালিকা দেখুন
          </button>
      </div>
      </div>


      {/* Add / Edit Form */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-indigo-200 rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-indigo-200">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${editingId ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
              {editingId ? '✏️' : '➕'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{editingId ? "প্রার্থী আপডেট" : "নতুন প্রার্থী যোগ"}</h3>
              <p className="text-sm text-gray-500">{editingId ? "প্রার্থীর তথ্য আপডেট করুন" : "নতুন প্রার্থীর তথ্য যোগ করুন"}</p>
            </div>
          </div>
          {editingId && (
            <button 
              onClick={resetForm} 
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all font-medium shadow-sm"
            >
              নতুন যোগ করুন
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-blue-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">1</div>
              <h4 className="text-lg font-bold text-gray-800">মৌলিক তথ্য</h4>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              <span className="text-red-500">*</span> পূর্ণ নাম (Candidate Name)
            </label>
            <input 
              className="w-full border-2 border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              value={form.name} 
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} 
              required 
              placeholder="প্রার্থীর পূর্ণ নাম"
            />
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <label className="block text-sm font-semibold text-gray-800 mb-2">স্ট্যাটাস</label>
            <select 
              className="w-full border-2 border-green-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white" 
              value={form.status} 
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">দল/স্বতন্ত্র পরিচয় (Party/Independent)</label>
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.isIndependent} onChange={(e) => setForm((p) => ({ ...p, isIndependent: e.target.checked, party: e.target.checked ? "" : p.party }))} />
                <span className="text-sm">স্বতন্ত্র</span>
              </label>
            </div>
            <input 
              className="w-full border rounded-md px-3 py-2" 
              placeholder="দলের নাম" 
              value={form.party} 
              onChange={(e) => setForm((p) => ({ ...p, party: e.target.value }))}
              disabled={form.isIndependent}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">প্রতীক নাম (Symbol Name)</label>
            <input className="w-full border rounded-md px-3 py-2" placeholder="প্রতীকের নাম" value={form.symbol} onChange={(e) => setForm((p) => ({ ...p, symbol: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">প্রতীক ছবি (Symbol Image)</label>
            <input type="file" accept="image/*" onChange={handleSymbolImageUpload} className="w-full border rounded-md px-3 py-2" disabled={uploadingSymbol} />
            {uploadingSymbol && <p className="text-xs text-blue-600 mt-1">আপলোড হচ্ছে...</p>}
            {form.symbolImageUrl && (
              <div className="mt-2">
                <img src={form.symbolImageUrl} alt="Symbol" className="w-16 h-16 object-cover rounded border" />
                <button type="button" onClick={() => setForm((p) => ({ ...p, symbolImageUrl: "" }))} className="text-xs text-red-600 mt-1">ছবি সরান</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">ছবি (Profile Image)</label>
            <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="w-full border rounded-md px-3 py-2" disabled={uploadingProfile} />
            {uploadingProfile && <p className="text-xs text-blue-600 mt-1">আপলোড হচ্ছে...</p>}
            {form.imageUrl && (
              <div className="mt-2">
                <img src={form.imageUrl} alt="Profile" className="w-16 h-16 object-cover rounded-full border" />
                <button type="button" onClick={() => setForm((p) => ({ ...p, imageUrl: "" }))} className="text-xs text-red-600 mt-1">ছবি সরান</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">নির্বাচনী এলাকা (Constituency) *</label>
            <input className="w-full border rounded-md px-3 py-2" placeholder="এলাকার নাম" value={form.constituency} onChange={(e) => setForm((p) => ({ ...p, constituency: e.target.value }))} required />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">সিট নম্বর (Seat Number)</label>
            <input className="w-full border rounded-md px-3 py-2" placeholder="সিট নম্বর" value={form.seatNumber} onChange={(e) => setForm((p) => ({ ...p, seatNumber: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">মোবাইল নম্বর (ঐচ্ছিক)</label>
            <input className="w-full border rounded-md px-3 py-2" type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">ইমেইল (ঐচ্ছিক)</label>
            <input className="w-full border rounded-md px-3 py-2" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>

          {/* Detailed Information */}
          <div className="md:col-span-2 mt-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-purple-200">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">2</div>
              <h4 className="text-lg font-bold text-gray-800">বিস্তারিত তথ্য</h4>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">সংক্ষিপ্ত জীবনী (Short Bio)</label>
            <textarea className="w-full border rounded-md px-3 py-2" rows={3} placeholder="সংক্ষিপ্ত জীবনী" value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">শিক্ষাগত যোগ্যতা (Education)</label>
            <textarea className="w-full border rounded-md px-3 py-2" rows={2} placeholder="শিক্ষাগত যোগ্যতা" value={form.education} onChange={(e) => setForm((p) => ({ ...p, education: e.target.value }))} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">রাজনৈতিক অভিজ্ঞতা / পেশা (Experience / Occupation)</label>
            <textarea className="w-full border rounded-md px-3 py-2" rows={2} placeholder="রাজনৈতিক অভিজ্ঞতা / পেশা" value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">পূর্বের অর্জন বা দায়িত্ব (Achievements / Previous Position)</label>
            <textarea className="w-full border rounded-md px-3 py-2" rows={2} placeholder="পূর্বের অর্জন বা দায়িত্ব" value={form.achievements} onChange={(e) => setForm((p) => ({ ...p, achievements: e.target.value }))} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">নির্বাচনী অঙ্গীকার / প্রতিশ্রুতি (Election Manifesto or Promises)</label>
            <textarea className="w-full border rounded-md px-3 py-2" rows={3} placeholder="নির্বাচনী অঙ্গীকার / প্রতিশ্রুতি" value={form.manifesto} onChange={(e) => setForm((p) => ({ ...p, manifesto: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">নির্বাচনী খরচ ঘোষণা (ঐচ্ছিক)</label>
            <input className="w-full border rounded-md px-3 py-2" type="number" placeholder="টাকার পরিমাণ" value={form.electionExpense} onChange={(e) => setForm((p) => ({ ...p, electionExpense: e.target.value }))} />
          </div>

          {/* Social Media / Contact */}
          <div className="md:col-span-2 mt-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-pink-200">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-bold">3</div>
              <h4 className="text-lg font-bold text-gray-800">সোশ্যাল মিডিয়া / যোগাযোগ</h4>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">অফিসিয়াল ফেসবুক লিংক</label>
            <input className="w-full border rounded-md px-3 py-2" type="url" placeholder="https://facebook.com/..." value={form.facebookLink} onChange={(e) => setForm((p) => ({ ...p, facebookLink: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">ওয়েবসাইট / পেজ</label>
            <input className="w-full border rounded-md px-3 py-2" type="url" placeholder="https://..." value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">যোগাযোগের ঠিকানা (Contact Address)</label>
            <textarea className="w-full border rounded-md px-3 py-2" rows={2} placeholder="যোগাযোগের ঠিকানা" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          </div>

          <div className="md:col-span-2 flex items-center gap-4 pt-6 mt-4 border-t-2 border-gray-200">
            <button 
              type="submit" 
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
                editingId 
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" 
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              }`}
              disabled={uploadingProfile || uploadingSymbol || isSubmitting}
            >
              {uploadingProfile || uploadingSymbol ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> আপলোড হচ্ছে...
                </span>
              ) : isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> প্রক্রিয়া হচ্ছে...
                </span>
              ) : (
                editingId ? "✅ আপডেট করুন" : "➕ প্রার্থী যোগ করুন"
              )}
            </button>
            <button 
              type="button" 
              onClick={resetForm} 
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all font-medium text-gray-700 shadow-sm"
            >
              🔄 রিসেট
            </button>
          </div>
        </form>
      </div>


      {/* Quick Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">ℹ️</div>
          <h3 className="text-xl font-bold text-gray-800">দ্রুত তথ্য</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          এই পেজে আপনি নতুন প্রার্থী যোগ করতে পারেন এবং প্রার্থীর বিস্তারিত তথ্য আপডেট করতে পারেন। 
          প্রার্থী তালিকা দেখতে উপরের <strong>"তালিকা দেখুন"</strong> বাটনে ক্লিক করুন।
        </p>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {notifications.map((n) => (
            <div key={n.id} className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow">{n.text}</div>
          ))}
        </div>
      )}
    </div>
  );
}



