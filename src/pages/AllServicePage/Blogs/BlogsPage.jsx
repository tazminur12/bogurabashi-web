import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaCalendar, 
  FaUser, 
  FaTag, 
  FaThumbsUp, 
  FaComment, 
  FaShare, 
  FaBookmark,
  FaEllipsisH,
  FaHome,
  FaNewspaper,
  FaFire,
  FaClock,
  FaStar,
  FaBars,
  FaTimes
} from "react-icons/fa";

const BlogsPage = () => {
  const axiosSecure = useAxiosSecure();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("latest");
  const [likeBusy, setLikeBusy] = useState({});
  const [commentsOpenFor, setCommentsOpenFor] = useState(null); // blog object
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosSecure.get("/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Blogs fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [axiosSecure]);

  // Filter and sort blogs
  const filteredBlogs = blogs
    .filter((blog) => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (blog.summary && blog.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !filterCategory || blog.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "latest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "popular":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Get unique categories
  const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];

  const handleShare = async (blog) => {
    const url = `${window.location.origin}/blog/${blog._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: blog.title, text: blog.summary || blog.title, url });
      } catch {
        // ignore share cancel
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("লিংক কপি হয়েছে!");
      } catch {
        // clipboard may fail if permissions missing
      }
    }
  };

  const toggleLike = async (blog) => {
    if (likeBusy[blog._id]) return;
    setLikeBusy(prev => ({ ...prev, [blog._id]: true }));
    const currentlyLiked = Boolean(blog.likedByCurrentUser);
    const newLikes = (blog.likes || 0) + (currentlyLiked ? -1 : 1);
    // optimistic update
    setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, likes: Math.max(0, newLikes), likedByCurrentUser: !currentlyLiked } : b));
    try {
      await axiosSecure.post(`/blogs/${blog._id}/like`, { action: currentlyLiked ? 'unlike' : 'like' });
    } catch {
      // revert
      setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, likes: blog.likes || 0, likedByCurrentUser: currentlyLiked } : b));
    } finally {
      setLikeBusy(prev => ({ ...prev, [blog._id]: false }));
    }
  };

  const openComments = async (blog) => {
    setCommentsOpenFor(blog);
    setCommentsLoading(true);
    setComments([]);
    setCommentText("");
    try {
      const res = await axiosSecure.get(`/blogs/${blog._id}/comments`);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const postComment = async () => {
    const text = commentText.trim();
    if (!text || !commentsOpenFor) return;
    setPostingComment(true);
    try {
      const payload = { text };
      const res = await axiosSecure.post(`/blogs/${commentsOpenFor._id}/comments`, payload);
      const created = res?.data || { text, createdAt: new Date().toISOString() };
      setComments(prev => [created, ...prev]);
      setCommentText("");
      // optional: update list comment count if present
      setBlogs(prev => prev.map(b => b._id === commentsOpenFor._id ? { ...b, commentsCount: (b.commentsCount || 0) + 1 } : b));
    } catch {
      // ignore post error
    } finally {
      setPostingComment(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "আজ";
    if (diffDays === 2) return "গতকাল";
    if (diffDays <= 7) return `${diffDays - 1} দিন আগে`;
    return date.toLocaleDateString("bn-BD");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">ব্লগ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Facebook-style Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <FaNewspaper className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">বগুড়া ব্লগ</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-2 sm:mx-8">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ব্লগ অনুসন্ধান করুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <FaBars />
              </button>
              <Link
                to="/add-blog"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                নতুন ব্লগ
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Facebook Style */}
          <div className="w-full lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 hidden lg:block">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FaHome className="mr-2 text-blue-600" />
                মেনু
              </h3>
              <nav className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                  <FaNewspaper className="mr-3 text-blue-600" />
                  সব ব্লগ
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                  <FaFire className="mr-3 text-orange-600" />
                  জনপ্রিয়
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                  <FaClock className="mr-3 text-green-600" />
                  সাম্প্রতিক
                </button>
              </nav>
            </div>

            {/* Categories Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4 hidden lg:block">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FaFilter className="mr-2 text-blue-600" />
                বিভাগ
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFilterCategory("")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    filterCategory === "" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                  }`}
                >
                  <span>সব বিভাগ</span>
                  <span className="text-sm text-gray-500">{blogs.length}</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      filterCategory === category ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{category}</span>
                    <span className="text-sm text-gray-500">
                      {blogs.filter(blog => blog.category === category).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 order-1">
            {/* Sort Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">ব্লগ পোস্ট</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">সাজান:</span>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="latest">সর্বশেষ</option>
                    <option value="oldest">পুরাতন</option>
                    <option value="popular">জনপ্রিয়</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Blogs Feed */}
            {filteredBlogs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaNewspaper className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো ব্লগ পাওয়া যায়নি</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterCategory ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ব্লগ নেই" : "এখনও কোনো ব্লগ প্রকাশ করা হয়নি"}
                </p>
                <Link
                  to="/add-blog"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  প্রথম ব্লগ লিখুন
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBlogs.map((blog) => (
                  <div key={blog._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Blog Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{blog.author}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <FaCalendar className="mr-1" />
                              {formatDate(blog.createdAt)}
                              {blog.category && (
                                <>
                                  <span className="mx-2">•</span>
                                  <FaTag className="mr-1" />
                                  {blog.category}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                          <FaEllipsisH />
                        </button>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                        <Link to={`/blog/${blog._id}`}>
                          {blog.title}
                        </Link>
                      </h2>

                      {blog.summary && (
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {blog.summary}
                        </p>
                      )}

                      {/* Blog Image */}
                      {blog.image && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 5).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                          {blog.tags.length > 5 && (
                            <span className="text-sm text-gray-500 flex items-center">
                              +{blog.tags.length - 5} আরও
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons - Facebook Style */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center flex-wrap gap-4">
                        <button
                          onClick={() => toggleLike(blog)}
                          disabled={likeBusy[blog._id]}
                          className={`flex items-center ${blog.likedByCurrentUser ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'} transition-colors`}
                        >
                          <FaThumbsUp className="mr-2" />
                          <span className="text-sm font-medium">{blog.likes || 0} লাইক</span>
                        </button>
                        <button
                          onClick={() => openComments(blog)}
                          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <FaComment className="mr-2" />
                          <span className="text-sm font-medium">{blog.commentsCount || comments.filter(c => c.blogId === blog._id).length || 0} মন্তব্য</span>
                        </button>
                        <button
                          onClick={() => handleShare(blog)}
                          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <FaShare className="mr-2" />
                          <span className="text-sm font-medium">শেয়ার</span>
                        </button>
                      </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                            <FaBookmark />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Trending */}
          <div className="w-full lg:w-64 flex-shrink-0 order-3">
            <div className="bg-white rounded-lg shadow-sm p-4 lg:sticky lg:top-24">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FaFire className="mr-2 text-orange-600" />
                জনপ্রিয় ব্লগ
              </h3>
              <div className="space-y-3">
                {blogs
                  .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                  .slice(0, 5)
                  .map((blog, index) => (
                    <div key={blog._id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {blog.title}
                        </Link>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <FaUser className="mr-1" />
                          {blog.author}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      {commentsOpenFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">মন্তব্য: {commentsOpenFor.title}</h3>
              <button onClick={() => setCommentsOpenFor(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-start gap-2 mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={2}
                  className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="আপনার মন্তব্য লিখুন..."
                  disabled={postingComment}
                />
                <button
                  onClick={postComment}
                  disabled={postingComment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  প্রকাশ করুন
                </button>
              </div>
              {commentsLoading ? (
                <p className="text-gray-500">মন্তব্য লোড হচ্ছে...</p>
              ) : (
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <p className="text-gray-500 text-sm">এখনও কোনো মন্তব্য নেই।</p>
                  ) : (
                    comments.map((c, idx) => (
                      <div key={c._id || idx} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-gray-800">{c.author || 'User'}</div>
                          <div className="text-xs text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleString('bn-BD') : ''}</div>
                        </div>
                        <div className="mt-1 text-gray-700 whitespace-pre-wrap">{c.text}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu/Filters Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90%] bg-white shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <FaHome className="mr-2 text-blue-600" />
                মেনু
              </h3>
              <button className="p-2 rounded hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)} aria-label="Close">
                <FaTimes />
              </button>
            </div>
            <nav className="space-y-2 mb-6">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                <FaNewspaper className="mr-3 text-blue-600" />
                সব ব্লগ
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                <FaFire className="mr-3 text-orange-600" />
                জনপ্রিয়
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center">
                <FaClock className="mr-3 text-green-600" />
                সাম্প্রতিক
              </button>
            </nav>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FaFilter className="mr-2 text-blue-600" />
                বিভাগ
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => { setFilterCategory(""); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    filterCategory === "" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                  }`}
                >
                  <span>সব বিভাগ</span>
                  <span className="text-sm text-gray-500">{blogs.length}</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => { setFilterCategory(category); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      filterCategory === category ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{category}</span>
                    <span className="text-sm text-gray-500">
                      {blogs.filter(blog => blog.category === category).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsPage; 