import React from 'react';
import {
  FaHeartbeat, FaHospital, FaUserMd, FaAmbulance, FaFireExtinguisher,
  FaShieldAlt, FaGavel, FaNewspaper, FaBus, FaTrain, FaCar, FaBox, FaBolt,
  FaWifi, FaGlobe, FaMapMarkedAlt, FaTint, FaCity, FaCloudSun, FaSchool,
  FaBriefcase, FaAward, FaHandsHelping, FaPeopleCarry, FaPlaneDeparture,
  FaUtensils, FaCalendarAlt, FaBlog, FaStar
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const allServices = [
  {
    id: 1,
    title: 'রক্তদাতা খুঁজুন',
    description: 'বগুড়া জেলার রক্তদাতা খুঁজুন মাত্র এক ক্লিকে।',
    icon: <FaHeartbeat className="text-4xl text-red-500" />,
    link: '/services/blood-donor',
  },
  {
    id: 2,
    title: 'হাসপাতালের তথ্য',
    description: 'বিভিন্ন হাসপাতাল ও ক্লিনিকের ঠিকানা ও যোগাযোগ মাধ্যম।',
    icon: <FaHospital className="text-4xl text-blue-600" />,
    link: '/services/hospitals',
  },
  {
    id: 3,
    title: 'ডাক্তার তালিকা',
    description: 'বিশ্বস্ত ডাক্তারদের তালিকা ও যোগাযোগ তথ্য।',
    icon: <FaUserMd className="text-4xl text-green-600" />,
    link: '/services/doctors',
  },
  {
    id: 4,
    title: 'অ্যাম্বুলেন্স সেবা',
    description: 'জরুরী অ্যাম্বুলেন্স সেবার তথ্য এবং নম্বর।',
    icon: <FaAmbulance className="text-4xl text-red-600" />,
    link: '/services/ambulance',
  },
  {
    id: 5,
    title: 'ফায়ার সার্ভিস',
    description: 'বগুড়ার ফায়ার সার্ভিস স্টেশন ও যোগাযোগ।',
    icon: <FaFireExtinguisher className="text-4xl text-orange-500" />,
    link: '/services/fire-service',
  },
  {
    id: 6,
    title: 'পুলিশ সেবা',
    description: 'বগুড়া জেলার থানা ও পুলিশের জরুরি নম্বর।',
    icon: <FaShieldAlt className="text-4xl text-indigo-500" />,
    link: '/services/police',
  },
  {
    id: 7,
    title: 'আইনজীবী তথ্য',
    description: 'যোগ্য ও অভিজ্ঞ আইনজীবীদের তালিকা।',
    icon: <FaGavel className="text-4xl text-purple-600" />,
    link: '/services/lawyers',
  },
  {
    id: 8,
    title: 'সাংবাদিক সংযোগ',
    description: 'স্থানীয় সাংবাদিকদের সাথে যোগাযোগের তথ্য।',
    icon: <FaNewspaper className="text-4xl text-blue-500" />,
    link: '/services/journalists',
  },
  {
    id: 9,
    title: 'বাস টিকিট সেবা',
    description: 'বাস কাউন্টার ও টিকিট সংক্রান্ত তথ্য।',
    icon: <FaBus className="text-4xl text-yellow-500" />,
    link: '/services/bus-tickets',
  },
  {
    id: 10,
    title: 'রেলওয়ে সেবা',
    description: 'ট্রেনের সময়সূচী ও টিকিট বুকিং তথ্য।',
    icon: <FaTrain className="text-4xl text-green-500" />,
    link: '/services/rail-service',
  },
  {
    id: 11,
    title: 'রেন্ট-এ-কার',
    description: 'রেন্ট-এ-কার সার্ভিস ও নম্বর।',
    icon: <FaCar className="text-4xl text-gray-700" />,
    link: '/services/rent-a-car',
  },
  {
    id: 12,
    title: 'কুরিয়ার সার্ভিস',
    description: 'কুরিয়ার অফিস এবং ট্র্যাকিং ব্যবস্থা।',
    icon: <FaBox className="text-4xl text-teal-600" />,
    link: '/services/courier',
  },
  {
    id: 13,
    title: 'বিদ্যুৎ অফিস',
    description: 'পিডিবি/পল্লী বিদ্যুৎ অফিস ও সেবাসমূহ।',
    icon: <FaBolt className="text-4xl text-yellow-600" />,
    link: '/services/electricity',
  },
  {
    id: 14,
    title: 'ইন্টারনেট সার্ভিস',
    description: 'লোকাল ISP ও কনেকশন তথ্য।',
    icon: <FaWifi className="text-4xl text-sky-500" />,
    link: '/services/isp',
  },
  {
    id: 15,
    title: 'ই-সেবা কেন্দ্র',
    description: 'জাতীয় ডিজিটাল সেবা কেন্দ্র সম্পর্কিত তথ্য।',
    icon: <FaGlobe className="text-4xl text-lime-600" />,
    link: '/services/e-service',
  },
  {
    id: 16,
    title: 'ইউনিয়ন ডিজিটাল সেন্টার',
    description: 'ইউনিয়ন পর্যায়ে সেবা কেন্দ্রের তথ্য।',
    icon: <FaMapMarkedAlt className="text-4xl text-emerald-600" />,
    link: '/services/union-digital',
  },
  {
    id: 17,
    title: 'গ্যাস ও পানি অফিস',
    description: 'ওয়াসা, গ্যাস অফিস ও বিল পেমেন্ট তথ্য।',
    icon: <FaTint className="text-4xl text-cyan-600" />,
    link: '/services/gas-water-office',
  },
  {
    id: 18,
    title: 'পৌরসভা সেবা',
    description: 'বগুড়া পৌরসভার সেবাসমূহ ও হটলাইন।',
    icon: <FaCity className="text-4xl text-gray-800" />,
    link: '/services/municipality',
  },
  {
    id: 19,
    title: 'আবহাওয়া তথ্য',
    description: 'বগুড়া জেলার তাপমাত্রা ও আবহাওয়ার তথ্য।',
    icon: <FaCloudSun className="text-4xl text-yellow-400" />,
    link: '/services/weather',
  },
  {
    id: 20,
    title: 'শিক্ষা প্রতিষ্ঠান',
    description: 'স্কুল, কলেজ ও শিক্ষা প্রতিষ্ঠানের তালিকা।',
    icon: <FaSchool className="text-4xl text-indigo-600" />,
    link: '/services/education',
  },
  {
    id: 21,
    title: 'চাকরি তথ্য',
    description: 'স্থানীয় চাকরির খবর ও নিয়োগ তথ্য।',
    icon: <FaBriefcase className="text-4xl text-orange-700" />,
    link: '/services/jobs',
  },
  {
    id: 22,
    title: 'স্কলারশিপ',
    description: 'বিভিন্ন সরকারি ও বেসরকারি স্কলারশিপ তথ্য।',
    icon: <FaAward className="text-4xl text-green-700" />,
    link: '/services/scholarship',
  },
  {
    id: 23,
    title: 'ভলান্টিয়ার সহায়তা',
    description: 'স্থানীয় স্বেচ্ছাসেবক দল ও সহায়তার তথ্য।',
    icon: <FaHandsHelping className="text-4xl text-rose-500" />,
    link: '/services/volunteer-help',
  },
  {
    id: 24,
    title: 'এনজিও সংস্থা',
    description: 'বগুড়ার সক্রিয় এনজিও ও তাদের কার্যক্রম।',
    icon: <FaPeopleCarry className="text-4xl text-fuchsia-600" />,
    link: '/services/ngo',
  },
  {
    id: 25,
    title: 'ভ্রমণ গন্তব্য',
    description: 'বগুড়ার দর্শনীয় স্থানসমূহ ও ভ্রমণ গাইড।',
    icon: <FaPlaneDeparture className="text-4xl text-indigo-500" />,
    link: '/services/destinations',
  },
  {
    id: 26,
    title: 'রেস্টুরেন্ট তথ্য',
    description: 'ভালো মানের খাবার ও রেস্টুরেন্ট লিস্ট।',
    icon: <FaUtensils className="text-4xl text-pink-600" />,
    link: '/services/restaurant',
  },
  {
    id: 27,
    title: 'ইভেন্টস',
    description: 'স্থানীয় অনুষ্ঠান, মেলা ও আয়োজন।',
    icon: <FaCalendarAlt className="text-4xl text-cyan-500" />,
    link: '/services/events',
  },
  {
    id: 28,
    title: 'ব্লগ',
    description: 'স্থানীয় বিষয় নিয়ে লেখা ব্লগ ও তথ্য।',
    icon: <FaBlog className="text-4xl text-violet-500" />,
    link: '/services/blog',
  },
  {
    id: 29,
    title: 'রিভিউস',
    description: 'ব্যবসা ও সেবার উপর জনমত ও রিভিউ।',
    icon: <FaStar className="text-4xl text-yellow-500" />,
    link: '/services/reviews',
  },
];

const AllService = () => {
  return (
    <>
    <Navbar></Navbar>
    <div className="py-12 px-4 md:px-16 bg-base-100">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">আমাদের সেবাসমূহ</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {allServices.map(service => (
          <div
            key={service.id}
            className="card bg-white shadow-md hover:shadow-xl border rounded-2xl transition-all duration-300"
          >
            <div className="card-body items-start">
              {service.icon}
              <h2 className="card-title text-lg mt-3 font-semibold">{service.title}</h2>
              <p className="text-sm text-gray-600">{service.description}</p>
              <div className="card-actions mt-4">
                <Link to={service.link} className="btn btn-sm btn-outline text-blue-600">
                  বিস্তারিত পড়ুন
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AllService;
