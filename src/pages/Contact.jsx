import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaPaperPlane, FaGlobe } from "react-icons/fa";
import useSecureAxios from "../hooks/useAxiosSecure"; // ✅ Secure Axios hook
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  const axiosSecure = useSecureAxios(); // ✅ Custom secure axios
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.post("/contacts", formData);
      toast.success("✅ বার্তা সফলভাবে পাঠানো হয়েছে!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("❌ বার্তা পাঠাতে ব্যর্থ হয়েছে!");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 font-bangla">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative max-w-6xl mx-auto px-4 md:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 relative inline-block">
              <span className="relative z-10">যোগাযোগ করুন</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 z-0 opacity-70"></span>
            </h2>
            <p className="text-lg text-gray-600 mt-4">আপনার প্রশ্ন, মতামত বা পরামর্শ আমাদের সাথে শেয়ার করুন</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl shadow-xl border border-white backdrop-blur-sm bg-opacity-80">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaPaperPlane className="text-blue-500" />
                বার্তা পাঠান
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">আপনার নাম</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    placeholder="নাম লিখুন"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">ইমেইল</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">বার্তা</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                    placeholder="আপনার বার্তা লিখুন..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  বার্তা পাঠান
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-white backdrop-blur-sm bg-opacity-80">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" />
                  যোগাযোগের তথ্য
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">ঠিকানা</h4>
                      <p className="text-gray-600">বগুড়া, রাজশাহী বিভাগ, বাংলাদেশ</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaPhone className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">ফোন</h4>
                      <p className="text-gray-600">+880 1234-567890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">ইমেইল</h4>
                      <p className="text-gray-600">info@bogurabashi.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaGlobe className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800">ওয়েবসাইট</h4>
                      <p className="text-gray-600">www.bogurabashi.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div variants={itemVariants} className="mt-12">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-white backdrop-blur-sm bg-opacity-80">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                আমাদের অবস্থান
              </h3>
              <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58147.5!2d89.35!3d24.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fdf6b6b6b6b6b6%3A0x39fdf6b6b6b6b6b6!2sBogura%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bogura Location Map"
                ></iframe>
              </div>
              <p className="text-center text-gray-600 mt-4">
                বগুড়া শহরের কেন্দ্রীয় অবস্থান - আপনার সহজে খুঁজে পেতে সাহায্য করবে
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* blob animation style */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <Toaster position="top-right" />
    </div>
  );
};

export default Contact;
