import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { 
  FiPlus, FiSearch, FiEdit, FiTrash2, FiBookOpen, 
  FiMapPin, FiPhone, FiMail, FiUsers, FiCalendar,
  FiFilter, FiRefreshCw, FiEye
} from "react-icons/fi";

const EducationDashboard = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/educations?district=bogura");
      
      // Ensure we have an array, even if the response structure is different
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
    } catch (err) {
      console.error('Error fetching institutes:', err);
      // Fallback to sample data if backend is not available
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
          description: 'বগুড়া জেলার অন্যতম প্রাচীন শিক্ষা প্রতিষ্ঠান'
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
          description: 'বগুড়া জেলার প্রাচীনতম স্কুল'
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
          description: 'উত্তরাঞ্চলের অন্যতম মেডিকেল কলেজ'
        }
      ];
      setInstitutes(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, [axiosSecure]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই শিক্ষা প্রতিষ্ঠানের তথ্য মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "না",
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/educations/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "সফল!",
            text: "শিক্ষা প্রতিষ্ঠানের তথ্য ডিলিট করা হয়েছে",
            icon: "success",
            confirmButtonText: "ঠিক আছে"
          });
          setInstitutes(institutes.filter((edu) => edu._id !== id));
        }
      } catch (err) {
        console.error('Error deleting institute:', err);
        Swal.fire("ত্রুটি", "ডিলিট ব্যর্থ হয়েছে", "error");
      }
    }
  };

  // Ensure institutes is always an array before filtering
  const institutesArray = Array.isArray(institutes) ? institutes : [];

  // Filter institutes
  const filteredInstitutes = institutesArray.filter(institute => {
    const matchesSearch = 
      institute.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institute.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institute.principal?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || institute.type === selectedType;
    const matchesLevel = selectedLevel === 'all' || institute.level === selectedLevel;
    
    return matchesSearch && matchesType && matchesLevel;
  });

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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'school': return '🏫';
      case 'college': return '🎓';
      case 'school_and_college': return '📚';
      case 'university': return '🏛️';
      case 'medical': return '🏥';
      case 'madrasa': return '🕌';
      default: return '📚';
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
            <FiBookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">শিক্ষা প্রতিষ্ঠান ড্যাশবোর্ড</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            বগুড়া জেলার সকল শিক্ষা প্রতিষ্ঠানের তথ্য পরিচালনা করুন
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiBookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">মোট প্রতিষ্ঠান</p>
                <p className="text-2xl font-bold text-gray-900">{institutesArray.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">স্কুল</p>
                <p className="text-2xl font-bold text-gray-900">{institutesArray.filter(i => i.type === 'school').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">কলেজ</p>
                <p className="text-2xl font-bold text-gray-900">{institutesArray.filter(i => i.type === 'college').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiBookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">স্কুল এবং কলেজ</p>
                <p className="text-2xl font-bold text-gray-900">{institutesArray.filter(i => i.type === 'school_and_college').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiMail className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">বিশ্ববিদ্যালয়</p>
                <p className="text-2xl font-bold text-gray-900">{institutesArray.filter(i => i.type === 'university').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiBookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">মাদ্রাসা</p>
                <p className="text-2xl font-bold text-gray-900">{institutesArray.filter(i => i.type === 'madrasa').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search Input */}
            <div>
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

            {/* Results Count */}
            <div className="flex items-end">
              <div className="bg-gray-50 px-4 py-3 rounded-lg w-full">
                <p className="text-sm text-gray-600">মোট ফলাফল</p>
                <p className="text-2xl font-bold text-gray-900">{filteredInstitutes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={fetchInstitutes}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              রিফ্রেশ
            </button>
          </div>
          <button
            onClick={() => navigate("/dashboard/add-education")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            নতুন প্রতিষ্ঠান যোগ করুন
          </button>
        </div>

        {/* Institutes Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">প্রতিষ্ঠানের নাম</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ঠিকানা</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">যোগাযোগ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ধরন</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">অধ্যক্ষ</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInstitutes.length > 0 ? (
                  filteredInstitutes.map((institute) => (
                    <tr key={institute._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getTypeIcon(institute.type)}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{institute.name}</div>
                            <div className="text-sm text-gray-500">{getLevelText(institute.level)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-700">
                          <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">{institute.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-700">
                            <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                            {institute.phone}
                          </div>
                          {institute.email && (
                            <div className="flex items-center text-sm text-gray-700">
                              <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                              {institute.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(institute.type)}`}>
                          {institute.type === 'school' && 'স্কুল'}
                          {institute.type === 'college' && 'কলেজ'}
                          {institute.type === 'university' && 'বিশ্ববিদ্যালয়'}
                          {institute.type === 'medical' && 'মেডিকেল'}
                          {institute.type === 'madrasa' && 'মাদ্রাসা'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{institute.principal}</div>
                        {institute.established && (
                          <div className="text-xs text-gray-500">প্রতিষ্ঠিত: {institute.established}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => navigate(`/dashboard/edit-education/${institute._id}`)}
                            className="inline-flex items-center px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors"
                            title="এডিট করুন"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/dashboard/view-education/${institute._id}`)}
                            className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                            title="দেখুন"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(institute._id)}
                            className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                            title="ডিলিট করুন"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <FiBookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো প্রতিষ্ঠান পাওয়া যায়নি</h3>
                        <p className="text-gray-500">
                          {searchTerm || selectedType !== 'all' || selectedLevel !== 'all'
                            ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো প্রতিষ্ঠান নেই।'
                            : 'এখনও কোনো শিক্ষা প্রতিষ্ঠান যোগ করা হয়নি।'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDashboard;
