import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaEye, FaPlus, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch, FaFilter, FaClock, FaUsers, FaStar } from "react-icons/fa";

const EventAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch all events
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/events");
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (err) {
        console.error("ইভেন্ট ফেচিং সমস্যা:", err);
        Swal.fire("❌ ত্রুটি", "ইভেন্ট তথ্য লোড করতে সমস্যা হয়েছে", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  // Search and filter functionality
  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, statusFilter, categoryFilter, events]);

  // Delete event
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ইভেন্টটি মুছে ফেললে ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "না, বাতিল করুন",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/events/${id}`);
        setEvents(prev => prev.filter(event => event._id !== id));
        Swal.fire("✅ সফল!", "ইভেন্টটি সফলভাবে মুছে ফেলা হয়েছে", "success");
      } catch (err) {
        console.error("Error deleting event:", err);
        Swal.fire("❌ ত্রুটি", "ইভেন্ট মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Ongoing":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Upcoming":
        return "🟦";
      case "Ongoing":
        return "🟢";
      case "Completed":
        return "⚫";
      case "Cancelled":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Upcoming":
        return "আসন্ন";
      case "Ongoing":
        return "চলমান";
      case "Completed":
        return "সম্পন্ন";
      case "Cancelled":
        return "বাতিল";
      default:
        return status || "N/A";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Cultural":
        return "🎭";
      case "Sports":
        return "⚽";
      case "Educational":
        return "📚";
      case "Business":
        return "💼";
      case "Religious":
        return "🕊️";
      case "Social":
        return "👥";
      case "Entertainment":
        return "🎪";
      case "Technology":
        return "💻";
      default:
        return "📅";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#333] mb-1">📅 ইভেন্ট ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-600">বগুড়া জেলার ইভেন্টের তথ্য পরিচালনা করুন</p>
          </div>
          <Link
            to="/dashboard/add-event"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <FaPlus />
            ➕ নতুন ইভেন্ট যোগ করুন
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ইভেন্ট, স্থান বা আয়োজক অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="Upcoming">আসন্ন</option>
                <option value="Ongoing">চলমান</option>
                <option value="Completed">সম্পন্ন</option>
                <option value="Cancelled">বাতিল</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 transition duration-200"
              >
                <option value="all">সব ক্যাটাগরি</option>
                <option value="Cultural">🎭 সাংস্কৃতিক</option>
                <option value="Sports">⚽ খেলাধুলা</option>
                <option value="Educational">📚 শিক্ষামূলক</option>
                <option value="Business">💼 ব্যবসায়িক</option>
                <option value="Religious">🕊️ ধর্মীয়</option>
                <option value="Social">👥 সামাজিক</option>
                <option value="Entertainment">🎪 বিনোদন</option>
                <option value="Technology">💻 প্রযুক্তি</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4">
              <span className="text-sm text-gray-600">
                মোট: <span className="font-semibold text-purple-600">{filteredEvents.length}</span> ইভেন্ট
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600 text-sm">লোড হচ্ছে...</span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো ইভেন্ট নেই</h3>
              <p className="text-gray-500 text-sm mb-4">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ইভেন্ট নেই।"
                  : "প্রথম ইভেন্ট যোগ করে শুরু করুন!"
                }
              </p>
              {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition duration-200"
                >
                  🔄 সব দেখুন
                </button>
              ) : (
                <Link
                  to="/dashboard/add-event"
                  className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition duration-200"
                >
                  ➕ প্রথম ইভেন্ট যোগ করুন
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📅 ইভেন্ট</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📍 স্থান</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">👤 আয়োজক</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📅 তারিখ</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">🎭 ক্যাটাগরি</th>
                    <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700">📊 অবস্থা</th>
                    <th className="py-4 px-4 text-center text-sm font-semibold text-gray-700">⚙️ অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEvents.map((event, index) => (
                    <tr key={event._id} className="hover:bg-gray-50 transition duration-200">
                      <td className="py-4 px-4">
                        <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{event.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <FaCalendarAlt className="text-purple-500 text-sm" />
                            <span className="text-xs text-gray-500">ইভেন্ট</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-red-500 text-sm" />
                          <span className="text-gray-700 text-sm">{event.location || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-blue-500 text-sm" />
                          <span className="text-gray-700">{event.organizer || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-green-500 text-sm" />
                          <span className="text-gray-700 text-sm">{formatDate(event.date)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">
                          {getCategoryIcon(event.category)} {event.category || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)} {getStatusLabel(event.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/dashboard/event-details/${event._id}`}
                            className="p-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition duration-200 flex items-center justify-center"
                            title="বিস্তারিত দেখুন"
                          >
                            <FaEye className="text-sm" />
                          </Link>
                          <Link
                            to={`/dashboard/update-event/${event._id}`}
                            className="p-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-lg transition duration-200 flex items-center justify-center"
                            title="সম্পাদনা করুন"
                          >
                            <FaEdit className="text-sm" />
                          </Link>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 flex items-center justify-center"
                            title="মুছে ফেলুন"
                          >
                            <FaTrash className="text-sm" />
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

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>📅 মোট ইভেন্ট:</span>
              <span className="font-semibold text-purple-600">{events.length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🟦 আসন্ন:</span>
              <span className="font-semibold text-blue-600">{events.filter(e => e.status === "Upcoming").length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>🟢 চলমান:</span>
              <span className="font-semibold text-green-600">{events.filter(e => e.status === "Ongoing").length}</span>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span>⚫ সম্পন্ন:</span>
              <span className="font-semibold text-gray-600">{events.filter(e => e.status === "Completed").length}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 ইভেন্ট ব্যবস্থাপনা সিস্টেম | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default EventAdmin;
