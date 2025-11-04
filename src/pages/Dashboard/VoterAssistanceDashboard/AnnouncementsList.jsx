import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBullhorn, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const STORAGE_KEY = "announcements_data";

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [announceForm, setAnnounceForm] = useState({
    id: null,
    title: "",
    details: "",
    validUntil: "",
    priority: "Normal",
    status: "Active",
    createdAt: "",
  });
  const [query, setQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnnouncements(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Error loading data:", error);
        setAnnouncements([]);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (announcements.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
    }
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    let rows = [...announcements];
    
    // Search filter
    if (query) {
      rows = rows.filter((r) => 
        r.title?.toLowerCase().includes(query.toLowerCase()) ||
        r.details?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (filterPriority) {
      rows = rows.filter((r) => r.priority === filterPriority);
    }
    
    if (filterStatus) {
      rows = rows.filter((r) => r.status === filterStatus);
    }
    
    // Sort by priority and date
    rows.sort((a, b) => {
      const priorityOrder = { High: 1, Normal: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    
    return rows;
  }, [announcements, query, filterPriority, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: announcements.length,
      active: announcements.filter((a) => a.status === "Active").length,
      highPriority: announcements.filter((a) => a.priority === "High").length,
      expired: announcements.filter((a) => {
        if (!a.validUntil) return false;
        return new Date(a.validUntil) < new Date();
      }).length,
    };
  }, [announcements]);

  const saveAnnouncement = (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const id = Date.now();
    setAnnouncements((prev) => [{ ...announceForm, id, createdAt: now }, ...prev]);
    Swal.fire("Success!", "Announcement added successfully!", "success");
    setAnnounceForm({
      id: null,
      title: "",
      details: "",
      validUntil: "",
      priority: "Normal",
      status: "Active",
      createdAt: "",
    });
  };

  const deleteAnnouncement = (row) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `এই ঘোষণা "${row.title}" মুছে ফেলা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        setAnnouncements((prev) => prev.filter((x) => x.id !== row.id));
        Swal.fire("মুছে ফেলা হয়েছে!", "ঘোষণাটি সফলভাবে মুছে ফেলা হয়েছে।", "success");
      }
    });
  };

  const isExpired = (validUntil) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <FaBullhorn className="text-4xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">গুরুত্বপূর্ণ ঘোষণা</h2>
                <p className="text-red-100 text-sm">গুরুত্বপূর্ণ ঘোষণা, নোটিশ ও তথ্য প্রকাশ করুন</p>
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
          <StatCard label="Total Announcements" value={stats.total} icon={<FaBullhorn />} gradient="from-red-500 to-pink-500" />
          <StatCard label="Active" value={stats.active} icon={<FaCheckCircle />} gradient="from-green-500 to-emerald-500" />
          <StatCard label="High Priority" value={stats.highPriority} icon={<FaExclamationTriangle />} gradient="from-orange-500 to-amber-500" />
          <StatCard label="Expired" value={stats.expired} icon={<FaCalendarAlt />} gradient="from-gray-500 to-slate-500" />
        </div>

        {/* Add Form */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-red-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaPlus className="text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">নতুন ঘোষণা যোগ</h3>
                <p className="text-red-100 text-sm mt-1">একটি নতুন গুরুত্বপূর্ণ ঘোষণা যোগ করুন</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <form onSubmit={saveAnnouncement} className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-2xl border-2 border-red-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaBullhorn className="text-red-600" /> Announcement Title *
                </label>
                <input
                  className="w-full border-2 border-red-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white"
                  placeholder="Announcement Title"
                  value={announceForm.title}
                  onChange={(e) => setAnnounceForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-5 rounded-2xl border-2 border-yellow-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FaEdit className="text-yellow-600" /> Details
                </label>
                <textarea
                  className="w-full border-2 border-yellow-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 bg-white resize-none"
                  placeholder="Details"
                  rows={4}
                  value={announceForm.details}
                  onChange={(e) => setAnnounceForm((p) => ({ ...p, details: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border-2 border-purple-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaCalendarAlt className="text-purple-600" /> Validity Date
                  </label>
                  <input
                    type="date"
                    className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white"
                    value={announceForm.validUntil}
                    onChange={(e) => setAnnounceForm((p) => ({ ...p, validUntil: e.target.value }))}
                  />
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaExclamationTriangle className="text-blue-600" /> Priority
                  </label>
                  <select
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                    value={announceForm.priority}
                    onChange={(e) => setAnnounceForm((p) => ({ ...p, priority: e.target.value }))}
                  >
                    <option>Normal</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaCheckCircle className="text-green-600" /> Status
                  </label>
                  <select
                    className="w-full border-2 border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white"
                    value={announceForm.status}
                    onChange={(e) => setAnnounceForm((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option>Active</option>
                    <option>Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Announcement
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAnnounceForm({
                      id: null,
                      title: "",
                      details: "",
                      validUntil: "",
                      priority: "Normal",
                      status: "Active",
                      createdAt: "",
                    })
                  }
                  className="px-6 py-4 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-red-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </select>
            <select
              className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-red-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <FaBullhorn /> ঘোষণা তালিকা
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600 border-b">
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Valid Until</th>
                  <th className="px-6 py-4 font-semibold">Created At</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                      {announcements.length === 0 ? (
                        <div>
                          <p className="text-lg mb-2">কোনো ঘোষণা নেই</p>
                          <p className="text-sm text-gray-400">উপরে ফর্ম ব্যবহার করে নতুন ঘোষণা যোগ করুন</p>
                        </div>
                      ) : (
                        "কোনো ফলাফল পাওয়া যায়নি"
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredAnnouncements.map((row) => (
                    <tr key={row.id} className={`border-b hover:bg-gray-50 transition ${isExpired(row.validUntil) ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{row.title}</div>
                        {row.details && (
                          <div className="text-xs text-gray-500 mt-1 max-w-md truncate">{row.details}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            row.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {row.priority}
                        </span>
                      </td>
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
                        {row.validUntil ? (
                          <div className={`${isExpired(row.validUntil) ? 'text-red-600 font-semibold' : ''}`}>
                            {new Date(row.validUntil).toLocaleDateString()}
                            {isExpired(row.validUntil) && <span className="ml-2 text-xs">(Expired)</span>}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            onClick={() => Swal.fire(row.title, row.details || "", "info")}
                            title="View Details"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            onClick={() => deleteAnnouncement(row)}
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

export default AnnouncementsList;

