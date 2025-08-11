import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSecureAxios from "../hooks/useAxiosSecure";
import { 
  FaExternalLinkAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaIndustry, 
  FaGraduationCap, 
  FaLeaf, 
  FaLandmark, 
  FaHeart, 
  FaTrophy,
  FaStar,
  FaBuilding,
  FaRoad,
  FaHospital,
  FaSchool,
  FaMosque,
  FaTree,
  FaWater,
  FaUtensils
} from "react-icons/fa";
import { Skeleton } from "@mui/material";

const thanas = [
  { name: "বগুড়া সদর", link: "https://sadar.bogra.gov.bd/", population: "৫,৪০,০০০+" },
  { name: "শেরপুর", link: "https://sherpur.bogra.gov.bd/", population: "৩,২০,০০০+" },
  { name: "নন্দীগ্রাম", link: "https://nandigram.bogra.gov.bd/", population: "২,৮০,০০০+" },
  { name: "ধুনট", link: "https://dhunot.bogra.gov.bd/", population: "২,৬০,০০০+" },
  { name: "সোনাতলা", link: "https://sonatala.bogra.gov.bd/", population: "২,৪০,০০০+" },
  { name: "আদমদীঘি", link: "https://adamdighi.bogra.gov.bd/", population: "২,২০,০০০+" },
  { name: "দুপচাঁচিয়া", link: "https://dupchanchia.bogra.gov.bd/", population: "২,১০,০০০+" },
  { name: "কাহালু", link: "https://kahalu.bogra.gov.bd/", population: "১,৯০,০০০+" },
  { name: "গাবতলী", link: "https://gabtali.bogra.gov.bd/", population: "১,৮০,০০০+" },
  { name: "শিবগঞ্জ", link: "https://shibganj.bogra.gov.bd/", population: "১,৭০,০০০+" },
];

