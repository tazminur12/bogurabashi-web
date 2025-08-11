import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaGlobe, FaClock, FaUsers, FaMoneyBillWave, FaPrint, FaShare, FaDownload, FaFacebook, FaInstagram, FaTwitter, FaArrowLeft, FaSpinner } from "react-icons/fa";

const EventDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("ইভেন্ট তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, axiosSecure]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
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

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `${event.title} - ${event.location}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("লিংক কপি হয়েছে!");
    }
  };

  const handleDownload = () => {
    const eventText = `
ইভেন্টের বিবরণ
================

শিরোনাম: ${event.title}
ক্যাটাগরি: ${event.category}
স্থান: ${event.location}
আয়োজক: ${event.organizer}
তারিখ: ${formatDate(event.date)}
সময়: ${formatTime(event.time)}
স্ট্যাটাস: ${getStatusLabel(event.status)}

বিবরণ: ${event.description || 'N/A'}

যোগাযোগের তথ্য:
ফোন: ${event.organizerPhone || 'N/A'}
ইমেইল: ${event.organizerEmail || 'N/A'}
ওয়েবসাইট: ${event.organizerWebsite || 'N/A'}

অতিরিক্ত তথ্য:
ধারণক্ষমতা: ${event.capacity || 'N/A'}
প্রবেশ ফি: ${event.isFree ? 'বিনামূল্যে' : `${event.entryFee} টাকা`}
লক্ষ্য দর্শক: ${event.targetAudience || 'N/A'}

বিশেষ আকর্ষণ: ${event.highlights || 'N/A'}
প্রয়োজনীয়তা: ${event.requirements || 'N/A'}

ঠিকানা: ${event.locationDetails?.address || event.address || 'N/A'}
এলাকা: ${event.locationDetails?.area || event.area || 'N/A'}
ল্যান্ডমার্ক: ${event.locationDetails?.landmark || event.landmark || 'N/A'}

সোশ্যাল মিডিয়া:
ফেসবুক: ${event.socialMedia?.facebook || 'N/A'}
ইনস্টাগ্রাম: ${event.socialMedia?.instagram || 'N/A'}
টুইটার: ${event.socialMedia?.twitter || 'N/A'}

---
বগুড়া জেলা প্রশাসন
বগুড়াবাশি.কম
    `;

    const blob = new Blob([eventText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">ইভেন্ট তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">ইভেন্ট পাওয়া যায়নি</h3>
          <p className="text-gray-500 text-sm mb-4">{error || "ইভেন্টটি বিদ্যমান নেই"}</p>
          <Link
            to="/events"
            className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition duration-200"
          >
            ← সব ইভেন্টে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-200 text-sm font-medium mb-4"
          >
            <FaArrowLeft />
            ← সব ইভেন্টে ফিরে যান
          </Link>
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    {getCategoryIcon(event.category)} {event.category}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200 flex items-center gap-2 text-sm"
                  title="প্রিন্ট করুন"
                >
                  <FaPrint />
                  প্রিন্ট
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200 flex items-center gap-2 text-sm"
                  title="শেয়ার করুন"
                >
                  <FaShare />
                  শেয়ার
                </button>
                <button
                  onClick={handleDownload}
                  className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition duration-200 flex items-center gap-2 text-sm"
                  title="ডাউনলোড করুন"
                >
                  <FaDownload />
                  ডাউনলোড
                </button>
              </div>
            </div>

            {/* Event Image Placeholder */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 text-center mb-6">
              <div className="text-6xl mb-4">{getCategoryIcon(event.category)}</div>
              <p className="text-gray-600">ইভেন্টের ছবি</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                {event.description && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 ইভেন্টের বিবরণ</h3>
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                )}

                {/* Highlights */}
                {event.highlights && (
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">⭐ বিশেষ আকর্ষণ</h3>
                    <p className="text-gray-700 leading-relaxed">{event.highlights}</p>
                  </div>
                )}

                {/* Requirements */}
                {event.requirements && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 প্রয়োজনীয়তা</h3>
                    <p className="text-gray-700 leading-relaxed">{event.requirements}</p>
                  </div>
                )}

                {/* Contact Info */}
                {event.contactInfo && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">📞 যোগাযোগের তথ্য</h3>
                    <p className="text-gray-700 leading-relaxed">{event.contactInfo}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Quick Info Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 দ্রুত তথ্য</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600">তারিখ</p>
                        <p className="font-medium">{formatDate(event.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaClock className="text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">সময়</p>
                        <p className="font-medium">{formatTime(event.time)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600">স্থান</p>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaUser className="text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">আয়োজক</p>
                        <p className="font-medium">{event.organizer}</p>
                      </div>
                    </div>

                    {event.capacity && (
                      <div className="flex items-center gap-3">
                        <FaUsers className="text-orange-500" />
                        <div>
                          <p className="text-sm text-gray-600">ধারণক্ষমতা</p>
                          <p className="font-medium">{event.capacity} জন</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <FaMoneyBillWave className="text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">প্রবেশ ফি</p>
                        <p className="font-medium">
                          {event.isFree ? "বিনামূল্যে" : `${event.entryFee} টাকা`}
                        </p>
                      </div>
                    </div>

                    {event.targetAudience && (
                      <div className="flex items-center gap-3">
                        <FaUsers className="text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600">লক্ষ্য দর্শক</p>
                          <p className="font-medium">{event.targetAudience}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Organizer Contact */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 আয়োজকের যোগাযোগ</h3>
                  
                  <div className="space-y-3">
                    {event.organizerPhone && (
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-green-500" />
                        <a href={`tel:${event.organizerPhone}`} className="text-blue-600 hover:underline">
                          {event.organizerPhone}
                        </a>
                      </div>
                    )}

                    {event.organizerEmail && (
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-blue-500" />
                        <a href={`mailto:${event.organizerEmail}`} className="text-blue-600 hover:underline">
                          {event.organizerEmail}
                        </a>
                      </div>
                    )}

                    {event.organizerWebsite && (
                      <div className="flex items-center gap-3">
                        <FaGlobe className="text-purple-500" />
                        <a href={event.organizerWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          ওয়েবসাইট দেখুন
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Media */}
                {(event.socialMedia?.facebook || event.socialMedia?.instagram || event.socialMedia?.twitter) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📱 সোশ্যাল মিডিয়া</h3>
                    
                    <div className="space-y-3">
                      {event.socialMedia?.facebook && (
                        <a
                          href={event.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition duration-200"
                        >
                          <FaFacebook className="text-blue-500" />
                          ফেসবুক
                        </a>
                      )}

                      {event.socialMedia?.instagram && (
                        <a
                          href={event.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-pink-600 hover:text-pink-800 transition duration-200"
                        >
                          <FaInstagram className="text-pink-500" />
                          ইনস্টাগ্রাম
                        </a>
                      )}

                      {event.socialMedia?.twitter && (
                        <a
                          href={event.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-blue-400 hover:text-blue-600 transition duration-200"
                        >
                          <FaTwitter className="text-blue-400" />
                          টুইটার
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Location Details */}
                {(event.locationDetails?.address || event.locationDetails?.area || event.locationDetails?.landmark) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 বিস্তারিত ঠিকানা</h3>
                    
                    <div className="space-y-2 text-sm">
                      {event.locationDetails?.address && (
                        <p><span className="font-medium">ঠিকানা:</span> {event.locationDetails.address}</p>
                      )}
                      {event.locationDetails?.area && (
                        <p><span className="font-medium">এলাকা:</span> {event.locationDetails.area}</p>
                      )}
                      {event.locationDetails?.landmark && (
                        <p><span className="font-medium">ল্যান্ডমার্ক:</span> {event.locationDetails.landmark}</p>
                      )}
                      <p><span className="font-medium">শহর:</span> বগুড়া</p>
                      <p><span className="font-medium">জেলা:</span> বগুড়া</p>
                      <p><span className="font-medium">বিভাগ:</span> রাজশাহী</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          © 2025 বগুড়া জেলা প্রশাসন | ইভেন্ট ব্যবস্থাপনা সিস্টেম
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 