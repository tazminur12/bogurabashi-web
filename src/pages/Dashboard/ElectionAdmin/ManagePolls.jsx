import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch, FaFilter, FaPlus, FaChartBar, FaEye, FaCalendarAlt, FaTag } from "react-icons/fa";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const STORAGE_KEY = "polls_data";

const ManagePolls = () => {
  const [polls, setPolls] = useState([]);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedPoll, setSelectedPoll] = useState(null);
  const axiosSecure = useAxiosSecure();

  // Load polls from API with optional filters
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const params = {};
        if (filterStatus) params.status = filterStatus;
        if (filterCategory) params.category = filterCategory;
        const res = await axiosSecure.get('/polls', { params });
        const data = Array.isArray(res.data) ? res.data : [];
        setPolls(data);
      } catch (error) {
        console.error('Error fetching polls:', error);
        // Fallback to localStorage if available
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setPolls(Array.isArray(parsed) ? parsed : []);
          } catch {
            setPolls([]);
          }
        }
      }
    };
    fetchPolls();
  }, [axiosSecure, filterStatus, filterCategory]);

  // Save polls to localStorage whenever polls change
  useEffect(() => {
    if (polls.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
    }
  }, [polls]);

  // Sync with PollsAdmin - listen for custom events and storage events
  useEffect(() => {
    const handlePollsUpdate = (e) => {
      if (e.detail) {
        setPolls(Array.isArray(e.detail) ? e.detail : []);
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setPolls(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error("Error syncing polls:", error);
        }
      }
    };

    // Also check localStorage periodically for updates
    const interval = setInterval(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const pollsArray = Array.isArray(parsed) ? parsed : [];
          setPolls(prevPolls => {
            // Only update if data actually changed
            if (JSON.stringify(pollsArray) !== JSON.stringify(prevPolls)) {
              return pollsArray;
            }
            return prevPolls;
          });
        } catch (error) {
          console.error("Error syncing polls:", error);
        }
      }
    }, 1000);

    window.addEventListener("pollsUpdated", handlePollsUpdate);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("pollsUpdated", handlePollsUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Filtered polls
  const filteredPolls = useMemo(() => {
    return polls.filter((poll) => {
      const matchesQuery = !query || 
        poll.question?.toLowerCase().includes(query.toLowerCase()) ||
        poll.description?.toLowerCase().includes(query.toLowerCase()) ||
        poll.category?.toLowerCase().includes(query.toLowerCase());
      
      const matchesStatus = !filterStatus || poll.status === filterStatus;
      const matchesCategory = !filterCategory || poll.category === filterCategory;

      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [polls, query, filterStatus, filterCategory]);

  // Statistics
  const stats = useMemo(() => {
    const totalPolls = polls.length;
    const activePolls = polls.filter(p => p.status === "Active").length;
    const upcomingPolls = polls.filter(p => p.status === "Upcoming").length;
    const totalVotes = polls.reduce((sum, p) => sum + (p.votes || 0), 0);
    
    return {
      totalPolls,
      activePolls,
      upcomingPolls,
      totalVotes,
    };
  }, [polls]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(polls.map(p => p.category).filter(Boolean))];
    return cats;
  }, [polls]);

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "—") return "—";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('bn-BD', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate percentage
  const percent = (votes, total) => (total ? Math.round((votes * 100) / total) : 0);

  // Handle delete
  const handleDelete = (poll) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `এই পোল "${poll.question}" মুছে ফেলা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          try {
            const id = poll._id || poll.id;
            await axiosSecure.delete(`/polls/${id}`);
            setPolls((prev) => prev.filter((p) => (p._id || p.id) !== id));
            const updated = polls.filter((p) => (p._id || p.id) !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            Swal.fire("মুছে ফেলা হয়েছে!", "পোলটি সফলভাবে মুছে ফেলা হয়েছে।", "success");
          } catch (error) {
            console.error('Error deleting poll:', error);
            Swal.fire("ব্যর্থ", "পোল মুছতে সমস্যা হয়েছে।", "error");
          }
        })();
      }
    });
  };

  // Handle view result
  const handleViewResult = async (poll) => {
    try {
      const id = poll._id || poll.id;
      // Fetch quick results for up-to-date stats
      const res = await axiosSecure.get(`/polls/${id}/results`);
      const r = res.data || {};
      const merged = {
        _id: poll._id || id,
        id,
        question: r.question || poll.question,
        description: r.description ?? poll.description,
        category: r.category ?? poll.category,
        status: r.status ?? poll.status,
        votes: r.totalVotes ?? poll.votes ?? 0,
        optionStats: Array.isArray(r.optionStats) ? r.optionStats.map(op => ({ label: op.label, votes: op.votes })) : (poll.optionStats || []),
      };
      setSelectedPoll(merged);
    } catch (error) {
      console.error('Error fetching poll results:', error);
      setSelectedPoll(poll);
    }
    window.document.getElementById('result-modal').showModal();
  };

  // Chart data for selected poll
  const chartData = useMemo(() => {
    if (!selectedPoll || !selectedPoll.optionStats) return [];
    return selectedPoll.optionStats.map((op, i) => ({
      name: op.label,
      value: op.votes,
      percent: percent(op.votes, selectedPoll.votes),
      fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]
    }));
  }, [selectedPoll]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Polls</h2>
          <p className="text-gray-600 mt-1">সব পোল দেখুন, সম্পাদনা করুন এবং ফলাফল দেখুন</p>
        </div>
        <Link
          to="/dashboard/election-polls"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus /> নতুন পোল তৈরি করুন
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="মোট পোল" value={stats.totalPolls} icon={<FaChartBar />} color="blue" />
        <StatCard label="সক্রিয় পোল" value={stats.activePolls} icon={<FaChartBar />} color="green" />
        <StatCard label="আসন্ন পোল" value={stats.upcomingPolls} icon={<FaCalendarAlt />} color="yellow" />
        <StatCard label="মোট ভোট" value={stats.totalVotes} icon={<FaChartBar />} color="purple" />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="পোল খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">সব Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Upcoming">Upcoming</option>
          </select>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">সব Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setQuery("");
              setFilterStatus("");
              setFilterCategory("");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Polls Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  প্রশ্ন
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Votes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPolls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {polls.length === 0 ? (
                      <div>
                        <p className="text-lg mb-2">কোনো পোল নেই</p>
                        <Link
                          to="/dashboard/election-polls"
                          className="text-blue-600 hover:underline"
                        >
                          প্রথম পোল তৈরি করুন
                        </Link>
                      </div>
                    ) : (
                      "কোনো ফলাফল পাওয়া যায়নি"
                    )}
                  </td>
                </tr>
              ) : (
                filteredPolls.map((poll) => {
                  const startDate = poll.startDate || poll.startDateTime?.split('T')[0] || "";
                  const endDate = poll.endDate || poll.endDateTime?.split('T')[0] || "";
                  
                  return (
                    <tr key={poll._id || poll.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                          {poll.question}
                        </div>
                        {poll.description && (
                          <div className="text-xs text-gray-500 mt-1 max-w-md truncate">
                            {poll.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {poll.category ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            <FaTag /> {poll.category}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          poll.status === "Active" ? "bg-green-100 text-green-800" : 
                          poll.status === "Upcoming" ? "bg-blue-100 text-blue-800" : 
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {poll.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {poll.votes || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewResult(poll)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition"
                            title="View Result"
                          >
                            <FaEye />
                          </button>
                          <Link
                            to={`/dashboard/election-polls`}
                            onClick={() => {
                              // Store poll ID in sessionStorage to edit in PollsAdmin
                              sessionStorage.setItem('editPollId', poll.id);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDelete(poll)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Modal */}
      <dialog id="result-modal" className="modal">
        <div className="modal-backdrop" onClick={() => window.document.getElementById('result-modal').close()}></div>
        <div className="modal-box max-w-4xl">
          {selectedPoll && (
            <>
              <h3 className="font-bold text-xl mb-2">{selectedPoll.question}</h3>
              {selectedPoll.description && (
                <p className="text-gray-600 mb-2 text-sm">{selectedPoll.description}</p>
              )}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <span>শ্রেণি: {selectedPoll.category || "—"}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedPoll.status === "Active" ? "bg-green-100 text-green-700" : 
                  selectedPoll.status === "Upcoming" ? "bg-blue-100 text-blue-700" : 
                  "bg-gray-100 text-gray-700"
                }`}>
                  {selectedPoll.status}
                </span>
                <span>•</span>
                <span>মোট ভোট: {selectedPoll.votes || 0}</span>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* Pie Chart */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Pie Chart</h4>
                  {chartData.length > 0 && selectedPoll.votes > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} votes`, '']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                      No votes yet
                    </div>
                  )}
                </div>

                {/* Bar Chart */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Bar Chart</h4>
                  {chartData.length > 0 && selectedPoll.votes > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} votes`, '']} />
                        <Legend />
                        <Bar dataKey="value" fill="#3b82f6">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                      No votes yet
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Stats Table */}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Detailed Statistics</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600 border-b">
                        <th className="py-2 pr-4">Option</th>
                        <th className="py-2 pr-4">Votes</th>
                        <th className="py-2 pr-4">Percentage</th>
                        <th className="py-2 pr-4">Visual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPoll.optionStats?.map((op, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2 pr-4 font-medium">{op.label}</td>
                          <td className="py-2 pr-4">{op.votes}</td>
                          <td className="py-2 pr-4">{percent(op.votes, selectedPoll.votes)}%</td>
                          <td className="py-2 pr-4">
                            <div className="w-32 h-2 bg-gray-100 rounded">
                              <div
                                className="h-2 rounded"
                                style={{ 
                                  width: `${percent(op.votes, selectedPoll.votes)}%`,
                                  backgroundColor: chartData[i]?.fill || '#3b82f6'
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <div className="modal-action mt-6">
            <form method="dialog">
              <button className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default ManagePolls;