const OurBogura = () => {
  const axiosSecure = useSecureAxios();
  const [famousPeople, setFamousPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFamousPeople = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosSecure.get("/famous");
        setFamousPeople(res.data);
      } catch (err) {
        setError("ডাটা লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFamousPeople();
  }, [axiosSecure]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Compact Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-3">
                <FaMapMarkerAlt className="mr-1.5 text-sm" />
                উত্তরবঙ্গের প্রবেশদ্বার
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">বগুড়া জেলা</h1>
            <p className="text-base md:text-lg leading-relaxed max-w-4xl mx-auto opacity-95 mb-6">
              ঐতিহাসিক পুন্ড্রনগরী মহাস্থানগড়ের স্মৃতিধন্য, কৃষি, শিল্প, শিক্ষা ও সংস্কৃতির সমৃদ্ধ ঐতিহ্য নিয়ে গড়ে উঠা 
              বাংলাদেশের একটি গুরুত্বপূর্ণ জেলা
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                <FaLandmark className="inline mr-1.5 text-sm" />
                ঐতিহাসিক নগরী
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                <FaHeart className="inline mr-1.5 text-sm" />
                সংস্কৃতির কেন্দ্র
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                <FaIndustry className="inline mr-1.5 text-sm" />
                শিল্পোন্নত অঞ্চল
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                <FaGraduationCap className="inline mr-1.5 text-sm" />
                শিক্ষার কেন্দ্র
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Compact Quick Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
            <FaMapMarkerAlt className="text-2xl text-blue-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-gray-800 mb-1">আয়তন</h3>
            <p className="text-xl font-bold text-blue-600">২,৯৬৮ বর্গকিমি</p>
            <p className="text-xs text-gray-600 mt-1">মোট এলাকা</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
            <FaUsers className="text-2xl text-green-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-gray-800 mb-1">জনসংখ্যা</h3>
            <p className="text-xl font-bold text-green-600">৩৫+ লক্ষ</p>
            <p className="text-xs text-gray-600 mt-1">আনুমানিক</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
            <FaBuilding className="text-2xl text-purple-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-gray-800 mb-1">উপজেলা</h3>
            <p className="text-xl font-bold text-purple-600">১২টি</p>
            <p className="text-xs text-gray-600 mt-1">প্রশাসনিক ইউনিট</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
            <FaGraduationCap className="text-2xl text-orange-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-gray-800 mb-1">শিক্ষা</h3>
            <p className="text-xl font-bold text-orange-600">৮৫%+</p>
            <p className="text-xs text-gray-600 mt-1">সাক্ষরতার হার</p>
          </div>
        </div>

        {/* Compact Thana List Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">বগুড়ার থানা সমূহ</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-3"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              বগুড়া জেলার ১২টি উপজেলা নিয়ে গঠিত প্রশাসনিক কাঠামো। প্রতিটি উপজেলার রয়েছে নিজস্ব ঐতিহ্য ও বৈশিষ্ট্য।
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {thanas.map((thana, idx) => (
              <a
                key={idx}
                href={thana.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-500 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt className="text-white text-sm" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
                    {thana.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    জনসংখ্যা: {thana.population}
                  </p>
                  <span className="inline-flex items-center text-blue-500 text-xs font-medium">
                    <FaExternalLinkAlt className="mr-1.5 text-xs" /> 
                    ওয়েবসাইট দেখুন
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Compact Achievements & Highlights */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">বগুড়ার অর্জন ও বৈশিষ্ট্য</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-600 mx-auto rounded-full mb-3"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center mb-3">
                <FaTrophy className="text-2xl text-orange-600 mr-2" />
                <h3 className="text-lg font-bold text-orange-800">বাংলাদেশের আলুর রাজধানী</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                বগুড়া বাংলাদেশের সর্ববৃহৎ আলু উৎপাদনকারী জেলা। এখানে বছরে প্রায় ২০ লক্ষ টন আলু উৎপাদিত হয়।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-cyan-200">
              <div className="flex items-center mb-3">
                <FaUtensils className="text-2xl text-cyan-600 mr-2" />
                <h3 className="text-lg font-bold text-cyan-800">বগুড়ার দই</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                বগুড়ার দই সারা দেশে বিখ্যাত। এর স্বাদ ও গুণগত মানের জন্য এটি দেশ-বিদেশে সমাদৃত।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center mb-3">
                <FaGraduationCap className="text-2xl text-emerald-600 mr-2" />
                <h3 className="text-lg font-bold text-emerald-800">শিক্ষার কেন্দ্র</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                বগুড়া বিশ্ববিদ্যালয়সহ অসংখ্য শিক্ষা প্রতিষ্ঠান। এখানকার শিক্ষার মান সারা দেশে স্বীকৃত।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center mb-3">
                <FaLandmark className="text-2xl text-indigo-600 mr-2" />
                <h3 className="text-lg font-bold text-indigo-800">মহাস্থানগড়</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                প্রাচীন পুন্ড্রবর্ধন নগরীর ধ্বংসাবশেষ। প্রত্নতাত্ত্বিক নিদর্শন ও ঐতিহাসিক স্থান।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 border border-pink-200">
              <div className="flex items-center mb-3">
                <FaIndustry className="text-2xl text-pink-600 mr-2" />
                <h3 className="text-lg font-bold text-pink-800">শিল্পোন্নত অঞ্চল</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                চিনি শিল্প, বস্ত্র শিল্প, খাদ্য প্রক্রিয়াকরণ শিল্পসহ বিভিন্ন শিল্প প্রতিষ্ঠান।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center mb-3">
                <FaHeart className="text-2xl text-green-600 mr-2" />
                <h3 className="text-lg font-bold text-green-800">সংস্কৃতির কেন্দ্র</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                নাট্যচর্চা, সাহিত্য, হস্তশিল্প ও লোকসংস্কৃতির ঐতিহ্যবাহী কেন্দ্র।
              </p>
            </div>
          </div>
        </section>

        {/* Compact Infrastructure & Development */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">অবকাঠামো ও উন্নয়ন</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-600 mx-auto rounded-full mb-3"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <FaRoad className="text-2xl text-blue-600 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-800 mb-1">সড়ক যোগাযোগ</h3>
              <p className="text-xl font-bold text-blue-600">১,২০০+ কিমি</p>
              <p className="text-xs text-gray-600 mt-1">পাকা সড়ক</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <FaHospital className="text-2xl text-green-600 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-800 mb-1">স্বাস্থ্য সেবা</h3>
              <p className="text-xl font-bold text-green-600">৫০+</p>
              <p className="text-xs text-gray-600 mt-1">হাসপাতাল/ক্লিনিক</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <FaSchool className="text-2xl text-purple-600 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-800 mb-1">শিক্ষা প্রতিষ্ঠান</h3>
              <p className="text-xl font-bold text-purple-600">১,২০০+</p>
              <p className="text-xs text-gray-600 mt-1">স্কুল/কলেজ</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <FaMosque className="text-2xl text-orange-600 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-800 mb-1">ধর্মীয় স্থান</h3>
              <p className="text-xl font-bold text-orange-600">৫০০+</p>
              <p className="text-xs text-gray-600 mt-1">মসজিদ/মন্দির</p>
            </div>
          </div>
        </section>

        {/* Compact Famous Persons Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">বগুড়ার বিখ্যাত ব্যক্তিত্ব</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full mb-3"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              যেসব গুণী ব্যক্তিত্ব বগুড়াকে দেশ ও বিশ্বে পরিচিত করেছেন। তাদের অবদান বগুড়ার গর্ব।
            </p>
          </div>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  <Skeleton variant="rectangular" width="100%" height={180} animation="wave" />
                  <div className="p-4">
                    <Skeleton variant="text" width="70%" height={24} animation="wave" />
                    <Skeleton variant="text" width="100%" height={48} animation="wave" className="mt-2" />
                    <div className="flex mt-3 space-x-2">
                      <Skeleton variant="rectangular" width={60} height={20} animation="wave" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-medium text-red-800">ডাটা লোড করতে সমস্যা</h3>
                    <div className="mt-1 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-3">
                      <button 
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none transition-colors"
                      >
                        আবার চেষ্টা করুন
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && famousPeople.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg max-w-3xl mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="mt-3 text-lg font-medium text-gray-900">কোনো তথ্য পাওয়া যায়নি</h3>
              <p className="mt-1 text-gray-600 max-w-md mx-auto text-sm">
                বর্তমানে আমাদের ডাটাবেসে বিখ্যাত ব্যক্তিদের তালিকা খালি রয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
              </p>
              <div className="mt-4">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
                >
                  রিপোর্ট করুন
                  <svg className="ml-1.5 -mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && famousPeople.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {famousPeople.slice(0, 8).map((person) => (
                  <div 
                    key={person._id || person.name}
                    className="group bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/placeholder-person.jpg';
                          e.target.className = 'w-full h-full object-cover bg-gray-100';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                          {person.profession || 'বিখ্যাত ব্যক্তিত্ব'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                        {person.name}
                      </h3>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <svg className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        জন্ম: {person.born || 'অজানা'}
                      </div>
                      
                      <p className="text-gray-600 text-xs mb-3 line-clamp-3 flex-grow">
                        {person.description}
                      </p>
                      
                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <Link
                            to={`/famous/${person._id}`}
                            className="inline-flex items-center text-blue-600 font-medium text-xs group-hover:underline"
                          >
                            বিস্তারিত জানুন
                            <svg className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                          </Link>
                          
                          {person.website && (
                            <a 
                              href={person.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-blue-500 transition-colors"
                              title="Wikipedia লিংক"
                            >
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.627 0-12 4.975-12 11.111 0 2.81 1.032 5.411 2.787 7.424.155.188.312.375.466.563.049.06.099.122.146.184.226.278.449.555.663.848l.015.022c1.411 1.998 2.518 4.15 2.92 5.036.399.881.987 1.673 1.809 2.241 1.101.758 2.555 1.157 4.194 1.157s3.093-.399 4.194-1.157c.822-.568 1.41-1.36 1.809-2.241.402-.886 1.509-3.038 2.92-5.036l.015-.022c.214-.293.437-.57.663-.848.047-.062.097-.124.146-.184.154-.188.311-.375.466-.563 1.755-2.013 2.787-4.614 2.787-7.424 0-6.136-5.373-11.111-12-11.111zm1.193 14.963l-3.056-3.259-5.963 6.159h13.378l-2.132-2.893-2.227 2.993zm-10.301-9.932c0-.644.527-1.167 1.176-1.167.65 0 1.177.523 1.177 1.167s-.527 1.167-1.177 1.167-1.176-.523-1.176-1.167zm5.108-1.167c-.65 0-1.177.523-1.177 1.167s.527 1.167 1.177 1.167c.649 0 1.176-.523 1.176-1.167s-.527-1.167-1.176-1.167z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Compact View All Button */}
              <div className="text-center mt-8">
                <Link 
                  to="/all-famous-person" 
                  className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-semibold text-sm"
                >
                  সব বিখ্যাত ব্যক্তিত্ব দেখুন
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Compact Natural Resources & Environment */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">প্রাকৃতিক সম্পদ ও পরিবেশ</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-600 mx-auto rounded-full mb-3"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-cyan-200">
              <div className="flex items-center mb-3">
                <FaWater className="text-2xl text-cyan-600 mr-2" />
                <h3 className="text-lg font-bold text-cyan-800">নদী ও জলাশয়</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                করতোয়া, বাঙ্গালী, নাগর, ইছামতি ও তুলসীগঙ্গা নদী। মোট ১২টি নদী ও অসংখ্য খাল-বিল।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center mb-3">
                <FaTree className="text-2xl text-emerald-600 mr-2" />
                <h3 className="text-lg font-bold text-emerald-800">কৃষি জমি</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                উর্বর কৃষি জমি। মোট জমির ৭০% কৃষি কাজে ব্যবহৃত। ধান, গম, আলু, আখ, পাট প্রধান ফসল।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center mb-3">
                <FaLeaf className="text-2xl text-orange-600 mr-2" />
                <h3 className="text-lg font-bold text-orange-800">জলবায়ু</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                উপক্রান্তীয় মৌসুমি জলবায়ু। গ্রীষ্মে ৩৫-৪০°C, শীতে ১০-১৫°C। বার্ষিক বৃষ্টিপাত ১,৫০০-২,০০০ মিমি।
              </p>
            </div>
          </div>
        </section>

        {/* Compact Call to Action Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">বগুড়া সম্পর্কে আরও জানুন</h2>
            <p className="text-base text-blue-100 mb-6 leading-relaxed">
              বগুড়া জেলা বাংলাদেশের উত্তরাঞ্চলের একটি ঐতিহাসিক ও গুরুত্বপূর্ণ জেলা। 
              এখানে অবস্থিত মহাস্থানগড় প্রাচীন পুন্ড্র রাজ্যের রাজধানী ছিল। 
              বগুড়া তার মিষ্টান্ন, বিশেষত দই ও চমচমের জন্য বিখ্যাত।
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link 
                to="/history" 
                className="px-6 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors shadow-md font-semibold text-sm"
              >
                ইতিহাস জানুন
              </Link>
              <Link 
                to="/destinationData" 
                className="px-6 py-2 bg-blue-500 text-white border border-blue-400 rounded-md hover:bg-blue-600 transition-colors shadow-md font-semibold text-sm"
              >
                পর্যটন স্থান
              </Link>
              <Link 
                to="/culture" 
                className="px-6 py-2 bg-blue-500 text-white border border-blue-400 rounded-md hover:bg-blue-600 transition-colors shadow-md font-semibold text-sm"
              >
                সংস্কৃতি
              </Link>
            </div>
          </div>
        </section>

        {/* Compact Footer Quote */}
        <div className="text-center bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center mb-3">
            <FaStar className="text-2xl text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            "বগুড়া - ইতিহাস, ঐতিহ্য ও সম্ভাবনার এক অপূর্ব মেলবন্ধন"
          </h3>
          <p className="text-gray-600 text-base">
            প্রাচীন সভ্যতা থেকে আধুনিক উন্নয়ন - বগুড়ার যাত্রা অব্যাহত
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurBogura;