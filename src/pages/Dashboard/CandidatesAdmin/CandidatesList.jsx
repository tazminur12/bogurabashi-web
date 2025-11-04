import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch, FaFilter, FaPlus } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

export default function CandidatesList() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [query, setQuery] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axiosSecure.get("/candidates");
        setCandidates(res.data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, [axiosSecure]);

  // Delete candidate with confirmation
  const deleteCandidate = async (candidate) => {
    const candidateId = candidate.id || candidate._id;
    const candidateName = candidate.name || "প্রার্থী";

    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `${candidateName} এর তথ্য মুছে ফেলা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "না, বাতিল করুন",
    });

    if (result.isConfirmed) {
      try {
        setIsDeleting(true);
        await axiosSecure.delete(`/candidates/${candidateId}`);
        Swal.fire("মুছে ফেলা হয়েছে!", "প্রার্থীর তথ্য মুছে ফেলা হয়েছে।", "success");
        // Refresh candidates list
        const res = await axiosSecure.get("/candidates");
        setCandidates(res.data);
      } catch (err) {
        console.error("Error deleting candidate:", err);
        Swal.fire("ত্রুটি!", "প্রার্থী মুছতে ব্যর্থ হয়েছে", "error");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Filtered candidates
  const filtered = useMemo(() => {
    return candidates
      .filter((c) => (query ? c.name?.toLowerCase().includes(query.toLowerCase()) : true))
      .filter((c) => (filterArea ? c.constituency === filterArea : true))
      .filter((c) => (filterStatus ? c.status === filterStatus : true));
  }, [candidates, query, filterArea, filterStatus]);

  const constituencies = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.constituency).filter(Boolean))),
    [candidates]
  );

  // Summary statistics
  const summary = useMemo(() => {
    const total = candidates.length;
    const active = candidates.filter((c) => c.status === "Active").length;
    const inactive = total - active;
    const now = Date.now();
    const addedThisWeek = candidates.filter(
      (c) => (now - (new Date(c.createdAt).getTime() || 0)) <= 7 * 24 * 3600 * 1000
    ).length;
    return { total, active, inactive, addedThisWeek };
  }, [candidates]);

  // Handle edit - navigate to edit page
  const handleEdit = (candidate) => {
    const candidateId = candidate.id || candidate._id;
    navigate(`/dashboard/election-candidates-edit/${candidateId}`);
  };

  // Loading state
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

  // Error state
  if (error) {
    const errorMessage = error?.response?.data?.message || error?.message || "অজানা ত্রুটি";
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg mb-4">তথ্য লোড করতে সমস্যা হয়েছে</p>
          <p className="text-red-500 text-sm">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">প্রার্থী ব্যবস্থাপনা</h2>
          <p className="text-gray-600">প্রার্থী যোগ, আপডেট, মুছুন</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/election-candidates")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
        >
          <FaPlus /> নতুন প্রার্থী যোগ করুন
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Candidates"
          value={summary.total}
          gradient="from-blue-500 to-blue-600"
          icon="👥"
        />
        <StatCard
          label="Active"
          value={summary.active}
          gradient="from-green-500 to-green-600"
          icon="✅"
        />
        <StatCard
          label="Inactive"
          value={summary.inactive}
          gradient="from-gray-500 to-gray-600"
          icon="⏸️"
        />
        <StatCard
          label="Added this week"
          value={summary.addedThisWeek}
          gradient="from-purple-500 to-purple-600"
          icon="📅"
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="নাম দিয়ে খুঁজুন..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by Area */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">সব এলাকা</option>
              {constituencies.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">সব স্ট্যাটাস</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              {candidates.length === 0 ? "কোনো প্রার্থী নেই" : "ফিল্টার অনুযায়ী কোনো প্রার্থী পাওয়া যায়নি"}
            </p>
            {candidates.length === 0 && (
              <button
                onClick={() => navigate("/dashboard/election-candidates")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm"
              >
                <FaPlus /> নতুন প্রার্থী যোগ করুন
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ছবি
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    নাম
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    এলাকা
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    দল/স্বতন্ত্র
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    প্রতীক
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    স্ট্যাটাস
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    কর্ম
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((candidate) => (
                  <tr key={candidate.id || candidate._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-12 w-12">
                        {candidate.imageUrl ? (
                          <img
                            src={candidate.imageUrl}
                            alt={candidate.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">N/A</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{candidate.name || "—"}</div>
                      {candidate.phone && (
                        <div className="text-sm text-gray-500">📞 {candidate.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.constituency || "—"}</div>
                      {candidate.seatNumber && (
                        <div className="text-xs text-gray-500">সিট: {candidate.seatNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {candidate.isIndependent ? (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            স্বতন্ত্র
                          </span>
                        ) : (
                          candidate.party || "—"
                        )}
                      </div>
                      {candidate.symbol && (
                        <div className="text-xs text-gray-500 mt-1">প্রতীক: {candidate.symbol}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidate.symbolImageUrl ? (
                        <img
                          src={candidate.symbolImageUrl}
                          alt={candidate.symbol}
                          className="h-10 w-10 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">{candidate.symbol || "—"}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          candidate.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {candidate.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(candidate)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteCandidate(candidate)}
                          disabled={isDeleting}
                          className={`p-2 rounded-md transition-colors ${
                            isDeleting
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                          title="মুছে ফেলুন"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {filtered.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          মোট {filtered.length} জন প্রার্থী পাওয়া গেছে
        </div>
      )}
    </div>
  );
}

// StatCard Component
function StatCard({ label, value, gradient, icon }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-3xl">{icon}</div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide opacity-90 mb-1">{label}</div>
          <div className="text-3xl font-bold">{String(value)}</div>
        </div>
      </div>
    </div>
  );
}
