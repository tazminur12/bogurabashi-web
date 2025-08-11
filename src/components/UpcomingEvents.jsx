import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaClock, FaArrowRight, FaSpinner } from "react-icons/fa";

const UpcomingEvents = () => {
  const axiosSecure = useAxiosSecure();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/events");
        // Filter upcoming events and sort by date
        const upcomingEvents = res.data
          .filter(event => event.status === "Upcoming")
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 6); // Show only 6 events
        setEvents(upcomingEvents);
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [axiosSecure]);

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

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">আসন্ন ইভেন্ট লোড হচ্ছে...</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">কোনো আসন্ন ইভেন্ট নেই</h2>
            <p className="text-gray-600 mb-6">শীঘ্রই নতুন ইভেন্ট যোগ হবে</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            📅 আসন্ন ইভেন্টসমূহ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            বগুড়া জেলার আসন্ন ইভেন্টসমূহ দেখুন এবং অংশগ্রহণ করুন
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
            >
              {/* Event Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-6xl">{getCategoryIcon(event.category)}</div>
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

        {/* View All Events Button */}
        <div className="text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600 hover:border-purple-700 font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            সব ইভেন্ট দেখুন
            <FaArrowRight className="text-sm" />
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">{events.length}</div>
            <div className="text-sm text-gray-600">আসন্ন ইভেন্ট</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {events.filter(e => e.isFree).length}
            </div>
            <div className="text-sm text-gray-600">বিনামূল্যে</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {new Set(events.map(e => e.category)).size}
            </div>
            <div className="text-sm text-gray-600">বিভিন্ন ক্যাটাগরি</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {new Set(events.map(e => e.organizer)).size}
            </div>
            <div className="text-sm text-gray-600">আয়োজক প্রতিষ্ঠান</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">আপনার ইভেন্ট যোগ করুন</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            বগুড়া জেলার ইভেন্ট আয়োজক হিসেবে আপনার ইভেন্টের তথ্য যোগ করুন এবং সকলের কাছে পৌঁছে দিন
          </p>
          <Link
            to="/add-event"
            className="inline-flex items-center gap-2 bg-white text-purple-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            ➕ ইভেন্ট যোগ করুন
            <FaArrowRight className="text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents; 