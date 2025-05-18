import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebook, FaPaperPlane } from 'react-icons/fa';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Contact = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
    <Navbar></Navbar>
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative max-w-6xl mx-auto px-4 md:px-8 font-bangla"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 relative inline-block">
              <span className="relative z-10">যোগাযোগ করুন</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 z-0 opacity-70"></span>
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              আপনার প্রশ্ন, মতামত বা পরামর্শ আমাদের সাথে শেয়ার করুন
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-xl border border-white backdrop-blur-sm bg-opacity-80"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <FaPaperPlane className="text-blue-500" />
                বার্তা পাঠান
              </h3>
              
              <form className="space-y-5">
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">আপনার নাম</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-gray-50"
                    placeholder="নাম লিখুন"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">ইমেইল</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-gray-50"
                    placeholder="example@gmail.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">বার্তা</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-gray-50"
                    rows="5"
                    placeholder="আপনার বার্তা লিখুন..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg w-full"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px -10px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPaperPlane />
                  বার্তা পাঠান
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              variants={containerVariants}
              className="space-y-6"
            >
              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-xl border border-white backdrop-blur-sm bg-opacity-80"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 shadow-inner">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">ঠিকানা</h4>
                    <p className="text-gray-600 leading-relaxed">
                      বগুড়াবাসী, <br />
                      বগুড়া সদর, <br />
                      <span className="font-bold text-gray-700">বগুড়া জেলা</span>, <br />
                      বগুড়া বিভাগ, বাংলাদেশ
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-xl border border-white backdrop-blur-sm bg-opacity-80"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600 shadow-inner">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">ইমেইল</h4>
                    <a 
                      href="mailto:contact@bogurabashi.org" 
                      className="text-blue-600 hover:text-blue-700 hover:underline transition"
                    >
                      contact@bogurabashi.org
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-xl border border-white backdrop-blur-sm bg-opacity-80"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-full text-purple-600 shadow-inner">
                    <FaPhone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">মোবাইল</h4>
                    <a 
                      href="tel:+8801XXXXXXXXX" 
                      className="text-blue-600 hover:text-blue-700 hover:underline transition"
                    >
                      +880 1XXX-XXXXXX
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-xl border border-white backdrop-blur-sm bg-opacity-80"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600 shadow-inner">
                    <FaFacebook size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">ফেসবুক</h4>
                    <a
                      href="https://facebook.com/bogurabashi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline transition flex items-center gap-2"
                    >
                      <FaFacebook />
                      facebook.com/bogurabashi
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Add this to your global CSS */}
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
    </div>
    <Footer></Footer>
    </>
  );
};

export default Contact;