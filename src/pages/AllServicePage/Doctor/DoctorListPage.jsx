import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaHospital, FaUserMd, FaPhone, FaClock, FaMoneyBillWave, FaMapMarkerAlt, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiHospitalFill } from 'react-icons/ri';

const DoctorListPage = () => {
  const axiosSecure = useAxiosSecure();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosSecure.get('/api/doctors');
        setDoctors(res.data);
      } catch (error) {
        console.error("ডাক্তার লোডে সমস্যা:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [axiosSecure]);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.area?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
    const matchesHospital = selectedHospital ? doctor.hospital === selectedHospital : true;
    const matchesArea = selectedArea ? doctor.area === selectedArea : true;

    return matchesSearch && matchesSpecialty && matchesHospital && matchesArea;
  });

  const specialties = [...new Set(doctors.map(doc => doc.specialty).filter(Boolean))].sort();
const hospitals = [...new Set(doctors.map(doc => doc.hospital).filter(Boolean))].sort();
const areas = [...new Set(doctors.map(doc => doc.area).filter(Boolean))].sort();

  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff&size=200`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            বগুড়ার ডাক্তার তালিকা
          </h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            আপনার পছন্দের বিশেষজ্ঞ ডাক্তার খুঁজে নিন এবং স্বাস্থ্যসেবা নিশ্চিত করুন
          </p>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-lg shadow-lg mb-6 border border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="ডাক্তার, বিশেষতা বা এলাকা খুঁজুন"
              className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all duration-300 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all duration-300 text-sm cursor-pointer"
          >
            <option value="">সব বিশেষতা</option>
            {specialties.map((sp, i) => <option key={i} value={sp}>{sp}</option>)}
          </select>
          
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all duration-300 text-sm cursor-pointer"
          >
            <option value="">সব হাসপাতাল</option>
            {hospitals.map((h, i) => <option key={i} value={h}>{h}</option>)}
          </select>
          
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all duration-300 text-sm cursor-pointer"
          >
            <option value="">সব এলাকা</option>
            {areas.map((a, i) => <option key={i} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-lg mr-3 inline-block">
              <FaUserMd className="text-white text-lg" />
            </div>
            <div className="mt-2">
              <p className="text-gray-500 text-xs font-medium">মোট ডাক্তার</p>
              <p className="text-xl font-bold text-gray-800">{doctors.length} জন</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg mr-3 inline-block">
              <RiHospitalFill className="text-white text-lg" />
            </div>
            <div className="mt-2">
              <p className="text-gray-500 text-xs font-medium">হাসপাতাল</p>
              <p className="text-xl font-bold text-gray-800">{hospitals.length} টি</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg mr-3 inline-block">
              <FaGraduationCap className="text-white text-lg" />
            </div>
            <div className="mt-2">
              <p className="text-gray-500 text-xs font-medium">বিশেষতা</p>
              <p className="text-xl font-bold text-gray-800">{specialties.length} ধরনের</p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-teal-200 border-t-teal-600"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md border border-gray-100">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">কোনো ডাক্তার পাওয়া যায়নি</h3>
            <p className="text-gray-600 text-sm mb-4 max-w-sm mx-auto">
              আপনার সার্চ ক্রাইটেরিয়া মেলে এমন কোনো ডাক্তার খুঁজে পাওয়া যায়নি
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('');
                setSelectedHospital('');
                setSelectedArea('');
              }}
              className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 font-semibold text-sm shadow-md"
            >
              সব ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
                <div className="md:flex">
                  {/* Doctor Image */}
                  <div className="md:w-1/4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
                    <img
                      src={doctor.image || getAvatarUrl(doctor.name)}
                      alt={doctor.name}
                      className="w-full h-48 md:h-full object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.src = getAvatarUrl(doctor.name);
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 md:w-3/4">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{doctor.name}</h2>
                      <div className="inline-flex items-center bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                        <FaUserMd className="mr-2 text-sm" /> {doctor.specialty}
                      </div>
                      {doctor.qualification && (
                        <p className="text-sm text-gray-700 mt-1 flex items-center font-medium">
                          <FaGraduationCap className="mr-2 text-teal-600 text-sm" /> {doctor.qualification}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center p-2 bg-gray-50 rounded-md">
                          <FaHospital className="mr-2 text-teal-600 text-sm flex-shrink-0" />
                          <div>
                            <span className="text-xs text-gray-500 font-medium block">হাসপাতাল</span>
                            <span className="text-sm text-gray-800 font-semibold">{doctor.hospital || 'নাই'}</span>
                          </div>
                        </div>
                        <div className="flex items-center p-2 bg-gray-50 rounded-md">
                          <FaMapMarkerAlt className="mr-2 text-blue-600 text-sm flex-shrink-0" />
                          <div>
                            <span className="text-xs text-gray-500 font-medium block">চেম্বার</span>
                            <span className="text-sm text-gray-800 font-semibold">{doctor.chamber || 'নাই'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center p-2 bg-gray-50 rounded-md">
                          <FaPhone className="mr-2 text-green-600 text-sm flex-shrink-0" />
                          <div>
                            <span className="text-xs text-gray-500 font-medium block">ফোন</span>
                            <span className="text-sm text-gray-800 font-semibold">{doctor.contact || 'নাই'}</span>
                          </div>
                        </div>
                        {doctor.email && (
                          <div className="flex items-center p-2 bg-gray-50 rounded-md">
                            <MdEmail className="mr-2 text-purple-600 text-sm flex-shrink-0" />
                            <div>
                              <span className="text-xs text-gray-500 font-medium block">ইমেইল</span>
                              <span className="text-sm text-gray-800 font-semibold">{doctor.email}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center p-2 bg-gray-50 rounded-md">
                          <FaClock className="mr-2 text-orange-600 text-sm flex-shrink-0" />
                          <div>
                            <span className="text-xs text-gray-500 font-medium block">সময়</span>
                            <span className="text-sm text-gray-800 font-semibold">{doctor.availability || 'নাই'}</span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {doctor.bio && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-md border border-blue-100">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                          <FaBriefcase className="mr-2 text-blue-600 text-sm" /> সম্পর্কে
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{doctor.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        {!loading && filteredDoctors.length > 0 && (
          <div className="mt-8 text-center p-4 bg-white rounded-lg shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">সর্বশেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}</p>
            <p className="text-gray-500 text-xs">ডাক্তারদের তথ্য নিয়মিত আপডেট করা হয়। কোনো ভুল তথ্য পেলে আমাদের জানান</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorListPage;