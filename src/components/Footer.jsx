import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const footerVariants = {
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
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Info */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span>বগুড়াবাসী</span>
          </h2>
          <p className="mb-4">বগুড়াবাসীর জন্য প্রয়োজনীয় সকল তথ্য ও সেবা একত্রিত করার ডিজিটাল প্ল্যাটফর্ম।</p>
          
          <div className="flex space-x-4 mt-4">
            <motion.a 
              href="#" 
              whileHover={{ y: -3 }}
              className="bg-gray-700 hover:bg-blue-600 text-white p-2 rounded-full transition"
            >
              <FaFacebook size={18} />
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ y: -3 }}
              className="bg-gray-700 hover:bg-blue-400 text-white p-2 rounded-full transition"
            >
              <FaTwitter size={18} />
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ y: -3 }}
              className="bg-gray-700 hover:bg-pink-600 text-white p-2 rounded-full transition"
            >
              <FaInstagram size={18} />
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ y: -3 }}
              className="bg-gray-700 hover:bg-red-600 text-white p-2 rounded-full transition"
            >
              <FaYoutube size={18} />
            </motion.a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-700">প্রয়োজনীয় লিংক</h3>
          <ul className="space-y-3">
            {[
              { name: 'আমাদের সম্পর্কে', link: '/about' },
              { name: 'সংবাদ', link: '/news' },
              { name: 'নোটিশ', link: '/notice' },
              { name: 'যোগাযোগ', link: '/contact' },
              { name: 'গোপনীয়তা নীতি', link: '/privacy' }
            ].map((item, index) => (
              <li key={index}>
                <motion.a 
                  href={item.link} 
                  whileHover={{ x: 5 }}
                  className="flex items-center hover:text-white transition"
                >
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2"></span>
                  {item.name}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Services */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-700">সেবাসমূহ</h3>
          <ul className="space-y-3">
            {[
              { name: 'রক্তদাতা', link: '/services/blood-donor' },
              { name: 'ডাক্তার', link: '/services/doctors' },
              { name: 'অ্যাম্বুলেন্স', link: '/services/ambulance' },
              { name: 'শিক্ষা প্রতিষ্ঠান', link: '/services/education' },
              { name: 'জরুরী সেবা', link: '/services/emergency' }
            ].map((item, index) => (
              <li key={index}>
                <motion.a 
                  href={item.link} 
                  whileHover={{ x: 5 }}
                  className="flex items-center hover:text-white transition"
                >
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-2"></span>
                  {item.name}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-gray-700">যোগাযোগ</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <FaMapMarkerAlt className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
              <span>বগুড়া সদর, বাংলাদেশ</span>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="text-blue-400 mr-3 flex-shrink-0" />
              <a href="mailto:info@bogurabashi.com" className="hover:text-white transition">info@bogurabashi.com</a>
            </li>
            <li className="flex items-center">
              <FaPhoneAlt className="text-blue-400 mr-3 flex-shrink-0" />
              <a href="tel:+880123456789" className="hover:text-white transition">+880-123-456789</a>
            </li>
          </ul>

          <div className="mt-6">
            <h4 className="text-white mb-2">নিউজলেটার সাবস্ক্রাইব করুন</h4>
            <div className="flex">
              <input 
                type="email" 
                placeholder="আপনার ইমেইল" 
                className="px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition"
              >
                সাবমিট
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Copyright with Developer Credit */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gray-900 text-center py-4 text-sm text-gray-400 border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div>
            © {new Date().getFullYear()} বগুড়াবাসী. সর্বস্বত্ব সংরক্ষিত। 
            <span className="mx-2">|</span>
            <NavLink 
              to="/developer" 
              className="hover:text-white transition"
            >
              Developed by Tazminur Rahman Tanim
            </NavLink>
          </div>
          <div className="mt-2 md:mt-0">
            <a href="/terms" className="hover:text-white transition mx-2">ব্যবহারের শর্তাবলী</a>
            <a href="/privacy" className="hover:text-white transition mx-2">গোপনীয়তা নীতি</a>
            <a href="/sitemap" className="hover:text-white transition mx-2">সাইটম্যাপ</a>
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;