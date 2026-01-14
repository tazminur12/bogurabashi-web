import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import usePageTitle from "../hooks/usePageTitle";
import { useParams, Link } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaShare, FaPrint } from "react-icons/fa";

const NewsDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const {
    data: newsItem,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/news/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  usePageTitle(
    newsItem?.title
      ? `${newsItem.title} | সংবাদ বিস্তারিত | বগুড়াবাসী`
      : "সংবাদ বিস্তারিত | বগুড়াবাসী – Bogurabashi"
  );

  // Fetch related news (same category)
  const {
    data: relatedNews = [],
  } = useQuery({
    queryKey: ["related-news", newsItem?.category],
    queryFn: async () => {
      if (!newsItem?.category) return [];
      const res = await axiosSecure.get(`/news?category=${newsItem.category}`);
      return res.data.filter(item => item._id !== id).slice(0, 3);
    },
    enabled: !!newsItem?.category,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-4 text-lg text-gray-600">নিউজ লোড হচ্ছে...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">নিউজ পাওয়া যায়নি</h2>
            <p className="text-gray-600 mb-4">আপনি যে নিউজ খুঁজছেন তা পাওয়া যায়নি</p>
            <Link
              to="/news"
              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition"
            >
              <FaArrowLeft className="mr-2" />
              সব নিউজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.content.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("লিংক কপি করা হয়েছে!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/news"
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition"
          >
            <FaArrowLeft className="mr-2" />
            সব নিউজে ফিরে যান
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Image */}
          {newsItem.imageUrl && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img
                src={newsItem.imageUrl}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
              {newsItem.status === "Published" && (
                <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded text-sm font-medium">
                  প্রকাশিত
                </span>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Category */}
            {newsItem.category && (
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium mb-4">
                {newsItem.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
              {newsItem.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 border-b border-gray-200 pb-4">
              {newsItem.author && (
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>{newsItem.author}</span>
                </div>
              )}
              {newsItem.publishDate && (
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>{new Date(newsItem.publishDate).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                {newsItem.content}
              </p>
            </div>

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaTag className="mr-2" />
                  ট্যাগস:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition"
              >
                <FaShare className="mr-2" />
                শেয়ার করুন
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition"
              >
                <FaPrint className="mr-2" />
                প্রিন্ট করুন
              </button>
            </div>
          </div>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">সম্পর্কিত নিউজ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedNews.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  {item.imageUrl && (
                    <div className="h-32 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      <Link
                        to={`/news/${item._id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {item.content}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <FaCalendarAlt className="mr-1" />
                      <span>{new Date(item.publishDate).toLocaleDateString('bn-BD')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 আপনার নিউজ সাইট | Developed by YourName</p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails; 