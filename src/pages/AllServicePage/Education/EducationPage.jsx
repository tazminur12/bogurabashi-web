import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { 
  FiSearch, FiMapPin, FiPhone, FiMail, FiGlobe, FiBookOpen,
  FiFilter, FiGrid, FiList, FiCalendar, FiUsers, FiStar,
  FiExternalLink, FiArrowRight, FiHome, FiAward,
  FiActivity, FiHeart
} from "react-icons/fi";

const EducationPage = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [favorites, setFavorites] = useState([]);
  const axiosSecure = useAxiosSecure();

  // Fetch education institutes
  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/educations?district=bogura");
        
        // Ensure we have an array
        let institutesData = [];
        if (Array.isArray(res.data)) {
          institutesData = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          institutesData = res.data.data;
        } else if (res.data && res.data.result && Array.isArray(res.data.result)) {
          institutesData = res.data.result;
        } else {
          console.warn('Unexpected data structure:', res.data);
          institutesData = [];
        }
        
        setInstitutes(institutesData);
      } catch (error) {
        console.error('Error fetching institutes:', error);
        // Fallback data for demo
        const demoData = [
          {
            _id: '1',
            name: 'বগুড়া সরকারি কলেজ',
            address: 'বগুড়া সদর, বগুড়া',
            phone: '01712345678',
            email: 'bogura@college.edu.bd',
            type: 'college',
            level: 'higher_secondary',
            established: '১৯৬২',
            principal: 'ড. আব্দুল হামিদ',
            students: '৫০০০+',
            description: 'বগুড়া জেলার অন্যতম প্রাচীন শিক্ষা প্রতিষ্ঠান। উচ্চমানের শিক্ষা প্রদান করে আসছে দীর্ঘদিন ধরে।',
            website: 'https://www.boguracollege.edu.bd',
            facilities: ['library', 'laboratory', 'computer_lab', 'playground'],
            images: [
              {
                url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=500',
                title: 'College Building'
              }
            ]
          },
          {
            _id: '2',
            name: 'বগুড়া জিলা স্কুল',
            address: 'স্কুল রোড, বগুড়া সদর',
            phone: '01812345678',
            email: 'bogura@school.edu.bd',
            type: 'school',
            level: 'secondary',
            established: '১৮৫৩',
            principal: 'মোঃ রফিক আহমেদ',
            students: '৩০০০+',
            description: 'বগুড়া জেলার প্রাচীনতম স্কুল। জাতীয় শিক্ষা কার্যক্রমে গুরুত্বপূর্ণ অবদান রাখছে।',
            website: 'https://www.boguraschool.edu.bd',
            facilities: ['library', 'playground', 'sports', 'medical'],
            images: [
              {
                url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500',
                title: 'School Building'
              }
            ]
          },
          {
            _id: '3',
            name: 'বগুড়া মেডিকেল কলেজ',
            address: 'মেডিকেল কলেজ রোড, বগুড়া',
            phone: '01912345678',
            email: 'bmc@medical.edu.bd',
            type: 'medical',
            level: 'university',
            established: '১৯৯২',
            principal: 'প্রফেসর ড. সেলিম খান',
            students: '৮০০+',
            description: 'উত্তরাঞ্চলের অন্যতম মেডিকেল কলেজ। চিকিৎসা শিক্ষার মান উন্নয়নে অগ্রণী ভূমিকা পালন করছে।',
            website: 'https://www.bmc.edu.bd',
            facilities: ['library', 'laboratory', 'medical', 'hostel', 'transport'],
            images: [
              {
                url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
                title: 'Medical College'
              }
            ]
          }
        ];
        setInstitutes(demoData);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, [axiosSecure]);

  // Filter institutes
  const filteredInstitutes = institutes.filter(institute => {
    const matchesSearch = 
      institute.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institute.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institute.principal?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || institute.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || institute.level === selectedLevel;
    
    return matchesSearch && matchesType && matchesLevel;
  });

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

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20  bg-opacity-20 rounded-full mb-6">
              <FiBookOpen className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">বগুড়ার শিক্ষা প্রতিষ্ঠান</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              বগুড়া জেলার সকল শিক্ষা প্রতিষ্ঠানের বিস্তারিত তথ্য। আপনার সন্তানের ভবিষ্যৎ গড়ার জন্য সঠিক প্রতিষ্ঠান নির্বাচন করুন।
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
              <FiBookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{institutes.length}</h3>
            <p className="text-gray-600">মোট প্রতিষ্ঠান</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
              <FiHome className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{institutes.filter(i => i.type === 'school').length}</h3>
            <p className="text-gray-600">স্কুল</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
              <FiAward className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{institutes.filter(i => i.type === 'college').length}</h3>
            <p className="text-gray-600">কলেজ</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-3">
              <FiBookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{institutes.filter(i => i.type === 'school_and_college').length}</h3>
            <p className="text-gray-600">স্কুল এবং কলেজ</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-3">
              <FiBookOpen className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{institutes.filter(i => i.type === 'university').length}</h3>
            <p className="text-gray-600">বিশ্ববিদ্যালয়</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-3">
              <FiBookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{institutes.filter(i => i.type === 'madrasa').length}</h3>
            <p className="text-gray-600">মাদ্রাসা</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">খুঁজুন</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="প্রতিষ্ঠানের নাম, ঠিকানা বা অধ্যক্ষ দিয়ে খুঁজুন..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">প্রতিষ্ঠানের ধরন</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">সব ধরনের প্রতিষ্ঠান</option>
                <option value="school">স্কুল</option>
                <option value="college">কলেজ</option>
                <option value="school_and_college">স্কুল এবং কলেজ</option>
                <option value="university">বিশ্ববিদ্যালয়</option>
                <option value="medical">মেডিকেল</option>
                <option value="madrasa">মাদ্রাসা</option>
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">শিক্ষার স্তর</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="all">সব স্তর</option>
                <option value="primary">প্রাথমিক</option>
                <option value="secondary">মাধ্যমিক</option>
                <option value="higher_secondary">উচ্চ মাধ্যমিক</option>
                <option value="primary_secondary_higher">প্রাথমিক, মাধ্যমিক এবং উচ্চ</option>
                <option value="secondary_higher">মাধ্যমিক এবং উচ্চ</option>
                <option value="school_and_college">স্কুল এবং কলেজ</option>
                <option value="university">বিশ্ববিদ্যালয়</option>
                <option value="medical">মেডিকেল</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-end">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            <span className="font-semibold">{filteredInstitutes.length}</span>টি প্রতিষ্ঠান পাওয়া গেছে
          </p>
        </div>

        {/* Institutes Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutes.map((institute) => (
              <div key={institute._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-indigo-500">
                  {institute.images && institute.images.length > 0 ? (
                    <img
                      src={institute.images[0].url}
                      alt={institute.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getTypeIcon(institute.type)}
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(institute._id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                      favorites.includes(institute._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <FiHeart className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(institute.type)}`}>
                      {getTypeText(institute.type)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{institute.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{getLevelText(institute.level)}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{institute.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{institute.phone}</span>
                    </div>
                    {institute.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{institute.email}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {institute.description}
                  </p>

                  {/* Facilities */}
                  {institute.facilities && institute.facilities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">সুবিধা সমূহ</p>
                      <div className="flex flex-wrap gap-1">
                        {institute.facilities.slice(0, 3).map((facility, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
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
                        ))}
                        {institute.facilities.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            +{institute.facilities.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/education/${institute._id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      বিস্তারিত দেখুন
                      <FiArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                    {institute.website && (
                      <a
                        href={institute.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInstitutes.map((institute) => (
              <div key={institute._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center">
                  {/* Image */}
                  <div className="lg:w-48 lg:h-32 mb-4 lg:mb-0 lg:mr-6">
                    <div className="relative h-32 lg:h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg overflow-hidden">
                      {institute.images && institute.images.length > 0 ? (
                        <img
                          src={institute.images[0].url}
                          alt={institute.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getTypeIcon(institute.type)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{institute.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(institute.type)}`}>
                            {getTypeText(institute.type)}
                          </span>
                          <button
                            onClick={() => toggleFavorite(institute._id)}
                            className={`p-1 rounded-full transition-colors ${
                              favorites.includes(institute._id)
                                ? 'text-red-500'
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <FiHeart className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-600 mb-2">{getLevelText(institute.level)}</p>
                        <p className="text-gray-700 text-sm line-clamp-2">{institute.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{institute.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{institute.phone}</span>
                      </div>
                      {institute.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">{institute.email}</span>
                        </div>
                      )}
                      {institute.principal && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FiUsers className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{institute.principal}</span>
                        </div>
                      )}
                    </div>

                    {/* Facilities */}
                    {institute.facilities && institute.facilities.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">সুবিধা সমূহ</p>
                        <div className="flex flex-wrap gap-2">
                          {institute.facilities.map((facility, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                              {facility === 'library' && '📚 গ্রন্থাগার'}
                              {facility === 'laboratory' && '🧪 ল্যাবরেটরি'}
                              {facility === 'computer_lab' && '💻 কম্পিউটার ল্যাব'}
                              {facility === 'playground' && '⚽ খেলার মাঠ'}
                              {facility === 'canteen' && '🍽️ ক্যান্টিন'}
                              {facility === 'transport' && '🚌 পরিবহন'}
                              {facility === 'hostel' && '🏠 হোস্টেল'}
                              {facility === 'medical' && '🏥 চিকিৎসা কেন্দ্র'}
                              {facility === 'sports' && '🏃 ক্রীড়া সুবিধা'}
                              {facility === 'auditorium' && '🎭 অডিটোরিয়াম'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Link
                        to={`/education/${institute._id}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        বিস্তারিত দেখুন
                        <FiArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                      {institute.website && (
                        <a
                          href={institute.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FiExternalLink className="w-4 h-4 mr-1" />
                          ওয়েবসাইট
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredInstitutes.length === 0 && (
          <div className="text-center py-12">
            <FiBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো প্রতিষ্ঠান পাওয়া যায়নি</h3>
            <p className="text-gray-500">
              {searchTerm || selectedType !== 'all' || selectedLevel !== 'all'
                ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো প্রতিষ্ঠান নেই।'
                : 'এখনও কোনো শিক্ষা প্রতিষ্ঠান যোগ করা হয়নি।'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationPage;