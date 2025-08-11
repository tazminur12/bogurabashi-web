import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // আপনার প্রকল্প অনুসারে path ঠিক করবেন
import Swal from "sweetalert2";

const Ambulance = () => {
  const axiosSecure = useAxiosSecure();
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // ব্যাকএন্ড থেকে ডাটা লোড করার ফাংশন
  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get("/ambulances");
      setAmbulances(response.data);
      setError(null);
    } catch (err) {
      setError("ডাটা লোডিংয়ে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  // ফিল্টার করা অ্যাম্বুলেন্স
  const filteredAmbulances = ambulances.filter((ambulance) => {
    const matchesSearch =
      ambulance.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea ? ambulance.area === selectedArea : true;
    const matchesType = selectedType ? ambulance.type === selectedType : true;

    return matchesSearch && matchesArea && matchesType;
  });

  // ইউনিক এলাকা ও ধরণ
  const areas = [...new Set(ambulances.map((a) => a.area))];
  const types = [...new Set(ambulances.map((a) => a.type))];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Emergency Banner */}
        <div className="bg-red-600 text-white p-4 rounded-lg mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg
              className="w-8 h-8 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h2 className="text-xl font-bold">জরুরী এম্বুলেন্স কল করুন</h2>
              <p className="text-sm">২৪/৭ সার্ভিস, দ্রুত সাড়া</p>
            </div>
          </div>
          <a
            href="tel:999"
            className="bg-white text-red-600 font-bold py-3 px-6 rounded-lg flex items-center hover:bg-gray-100 transition duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-lg">৯৯৯</span>
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            বগুড়ার এম্বুলেন্স সার্ভিস
          </h1>
          <p className="text-gray-600">জরুরী প্রয়োজনে নিকটবর্তী এম্বুলেন্স খুঁজুন</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                সার্ভিস খুঁজুন
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="সার্ভিস নাম বা এলাকা লিখুন"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label
                htmlFor="area"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                এলাকা
              </label>
              <select
                id="area"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">সব এলাকা</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ধরণ
              </label>
              <select
                id="type"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">সব ধরণ</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-500">লোড হচ্ছে...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredAmbulances.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              কোন এম্বুলেন্স সার্ভিস পাওয়া যায়নি
            </h3>
            <p className="mt-1 text-gray-500">আপনার খুঁজে পাওয়া শর্তের সাথে মিলছে না</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAmbulances.map((ambulance) => (
              <div
                key={ambulance._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      className="h-56 w-full object-cover md:h-full"
                      src={ambulance.image || "/images/ambulance-default.jpg"}
                      alt={ambulance.serviceName}
                    />
                  </div>

                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {ambulance.serviceName}
                        </h2>
                        <div className="mt-2 flex items-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              ambulance.availability
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {ambulance.availability ? "সার্ভিস প্রস্তুত" : "অপ্রস্তুত"}
                          </span>
                          <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {ambulance.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">এলাকা</p>
                        <p className="font-medium">{ambulance.area}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">
                        সুবিধা সমূহ:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ambulance.features?.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">
                          নিয়মিত যোগাযোগ:
                        </h4>
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-gray-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="font-medium">{ambulance.contact}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-1">
                          জরুরী নম্বর:
                        </h4>
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-red-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-medium">{ambulance.emergencyNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <a
                        href={`tel:${
                          ambulance.emergencyNumber
                            ? ambulance.emergencyNumber.replace(/-/g, "")
                            : ""
                        }`}
                        className={`w-full block text-center px-6 py-3 ${
                          ambulance.availability
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-gray-400 cursor-not-allowed"
                        } text-white font-medium rounded-lg transition duration-300`}
                      >
                        {ambulance.availability ? "এখনই কল করুন" : "সার্ভিস অপ্রস্তুত"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Emergency Info */}
        <div className="mt-12 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            জরুরী স্বাস্থ্য সেবা
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-blue-700 mb-2">জাতীয় জরুরী নম্বর</h4>
              <p className="text-2xl font-bold text-red-600">৯৯৯</p>
              <p className="text-sm text-gray-600 mt-1">সকল জরুরী সেবার জন্য</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-blue-700 mb-2">হেল্পলাইন</h4>
              <p className="text-2xl font-bold text-blue-600">১৬২৬৩</p>
              <p className="text-sm text-gray-600 mt-1">স্বাস্থ্য বাতায়ন</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-blue-700 mb-2">কোভিড হেল্পলাইন</h4>
              <p className="text-2xl font-bold text-green-600">৩৩৩</p>
              <p className="text-sm text-gray-600 mt-1">বিশেষ সেবা</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ambulance;
