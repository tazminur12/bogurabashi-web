import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaPoll, FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaTag, FaChartBar, FaUsers, FaCog, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const STORAGE_KEY = "polls_data";

const defaultNewPoll = {
  question: "",
  options: ["", ""],
  category: "",
  status: "Active",
  startDate: "",
  endDate: "",
  startDateTime: "",
  endDateTime: "",
  description: "",
  allowMultipleVotes: false,
  settings: {
    votesPerUser: 1,
    autoCloseOnEnd: true,
    allowAnonymous: false,
    adminOnly: false,
  },
};

const PollsAdmin = () => {
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState(defaultNewPoll);
  const [editingPollId, setEditingPollId] = useState(null);
  const [categories, setCategories] = useState([
    "ইউনিয়ন নির্বাচন",
    "সিটি কর্পোরেশন",
    "জাতীয় নির্বাচন",
    "প্রার্থী জনপ্রিয়তা",
    "দল/সংগঠনের সমর্থন",
    "নির্বাচনী অঙ্গীকার বা প্রতিশ্রুতি গ্রহণযোগ্যতা",
    "ভোটারদের ভোট দেওয়ার প্রস্তুতি / মনোভাব",
    "নির্বাচনী এলাকায় উন্নয়নমূলক কার্যক্রম",
    "নির্বাচনী ইস্যু বা সমস্যা (যেমন সড়ক, শিক্ষা, স্বাস্থ্য)",
    "নির্বাচনী প্রতীক ও পরিচিতি",
    "নির্বাচনী প্রচারণা ও মিডিয়ার প্রভাব",
    "অন্যান্য নির্বাচন-সংক্রান্ত জরিপ",
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const axiosSecure = useAxiosSecure();

  // Load polls and check for edit
  useEffect(() => {
    const loadPollsAndCheckEdit = async () => {
      // Try to load from API first
      try {
        const res = await axiosSecure.get('/polls');
        const apiPolls = Array.isArray(res.data) ? res.data : [];
        if (apiPolls.length > 0) {
          setPolls(apiPolls);
          checkForEditPoll(apiPolls);
          return;
        }
      } catch (error) {
        console.error("Error loading polls from API:", error);
      }

      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const pollsArray = Array.isArray(parsed) ? parsed : [];
          setPolls(pollsArray);
          checkForEditPoll(pollsArray);
        } catch (error) {
          console.error("Error loading polls:", error);
          setPolls([]);
        }
      }
    };

    const checkForEditPoll = (pollsArray) => {
      const editPollId = sessionStorage.getItem('editPollId');
      if (editPollId && pollsArray.length > 0) {
        // Try both _id and id, and handle string/number comparison
        const pollToEdit = pollsArray.find(p => {
          const pid = String(p._id || p.id || '');
          const eid = String(editPollId);
          return pid === eid || pid === String(Number(eid)) || String(Number(pid)) === eid;
        });
        
        if (pollToEdit) {
          setNewPoll({
            question: pollToEdit.question || "",
            options: pollToEdit.options || ["", ""],
            category: pollToEdit.category || "",
            status: pollToEdit.status || "Active",
            startDate: pollToEdit.startDate || "",
            endDate: pollToEdit.endDate || "",
            startDateTime: pollToEdit.startDateTime || "",
            endDateTime: pollToEdit.endDateTime || "",
            description: pollToEdit.description || "",
            allowMultipleVotes: pollToEdit.allowMultipleVotes || false,
            settings: pollToEdit.settings || defaultNewPoll.settings,
          });
          setEditingPollId(pollToEdit._id || pollToEdit.id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        sessionStorage.removeItem('editPollId');
      }
    };

    loadPollsAndCheckEdit();
  }, [axiosSecure]);

  // Save polls to localStorage whenever polls change
  useEffect(() => {
    if (polls.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('pollsUpdated', { detail: polls }));
    }
  }, [polls]);

  const summary = useMemo(() => {
    const totalPolls = polls.length;
    const totalVotes = polls.reduce((sum, p) => sum + (p.votes || 0), 0);
    const top = polls
      .slice()
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))[0];
    return {
      totalPolls,
      totalVotes,
      topQuestion: top?.question || "—",
    };
  }, [polls]);

  const handleOptionChange = (idx, value) => {
    setNewPoll((p) => ({ ...p, options: p.options.map((op, i) => (i === idx ? value : op)) }));
  };

  const addOption = () => {
    if (newPoll.options.length >= 5) return;
    setNewPoll((p) => ({ ...p, options: [...p.options, ""] }));
  };

  const removeOption = (idx) => {
    if (newPoll.options.length <= 2) return;
    setNewPoll((p) => ({ ...p, options: p.options.filter((_, i) => i !== idx) }));
  };

  const resetForm = () => setNewPoll(defaultNewPoll);

  const createOrUpdatePoll = async (e) => {
    e.preventDefault();
    const trimmedOptions = newPoll.options.map((o) => o.trim()).filter(Boolean);
    if (!newPoll.question.trim() || trimmedOptions.length < 2) return;

    const pollData = {
      question: newPoll.question.trim(),
      options: trimmedOptions,
      category: newPoll.category || "",
      status: newPoll.status,
      startDate: newPoll.startDate || newPoll.startDateTime?.split('T')[0] || "",
      endDate: newPoll.endDate || newPoll.endDateTime?.split('T')[0] || "",
      startDateTime: newPoll.startDateTime || "",
      endDateTime: newPoll.endDateTime || "",
      description: newPoll.description || "",
      allowMultipleVotes: newPoll.allowMultipleVotes || false,
      settings: newPoll.settings || defaultNewPoll.settings,
    };

    if (editingPollId) {
      setPolls((prev) =>
        prev.map((p) => {
          const pid = p._id || p.id;
          const eid = editingPollId;
          if (String(pid) === String(eid)) {
            return { ...p, ...pollData };
          }
          return p;
        })
      );
      // Also try to update via API
      try {
        const id = editingPollId;
        await axiosSecure.put(`/polls/${id}`, pollData);
      } catch (error) {
        console.error('Error updating poll via API:', error);
      }
      setEditingPollId(null);
    } else {
      try {
        const response = await axiosSecure.post('/polls', pollData);
        const created = response?.data?.poll;
        if (created) {
          setPolls((prev) => [
            ...prev,
            {
              ...created,
              id: created._id || Date.now(),
            },
          ]);
        }
      } catch (error) {
        console.error('Error creating poll:', error);
      }
    }
    resetForm();
  };

  const percent = (votes, total) => (total ? Math.round((votes * 100) / total) : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-2 px-2 sm:py-3 sm:px-3">
    <div className="max-w-7xl mx-auto">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl sm:rounded-2xl shadow-xl p-2 sm:p-3 md:p-4 mb-2 sm:mb-3 md:mb-4 text-white">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="bg-white/20 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                <FaPoll className="text-lg sm:text-xl md:text-2xl text-white" />
              </div>
        <div>
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1">জরিপ (Polls) অ্যাডমিন</h2>
                <p className="text-purple-100 text-[10px] sm:text-xs">নতুন জরিপ তৈরি, পরিচালনা ও অ্যানালিটিক্স দেখুন</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto mt-2 sm:mt-0">
              <Link 
                to="/dashboard/manage-polls" 
                className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium hover:bg-white/30 transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-lg"
              >
                <FaChartBar className="text-[10px] sm:text-xs" /> <span className="hidden sm:inline">Manage Polls</span>
              </Link>
              <a 
                href="/election/polls" 
                className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium hover:bg-white/30 transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-lg"
              >
                <FaEye className="text-[10px] sm:text-xs" /> <span className="text-[10px] sm:text-xs">পাবলিক পোল</span>
              </a>
              <button 
                onClick={() => window.document.getElementById('poll-category-modal').showModal()} 
                className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg bg-yellow-400 text-gray-800 text-[10px] sm:text-xs font-medium hover:bg-yellow-300 transition-all duration-300 flex items-center gap-1 shadow-md hover:shadow-lg"
              >
                <FaTag className="text-[10px] sm:text-xs" /> <span className="text-[10px] sm:text-xs">ক্যাটাগরি তৈরি</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards with Gradient */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 md:gap-3 mb-2 sm:mb-3 md:mb-4">
          <SummaryCard 
            label="Total Polls" 
            value={summary.totalPolls} 
            icon={<FaPoll className="text-base sm:text-lg md:text-xl" />}
            gradient="from-purple-500 to-pink-500"
            bgColor="bg-purple-100"
          />
          <SummaryCard 
            label="Total Votes" 
            value={summary.totalVotes} 
            icon={<FaUsers className="text-base sm:text-lg md:text-xl" />}
            gradient="from-blue-500 to-cyan-500"
            bgColor="bg-blue-100"
          />
          <SummaryCard 
            label="Top Active Poll" 
            value={summary.topQuestion} 
            icon={<FaChartBar className="text-base sm:text-lg md:text-xl" />}
            gradient="from-indigo-500 to-purple-500"
            bgColor="bg-indigo-100"
          />
        </div>

        {/* Create / Edit Poll Form with Beautiful Design */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-purple-100 overflow-hidden mb-2 sm:mb-3 md:mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 sm:p-2.5 md:p-3 text-white">
            <div className="flex items-center justify-between flex-wrap gap-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="bg-white/20 backdrop-blur-sm p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                  <FaPlus className="text-sm sm:text-base md:text-lg" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">{editingPollId ? "পোল আপডেট" : "নতুন পোল তৈরি"}</h3>
                  <p className="text-purple-100 text-[10px] sm:text-xs mt-0.5">{editingPollId ? "আপনার পোল সম্পাদনা করুন" : "একটি নতুন জরিপ তৈরি করুন"}</p>
      </div>
      </div>
          {editingPollId && (
                <button 
                  onClick={() => { setEditingPollId(null); resetForm(); }} 
                  className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 flex items-center gap-1 text-[10px] sm:text-xs font-medium"
                >
                  <FaPlus /> <span className="text-[10px] sm:text-xs">নতুন তৈরি করুন</span>
                </button>
          )}
        </div>
          </div>
          <div className="p-2 sm:p-2.5 md:p-3 lg:p-4">
            <form onSubmit={createOrUpdatePoll} className="space-y-2 sm:space-y-2.5 md:space-y-3">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 border-purple-100">
                <label className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">
                  <FaPoll className="text-purple-600 text-[10px] sm:text-xs" /> Poll Question *
                </label>
            <input
              type="text"
                  className="w-full border-2 border-purple-200 rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-white"
                  placeholder="উদাহরণ: আপনি কাকে ভোট দিতে চান?"
              value={newPoll.question}
              onChange={(e) => setNewPoll((p) => ({ ...p, question: e.target.value }))}
              required
            />
          </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 border-blue-100">
                <label className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">
                  <FaEdit className="text-blue-600 text-[10px] sm:text-xs" /> Description (Optional)
                </label>
                <textarea
                  className="w-full border-2 border-blue-200 rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white resize-none"
                  placeholder="সংক্ষিপ্ত ব্যাখ্যা (ঐচ্ছিক)"
                  rows="2"
                  value={newPoll.description}
                  onChange={(e) => setNewPoll((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 border-green-100">
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  <FaCheckCircle className="text-green-600 text-[10px] sm:text-xs" /> Options (2-5)
                </div>
                <div className="space-y-1.5 sm:space-y-2">
              {newPoll.options.map((opt, idx) => (
                    <div key={idx} className="flex gap-1.5 sm:gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-1.5 sm:left-2 md:left-2.5 top-1/2 transform -translate-y-1/2 text-green-600 font-bold bg-green-100 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs">
                          {idx + 1}
                        </span>
                  <input
                    type="text"
                          className="w-full border-2 border-green-200 rounded-md sm:rounded-lg pl-6 sm:pl-7 md:pl-8 pr-2 sm:pr-2.5 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    required
                  />
                      </div>
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                        className="px-1.5 sm:px-2 md:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs rounded-md sm:rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-1"
                    disabled={newPoll.options.length <= 2}
                  >
                        <FaTrash className="text-[10px]" /> <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                    className="w-full px-2 sm:px-2.5 py-1.5 sm:py-2 text-[10px] sm:text-xs rounded-md sm:rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                disabled={newPoll.options.length >= 5}
              >
                    <FaPlus className="text-[10px] sm:text-xs" /> Add Option
              </button>
            </div>
          </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 border-orange-100">
                  <label className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">
                    <FaTag className="text-orange-600 text-[10px] sm:text-xs" /> Poll Category / Tag
                  </label>
              <select
                    className="w-full border-2 border-orange-200 rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white"
                value={newPoll.category}
                onChange={(e) => setNewPoll((p) => ({ ...p, category: e.target.value }))}
              >
                    <option value="">Select (Optional)</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
                  <div className="mt-1 text-[10px] sm:text-xs text-orange-600 font-medium">প্রয়োজন হলে নতুন ক্যাটাগরি তৈরি করুন।</div>
            </div>
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 border-pink-100">
                  <label className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">
                    <FaCog className="text-pink-600 text-[10px] sm:text-xs" /> Visibility Status
                  </label>
              <select
                    className="w-full border-2 border-pink-200 rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 bg-white"
                value={newPoll.status}
                onChange={(e) => setNewPoll((p) => ({ ...p, status: e.target.value }))}
              >
                <option>Active</option>
                <option>Inactive</option>
                    <option>Upcoming</option>
              </select>
            </div>
          </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
                <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 border-cyan-100">
                  <label className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">
                    <FaCalendarAlt className="text-cyan-600 text-[10px] sm:text-xs" /> Start Date & Time
                  </label>
              <input
                    type="datetime-local"
                    className="w-full border-2 border-cyan-200 rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 bg-white"
                    value={newPoll.startDateTime}
                    onChange={(e) => setNewPoll((p) => ({ ...p, startDateTime: e.target.value, startDate: e.target.value.split('T')[0] }))}
              />
            </div>
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border-2 border-violet-100">
                  <label className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">
                    <FaClock className="text-violet-600 text-[10px] sm:text-xs" /> End Date & Time
                  </label>
              <input
                    type="datetime-local"
                    className="w-full border-2 border-violet-200 rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 bg-white"
                    value={newPoll.endDateTime}
                    onChange={(e) => setNewPoll((p) => ({ ...p, endDateTime: e.target.value, endDate: e.target.value.split('T')[0] }))}
              />
            </div>
          </div>

          {/* Settings */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-2.5 md:p-3 border-2 border-slate-200">
                <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-1">
                  <FaCog className="text-slate-600 text-xs sm:text-sm" /> Advanced Settings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
            <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">Votes per user</label>
              <input
                type="number"
                min={1}
                      className="w-full border-2 border-slate-200 rounded-md sm:rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300 bg-white"
                value={newPoll.settings.votesPerUser}
                onChange={(e) => setNewPoll((p) => ({ ...p, settings: { ...p.settings, votesPerUser: Number(e.target.value) || 1 } }))}
              />
            </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg border-2 border-slate-200 hover:border-purple-300 cursor-pointer transition-all duration-300">
                      <input 
                        type="checkbox" 
                        checked={newPoll.allowMultipleVotes} 
                        onChange={(e) => setNewPoll((p) => ({ ...p, allowMultipleVotes: e.target.checked }))}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700">Allow Multiple Votes</span>
                    </label>
                    <label className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg border-2 border-slate-200 hover:border-blue-300 cursor-pointer transition-all duration-300">
                      <input 
                        type="checkbox" 
                        checked={newPoll.settings.autoCloseOnEnd} 
                        onChange={(e) => setNewPoll((p) => ({ ...p, settings: { ...p.settings, autoCloseOnEnd: e.target.checked } }))}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700">Auto-close on end date</span>
              </label>
                    <label className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg border-2 border-slate-200 hover:border-green-300 cursor-pointer transition-all duration-300">
                      <input 
                        type="checkbox" 
                        checked={newPoll.settings.allowAnonymous} 
                        onChange={(e) => setNewPoll((p) => ({ ...p, settings: { ...p.settings, allowAnonymous: e.target.checked } }))}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700">Allow anonymous votes</span>
              </label>
                    <label className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-md sm:rounded-lg border-2 border-slate-200 hover:border-red-300 cursor-pointer transition-all duration-300">
                      <input 
                        type="checkbox" 
                        checked={newPoll.settings.adminOnly} 
                        onChange={(e) => setNewPoll((p) => ({ ...p, settings: { ...p.settings, adminOnly: e.target.checked } }))}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700">Admin-only poll</span>
              </label>
                  </div>
            </div>
          </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 md:gap-2.5 pt-1.5 sm:pt-2 md:pt-2.5">
                <button 
                  type="submit" 
                  className="flex-1 px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                >
                  {editingPollId ? (
                    <>
                      <FaEdit className="text-[10px] sm:text-xs" /> <span className="text-xs sm:text-sm">Update Poll</span>
                    </>
                  ) : (
                    <>
                      <FaPlus className="text-[10px] sm:text-xs" /> <span className="text-xs sm:text-sm">Create Poll</span>
                    </>
                  )}
            </button>
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold text-xs sm:text-sm hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                >
                  <FaTimesCircle className="text-[10px] sm:text-xs" /> <span className="text-xs sm:text-sm">Reset</span>
            </button>
          </div>
        </form>
      </div>
        </div>

        {/* View Result Modals with Charts */}
        {polls.map((poll) => {
        const chartData = poll.optionStats?.map((op, i) => ({
          name: op.label,
          value: op.votes,
          percent: percent(op.votes, poll.votes),
          fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]
        })) || [];

        return (
          <dialog key={poll.id} id={`poll-result-${poll.id}`} className="modal">
            <div className="modal-backdrop" onClick={() => window.document.getElementById(`poll-result-${poll.id}`).close()}></div>
            <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2">{poll.question}</h3>
              {poll.description && (
                <p className="text-gray-600 mb-1.5 sm:mb-2 text-[10px] sm:text-xs">{poll.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3 text-[10px] sm:text-xs text-gray-600">
                <span>শ্রেণি: {poll.category || "—"}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  poll.status === "Active" ? "bg-green-100 text-green-700" : 
                  poll.status === "Upcoming" ? "bg-blue-100 text-blue-700" : 
                  "bg-gray-100 text-gray-700"
                }`}>
                  {poll.status}
                  </span>
                <span>•</span>
                <span>মোট ভোট: {poll.votes || 0}</span>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3 my-2 sm:my-3 md:my-4">
                {/* Pie Chart */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1.5 sm:mb-2 text-xs sm:text-sm">Pie Chart</h4>
                  {chartData.length > 0 && poll.votes > 0 ? (
                    <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={55}
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
                    <div className="flex items-center justify-center h-[200px] sm:h-[250px] text-gray-500 text-xs sm:text-sm">
                      No votes yet
                    </div>
                  )}
                </div>

                {/* Bar Chart */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1.5 sm:mb-2 text-xs sm:text-sm">Bar Chart</h4>
                  {chartData.length > 0 && poll.votes > 0 ? (
                    <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={50} className="sm:h-[60px]" fontSize={10} />
                        <YAxis fontSize={10} />
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
                    <div className="flex items-center justify-center h-[200px] sm:h-[250px] text-gray-500 text-xs sm:text-sm">
                      No votes yet
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Stats Table */}
              <div className="mt-2 sm:mt-3">
                <h4 className="font-semibold text-gray-800 mb-1.5 sm:mb-2 text-xs sm:text-sm">Detailed Statistics</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-[10px] sm:text-xs">
                    <thead>
                      <tr className="text-left text-gray-600 border-b">
                        <th className="py-1 sm:py-1.5 pr-1.5 sm:pr-2 md:pr-3">Option</th>
                        <th className="py-1 sm:py-1.5 pr-1.5 sm:pr-2 md:pr-3">Votes</th>
                        <th className="py-1 sm:py-1.5 pr-1.5 sm:pr-2 md:pr-3">Percentage</th>
                        <th className="py-1 sm:py-1.5 pr-1.5 sm:pr-2 md:pr-3">Visual</th>
                      </tr>
                    </thead>
                    <tbody>
                {poll.optionStats?.map((op, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-1 sm:py-1.5 pr-1.5 sm:pr-2 md:pr-3 font-medium">{op.label}</td>
                          <td className="py-1 sm:py-1.5 pr-1.5 sm:pr-2 md:pr-3">{op.votes}</td>
                          <td className="py-1 sm:py-1.5 pr-1.5 sm:pr-2 md:pr-3">{percent(op.votes, poll.votes)}%</td>
                          <td className="py-1 sm:py-1.5 pr-1.5 sm:pr-2 md:pr-3">
                            <div className="w-20 sm:w-24 md:w-32 h-1 sm:h-1.5 bg-gray-100 rounded">
                              <div
                                className="h-1 sm:h-1.5 rounded"
                                style={{ 
                                  width: `${percent(op.votes, poll.votes)}%`,
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

              <div className="modal-action mt-3 sm:mt-4">
                <form method="dialog">
                  <button className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-[10px] sm:text-xs">Close</button>
                </form>
              </div>
            </div>
          </dialog>
          );
        })}

      {/* Category Create Modal */}
      <dialog id="poll-category-modal" className="modal">
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2">নতুন ক্যাটাগরি তৈরি</h3>
          <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3">উদাহরণ: ইউনিয়ন নির্বাচন, সিটি কর্পোরেশন</p>
          <form method="dialog" className="space-y-1.5 sm:space-y-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="w-full border rounded-md px-2 py-1.5 sm:py-2 text-xs sm:text-sm"
              placeholder="ক্যাটাগরির নাম"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 pt-1.5 sm:pt-2">
              <button
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md bg-gray-100 text-[10px] sm:text-xs"
                onClick={() => {
                  setNewCategoryName("");
                  window.document.getElementById('poll-category-modal').close();
                }}
              >
                বাতিল
              </button>
              <button
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md bg-blue-600 text-white disabled:opacity-50 text-[10px] sm:text-xs"
                disabled={!newCategoryName.trim()}
                onClick={() => {
                  const name = newCategoryName.trim();
                  if (!name) return;
                  if (!categories.includes(name)) {
                    setCategories((prev) => [...prev, name]);
                  }
                  setNewPoll((p) => ({ ...p, category: name }));
                  setNewCategoryName("");
                  window.document.getElementById('poll-category-modal').close();
                }}
              >
                সংরক্ষণ
              </button>
            </div>
          </form>
        </div>
      </dialog>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, gradient, bgColor }) => (
  <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
    <div className={`bg-gradient-to-br ${gradient} p-2 sm:p-3 md:p-4 text-white`}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className={`${bgColor} p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm`}>
          {icon}
        </div>
      </div>
      <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-0.5 sm:mb-1">{String(value)}</div>
      <div className="text-[10px] sm:text-xs font-medium text-white/90 uppercase tracking-wide">{label}</div>
    </div>
  </div>
);

export default PollsAdmin;


