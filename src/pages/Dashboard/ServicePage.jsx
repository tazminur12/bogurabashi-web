// src/pages/ServicePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FaHeartbeat,
  FaHospital,
  FaUserMd,
  FaAmbulance,
  FaFireExtinguisher,
  FaShieldAlt,
  FaGavel,
  FaNewspaper,
  FaBus,
  FaTrain,
  FaPlaneDeparture,
  FaBox,
  FaBolt,
  FaWifi,
  FaGlobe,
  FaMapMarkedAlt,
  FaTint,
  FaCity,
  FaSchool,
  FaBriefcase,
  FaAward,
  FaHandsHelping,
  FaPeopleCarry,
  FaCar,
  FaUtensils,
  FaCalendarAlt,
  FaBlog,
  FaStar,
} from "react-icons/fa";

const services = [
  {
      id: 1,
      title: 'রক্তদাতা খুঁজুন',
      description: 'বগুড়া জেলার রক্তদাতা খুঁজুন মাত্র এক ক্লিকে।',
      icon: <FaHeartbeat className="text-4xl text-red-500" />,
      link: '/dashboard/adminblood',
      category: 'health',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      id: 2,
      title: 'হাসপাতালের তথ্য',
      description: 'বিভিন্ন হাসপাতাল ও ক্লিনিকের ঠিকানা ও যোগাযোগ মাধ্যম।',
      icon: <FaHospital className="text-4xl text-blue-600" />,
      link: '/dashboard/addHospital',
      category: 'health',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'ডাক্তার তালিকা',
      description: 'বিশ্বস্ত ডাক্তারদের তালিকা ও যোগাযোগ তথ্য।',
      icon: <FaUserMd className="text-4xl text-green-600" />,
      link: '/dashboard/doctorlist',
      category: 'health',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      title: 'অ্যাম্বুলেন্স সেবা',
      description: 'জরুরী অ্যাম্বুলেন্স সেবার তথ্য এবং নম্বর।',
      icon: <FaAmbulance className="text-4xl text-red-600" />,
      link: '/dashboard/adminAmbulance',
      category: 'emergency',
      gradient: 'from-red-600 to-orange-500'
    },
    {
      id: 5,
      title: 'ফায়ার সার্ভিস',
      description: 'বগুড়ার ফায়ার সার্ভিস স্টেশন ও যোগাযোগ।',
      icon: <FaFireExtinguisher className="text-4xl text-orange-500" />,
      link: '/dashboard/fire-station',
      category: 'emergency',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 6,
      title: 'পুলিশ সেবা',
      description: 'বগুড়া জেলার থানা ও পুলিশের জরুরি নম্বর।',
      icon: <FaShieldAlt className="text-4xl text-indigo-500" />,
      link: '/dashboard/police',
      category: 'emergency',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 7,
      title: 'আইনজীবী তথ্য',
      description: 'যোগ্য ও অভিজ্ঞ আইনজীবীদের তালিকা।',
      icon: <FaGavel className="text-4xl text-purple-600" />,
      link: '/dashboard/lawyerslist',
      category: 'legal',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      id: 8,
      title: 'সাংবাদিক সংযোগ',
      description: 'স্থানীয় সাংবাদিকদের সাথে যোগাযোগের তথ্য।',
      icon: <FaNewspaper className="text-4xl text-blue-500" />,
      link: '/dashboard/journalists',
      category: 'media',
      gradient: 'from-blue-500 to-sky-500'
    },
    {
      id: 9,
      title: 'বাস টিকিট সেবা',
      description: 'বাস কাউন্টার ও টিকিট সংক্রান্ত তথ্য।',
      icon: <FaBus className="text-4xl text-yellow-500" />,
      link: '/dashboard/bus-admin',
      category: 'transport',
      gradient: 'from-yellow-500 to-orange-400'
    },
    {
      id: 10,
      title: 'রেলওয়ে সেবা',
      description: 'ট্রেনের সময়সূচী ও টিকিট বুকিং তথ্য।',
      icon: <FaTrain className="text-4xl text-green-500" />,
      link: '/dashboard/rail-service',
      category: 'transport',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 11,
      title: 'ভ্রমণ গন্তব্য',
      description: 'বগুড়ার দর্শনীয় স্থানসমূহ ও ভ্রমণ গাইড।',
      icon: <FaPlaneDeparture className="text-4xl text-indigo-500" />,
      link: '/dashboard/destinations-list',
      category: 'tourism',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      id: 12,
      title: 'কুরিয়ার সার্ভিস',
      description: 'কুরিয়ার অফিস এবং ট্র্যাকিং ব্যবস্থা।',
      icon: <FaBox className="text-4xl text-teal-600" />,
      link: '/dashboard/courier-service',
      category: 'logistics',
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      id: 13,
      title: 'বিদ্যুৎ অফিস',
      description: 'পিডিবি/পল্লী বিদ্যুৎ অফিস ও সেবাসমূহ।',
      icon: <FaBolt className="text-4xl text-yellow-600" />,
      link: '/dashboard/electricity',
      category: 'utilities',
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      id: 14,
      title: 'ইন্টারনেট সার্ভিস',
      description: 'লোকাল ISP ও কনেকশন তথ্য।',
      icon: <FaWifi className="text-4xl text-sky-500" />,
      link: '/dashboard/internet-dashboard',
      category: 'utilities',
      gradient: 'from-sky-500 to-blue-500'
    },
    {
      id: 15,
      title: 'ই-সেবা কেন্দ্র',
      description: 'জাতীয় ডিজিটাল সেবা কেন্দ্র সম্পর্কিত তথ্য।',
      icon: <FaGlobe className="text-4xl text-lime-600" />,
      link: '/dashboard/eservice-admin',
      category: 'digital',
      gradient: 'from-lime-500 to-green-500'
    },
    {
      id: 16,
      title: 'ইউনিয়ন ডিজিটাল সেন্টার',
      description: 'ইউনিয়ন পর্যায়ে সেবা কেন্দ্রের তথ্য।',
      icon: <FaMapMarkedAlt className="text-4xl text-emerald-600" />,
      link: '/dashboard/union-digital',
      category: 'digital',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 17,
      title: 'গ্যাস ও পানি অফিস',
      description: 'ওয়াসা, গ্যাস অফিস ও বিল পেমেন্ট তথ্য।',
      icon: <FaTint className="text-4xl text-cyan-600" />,
      link: '/dashboard/water-admin',
      category: 'utilities',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      id: 18,
      title: 'পৌরসভা সেবা',
      description: 'বগুড়া পৌরসভার সেবাসমূহ ও হটলাইন।',
      icon: <FaCity className="text-4xl text-gray-800" />,
      link: '/dashboard/municipality-admin',
      category: 'government',
      gradient: 'from-gray-600 to-gray-700'
    },
    {
      id: 19,
      title: 'রেস্টুরেন্ট ব্যবস্থাপনা',
      description: 'বগুড়া জেলার রেস্টুরেন্টের তথ্য পরিচালনা করুন।',
      icon: <FaUtensils className="text-4xl text-orange-600" />,
      link: '/dashboard/restaurant-admin',
      category: 'food',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 20,
      title: 'শিক্ষা প্রতিষ্ঠান',
      description: 'স্কুল, কলেজ ও শিক্ষা প্রতিষ্ঠানের তালিকা।',
      icon: <FaSchool className="text-4xl text-indigo-600" />,
      link: '/dashboard/education',
      category: 'education',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 21,
      title: 'ভাড়ার গাড়ি ব্যবস্থাপনা',
      description: 'বগুড়া জেলার ভাড়ার গাড়ির তথ্য পরিচালনা করুন।',
      icon: <FaCar className="text-4xl text-blue-600" />,
      link: '/dashboard/rent-car-admin',
      category: 'transport',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 22,
      title: 'ইভেন্ট ব্যবস্থাপনা',
      description: 'বগুড়া জেলার ইভেন্টের তথ্য পরিচালনা করুন।',
      icon: <FaCalendarAlt className="text-4xl text-purple-500" />,
      link: '/dashboard/event-admin',
      category: 'events',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 23,
      title: 'ব্লগ',
      description: 'স্থানীয় বিষয় নিয়ে লেখা ব্লগ ও তথ্য।',
      icon: <FaBlog className="text-4xl text-violet-500" />,
      link: '/dashboard/blogs-admin',
      category: 'content',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      id: 24,
      title: 'অংশীদার ব্যবস্থাপনা',
      description: 'Our Partners সেকশনের ডেটা পরিচালনা করুন।',
      icon: <FaHandsHelping className="text-4xl text-blue-600" />,
      link: '/dashboard/partners-admin',
      category: 'content',
      gradient: 'from-blue-500 to-indigo-500'
    },
    
];

const ServicePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              আমাদের সেবাসমূহ
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              বগুড়া জেলার সকল গুরুত্বপূর্ণ সেবা একত্রিত করে উপস্থাপন করা হয়েছে
            </p>
            <div className="mt-8 flex justify-center">
              <div className=" bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-2">
                <span className="text-white font-medium">২৪টি সেবা</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {['সকল', 'স্বাস্থ্য', 'জরুরি', 'পরিবহন', 'শিক্ষা', 'সরকারি', 'ডিজিটাল'].map((category) => (
              <button
                key={category}
                className="px-6 py-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-indigo-600 font-medium border border-gray-200 hover:border-indigo-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              আরও সেবা যোগ করতে চান?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              আপনার সেবা আমাদের প্ল্যাটফর্মে যোগ করে আরও বেশি মানুষের কাছে পৌঁছান
            </p>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              সেবা যোগ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service }) => {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-indigo-200 transform group-hover:-translate-y-2">
        {/* Card Header with Gradient */}
        <div className={`bg-gradient-to-r ${service.gradient} p-6 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative flex justify-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
              {service.icon}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 text-center leading-tight">
            {service.title}
          </h3>
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            {service.description}
          </p>
          
          {/* Action Button */}
          <div className="text-center">
            <Link
              to={service.link}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              বিস্তারিত দেখুন
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Category Badge */}
          <div className="mt-4 text-center">
            <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
              {service.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;