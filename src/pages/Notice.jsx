import React from 'react';
import { motion } from 'framer-motion';
import { FaBullhorn, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const notices = [
  {
    id: 1,
    title: "বিদ্যুৎ সংযোগ সাময়িক বন্ধ থাকবে",
    date: "১৮ মে, ২০২৫",
    description: "আগামী শনিবার সকাল ৮টা থেকে দুপুর ১২টা পর্যন্ত লাইন মেরামতের জন্য বিদ্যুৎ সংযোগ সাময়িকভাবে বন্ধ থাকবে।",
    category: "সরকারি বিজ্ঞপ্তি",
    urgency: "urgent"
  },
  {
    id: 2,
    title: "নতুন রক্তদাতা নিবন্ধন শুরু হয়েছে",
    date: "১৭ মে, ২০২৫",
    description: "আপনি যদি রক্তদাতা হতে আগ্রহী হন, আমাদের ওয়েবসাইটে নিবন্ধন করুন।",
    category: "স্বাস্থ্য সেবা",
    urgency: "normal"
  },
  {
    id: 3,
    title: "ডিজিটাল সেবা সপ্তাহ শুরু",
    date: "১৫ মে, ২০২৫",
    description: "ডিজিটাল সেবা সপ্তাহ উপলক্ষে ইউনিয়ন ডিজিটাল সেন্টারে বিশেষ সেবা চালু থাকবে।",
    category: "ডিজিটাল সেবা",
    urgency: "normal"
  },
  {
    id: 4,
    title: "পানি সরবরাহ বন্ধ থাকবে",
    date: "২০ মে, ২০২৫",
    description: "পাইপলাইন মেরামতের জন্য আগামীকাল সকাল ৯টা থেকে বিকাল ৪টা পর্যন্ত পানি সরবরাহ বন্ধ থাকবে।",
    category: "সরকারি বিজ্ঞপ্তি",
    urgency: "urgent"
  }
];

const Notice = () => {
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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
            <FaBullhorn size={24} />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-3">নোটিশ বোর্ড</h2>
          <p className="text-lg text-gray-600">
            বগুড়া সম্পর্কিত সকল প্রাতিষ্ঠানিক নোটিশ ও বিজ্ঞপ্তি
          </p>
        </motion.div>

        {/* Notice Board */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {notices.map(notice => (
            <motion.div
              key={notice.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${
                notice.urgency === "urgent" 
                  ? "border-red-500 hover:shadow-red-100" 
                  : "border-blue-500 hover:shadow-blue-100"
              } hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    notice.urgency === "urgent" 
                      ? "bg-red-100 text-red-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {notice.category}
                  </span>
                  {notice.urgency === "urgent" && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                      জরুরি
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2 md:mt-0">
                  <FaCalendarAlt className="mr-1" />
                  {notice.date}
                </div>
              </div>

              <h3 className={`text-xl font-semibold mb-2 ${
                notice.urgency === "urgent" ? "text-red-700" : "text-gray-800"
              }`}>
                {notice.title}
              </h3>
              <p className="text-gray-700 mb-4">{notice.description}</p>
              
              <motion.a
                href={`/notices/${notice.id}`}
                className="inline-flex items-center text-blue-600 font-medium"
                whileHover={{ x: 5 }}
              >
                বিস্তারিত দেখুন
                <FaArrowRight className="ml-2" />
              </motion.a>
            </motion.div>
          ))}
        </motion.div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            পুরোনো নোটিশ দেখুন
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Notice;