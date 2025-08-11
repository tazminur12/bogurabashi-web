import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaCar, FaPhone, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaUser, FaPrint, FaShare, FaDownload, FaArrowLeft, FaStar, FaShieldAlt, FaGasPump, FaCog, FaUsers, FaInfoCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const RentCarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/rent-cars/${id}`);
        setCar(response.data);
      } catch (err) {
        console.error("Error fetching car details:", err);
        setError("গাড়ির তথ্য লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id, axiosSecure]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Rented":
        return "bg-yellow-100 text-yellow-800";
      case "Maintenance":
        return "bg-red-100 text-red-800";
      case "Reserved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available":
        return "🟢";
      case "Rented":
        return "🟡";
      case "Maintenance":
        return "🔴";
      case "Reserved":
        return "🔵";
      default:
        return "⚪";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Available":
        return "উপলব্ধ";
      case "Rented":
        return "ভাড়া দেওয়া";
      case "Maintenance":
        return "মেরামত";
      case "Reserved":
        return "সংরক্ষিত";
      default:
        return status || "N/A";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Sedan":
        return "🚗";
      case "SUV":
        return "🚙";
      case "Micro":
        return "🚐";
      case "Luxury":
        return "🏎️";
      case "Van":
        return "🚐";
      case "Truck":
        return "🚛";
      case "Pickup":
        return "🛻";
      case "Bus":
        return "🚌";
      default:
        return "🚗";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('bn-BD').format(price);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${car.brand} ${car.model} - ভাড়ার গাড়ি`,
          text: `${car.brand} ${car.model} ভাড়ার জন্য উপলব্ধ। দৈনিক ভাড়া: ৳${formatPrice(car.rentPerDay)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      Swal.fire("✅ কপি হয়েছে!", "লিংক ক্লিপবোর্ডে কপি করা হয়েছে", "success");
    }
  };

  const handleDownload = () => {
    const carInfo = `
বগুড়া ভাড়ার গাড়ি - বিস্তারিত তথ্য

গাড়ির তথ্য:
- ব্র্যান্ড: ${car.brand}
- মডেল: ${car.model}
- বছর: ${car.year}
- ধরন: ${car.type}
- রং: ${car.color || 'N/A'}
- ট্রান্সমিশন: ${car.transmission || 'N/A'}
- জ্বালানির ধরন: ${car.fuelType || 'N/A'}
- আসনের সংখ্যা: ${car.seats || 'N/A'}

ভাড়ার তথ্য:
- দৈনিক ভাড়া: ৳${formatPrice(car.rentPerDay)}
- সাপ্তাহিক ভাড়া: ${car.rentPerWeek ? `৳${formatPrice(car.rentPerWeek)}` : 'N/A'}
- মাসিক ভাড়া: ${car.rentPerMonth ? `৳${formatPrice(car.rentPerMonth)}` : 'N/A'}

যোগাযোগের তথ্য:
- মালিক: ${car.ownerName}
- যোগাযোগ: ${car.contact}
- অবস্থান: ${car.location}

অতিরিক্ত তথ্য:
- রেজিস্ট্রেশন: ${car.registrationNumber || 'N/A'}
- মাইলেজ: ${car.mileage ? `${car.mileage} কিমি` : 'N/A'}
- অবস্থা: ${car.condition || 'N/A'}
- বীমা: ${car.insurance || 'N/A'}

সুবিধাসমূহ: ${car.features?.join(', ') || 'N/A'}

বিবরণ: ${car.description || 'N/A'}

অতিরিক্ত তথ্য: ${car.additionalInfo || 'N/A'}

