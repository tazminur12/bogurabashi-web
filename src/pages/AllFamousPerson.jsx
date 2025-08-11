import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSecureAxios from "../hooks/useAxiosSecure";
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaExternalLinkAlt,
  FaArrowLeft,
  FaStar,
  FaUsers,
  FaCalendarAlt,
  FaEye,
  FaBookmark,
  FaShare
} from "react-icons/fa";
import { Skeleton } from "@mui/material";

const AllFamousPerson = () => {
  const axiosSecure = useSecureAxios();
  const [famousPeople, setFamousPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16);

  // Get unique professions for filter
  const professions = ["all", ...new Set(famousPeople.map(person => person.profession).filter(Boolean))];

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

  // Filter and search logic
  const filteredPeople = famousPeople.filter(person => {
    const matchesSearch = person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.profession?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProfession = selectedProfession === "all" || person.profession === selectedProfession;
    
    return matchesSearch && matchesProfession;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPeople = filteredPeople.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Compact Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <Link 
              to="/ourBogura"
              className="inline-flex items-center text-blue-100 hover:text-white mb-4 transition-colors text-sm"
            >
              <FaArrowLeft className="mr-2 text-sm" />
              বগুড়া সম্পর্কে ফিরে যান
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">বগুড়ার বিখ্যাত ব্যক্তিত্ব</h1>
            <p className="text-base text-blue-100 max-w-2xl mx-auto">
              যেসব গুণী ব্যক্তিত্ব বগুড়াকে দেশ ও বিশ্বে পরিচিত করেছেন। তাদের অবদান বগুড়ার গর্ব।
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Professional Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="নাম, পেশা বা বিবরণ অনুসন্ধান করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-sm transition-colors"
              >
                {professions.map((profession) => (
                  <option key={profession} value={profession}>
                    {profession === "all" ? "সব পেশা" : profession}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <span className="flex items-center">
                <FaUsers className="mr-1 text-xs" />
                মোট: {famousPeople.length} জন
              </span>
              <span className="flex items-center">
                <FaSearch className="mr-1 text-xs" />
                পাওয়া গেছে: {filteredPeople.length} জন
              </span>
            </div>
            {searchTerm || selectedProfession !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedProfession("all");
                }}
                className="text-blue-600 hover:text-blue-800 font-medium text-xs"
              >
                ফিল্টার মুছুন
              </button>
            ) : null}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <Skeleton variant="rectangular" width="100%" height={160} animation="wave" />
                <div className="p-4">
                  <Skeleton variant="text" width="70%" height={20} animation="wave" />
                  <Skeleton variant="text" width="100%" height={40} animation="wave" className="mt-2" />
                  <div className="flex mt-3 space-x-2">
                    <Skeleton variant="rectangular" width={60} height={16} animation="wave" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
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

        {/* Empty State */}
        {!loading && !error && filteredPeople.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">কোনো ব্যক্তিত্ব পাওয়া যায়নি</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4 text-sm">
              আপনার অনুসন্ধানের সাথে মিলে যায় এমন কোন বিখ্যাত ব্যক্তিত্ব পাওয়া যায়নি। 
              অনুগ্রহ করে অন্য শব্দ দিয়ে অনুসন্ধান করুন।
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedProfession('all');
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors text-sm"
            >
              সব ব্যক্তিত্ব দেখুন
            </button>
          </div>
        )}

        {/* Professional Results Grid */}
        {!loading && !error && filteredPeople.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {currentPeople.map((person) => (
                <div 
                  key={person._id || person.name}
                  className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/placeholder-person.jpg';
                        e.target.className = 'w-full h-full object-cover bg-gray-100';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                    
                    {/* Professional Badge */}
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-sm">
                        {person.profession || 'বিখ্যাত ব্যক্তিত্ব'}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex space-x-1">
                        <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-blue-600 transition-colors">
                          <FaBookmark className="text-xs" />
                        </button>
                        <button className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-blue-600 transition-colors">
                          <FaShare className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {person.name}
                    </h3>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <FaCalendarAlt className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                      জন্ম: {person.born || 'অজানা'}
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-grow leading-relaxed">
                      {person.description}
                    </p>
                    
                    <div className="mt-auto pt-3 border-t border-gray-50">
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/famous/${person._id}`}
                          className="inline-flex items-center text-blue-600 font-medium text-xs group-hover:underline"
                        >
                          <FaEye className="mr-1 text-xs" />
                          বিস্তারিত
                        </Link>
                        
                        {person.website && (
                          <a 
                            href={person.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title="Wikipedia লিংক"
                          >
                            <FaExternalLinkAlt className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    পূর্ববর্তী
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-500 bg-white border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    পরবর্তী
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Professional Back to Our Bogura */}
        <div className="mt-10 text-center">
          <Link 
            to="/ourBogura"
            className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 text-sm font-medium"
          >
            <FaArrowLeft className="mr-2 text-sm" />
            বগুড়া সম্পর্কে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllFamousPerson; 