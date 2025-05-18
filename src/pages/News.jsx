import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';

const News = () => {
  const newsItems = [
    {
      id: 1,
      title: 'বগুড়ায় নতুন ডিজিটাল সেন্টার উদ্বোধন',
      excerpt: 'বগুড়া সদরে নতুন একটি ডিজিটাল সেন্টার চালু হয়েছে যা স্থানীয় যুবকদের জন্য ডিজিটাল প্রশিক্ষণের সুযোগ সৃষ্টি করবে।',
      date: '১৫ জুন, ২০২৩',
      author: 'প্রশাসন',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: 2,
      title: 'বগুড়া সিটি কর্পোরেশনের নতুন প্রকল্প',
      excerpt: 'বগুড়া সিটি কর্পোরেশন শহরের ড্রেনেজ সিস্টেম উন্নয়নের জন্য নতুন প্রকল্প হাতে নিয়েছে।',
      date: '১০ জুন, ২০২৩',
      author: 'নগর পরিকল্পনা',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1544&q=80'
    },
    {
      id: 3,
      title: 'স্থানীয় ব্যবসায়ীদের জন্য বিশেষ ঋণ প্রকল্প',
      excerpt: 'বগুড়ার ক্ষুদ্র ব্যবসায়ীদের জন্য সরকার বিশেষ সুদহারে ঋণ প্রদানের ঘোষণা দিয়েছে।',
      date: '৫ জুন, ২০২৩',
      author: 'অর্থনীতি',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
      id: 4,
      title: 'বগুড়া বিশ্ববিদ্যালয়ে নতুন বিভাগ চালু',
      excerpt: 'বগুড়া বিশ্ববিদ্যালয়ে কৃত্রিম বুদ্ধিমত্তা বিভাগ চালু করা হয়েছে আগামী শিক্ষাবর্ষ থেকে।',
      date: '১ জুন, ২০২৩',
      author: 'শিক্ষা',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    }
  ];

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
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">বগুড়ার সংবাদ</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            বগুড়া ও এর আশেপাশের এলাকার সর্বশেষ সংবাদ ও আপডেট
          </p>
        </motion.div>

        {/* News Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {newsItems.map((news) => (
            <motion.div
              key={news.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="flex items-center mr-4">
                    <FaCalendarAlt className="mr-1" />
                    {news.date}
                  </span>
                  <span className="flex items-center">
                    <FaUser className="mr-1" />
                    {news.author}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{news.title}</h3>
                <p className="text-gray-600 mb-4">{news.excerpt}</p>
                <motion.a
                  href={`/news/${news.id}`}
                  className="inline-flex items-center text-blue-600 font-medium"
                  whileHover={{ x: 5 }}
                >
                  বিস্তারিত পড়ুন
                  <FaArrowRight className="ml-2" />
                </motion.a>
              </div>
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
            আরও সংবাদ দেখুন
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default News;