---
বগুড়া ভাড়ার গাড়ি সেবা
${new Date().toLocaleDateString('bn-BD')}
    `;

    const blob = new Blob([carInfo], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${car.brand}_${car.model}_details.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleCall = () => {
    if (car.contact) {
      window.location.href = `tel:${car.contact}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">গাড়ির তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">ত্রুটি</h3>
          <p className="text-gray-500 mb-4">{error || "গাড়ির তথ্য পাওয়া যায়নি"}</p>
          <Link
            to="/rent-cars"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
          >
            ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#333] mb-1">
                {getTypeIcon(car.type)} {car.brand} {car.model}
              </h1>
              <p className="text-sm text-gray-600">ভাড়ার গাড়ির বিস্তারিত তথ্য</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to="/add-rent-car"
              className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition duration-200"
              title="নতুন গাড়ি যোগ করুন"
            >
              <FaCar />
            </Link>
            <button
              onClick={handlePrint}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
              title="প্রিন্ট করুন"
            >
              <FaPrint />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200"
              title="শেয়ার করুন"
            >
              <FaShare />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition duration-200"
              title="ডাউনলোড করুন"
            >
              <FaDownload />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Overview */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">গাড়ির তথ্য</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(car.status)}`}>
                  {getStatusIcon(car.status)} {getStatusLabel(car.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaCar className="text-blue-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">ব্র্যান্ড & মডেল</p>
                    <p className="font-medium">{car.brand} {car.model}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="text-green-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">বছর</p>
                    <p className="font-medium">{car.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaCog className="text-purple-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">ট্রান্সমিশন</p>
                    <p className="font-medium">{car.transmission || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaGasPump className="text-orange-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">জ্বালানির ধরন</p>
                    <p className="font-medium">{car.fuelType || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaUsers className="text-indigo-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">আসনের সংখ্যা</p>
                    <p className="font-medium">{car.seats || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaShieldAlt className="text-red-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">রং</p>
                    <p className="font-medium">{car.color || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaMoneyBillWave className="text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800">ভাড়ার তথ্য</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">৳{formatPrice(car.rentPerDay)}</div>
                  <div className="text-sm text-green-700">প্রতি দিন</div>
                </div>
                
                {car.rentPerWeek && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">৳{formatPrice(car.rentPerWeek)}</div>
                    <div className="text-sm text-blue-700">প্রতি সপ্তাহ</div>
                  </div>
                )}
                
                {car.rentPerMonth && (
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">৳{formatPrice(car.rentPerMonth)}</div>
                    <div className="text-sm text-purple-700">প্রতি মাস</div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">যোগাযোগের তথ্য</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaUser className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">মালিক</p>
                    <p className="font-medium">{car.ownerName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">অবস্থান</p>
                    <p className="font-medium">{car.location}</p>
                  </div>
                </div>
              </div>
              
              {car.contact && (
                <div className="mt-4">
                  <button
                    onClick={handleCall}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FaPhone />
                    {car.contact} - কল করুন
                  </button>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaInfoCircle className="text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">অতিরিক্ত তথ্য</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">রেজিস্ট্রেশন নম্বর</label>
                  <p className="text-gray-900">{car.registrationNumber || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">মাইলেজ</label>
                  <p className="text-gray-900">{car.mileage ? `${car.mileage} কিমি` : 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">গাড়ির অবস্থা</label>
                  <p className="text-gray-900">{car.condition || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">বীমা</label>
                  <p className="text-gray-900">{car.insurance || 'N/A'}</p>
                </div>
              </div>
              
              {car.description && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">বিবরণ</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{car.description}</p>
                </div>
              )}
              
              {car.additionalInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">অতিরিক্ত তথ্য</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{car.additionalInfo}</p>
                </div>
              )}
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaShieldAlt className="text-purple-500" />
                  <h2 className="text-xl font-semibold text-gray-800">গাড়ির সুবিধাসমূহ</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <FaStar className="text-purple-500 text-sm" />
                      <span className="text-sm text-purple-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">দ্রুত অ্যাকশন</h3>
              
              <div className="space-y-3">
                {car.contact && (
                  <button
                    onClick={handleCall}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FaPhone />
                    কল করুন
                  </button>
                )}
                
                <button
                  onClick={handleShare}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
                >
                  <FaShare />
                  শেয়ার করুন
                </button>
                
                <button
                  onClick={handleDownload}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
                >
                  <FaDownload />
                  ডাউনলোড করুন
                </button>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">গাড়ির অবস্থা</h3>
              
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(car.status)}`}>
                  {getStatusIcon(car.status)} {getStatusLabel(car.status)}
                </div>
                
                <p className="text-sm text-gray-600 mt-2">
                  {car.status === "Available" && "এই গাড়িটি এখনই ভাড়া দেওয়া যাবে"}
                  {car.status === "Rented" && "এই গাড়িটি বর্তমানে ভাড়া দেওয়া আছে"}
                  {car.status === "Maintenance" && "এই গাড়িটি মেরামতের জন্য বন্ধ আছে"}
                  {car.status === "Reserved" && "এই গাড়িটি সংরক্ষিত আছে"}
                </p>
              </div>
            </div>

            {/* Back to List */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <Link
                to="/rent-cars"
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
              >
                <FaArrowLeft />
                সব গাড়ি দেখুন
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-gray-500 text-xs text-center">
          © 2025 বগুড়া ভাড়ার গাড়ি সেবা | Developed by BoguraBashi
        </div>
      </div>
    </div>
  );
};

export default RentCarDetails; 