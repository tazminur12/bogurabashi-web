import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaMapMarkerAlt, FaPhone, FaHospital } from "react-icons/fa";

const HospitalListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Fetch hospital data from backend
  useEffect(() => {
    axiosSecure.get("/hospitals")
      .then(res => {
        setHospitals(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [axiosSecure]);

  // ✅ Filter search results
  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            বগুড়া জেলার হাসপাতাল সমূহ
          </h1>
          <p className="text-gray-600">জরুরী প্রয়োজনে নিকটবর্তী হাসপাতাল খুঁজুন</p>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            হাসপাতাল খুঁজুন
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="হাসপাতালের নাম বা এলাকা লিখুন"
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 bg-gray-200" />
                  <div className="p-6 md:w-2/3 space-y-3">
                    <div className="h-6 w-1/2 bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded" />
                    <div className="h-10 w-40 bg-gray-200 rounded mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">কোন হাসপাতাল পাওয়া যায়নি</h3>
            <p className="mt-1 text-gray-500">আপনার খোঁজে মিলেনি</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-1/3">
                    <img
                      src={hospital.image || "/images/hospital-default.jpg"}
                      alt={hospital.name}
                      className="h-48 w-full object-cover md:h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <div className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-2">
                          <FaHospital className="mr-1" /> হাসপাতাল
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 truncate">{hospital.name}</h2>
                        <div className="flex items-start text-gray-600 mt-2 text-sm">
                          <FaMapMarkerAlt className="mt-0.5 mr-2 text-blue-600" />
                          <span className="break-words">{hospital.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-500">বিশেষায়িত সেবা:</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(hospital.specialties || []).map((spec, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-sm rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {hospital.contact && (
                        <div className="flex items-center text-gray-700">
                          <FaPhone className="mr-2 text-green-600" /> {hospital.contact}
                        </div>
                      )}
                      {hospital.emergency && (
                        <div className="flex items-center text-gray-700">
                          <FaPhone className="mr-2 text-red-600" /> জরুরী: {hospital.emergency}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {hospital.contact && (
                        <a href={`tel:${hospital.contact}`} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                          <FaPhone className="mr-2" /> কল করুন
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalListPage;
