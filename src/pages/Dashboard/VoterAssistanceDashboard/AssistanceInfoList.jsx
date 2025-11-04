import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaInfoCircle, FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter, FaTag, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const STORAGE_KEY = "assistance_info_data";

const AssistanceInfoList = () => {
  const [infos, setInfos] = useState([]);
  const [infoForm, setInfoForm] = useState({
    id: null,
    title: "",
    category: "",
    description: "",
    link: "",
    area: "",
    status: "Active",
    imageUrl: "",
    createdAt: "",
    updatedAt: "",
  });
  const [editingInfoId, setEditingInfoId] = useState(null);
  const [filters, setFilters] = useState({ area: "", category: "", status: "", sort: "newest" });
  const [query, setQuery] = useState("");

  const categories = ["ভোট কেন্দ্র তথ্য", "নির্দেশিকা", "ঘোষণা", "গুরুত্বপূর্ণ নোটিশ"];

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInfos(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Error loading data:", error);
        setInfos([]);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (infos.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(infos));
    }
  }, [infos]);

  const areas = useMemo(() => Array.from(new Set(infos.map((i) => i.area).filter(Boolean))), [infos]);

  const filteredInfos = useMemo(() => {
    let rows = [...infos];
    
    // Search filter
    if (query) {
      rows = rows.filter((r) => 
        r.title?.toLowerCase().includes(query.toLowerCase()) ||
        r.description?.toLowerCase().includes(query.toLowerCase()) ||
        r.category?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (filters.area) rows = rows.filter((r) => r.area === filters.area);
    if (filters.category) rows = rows.filter((r) => r.category === filters.category);
    if (filters.status) rows = rows.filter((r) => r.status === filters.status);
    
    rows.sort((a, b) => 
      filters.sort === "newest" 
        ? (new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        : (new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    );
    return rows;
  }, [infos, filters, query]);

  const stats = useMemo(() => {
    return {
      total: infos.length,
      active: infos.filter((i) => i.status === "Active").length,
      inactive: infos.filter((i) => i.status === "Inactive").length,
      categories: categories.length,
    };
  }, [infos]);

  const saveInfo = (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    if (editingInfoId) {
      setInfos((prev) =>
        prev.map((x) => (x.id === editingInfoId ? { ...infoForm, id: editingInfoId, updatedAt: now } : x))
      );
      Swal.fire("Success!", "Information updated successfully!", "success");
      setEditingInfoId(null);
    } else {
      const id = Date.now();
      setInfos((prev) => [{ ...infoForm, id, createdAt: now, updatedAt: now }, ...prev]);
      Swal.fire("Success!", "Information added successfully!", "success");
    }
    setInfoForm({
      id: null,
      title: "",
      category: "",
      description: "",
      link: "",
      area: "",
      status: "Active",
      imageUrl: "",
      createdAt: "",
      updatedAt: "",
    });
  };

  const editInfo = (row) => {
    setInfoForm({ ...row });
    setEditingInfoId(row.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteInfo = (row) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `এই তথ্য "${row.title}" মুছে ফেলা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        setInfos((prev) => prev.filter((x) => x.id !== row.id));
        Swal.fire("মুছে ফেলা হয়েছে!", "তথ্যটি সফলভাবে মুছে ফেলা হয়েছে।", "success");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <FaInfoCircle className="text-4xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Assistance Information Management</h2>
                <p className="text-blue-100 text-sm">ভোট কেন্দ্র তথ্য, নির্দেশিকা, ঘোষণা ও গুরুত্বপূর্ণ নোটিশ ম্যানেজ করুন</p>
              </div>
            </div>
            <Link
              to="/dashboard/voter-assistance"
              className="px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaPlus /> Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Information" value={stats.total} icon={<FaInfoCircle />} gradient="from-blue-500 to-cyan-500" />
          <StatCard label="Active Posts" value={stats.active} icon={<FaCheckCircle />} gradient="from-green-500 to-emerald-500" />
          <StatCard label="Inactive Posts" value={stats.inactive} icon={<FaTag />} gradient="from-gray-500 to-slate-500" />
          <StatCard label="Categories" value={stats.categories} icon={<FaTag />} gradient="from-purple-500 to-pink-500" />
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <FaPlus className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{editingInfoId ? "তথ্য আপডেট" : "নতুন তথ্য যুক্ত"}</h3>
                  <p className="text-blue-100 text-sm mt-1">{editingInfoId ? "আপনার তথ্য সম্পাদনা করুন" : "একটি নতুন তথ্য যোগ করুন"}</p>
                </div>
              </div>
              {editingInfoId && (
                <button
                  onClick={() => {
                    setEditingInfoId(null);
                    setInfoForm({
                      id: null,
                      title: "",
                      category: "",
                      description: "",
                      link: "",
                      area: "",
                      status: "Active",
                      imageUrl: "",
                      createdAt: "",
                      updatedAt: "",
                    });
                  }}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                >
                  <FaPlus /> নতুন যোগ
                </button>
              )}
            </div>
          </div>
          <div className="p-8">
            <form onSubmit={saveInfo} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border-2 border-purple-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaInfoCircle className="text-purple-600" /> শিরোনাম *
                  </label>
                  <input
                    className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white"
                    value={infoForm.title}
                    onChange={(e) => setInfoForm((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaTag className="text-blue-600" /> ধরন (Category) *
                  </label>
                  <select
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                    value={infoForm.category}
                    onChange={(e) => setInfoForm((p) => ({ ...p, category: e.target.value }))}
                    required
                  >
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaEdit className="text-green-600" /> বর্ণনা
                </label>
                <textarea
                  className="w-full border-2 border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white resize-none"
                  rows={3}
                  value={infoForm.description}
                  onChange={(e) => setInfoForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-2xl border-2 border-orange-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaInfoCircle className="text-orange-600" /> লিংক
                  </label>
                  <input
                    className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white"
                    placeholder="https://..."
                    value={infoForm.link}
                    onChange={(e) => setInfoForm((p) => ({ ...p, link: e.target.value }))}
                  />
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-2xl border-2 border-pink-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="text-pink-600" /> এলাকা/ওয়ার্ড
                  </label>
                  <input
                    className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 bg-white"
                    value={infoForm.area}
                    onChange={(e) => setInfoForm((p) => ({ ...p, area: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-5 rounded-2xl border-2 border-cyan-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaTag className="text-cyan-600" /> স্ট্যাটাস
                  </label>
                  <select
                    className="w-full border-2 border-cyan-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 bg-white"
                    value={infoForm.status}
                    onChange={(e) => setInfoForm((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-2xl border-2 border-violet-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaInfoCircle className="text-violet-600" /> ইমেজ/ম্যাপ (URL)
                  </label>
                  <input
                    className="w-full border-2 border-violet-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-white"
                    placeholder="https://..."
                    value={infoForm.imageUrl}
                    onChange={(e) => setInfoForm((p) => ({ ...p, imageUrl: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {editingInfoId ? (
                    <>
                      <FaEdit /> Save Changes
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Information
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInfoForm({
                      id: null,
                      title: "",
                      category: "",
                      description: "",
                      link: "",
                      area: "",
                      status: "Active",
                      imageUrl: "",
                      createdAt: "",
                      updatedAt: "",
                    });
                    setEditingInfoId(null);
                  }}
                  className="px-6 py-4 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search information..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.area}
              onChange={(e) => setFilters((f) => ({ ...f, area: e.target.value }))}
            >
              <option value="">Filter by Area</option>
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select
              className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            >
              <option value="">Filter by Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <FaInfoCircle /> Manage Assistance Information
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600 border-b">
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Area</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Created At</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInfos.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                      {infos.length === 0 ? (
                        <div>
                          <p className="text-lg mb-2">কোনো তথ্য নেই</p>
                          <p className="text-sm text-gray-400">উপরে ফর্ম ব্যবহার করে নতুন তথ্য যোগ করুন</p>
                        </div>
                      ) : (
                        "কোনো ফলাফল পাওয়া যায়নি"
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredInfos.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{row.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                          {row.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{row.area || "—"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            row.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            onClick={() => Swal.fire(row.title, row.description || "", "info")}
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            onClick={() => editInfo(row)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            onClick={() => deleteInfo(row)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, gradient }) => (
  <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div className={`bg-gradient-to-br ${gradient} p-6 text-white`}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-2">{String(value)}</div>
      <div className="text-sm font-medium text-white/90 uppercase tracking-wide">{label}</div>
    </div>
  </div>
);

export default AssistanceInfoList;

