import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaSortUp, 
  FaSortDown,
  FaCalendarAlt,
  FaTimes,
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";

const NewsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  // ✅ react-query v5 syntax
  const {
    data: news = [],
    isLoading,
  } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await axiosSecure.get("/news");
      return res.data;
    },
    refetchInterval: 5000, // Auto refresh every 5 seconds
  });

  // Get unique categories and statuses for filter options
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(news.map(item => item.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [news]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(news.map(item => item.status).filter(Boolean))];
    return uniqueStatuses.sort();
  }, [news]);

  // Filter and search news
  const filteredNews = useMemo(() => {
    return news.filter(item => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === "" || item.category === selectedCategory;

      // Status filter
      const matchesStatus = selectedStatus === "" || item.status === selectedStatus;

      // Date range filter
      let matchesDateRange = true;
      if (dateRange.start || dateRange.end) {
        const itemDate = new Date(item.createdAt || item.updatedAt);
        if (dateRange.start) {
          const startDate = new Date(dateRange.start);
          matchesDateRange = matchesDateRange && itemDate >= startDate;
        }
        if (dateRange.end) {
          const endDate = new Date(dateRange.end);
          endDate.setHours(23, 59, 59, 999); // End of day
          matchesDateRange = matchesDateRange && itemDate <= endDate;
        }
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesDateRange;
    });
  }, [news, searchTerm, selectedCategory, selectedStatus, dateRange]);

  // Sort filtered news
  const sortedNews = useMemo(() => {
    return [...filteredNews].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date sorting
      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(a[sortField] || a._id?.toString().substring(0, 8) * 1000);
        bValue = new Date(b[sortField] || b._id?.toString().substring(0, 8) * 1000);
      }

      // Handle string sorting
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredNews, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === "asc" ? <FaSortUp className="text-blue-600" /> : <FaSortDown className="text-blue-600" />;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    setDateRange({ start: "", end: "" });
    setSortField("createdAt");
    setSortDirection("desc");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এটি মুছে ফেলা হলে আর ফিরিয়ে আনা যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "না, বাতিল করুন",
    });
    if (confirm.isConfirmed) {
      await axiosSecure.delete(`/news/${id}`);
      Swal.fire("মুছে ফেলা হয়েছে!", "নিউজ মুছে ফেলা হয়েছে!", "success");
      // Invalidate and refetch news data
      queryClient.invalidateQueries({ queryKey: ["news"] });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-[#333]">📰 সব নিউজ</h1>
          <Link
            to="/dashboard/add-news"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
          >
            ➕ নতুন নিউজ
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2" />
                অনুসন্ধান
              </label>
              <input
                type="text"
                placeholder="শিরোনাম, বিষয়বস্তু, বা ট্যাগ খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline mr-2" />
                বিভাগ
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">সব বিভাগ</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline mr-2" />
                অবস্থা
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">সব অবস্থা</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                তারিখের পরিসর
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="শুরুর তারিখ"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="শেষের তারিখ"
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                মোট ফলাফল: <span className="font-semibold">{filteredNews.length}</span> / {news.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <FaTimes className="inline mr-2" />
                ফিল্টার রিসেট করুন
              </button>
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600 text-sm">লোড হচ্ছে...</span>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">📰</div>
              <h3 className="text-base font-medium text-gray-800 mb-1">
                {searchTerm || selectedCategory || selectedStatus || dateRange.start || dateRange.end 
                  ? "ফিল্টারের সাথে মিলে এমন কোনো নিউজ নেই" 
                  : "কোনো নিউজ নেই"
                }
              </h3>
              <p className="text-gray-500 text-sm mb-3">
                {searchTerm || selectedCategory || selectedStatus || dateRange.start || dateRange.end 
                  ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো নিউজ পাওয়া যায়নি" 
                  : "প্রথম নিউজ যোগ করুন!"
                }
              </p>
              {!searchTerm && !selectedCategory && !selectedStatus && !dateRange.start && !dateRange.end && (
                <Link
                  to="/dashboard/add-news"
                  className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition"
                >
                  ➕ প্রথম নিউজ যোগ করুন
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header with Sort */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
                <div className="col-span-1">#</div>
                <div 
                  className="col-span-3 cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center space-x-1"
                  onClick={() => handleSort("title")}
                >
                  <span>শিরোনাম</span>
                  {getSortIcon("title")}
                </div>
                <div className="col-span-2">বিভাগ</div>
                <div className="col-span-2">ট্যাগ</div>
                <div 
                  className="col-span-2 cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center space-x-1"
                  onClick={() => handleSort("createdAt")}
                >
                  <span>তারিখ</span>
                  {getSortIcon("createdAt")}
                </div>
                <div className="col-span-2">ক্রিয়া</div>
              </div>

              {sortedNews.map((item, index) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-md p-4 flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center hover:shadow transition"
                >
                  {/* Mobile view */}
                  <div className="md:hidden flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-base font-medium text-gray-800">{item.title}</span>
                  </div>

                  {/* Desktop view */}
                  <div className="hidden md:block col-span-1">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>

                  <div className="md:col-span-3">
                    <div className="text-base font-medium text-gray-800 mb-1">{item.title}</div>
                    <div className="text-gray-600 text-xs line-clamp-2">{item.content}</div>
                  </div>

                  <div className="md:col-span-2">
                    {item.category && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{item.category}</span>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {item.tags && item.tags.length > 0 && item.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">#{tag}</span>
                      ))}
                      {item.tags && item.tags.length > 2 && (
                        <span className="text-gray-500 text-xs">+{item.tags.length - 2} আরও</span>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex flex-col md:flex-row gap-2 md:items-center mt-2 md:mt-0">
                      <Link
                        to={`/dashboard/edit-news/${item._id}`}
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded text-xs font-medium transition flex items-center justify-center"
                      >
                        <FaEdit className="mr-1" />
                        এডিট
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition flex items-center justify-center"
                      >
                        <FaTrash className="mr-1" />
                        মুছুন
                      </button>
                    </div>
                  </div>

                  {/* Image preview for mobile */}
                  {item.imageUrl && (
                    <div className="md:hidden mt-2">
                      <img src={item.imageUrl} alt="news" className="w-28 h-20 object-cover rounded border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-gray-500 text-xs text-center">
          © 2025 আপনার নিউজ সাইট | Developed by YourName
        </div>
      </div>
    </div>
  );
};

export default NewsAdmin;
