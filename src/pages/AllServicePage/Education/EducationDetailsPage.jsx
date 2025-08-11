import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { 
  FiArrowLeft, FiMapPin, FiPhone, FiMail, FiGlobe, FiBookOpen,
  FiCalendar, FiUsers, FiStar, FiExternalLink, FiHome, FiAward,
  FiActivity, FiHeart, FiShare2, FiClock, FiUser, FiInfo, FiRefreshCw
} from "react-icons/fi";

const EducationDetailsPage = () => {
  const { id } = useParams();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Fetch institute details
  useEffect(() => {
    const fetchInstituteDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axiosSecure.get(`/educations/${id}`);
        console.log('API Response:', res);
        
        // Handle different response structures
        let instituteData = null;
        
        if (res.data && res.data._id) {
          // Direct data structure
          instituteData = res.data;
        } else if (res.data && res.data.data && res.data.data._id) {
          // Nested data structure: { data: { ... } }
          instituteData = res.data.data;
        } else if (res.data && res.data.result && res.data.result._id) {
          // Nested data structure: { result: { ... } }
          instituteData = res.data.result;
        } else {
          throw new Error('Invalid data structure received from API');
        }
        
        console.log('Processed Institute Data:', instituteData);
        setInstitute(instituteData);
        
      } catch (error) {
        console.error('Error fetching institute details:', error);
        
        let errorMessage = 'শিক্ষা প্রতিষ্ঠানের তথ্য লোড করা যায়নি';
        
        if (error.response) {
          // Server responded with error status
          if (error.response.status === 404) {
            errorMessage = 'শিক্ষা প্রতিষ্ঠান পাওয়া যায়নি';
          } else if (error.response.status === 500) {
            errorMessage = 'সার্ভার ত্রুটি - আবার চেষ্টা করুন';
          } else {
            errorMessage = `সার্ভার ত্রুটি (${error.response.status})`;
          }
        } else if (error.request) {
          // Network error
          errorMessage = 'নেটওয়ার্ক ত্রুটি - ইন্টারনেট সংযোগ চেক করুন';
        } else {
          // Other error
          errorMessage = error.message || 'অজানা ত্রুটি';
        }
        
        setError(errorMessage);
        setInstitute(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInstituteDetails();
    }
  }, [id, axiosSecure]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'school': return <FiHome className="w-6 h-6" />;
      case 'college': return <FiAward className="w-6 h-6" />;
      case 'school_and_college': return <FiBookOpen className="w-6 h-6" />;
      case 'university': return <FiBookOpen className="w-6 h-6" />;
      case 'medical': return <FiActivity className="w-6 h-6" />;
      case 'madrasa': return <FiBookOpen className="w-6 h-6" />;
      default: return <FiBookOpen className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'school': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'college': return 'bg-green-100 text-green-800 border-green-200';
      case 'school_and_college': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'university': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'medical': return 'bg-red-100 text-red-800 border-red-200';
      case 'madrasa': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'school': return 'স্কুল';
      case 'college': return 'কলেজ';
      case 'school_and_college': return 'স্কুল এবং কলেজ';
      case 'university': return 'বিশ্ববিদ্যালয়';
      case 'medical': return 'মেডিকেল';
      case 'madrasa': return 'মাদ্রাসা';
      default: return type;
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'primary': return 'প্রাথমিক';
      case 'secondary': return 'মাধ্যমিক';
      case 'higher_secondary': return 'উচ্চ মাধ্যমিক';
      case 'primary_secondary_higher': return 'প্রাথমিক, মাধ্যমিক এবং উচ্চ';
      case 'secondary_higher': return 'মাধ্যমিক এবং উচ্চ';
      case 'school_and_college': return 'স্কুল এবং কলেজ';
      case 'university': return 'বিশ্ববিদ্যালয়';
      case 'medical': return 'মেডিকেল';
      default: return level;
    }
  };

  const getFacilityText = (facility) => {
    switch (facility) {
      case 'library': return '📚 গ্রন্থাগার';
      case 'laboratory': return '🧪 ল্যাবরেটরি';
      case 'computer_lab': return '💻 কম্পিউটার ল্যাব';
      case 'playground': return '⚽ খেলার মাঠ';
      case 'canteen': return '🍽️ ক্যান্টিন';
      case 'transport': return '🚌 পরিবহন';
      case 'hostel': return '🏠 হোস্টেল';
      case 'medical': return '🏥 চিকিৎসা কেন্দ্র';
      case 'sports': return '🏃 ক্রীড়া সুবিধা';
      case 'auditorium': return '🎭 অডিটোরিয়াম';
      default: return facility;
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const shareInstitute = () => {
    if (navigator.share) {
      navigator.share({
        title: institute.name,
        text: institute.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('লিংক কপি করা হয়েছে!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">শিক্ষা প্রতিষ্ঠানের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error && !institute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <FiInfo className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">তথ্য লোড করতে ব্যর্থ</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          
          <div className="space-y-3">
            <Link
              to="/education"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              শিক্ষা প্রতিষ্ঠানের তালিকায় ফিরে যান
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link
              to="/education"
              className="inline-flex items-center text-blue-100 hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              ফিরে যান
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white bg-opacity-20 text-white hover:bg-red-500'
                }`}
              >
                <FiHeart className="w-5 h-5" />
              </button>
              <button
                onClick={shareInstitute}
                className="p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-colors"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Institute Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
                  {getTypeIcon(institute.type)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{institute.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(institute.type)}`}>
                      {getTypeText(institute.type)}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-600">{getLevelText(institute.level)}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {institute.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">ঠিকানা</p>
                    <p className="font-medium text-gray-900">{institute.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">যোগাযোগ</p>
                    <p className="font-medium text-gray-900">{institute.phone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">অধ্যক্ষ</p>
                    <p className="font-medium text-gray-900">{institute.principal}</p>
                  </div>
                </div>
              </div>
            </div>

            {institute.website && (
              <div className="lg:ml-8 mt-6 lg:mt-0">
                <a
                  href={institute.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiExternalLink className="w-5 h-5 mr-2" />
                  ওয়েবসাইট দেখুন
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images Section */}
            {institute.images && institute.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">ছবি সমূহ</h2>
                </div>
                <div className="p-6">
                  {/* Main Image */}
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={institute.images[selectedImage].url}
                      alt={institute.images[selectedImage].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Thumbnail Images */}
                  {institute.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {institute.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Facilities Section */}
            {institute.facilities && institute.facilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">সুবিধা সমূহ</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {institute.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-lg mr-3">
                          {facility === 'library' && '📚'}
                          {facility === 'laboratory' && '🧪'}
                          {facility === 'computer_lab' && '💻'}
                          {facility === 'playground' && '⚽'}
                          {facility === 'canteen' && '🍽️'}
                          {facility === 'transport' && '🚌'}
                          {facility === 'hostel' && '🏠'}
                          {facility === 'medical' && '🏥'}
                          {facility === 'sports' && '🏃'}
                          {facility === 'auditorium' && '🎭'}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {getFacilityText(facility)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">দ্রুত তথ্য</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">প্রতিষ্ঠার বছর</p>
                    <p className="font-medium text-gray-900">{institute.established}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiUsers className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">শিক্ষার্থীর সংখ্যা</p>
                    <p className="font-medium text-gray-900">{institute.students}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">উপজেলা</p>
                    <p className="font-medium text-gray-900">{institute.upazila}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">যোগাযোগের তথ্য</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">ফোন</p>
                    <a href={`tel:${institute.phone}`} className="font-medium text-blue-600 hover:text-blue-700">
                      {institute.phone}
                    </a>
                  </div>
                </div>
                {institute.email && (
                  <div className="flex items-center">
                    <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">ইমেইল</p>
                      <a href={`mailto:${institute.email}`} className="font-medium text-blue-600 hover:text-blue-700">
                        {institute.email}
                      </a>
                    </div>
                  </div>
                )}
                {institute.website && (
                  <div className="flex items-center">
                    <FiGlobe className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">ওয়েবসাইট</p>
                      <a 
                        href={institute.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        ওয়েবসাইট দেখুন
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">অ্যাকশন</h3>
              <div className="space-y-3">
                <button
                  onClick={toggleFavorite}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                    isFavorite 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiHeart className="w-4 h-4 mr-2" />
                  {isFavorite ? 'ফেভারিট থেকে সরান' : 'ফেভারিটে যোগ করুন'}
                </button>
                <button
                  onClick={shareInstitute}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiShare2 className="w-4 h-4 mr-2" />
                  শেয়ার করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDetailsPage; 