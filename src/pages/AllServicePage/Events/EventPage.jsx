import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaClock, FaArrowRight, FaSpinner, FaSearch, FaFilter, FaPlus } from "react-icons/fa";

const EventPage = () => {
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/events");
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
      case "Health":
        return "🏥";
      case "Environment":
        return "🌱";
      default:
        return "📅";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Cultural":
        return "bg-purple-100 text-purple-700";
      case "Sports":
        return "bg-green-100 text-green-700";
      case "Educational":
        return "bg-blue-100 text-blue-700";
      case "Business":
        return "bg-gray-100 text-gray-700";
      case "Religious":
        return "bg-yellow-100 text-yellow-700";
      case "Social":
        return "bg-pink-100 text-pink-700";
      case "Entertainment":
        return "bg-red-100 text-red-700";
      case "Technology":
        return "bg-indigo-100 text-indigo-700";
      case "Health":
        return "bg-emerald-100 text-emerald-700";
      case "Environment":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">ইভেন্ট লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📅 সকল ইভেন্ট</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            বগুড়া জেলার সকল ইভেন্ট দেখুন এবং আপনার পছন্দের ইভেন্টে অংশগ্রহণ করুন
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-8">
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
                <option value="Health">🏥 স্বাস্থ্য</option>
                <option value="Environment">🌱 পরিবেশ</option>
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

        {/* Add Event Button */}
        <div className="text-center mb-8">
          <Link
            to="/add-event"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaPlus />
            ➕ আপনার ইভেন্ট যোগ করুন
          </Link>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
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
                to="/add-event"
                className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition duration-200"
              >
                ➕ প্রথম ইভেন্ট যোগ করুন
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
              >
                {/* Event Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
                  <div className="text-6xl">{getCategoryIcon(event.category)}</div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {getStatusLabel(event.status)}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {getCategoryIcon(event.category)} {event.category}
                    </span>
                  </div>

                  {/* Event Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaCalendarAlt className="text-purple-500 flex-shrink-0" />
                      <span>{formatDate(event.date)}</span>
                    </div>

                    {event.time && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <FaClock className="text-green-500 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    {event.organizer && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <FaUser className="text-blue-500 flex-shrink-0" />
                        <span className="line-clamp-1">{event.organizer}</span>
                      </div>
                    )}
                  </div>

                  {/* Entry Fee */}
                  {event.entryFee !== undefined && (
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        event.isFree 
                          ? "bg-green-100 text-green-700" 
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {event.isFree ? "🆓 বিনামূল্যে" : `💰 ${event.entryFee} টাকা`}
                      </span>
                    </div>
                  )}

                  {/* Description Preview */}
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {/* View Details Button */}
                  <Link
                    to={`/event/${event._id}`}
                    className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm"
                  >
                    বিস্তারিত দেখুন
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">{events.length}</div>
            <div className="text-sm text-gray-600">মোট ইভেন্ট</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {events.filter(e => e.status === "Upcoming").length}
            </div>
            <div className="text-sm text-gray-600">আসন্ন ইভেন্ট</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {events.filter(e => e.isFree).length}
            </div>
            <div className="text-sm text-gray-600">বিনামূল্যে</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {new Set(events.map(e => e.category)).size}
            </div>
            <div className="text-sm text-gray-600">বিভিন্ন ক্যাটাগরি</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          © 2025 বগুড়া জেলা প্রশাসন | ইভেন্ট ব্যবস্থাপনা সিস্টেম
        </div>
      </div>
    </div>
  );
};

export default EventPage; 