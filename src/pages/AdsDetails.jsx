import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { 
  FaArrowLeft, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaGlobe, 
  FaCalendarAlt, 
  FaTag, 
  FaAd, 
  FaEye, 
  FaShare, 
  FaBookmark, 
  FaHeart, 
  FaStar, 
  FaClock, 
  FaBuilding, 
  FaExternalLinkAlt,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaSpinner,
  FaTimes,
  FaCheck
} from 'react-icons/fa';

const AdsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  
  // Fetch ad details
  const {
    data: ad,
    isLoading: adLoading,
    // error: adError, // removed unused error
  } = useQuery({
    queryKey: ["ad-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/ads/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch related ads
  const {
    data: relatedAds = [],
  } = useQuery({
    queryKey: ["related-ads", ad?.category],
    queryFn: async () => {
      const res = await axiosSecure.get(`/ads?category=${ad.category}&limit=3&exclude=${id}`);
      return res.data;
    },
    enabled: !!ad?.category,
  });

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAdTypeColor = (type) => {
    switch (type) {
      case "featured":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "premium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "sponsored":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getAdTypeText = (type) => {
    switch (type) {
      case "featured":
        return "ফিচার্ড";
      case "premium":
        return "প্রিমিয়াম";
      case "sponsored":
        return "স্পনসরড";
      default:
        return "বিজ্ঞাপন";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (adLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">বিজ্ঞাপনের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">বিজ্ঞাপন পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-4">এই বিজ্ঞাপনটি মুছে ফেলা হয়েছে অথবা বিদ্যমান নেই</p>
          <button
            onClick={() => navigate('/ads')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            সব বিজ্ঞাপন দেখুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/ads')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              সব বিজ্ঞাপনে ফিরে যান
            </button>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
                <FaBookmark />
              </button>
              <button className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
                <FaShare />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ad Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Image Section */}
              {ad.image && (
                <div className="relative h-64 lg:h-80 overflow-hidden">
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    <div className={`${getAdTypeColor(ad.type)} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center`}>
                      <FaAd className="mr-1" />
                      {getAdTypeText(ad.type)}
                    </div>
                    <div className={`${getStatusColor(ad.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                      {ad.status === 'active' ? 'সক্রিয়' : ad.status === 'inactive' ? 'নিষ্ক্রিয়' : 'মেয়াদোত্তীর্ণ'}
                    </div>
                  </div>
                  {ad.discount && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                      {ad.discount}% ছাড়
                    </div>
                  )}
                </div>
              )}

              {/* Content Section */}
              <div className="p-6">
                {/* Category */}
                {ad.category && (
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {ad.category}
                  </span>
                )}

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{ad.title}</h1>

                {/* Description */}
                {ad.description && (
                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed">{ad.description}</p>
                  </div>
                )}

                {/* Price Section */}
                {ad.price && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-green-600">
                          ৳{ad.price.toLocaleString()}
                        </span>
                        {ad.originalPrice && ad.originalPrice > ad.price && (
                          <span className="text-gray-400 line-through ml-3 text-xl">
                            ৳{ad.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {ad.discount && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">{ad.discount}%</div>
                          <div className="text-sm text-gray-600">ছাড়</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {ad.link ? (
                    <a
                      href={ad.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      ওয়েবসাইটে যান
                    </a>
                  ) : null}
                  
                  {ad.phone && (
                    <a
                      href={`tel:${ad.phone}`}
                      className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      <FaPhone className="mr-2" />
                      কল করুন
                    </a>
                  )}
                </div>

                {/* Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  {ad.company && (
                    <div className="flex items-center">
                      <FaBuilding className="mr-3 text-gray-400" />
                      <span>{ad.company}</span>
                    </div>
                  )}
                  {ad.location && (
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-3 text-gray-400" />
                      <span>{ad.location}</span>
                    </div>
                  )}
                  {ad.phone && (
                    <div className="flex items-center">
                      <FaPhone className="mr-3 text-gray-400" />
                      <span>{ad.phone}</span>
                    </div>
                  )}
                  {ad.link && (
                    <div className="flex items-center">
                      <FaGlobe className="mr-3 text-gray-400" />
                      <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        ওয়েবসাইট দেখুন
                      </a>
                    </div>
                  )}
                  {ad.validUntil && (
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-3 text-gray-400" />
                      <span>মেয়াদ শেষ: {formatDate(ad.validUntil)}</span>
                    </div>
                  )}
                  {ad.createdAt && (
                    <div className="flex items-center">
                      <FaClock className="mr-3 text-gray-400" />
                      <span>প্রকাশ: {formatDate(ad.createdAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Ads */}
            {relatedAds.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">সম্পর্কিত বিজ্ঞাপন</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedAds.map((relatedAd) => (
                    <Link
                      key={relatedAd._id}
                      to={`/ads/${relatedAd._id}`}
                      className="group block"
                    >
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        {relatedAd.image && (
                          <img
                            src={relatedAd.image}
                            alt={relatedAd.title}
                            className="w-full h-24 object-cover rounded-lg mb-3"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                        )}
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedAd.title}
                        </h4>
                        {relatedAd.price && (
                          <p className="text-green-600 font-semibold mt-2">
                            ৳{relatedAd.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">যোগাযোগের তথ্য</h3>
              <div className="space-y-3">
                {ad.company && (
                  <div className="flex items-center text-sm">
                    <FaBuilding className="mr-3 text-gray-400" />
                    <span className="font-medium">{ad.company}</span>
                  </div>
                )}
                {ad.location && (
                  <div className="flex items-center text-sm">
                    <FaMapMarkerAlt className="mr-3 text-gray-400" />
                    <span>{ad.location}</span>
                  </div>
                )}
                {ad.phone && (
                  <div className="flex items-center text-sm">
                    <FaPhone className="mr-3 text-gray-400" />
                    <span className="font-medium">{ad.phone}</span>
                  </div>
                )}
                {ad.link && (
                  <div className="flex items-center text-sm">
                    <FaGlobe className="mr-3 text-gray-400" />
                    <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      ওয়েবসাইট
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">শেয়ার করুন</h3>
              <div className="flex space-x-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  <FaFacebook />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(ad.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-400 text-white py-2 px-3 rounded-lg hover:bg-blue-500 transition-colors text-center"
                >
                  <FaTwitter />
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${ad.title} - ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-center"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsDetails; 