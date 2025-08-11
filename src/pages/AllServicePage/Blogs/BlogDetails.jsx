import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaArrowLeft, FaUser, FaCalendar, FaTag, FaShare, FaPrint, FaDownload, FaPhone, FaThumbsUp } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

const BlogDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const { user } = useAuth?.() || { user: null };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosSecure.get(`/blogs/${id}`);
        setBlog(response.data);
        setLikes(response.data?.likes || 0);
        // Optional: if backend returns whether current user liked
        if (response.data?.likedByCurrentUser != null) {
          setLiked(Boolean(response.data.likedByCurrentUser));
        }
        // Load comments
        try {
          const commentsRes = await axiosSecure.get(`/blogs/${id}/comments`);
          setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
        } catch (_e) {
          setComments([]);
        }
      } catch (error) {
        console.error("Blog fetch error:", error);
        setError("ব্লগ লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, axiosSecure]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.summary || blog.content.substring(0, 100),
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("লিংক কপি হয়েছে!");
    }
  };

  const toggleLike = async () => {
    try {
      const action = liked ? "unlike" : "like";
      setLiked(!liked);
      setLikes((c) => c + (liked ? -1 : 1));
      await axiosSecure.post(`/blogs/${id}/like`, { action });
    } catch (e) {
      // revert on failure
      setLiked((v) => !v);
      setLikes((c) => c + (liked ? 1 : -1));
    }
  };

  const submitComment = async () => {
    const text = commentText.trim();
    if (!text) return;
    setPosting(true);
    try {
      const payload = {
        text,
        author: user?.name || "Guest",
      };
      const res = await axiosSecure.post(`/blogs/${id}/comments`, payload);
      const created = res?.data || payload;
      setComments((prev) => [created, ...prev]);
      setCommentText("");
    } catch (e) {
      // no-op UI error could be added
    } finally {
      setPosting(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([`
      ${blog.title}
      
      লেখক: ${blog.author}
      তারিখ: ${new Date(blog.createdAt).toLocaleDateString("bn-BD")}
      বিভাগ: ${blog.category || "নির্দিষ্ট নয়"}
      
      ${blog.content}
    `], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${blog.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">ব্লগ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">ত্রুটি</h3>
          <p className="mt-2 text-gray-600">{error || "ব্লগ পাওয়া যায়নি"}</p>
          <Link
            to="/blogs"
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaArrowLeft className="mr-2" />
            ব্লগ তালিকায় ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/blogs"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              ব্লগ তালিকায় ফিরে যান
            </Link>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="প্রিন্ট করুন"
              >
                <FaPrint className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="শেয়ার করুন"
              >
                <FaShare className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="ডাউনলোড করুন"
              >
                <FaDownload className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Blog Image */}
          {blog.image && (
            <div className="h-64 md:h-96 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="p-6 md:p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center">
                <FaUser className="mr-2" />
                {blog.author}
              </span>
              <span className="flex items-center">
                <FaCalendar className="mr-2" />
                {new Date(blog.createdAt).toLocaleDateString("bn-BD")}
              </span>
              {blog.category && (
                <span className="flex items-center">
                  <FaTag className="mr-2" />
                  {blog.category}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>

            {/* Summary */}
            {blog.summary && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-800 font-medium">{blog.summary}</p>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {blog.content}
              </div>
            </div>

            {/* Reactions */}
            <div className="mt-6">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <button
                  onClick={toggleLike}
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${liked ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`}
                >
                  <FaThumbsUp className={`mr-2 ${liked ? "text-blue-600" : "text-gray-600"}`} />
                  {liked ? "পছন্দ হয়েছে" : "লাইক"}
                </button>
                <div className="text-sm text-gray-500">{likes} জন পছন্দ করেছেন</div>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">মন্তব্য</h3>
              <div className="flex items-start gap-2 mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={2}
                  className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="আপনার মন্তব্য লিখুন..."
                  disabled={posting}
                />
                <button
                  onClick={submitComment}
                  disabled={posting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  প্রকাশ করুন
                </button>
              </div>
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm">এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্যটি করুন।</p>) : (
                  comments.map((c, idx) => (
                    <div key={c._id || idx} className="bg-white border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-800">{c.author || "User"}</div>
                        <div className="text-xs text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleString("bn-BD") : ""}</div>
                      </div>
                      <div className="mt-1 text-gray-700 whitespace-pre-wrap">{c.text}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">যোগাযোগ</h3>
                <p className="text-gray-600 mb-2">
                  এই ব্লগ সম্পর্কে আরও তথ্যের জন্য যোগাযোগ করুন:
                </p>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-gray-600">
                    <FaUser className="mr-2" />
                    লেখক: {blog.author}
                  </span>
                  <a
                    href="tel:+8801234567890"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaPhone className="mr-2" />
                    কল করুন
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/blogs"
            className="flex-1 text-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            সব ব্লগ দেখুন
          </Link>
          <Link
            to="/add-blog"
            className="flex-1 text-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            নতুন ব্লগ যোগ করুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails; 