// ServiceCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaHospital, FaUserMd, FaAmbulance, FaFireExtinguisher, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

const services = [
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
    title: 'ফায়ার সার্ভিস',
    description: 'বগুড়ার ফায়ার সার্ভিস স্টেশন ও যোগাযোগ।',
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
    title: 'দুর্নীতি ও অন্যায় রিপোর্ট',
    description: 'দুর্নীতি, দুর্যোগ ও অন্যায়ের বিরুদ্ধে রিপোর্ট করুন।',
    icon: <FaExclamationTriangle className="text-4xl text-red-600" />,
    link: '/disaster-reports',
  },
];

const ServiceCard = () => {
  return (
    <div className="py-12 px-4 md:px-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">আমাদের সেবাসমূহ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div
            key={service.id}
            className="card bg-white shadow-md hover:shadow-xl border rounded-2xl transition-all duration-300"
          >
            <div className="card-body items-start">
              {service.icon}
              <h2 className="card-title text-lg mt-3 text-black font-semibold">{service.title}</h2>
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
      <div className="text-center mt-8">
        <Link to="/services" className="btn btn-outline btn-primary">
          সব সেবা দেখুন
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
