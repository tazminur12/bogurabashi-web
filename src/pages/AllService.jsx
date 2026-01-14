import React from 'react';
import usePageTitle from '../hooks/usePageTitle';
import {
  FaHeartbeat, FaHospital, FaUserMd, FaAmbulance, FaFireExtinguisher,
  FaShieldAlt, FaGavel, FaNewspaper, FaBus, FaTrain, FaCar, FaBox, FaBolt,
  FaWifi, FaGlobe, FaMapMarkedAlt, FaTint, FaCity, FaCloudSun, FaSchool,
  FaPlaneDeparture, FaUtensils, FaCalendarAlt, FaBlog, FaVideo, FaExclamationTriangle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

// ✅ All services list
const allServices = [
  {
    id: 1,
    title: 'রক্তদাতা খুঁজুন',
    description: 'বগুড়া জেলার রক্তদাতা খুঁজুন মাত্র এক ক্লিকে।',
    icon: <FaHeartbeat className="text-4xl text-red-500" />,
    link: '/all-blood',
  },
  {
    id: 2,
    title: 'হাসপাতালের তথ্য',
    description: 'বিভিন্ন হাসপাতাল ও ক্লিনিকের ঠিকানা ও যোগাযোগ মাধ্যম।',
    icon: <FaHospital className="text-4xl text-blue-600" />,
    link: '/hospital-list',
  },
  {
    id: 3,
    title: 'ডাক্তার তালিকা',
    description: 'বিশ্বস্ত ডাক্তারদের তালিকা ও যোগাযোগ তথ্য।',
    icon: <FaUserMd className="text-4xl text-green-600" />,
    link: '/doctor-list',
  },
  {
    id: 4,
    title: 'অ্যাম্বুলেন্স সেবা',
    description: 'জরুরী অ্যাম্বুলেন্স সেবার তথ্য এবং নম্বর।',
    icon: <FaAmbulance className="text-4xl text-red-600" />,
    link: '/ambulance',
  },
  {
    id: 5,
    title: 'ফায়ার সার্ভিস',
    description: 'বগুড়ার ফায়ার সার্ভিস স্টেশন ও যোগাযোগ।',
    icon: <FaFireExtinguisher className="text-4xl text-orange-500" />,
    link: '/fire-service',
  },
  {
    id: 6,
    title: 'পুলিশ সেবা',
    description: 'বগুড়া জেলার থানা ও পুলিশের জরুরি নম্বর।',
    icon: <FaShieldAlt className="text-4xl text-indigo-500" />,
    link: '/police',
  },
  {
    id: 7,
    title: 'কনটেন্ট ক্রিয়েটর',
    description: 'ভিডিও, ফটো, ভয়েস ওভার ও সোশ্যাল মিডিয়া কনটেন্ট ক্রিয়েটরদের তালিকা।',
    icon: <FaVideo className="text-4xl text-purple-600" />,
    link: '/content-creators',
  },
  {
    id: 8,
    title: 'আইনজীবী তথ্য',
    description: 'যোগ্য ও অভিজ্ঞ আইনজীবীদের তালিকা।',
    icon: <FaGavel className="text-4xl text-purple-600" />,
    link: '/lawyers',
  },
  {
    id: 9,
    title: 'সাংবাদিক সংযোগ',
    description: 'স্থানীয় সাংবাদিকদের সাথে যোগাযোগের তথ্য।',
    icon: <FaNewspaper className="text-4xl text-blue-500" />,
    link: '/journalistsPage',
  },
  {
    id: 10,
    title: 'বাস টিকিট সেবা',
    description: 'বাস কাউন্টার ও টিকিট সংক্রান্ত তথ্য।',
    icon: <FaBus className="text-4xl text-yellow-500" />,
    link: '/bus-ticket',
  },
  {
    id: 11,
    title: 'রেলওয়ে সেবা',
    description: 'ট্রেনের সময়সূচী ও টিকিট বুকিং তথ্য।',
    icon: <FaTrain className="text-4xl text-green-500" />,
    link: '/rail-service',
  },
  {
    id: 12,
    title: 'ভ্রমণ গন্তব্য',
    description: 'বগুড়ার দর্শনীয় স্থানসমূহ ও ভ্রমণ গাইড।',
    icon: <FaPlaneDeparture className="text-4xl text-indigo-500" />,
    link: '/destinationData',
  },
  {
    id: 13,
    title: 'শিক্ষা প্রতিষ্ঠান',
    description: 'স্কুল, কলেজ ও শিক্ষা প্রতিষ্ঠানের তালিকা।',
    icon: <FaSchool className="text-4xl text-indigo-600" />,
    link: '/education',
  },
  {
    id: 14,
    title: 'বিদ্যুৎ অফিস',
    description: 'পিডিবি/পল্লী বিদ্যুৎ অফিস ও সেবাসমূহ।',
    icon: <FaBolt className="text-4xl text-yellow-600" />,
    link: '/electricity',
  },
  {
    id: 15,
    title: 'ইন্টারনেট সার্ভিস',
    description: 'লোকাল ISP ও কনেকশন তথ্য।',
    icon: <FaWifi className="text-4xl text-sky-500" />,
    link: '/internet',
  },
  {
    id: 16,
    title: 'ই-সেবা কেন্দ্র',
    description: 'জাতীয় ডিজিটাল সেবা কেন্দ্র সম্পর্কিত তথ্য।',
    icon: <FaGlobe className="text-4xl text-lime-600" />,
    link: '/eservice',
  },
  {
    id: 17,
    title: 'ইউনিয়ন পরিষদ',
    description: 'বগুড়া জেলার ইউনিয়ন পরিষদসমূহের তথ্য ও যোগাযোগ।',
    icon: <FaMapMarkedAlt className="text-4xl text-emerald-600" />,
    link: '/union',
  },
  {
    id: 18,
    title: 'গ্যাস ও পানি অফিস',
    description: 'ওয়াসা, গ্যাস অফিস ও বিল পেমেন্ট তথ্য।',
    icon: <FaTint className="text-4xl text-cyan-600" />,
    link: '/water-offices',
  },
  {
    id: 19,
    title: 'পৌরসভা সেবা',
    description: 'বগুড়া পৌরসভার সেবাসমূহ ও হটলাইন।',
    icon: <FaCity className="text-4xl text-gray-800" />,
    link: '/municipalities',
  },
  {
    id: 20,
    title: 'আবহাওয়া তথ্য',
    description: 'বগুড়া জেলার তাপমাত্রা ও আবহাওয়ার তথ্য।',
    icon: <FaCloudSun className="text-4xl text-yellow-400" />,
    link: '/weather',
  },
  {
    id: 21,
    title: 'কুরিয়ার সার্ভিস',
    description: 'কুরিয়ার অফিস এবং ট্র্যাকিং ব্যবস্থা।',
    icon: <FaBox className="text-4xl text-teal-600" />,
    link: '/courier',
  },
  {
    id: 22,
    title: 'ভাড়ার গাড়ি',
    description: 'বগুড়া জেলার ভাড়ার গাড়ির তালিকা ও যোগাযোগ।',
    icon: <FaCar className="text-4xl text-blue-600" />,
    link: '/rent-cars',
  },
  {
    id: 23,
    title: 'রেস্টুরেন্ট তথ্য',
    description: 'ভালো মানের খাবার ও রেস্টুরেন্ট লিস্ট।',
    icon: <FaUtensils className="text-4xl text-pink-600" />,
    link: '/restaurants',
  },
  {
    id: 24,
    title: 'ইভেন্টস',
    description: 'বগুড়া জেলার সকল ইভেন্ট, মেলা ও আয়োজন দেখুন।',
    icon: <FaCalendarAlt className="text-4xl text-purple-500" />,
    link: '/events',
  },
  {
    id: 25,
    title: 'ব্লগ',
    description: 'স্থানীয় বিষয় নিয়ে লেখা ব্লগ ও তথ্য।',
    icon: <FaBlog className="text-4xl text-violet-500" />,
    link: '/blogs',
  },
  {
    id: 26,
    title: 'দুর্নীতি ও অন্যায় রিপোর্ট',
    description: 'বগুড়া জেলার দুর্নীতি, দুর্যোগ ও অন্যায়ের বিরুদ্ধে রিপোর্ট করুন।',
    icon: <FaExclamationTriangle className="text-4xl text-red-600" />,
    link: '/disaster-reports',
  }
];

// ✅ Component
const AllService = () => {
  usePageTitle('সব সেবা একসাথে | Bogura All Services | বগুড়াবাসী');
  return (
    <div className="py-12 px-4 md:px-16 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">আমাদের সেবাসমূহ</h2>
        <p className="text-gray-600">বগুড়া জেলার সকল গুরুত্বপূর্ণ সেবা একত্রে এখানে পাওয়া যাবে</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {allServices.map((service) => (
          <div key={service.id} className="border shadow-sm hover:shadow-lg transition-all duration-200 p-5 rounded-xl bg-white">
            <div className="mb-3">{service.icon}</div>
            <h3 className="text-lg text-black font-semibold mb-1">{service.title}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
            <Link to={service.link} className="inline-block mt-3 text-blue-600 hover:underline text-sm font-medium">
              বিস্তারিত পড়ুন →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllService;
