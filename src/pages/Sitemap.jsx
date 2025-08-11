import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaPhone, FaNewspaper, FaExclamationTriangle, FaMapMarkerAlt, FaUserFriends, FaGraduationCap, FaHospital, FaAmbulance, FaShieldAlt, FaBus, FaTrain, FaCar, FaUtensils, FaCalendarAlt, FaBlog, FaAd, FaUsers, FaEye, FaPlus } from 'react-icons/fa';

const Sitemap = () => {
  const mainSections = [
    {
      title: "🏠 মূল পেজ",
      icon: <FaHome className="text-blue-600" />,
      pages: [
        { name: "হোম", path: "/", description: "মূল পেজ" },
        { name: "আমাদের সম্পর্কে", path: "/about", description: "ওয়েবসাইট সম্পর্কে তথ্য" },
        { name: "যোগাযোগ", path: "/contact", description: "যোগাযোগের তথ্য" },
        { name: "সংবাদ", path: "/news", description: "সর্বশেষ সংবাদ" },
        { name: "নোটিশ", path: "/notice", description: "গুরুত্বপূর্ণ নোটিশ" }
      ]
    },
    {
      title: "🏛️ বগুড়া পরিচিতি",
      icon: <FaInfoCircle className="text-green-600" />,
      pages: [
        { name: "বগুড়া পরিচিতি", path: "/bogura-intro", description: "বগুড়ার ইতিহাস ও সংস্কৃতি" },
        { name: "সব বিখ্যাত ব্যক্তি", path: "/all-famous-person", description: "বগুড়ার বিখ্যাত ব্যক্তিদের তালিকা" },
        { name: "ইতিহাস", path: "/history", description: "বগুড়ার ঐতিহাসিক তথ্য" },
        { name: "সংস্কৃতি", path: "/culture", description: "বগুড়ার সাংস্কৃতিক ঐতিহ্য" }
      ]
    },
    {
      title: "🩸 স্বাস্থ্য সেবা",
      icon: <FaHospital className="text-red-600" />,
      pages: [
        { name: "রক্তদাতা", path: "/all-blood", description: "রক্তদাতাদের তালিকা" },
        { name: "ডাক্তার", path: "/doctor", description: "ডাক্তারদের তালিকা" },
        { name: "অ্যাম্বুলেন্স", path: "/ambulance", description: "অ্যাম্বুলেন্স সেবা" },
        { name: "হাসপাতাল", path: "/hospital-list", description: "হাসপাতালের তালিকা" }
      ]
    },
    {
      title: "🚨 জরুরী সেবা",
      icon: <FaShieldAlt className="text-orange-600" />,
      pages: [
        { name: "পুলিশ সেবা", path: "/police", description: "পুলিশ স্টেশন ও সেবা" },
        { name: "ফায়ার সার্ভিস", path: "/fire-service", description: "ফায়ার স্টেশন" },
        { name: "দুর্যোগ রিপোর্ট", path: "/disaster-reports", description: "দুর্যোগ ও অন্যায় রিপোর্ট" }
      ]
    },
    {
      title: "🚌 পরিবহন সেবা",
      icon: <FaBus className="text-blue-600" />,
      pages: [
        { name: "বাস টিকিট", path: "/bus-ticket", description: "বাস টিকিট বুকিং" },
        { name: "রেল সেবা", path: "/rail-service", description: "রেলওয়ে স্টেশন" },
        { name: "ভাড়া গাড়ি", path: "/rent-cars", description: "ভাড়া গাড়ির সেবা" }
      ]
    },
    {
      title: "🏫 শিক্ষা প্রতিষ্ঠান",
      icon: <FaGraduationCap className="text-purple-600" />,
      pages: [
        { name: "শিক্ষা প্রতিষ্ঠান", path: "/education", description: "স্কুল, কলেজ, বিশ্ববিদ্যালয়" }
      ]
    },
    {
      title: "🏢 অন্যান্য সেবা",
      icon: <FaUsers className="text-indigo-600" />,
      pages: [
        { name: "আইনজীবী", path: "/lawyers", description: "আইনজীবীদের তালিকা" },
        { name: "সাংবাদিক", path: "/journalistsPage", description: "সাংবাদিকদের তালিকা" },
        { name: "ইউনিয়ন", path: "/union", description: "ইউনিয়ন পরিষদ" },
        { name: "পৌরসভা", path: "/municipalities", description: "পৌরসভা" },
        { name: "রেস্টুরেন্ট", path: "/restaurants", description: "রেস্টুরেন্ট" },
        { name: "ইভেন্ট", path: "/events", description: "সামাজিক ইভেন্ট" },
        { name: "ব্লগ", path: "/blogs", description: "ব্লগ পোস্ট" },
        { name: "বিজ্ঞাপন", path: "/ads", description: "বিজ্ঞাপন" }
      ]
    },
    {
      title: "⚡ ইউটিলিটি সেবা",
      icon: <FaPlus className="text-teal-600" />,
      pages: [
        { name: "বিদ্যুৎ", path: "/electricity", description: "বিদ্যুৎ অফিস" },
        { name: "ইন্টারনেট", path: "/internet", description: "ইন্টারনেট প্রোভাইডার" },
        { name: "ই-সেবা", path: "/eservice", description: "ইলেকট্রনিক সেবা" },
        { name: "পানি", path: "/water-offices", description: "পানি অফিস" },
        { name: "কুরিয়ার", path: "/courier", description: "কুরিয়ার সেবা" },
        { name: "আবহাওয়া", path: "/weather", description: "আবহাওয়ার তথ্য" }
      ]
    },
    {
      title: "📋 গুরুত্বপূর্ণ পেজ",
      icon: <FaEye className="text-gray-600" />,
      pages: [
        { name: "গোপনীয়তা নীতি", path: "/privacy", description: "গোপনীয়তা নীতি" },
        { name: "ব্যবহারের শর্তাবলী", path: "/terms", description: "ব্যবহারের শর্তাবলী" },
        { name: "সাইটম্যাপ", path: "/sitemap", description: "সাইটের মানচিত্র" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <span className="text-2xl">🗺️</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">সাইটম্যাপ</h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">বগুড়াবাসী ওয়েবসাইটের সব পেজ ও সেবার সন্ধান করুন</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {mainSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
                <div className="flex items-center mb-3">
                  <div className="text-2xl mr-3">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {section.pages.map((page, pageIndex) => (
                    <Link
                      key={pageIndex}
                      to={page.path}
                      className="block p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 group/page"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 group-hover/page:text-blue-600 transition-colors duration-200">
                            {page.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                        </div>
                        <div className="text-blue-400 group-hover/page:text-blue-600 transition-colors duration-200">
                          →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">দ্রুত নেভিগেশন</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/" className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 group">
              <FaHome className="text-2xl text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium text-gray-700">হোম</span>
            </Link>
            <Link to="/services" className="flex flex-col items-center p-4 rounded-lg hover:bg-green-50 transition-colors duration-200 group">
              <FaUserFriends className="text-2xl text-green-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium text-gray-700">সেবাসমূহ</span>
            </Link>
            <Link to="/contact" className="flex flex-col items-center p-4 rounded-lg hover:bg-purple-50 transition-colors duration-200 group">
              <FaPhone className="text-2xl text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium text-gray-700">যোগাযোগ</span>
            </Link>
            <Link to="/about" className="flex flex-col items-center p-4 rounded-lg hover:bg-orange-50 transition-colors duration-200 group">
              <FaInfoCircle className="text-2xl text-orange-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium text-gray-700">আমাদের সম্পর্কে</span>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            এই সাইটম্যাপে বগুড়াবাসী ওয়েবসাইটের সব গুরুত্বপূর্ণ পেজ ও সেবা অন্তর্ভুক্ত করা হয়েছে। 
            কোনো পেজ খুঁজে পেতে সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
