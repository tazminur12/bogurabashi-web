import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import Swal from "sweetalert2";

const BlogsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // ব্লগ ডেটা আনা
  const fetchBlogs = async () => {
    try {
      const res = await axiosSecure.get("/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error("ব্লগ ডেটা আনতে সমস্যা হয়েছে:", err);
      Swal.fire("❌ ত্রুটি", "ব্লগ ডেটা লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // মুছে ফেলা
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "একবার মুছে ফেললে ফিরিয়ে আনা যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "না",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/blogs/${id}`);
        setBlogs(blogs.filter((blog) => blog._id !== id));
        Swal.fire("✅ মুছে ফেলা হয়েছে!", "ব্লগটি সফলভাবে মুছে ফেলা হয়েছে", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("❌ ত্রুটি", "ব্লগ মুছে ফেলতে সমস্যা হয়েছে", "error");
      }
    }
  };

  // ফিল্টার
  const filteredBlogs = blogs.filter((blog) => {
    const searchMatch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryMatch = !filterCategory || blog.category === filterCategory;
    return searchMatch && categoryMatch;
  });

  const categories = [...new Set(blogs.map((b) => b.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">ব্লগ প্রশাসন</h1>
          <p className="text-sm text-gray-600">বগুড়া জেলার ব্লগ ডেটা ম্যানেজ করুন</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/add-blog")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
        >
          <FaPlus /> নতুন ব্লগ
        </button>
      </div>

      {/* সার্চ ও ফিল্টার */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="ব্লগ অনুসন্ধান করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">সব বিভাগ</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ব্লগ লিস্ট */}
      {loading ? (
        <p className="text-center text-gray-500 py-20">লোড হচ্ছে...</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-500 py-20">কোনো ব্লগ পাওয়া যায়নি</p>
      ) : (
        <div className="grid gap-4">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{blog.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">✍️ {blog.author} | 📅 {new Date(blog.createdAt).toLocaleDateString("bn-BD")}</p>
                  <p className="mt-2 text-gray-800">{blog.content?.slice(0, 150)}...</p>
                  {blog.tags && blog.tags.map((tag, i) => (
                    <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded-full mt-2">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit-blog/${blog._id}`)}
                    className="text-blue-600 hover:text-blue-800"
                    title="সম্পাদনা করুন"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600 hover:text-red-800"
                    title="মুছুন"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogsAdmin;
