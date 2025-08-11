import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaSearch, FaTint, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaHeart, FaPlus, FaFilter, FaTimes } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const BloodDonorListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/donors`);
        setDonors(res.data.data || []);
      } catch (error) {
        console.error('❌ Donor fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, [axiosSecure]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBloodGroup('');
    setSelectedDistrict('');
  };

  const filteredDonors = donors.filter(donor => {
    const matchSearch =
      donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.mobile?.includes(searchTerm) ||
      donor.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGroup = selectedBloodGroup ? donor.bloodGroup === selectedBloodGroup : true;
    const matchDistrict = selectedDistrict ? donor.district === selectedDistrict : true;
    return matchSearch && matchGroup && matchDistrict;
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const districts = ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];

  const getBloodGroupColor = (bg) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800 border-red-200',
      'A-': 'bg-red-50 text-red-700 border-red-100',
      'B+': 'bg-blue-100 text-blue-800 border-blue-200',
      'B-': 'bg-blue-50 text-blue-700 border-blue-100',
      'AB+': 'bg-purple-100 text-purple-800 border-purple-200',
      'AB-': 'bg-purple-50 text-purple-700 border-purple-100',
      'O+': 'bg-green-100 text-green-800 border-green-200',
      'O-': 'bg-green-50 text-green-700 border-green-100',
    };
    return colors[bg] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('bn-BD') : 'কোন তথ্য নেই';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <FaHeart className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">রক্তদাতা খুঁজুন</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">প্রয়োজনীয় রক্তের গ্রুপের দাতা খুঁজুন এবং জীবন বাঁচাতে সাহায্য করুন</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">মোট দাতা: {filteredDonors.length}</h2>
            <p className="text-sm text-gray-600">উপলব্ধ গ্রুপ: {new Set(filteredDonors.map(d => d.bloodGroup)).size}</p>
          </div>
          <NavLink to="/add-donor">
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center">
              <FaPlus className="mr-2" /> রক্তদাতা হিসেবে যোগ দিন
            </button>
          </NavLink>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="নাম, মোবাইল বা ঠিকানা"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="text-red-600 flex items-center gap-1">
            <FaFilter /> {showFilters ? "ফিল্টার বন্ধ করুন" : "ফিল্টার দেখুন"}
          </button>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <select value={selectedBloodGroup} onChange={e => setSelectedBloodGroup(e.target.value)} className="border rounded p-2">
                <option value="">সব গ্রুপ</option>
                {bloodGroups.map(g => <option key={g}>{g}</option>)}
              </select>
              <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} className="border rounded p-2">
                <option value="">সব জেলা</option>
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>
              <button onClick={resetFilters} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded flex items-center justify-center">
                <FaTimes className="mr-2" /> রিসেট করুন
              </button>
            </div>
          )}
        </div>

        {/* Donor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12">লোড হচ্ছে...</div>
          ) : filteredDonors.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">কোনো দাতা পাওয়া যায়নি</div>
          ) : (
            filteredDonors.map(donor => (
              <div key={donor._id} className="border rounded-xl p-4 bg-white hover:shadow-lg transition">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">{donor.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getBloodGroupColor(donor.bloodGroup)} border`}>
                    {donor.bloodGroup}
                  </span>
                </div>
                <p className="text-sm text-gray-700 flex items-center"><FaPhone className="mr-2" /> {donor.mobile}</p>
                <p className="text-sm text-gray-700 flex items-center"><FaMapMarkerAlt className="mr-2" /> {donor.district}</p>
                <p className="text-sm text-gray-700 flex items-center"><FaCalendarAlt className="mr-2" /> সর্বশেষ: {formatDate(donor.lastDonationDate)}</p>
                <p className={`text-sm mt-2 font-semibold ${donor.canDonate ? 'text-green-600' : 'text-yellow-600'}`}>
                  {donor.canDonate ? '✅ দিতে পারবেন' : '⏳ এখনো সময় হয়নি'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodDonorListing;
