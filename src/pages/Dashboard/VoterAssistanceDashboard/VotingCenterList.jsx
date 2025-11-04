import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaBuilding, FaUser, FaLink, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const STORAGE_KEY = "voting_center_data";

const VotingCenterList = () => {
  const [centers, setCenters] = useState([]);
  const [centerForm, setCenterForm] = useState({
    id: null,
    name: "",
    address: "",
    ward: "",
    area: "",
    mapLink: "",
    officer: "",
    status: "Active",
    createdAt: "",
    updatedAt: "",
  });
  const [editingCenterId, setEditingCenterId] = useState(null);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCenters(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Error loading data:", error);
        setCenters([]);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (centers.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(centers));
    }
  }, [centers]);

  const filteredCenters = useMemo(() => {
    let rows = [...centers];
    
    // Search filter
    if (query) {
      rows = rows.filter((r) => 
        r.name?.toLowerCase().includes(query.toLowerCase()) ||
        r.address?.toLowerCase().includes(query.toLowerCase()) ||
        r.ward?.toLowerCase().includes(query.toLowerCase()) ||
        r.area?.toLowerCase().includes(query.toLowerCase()) ||
        r.officer?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (filterStatus) {
      rows = rows.filter((r) => r.status === filterStatus);
    }
    
    return rows;
  }, [centers, query, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: centers.length,
      active: centers.filter((c) => c.status === "Active").length,
      inactive: centers.filter((c) => c.status === "Inactive").length,
    };
  }, [centers]);

  const saveCenter = (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    if (editingCenterId) {
      setCenters((prev) =>
        prev.map((x) => (x.id === editingCenterId ? { ...centerForm, id: editingCenterId, updatedAt: now } : x))
      );
      Swal.fire("Success!", "Center updated successfully!", "success");
      setEditingCenterId(null);
    } else {
      const id = Date.now();
      setCenters((prev) => [{ ...centerForm, id, createdAt: now, updatedAt: now }, ...prev]);
      Swal.fire("Success!", "Center added successfully!", "success");
    }
    setCenterForm({
      id: null,
      name: "",
      address: "",
      ward: "",
      area: "",
      mapLink: "",
      officer: "",
      status: "Active",
      createdAt: "",
      updatedAt: "",
    });
  };

  const editCenter = (row) => {
    setCenterForm({ ...row });
    setEditingCenterId(row.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCenter = (row) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `এই কেন্দ্র "${row.name}" মুছে ফেলা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        setCenters((prev) => prev.filter((x) => x.id !== row.id));
        Swal.fire("মুছে ফেলা হয়েছে!", "কেন্দ্রটি সফলভাবে মুছে ফেলা হয়েছে।", "success");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <FaMapMarkerAlt className="text-4xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">ভোট কেন্দ্র ম্যানেজমেন্ট</h2>
                <p className="text-green-100 text-sm">ভোট কেন্দ্রের তথ্য, ঠিকানা, ম্যাপ লিংক ও দায়িত্বপ্রাপ্ত কর্মকর্তা ম্যানেজ করুন</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Centers" value={stats.total} icon={<FaBuilding />} gradient="from-green-500 to-emerald-500" />
          <StatCard label="Active Centers" value={stats.active} icon={<FaCheckCircle />} gradient="from-blue-500 to-cyan-500" />
          <StatCard label="Inactive Centers" value={stats.inactive} icon={<FaMapMarkerAlt />} gradient="from-gray-500 to-slate-500" />
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <FaPlus className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{editingCenterId ? "কেন্দ্র আপডেট" : "নতুন কেন্দ্র যোগ"}</h3>
                  <p className="text-green-100 text-sm mt-1">{editingCenterId ? "আপনার কেন্দ্র সম্পাদনা করুন" : "একটি নতুন ভোট কেন্দ্র যোগ করুন"}</p>
                </div>
              </div>
              {editingCenterId && (
                <button
                  onClick={() => {
                    setEditingCenterId(null);
                    setCenterForm({
                      id: null,
                      name: "",
                      address: "",
                      ward: "",
                      area: "",
                      mapLink: "",
                      officer: "",
                      status: "Active",
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
            <form onSubmit={saveCenter} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border-2 border-purple-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaBuilding className="text-purple-600" /> কেন্দ্রের নাম *
                  </label>
                  <input
                    className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white"
                    placeholder="কেন্দ্রের নাম"
                    value={centerForm.name}
                    onChange={(e) => setCenterForm((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="text-blue-600" /> ঠিকানা
                  </label>
                  <input
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                    placeholder="ঠিকানা"
                    value={centerForm.address}
                    onChange={(e) => setCenterForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="text-green-600" /> ওয়ার্ড/এলাকা
                  </label>
                  <input
                    className="w-full border-2 border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white"
                    placeholder="ওয়ার্ড/এলাকা"
                    value={centerForm.ward}
                    onChange={(e) => setCenterForm((p) => ({ ...p, ward: e.target.value }))}
                  />
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-2xl border-2 border-orange-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="text-orange-600" /> এরিয়া
                  </label>
                  <input
                    className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white"
                    placeholder="এরিয়া"
                    value={centerForm.area}
                    onChange={(e) => setCenterForm((p) => ({ ...p, area: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-5 rounded-2xl border-2 border-pink-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaLink className="text-pink-600" /> Google Map Link
                  </label>
                  <input
                    className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 bg-white"
                    placeholder="https://maps.google.com/..."
                    value={centerForm.mapLink}
                    onChange={(e) => setCenterForm((p) => ({ ...p, mapLink: e.target.value }))}
                  />
                </div>
                <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-5 rounded-2xl border-2 border-cyan-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaUser className="text-cyan-600" /> দায়িত্বপ্রাপ্ত কর্মকর্তা
                  </label>
                  <input
                    className="w-full border-2 border-cyan-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 bg-white"
                    placeholder="দায়িত্বপ্রাপ্ত কর্মকর্তা"
                    value={centerForm.officer}
                    onChange={(e) => setCenterForm((p) => ({ ...p, officer: e.target.value }))}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-2xl border-2 border-violet-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaCheckCircle className="text-violet-600" /> স্ট্যাটাস
                </label>
                <select
                  className="w-full border-2 border-violet-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-white"
                  value={centerForm.status}
                  onChange={(e) => setCenterForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {editingCenterId ? (
                    <>
                      <FaEdit /> Update Center
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Center
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCenterForm({
                      id: null,
                      name: "",
                      address: "",
                      ward: "",
                      area: "",
                      mapLink: "",
                      officer: "",
                      status: "Active",
                      createdAt: "",
                      updatedAt: "",
                    });
                    setEditingCenterId(null);
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
        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search centers..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <FaMapMarkerAlt /> ভোট কেন্দ্র তালিকা
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600 border-b">
                  <th className="px-6 py-4 font-semibold">Center Name</th>
                  <th className="px-6 py-4 font-semibold">Address</th>
                  <th className="px-6 py-4 font-semibold">Ward/Area</th>
                  <th className="px-6 py-4 font-semibold">Officer</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCenters.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                      {centers.length === 0 ? (
                        <div>
                          <p className="text-lg mb-2">কোনো কেন্দ্র নেই</p>
                          <p className="text-sm text-gray-400">উপরে ফর্ম ব্যবহার করে নতুন কেন্দ্র যোগ করুন</p>
                        </div>
                      ) : (
                        "কোনো ফলাফল পাওয়া যায়নি"
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredCenters.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 text-gray-600">{row.address || "—"}</td>
                      <td className="px-6 py-4 text-gray-600">{row.ward || row.area || "—"}</td>
                      <td className="px-6 py-4 text-gray-600">{row.officer || "—"}</td>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {row.mapLink && (
                            <a
                              href={row.mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Map"
                            >
                              <FaLink />
                            </a>
                          )}
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            onClick={() => editCenter(row)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            onClick={() => deleteCenter(row)}
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

export default VotingCenterList;

