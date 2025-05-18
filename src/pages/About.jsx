import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaHandsHelping, FaUsers, FaHeart } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: <FaBullseye className="text-blue-600 text-3xl" />,
      title: "আমাদের লক্ষ্য",
      description: "বগুড়াবাসীর জন্য সকল প্রয়োজনীয় সেবা এক জায়গায় উপস্থাপন"
    },
    {
      icon: <FaHandsHelping className="text-green-600 text-3xl" />,
      title: "সামাজিক দায়িত্ব",
      description: "সমাজসেবামূলক কার্যক্রমে আমাদের অংশগ্রহণ"
    },
    {
      icon: <FaUsers className="text-purple-600 text-3xl" />,
      title: "সাম্প্রদায়িকতা",
      description: "সকল ধর্ম ও বর্ণের মানুষের জন্য উন্মুক্ত প্ল্যাটফর্ম"
    },
    {
      icon: <FaHeart className="text-red-600 text-3xl" />,
      title: "স্বেচ্ছাসেবক",
      description: "১০০% ফ্রি সেবা প্রদান"
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
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
            <span className="relative z-10">আমাদের সম্পর্কে</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 z-0 opacity-70"></span>
          </h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            "বগুড়াবাসী" একটি আধুনিক ও তথ্যবহুল ওয়েব প্ল্যাটফর্ম, যা বগুড়া জেলার নাগরিকদের জন্য জরুরি সেবা, স্থানীয় তথ্য এবং সমাজসেবামূলক কার্যক্রম একত্রিত করে সহজে উপস্থাপন করে।
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <motion.div variants={itemVariants}>
            <img
              src="https://i.ibb.co/XRMCt6Y/5155720-2672335.jpg"
              alt="About Us"
              className="rounded-xl shadow-xl w-full h-auto object-cover"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-800">আমাদের লক্ষ্য</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              আমরা চাই বগুড়ার প্রতিটি মানুষ ডিজিটাল তথ্যপ্রযুক্তির সুফল পেতে পারে। এই ওয়েবসাইটে রক্তদাতা, হাসপাতাল, অ্যাম্বুলেন্স, পুলিশ, ফায়ার সার্ভিস, ডাক্তার, আইনজীবী, ইন্টারনেট, বিদ্যুৎ অফিস, ট্রান্সপোর্ট, শিক্ষাপ্রতিষ্ঠানসহ আরও অনেক প্রয়োজনীয় তথ্য এক জায়গায় সহজে খুঁজে পাওয়া যাবে।
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              আমাদের এই প্ল্যাটফর্ম ১০০% ফ্রি। যে কেউ লগইন ছাড়াই তথ্য ব্রাউজ করতে পারবেন। তবে যারা ডোনেট করতে চান, তারা আইডি তৈরি করে রক্তদাতাদের তালিকায় যুক্ত হতে পারবেন।
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              আমরা চাই বগুড়াবাসী একসাথে, এক প্ল্যাটফর্মে—একটি ভালো সমাজ গড়তে।
            </p>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center bg-blue-600 rounded-xl p-8 shadow-lg"
        >
          <h4 className="text-2xl font-semibold text-white mb-4">আপনিও আমাদের সাথে যুক্ত হোন</h4>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            যদি আপনি আমাদের উদ্যোগে যুক্ত হতে চান অথবা আপনার যেকোনো মতামত আমাদের জানাতে চান, আমাদের সাথে যোগাযোগ করুন।
          </p>
          <motion.a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-100 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            যোগাযোগ করুন
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;