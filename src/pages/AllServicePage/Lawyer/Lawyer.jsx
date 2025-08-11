import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure'; // ✅ Correct path as needed


const Lawyer = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ✅ Fetch lawyers from backend
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await axiosSecure.get('/lawyers'); // Adjust API route
        setLawyers(res.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
        setFetchError('ডেটা লোড করা সম্ভব হয়নি');
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [axiosSecure]);

  // ✅ Filter logic
  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? lawyer.category === selectedCategory : true;
    const matchesArea = selectedArea ? lawyer.chamber.includes(selectedArea) : true;

    return matchesSearch && matchesCategory && matchesArea;
  });

  const categories = [...new Set(lawyers.map((lawyer) => lawyer.category))];
  const areas = [...new Set(lawyers.map((lawyer) => lawyer.chamber.split(',')[0]))]; // Optional enhancement

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-blue-600 text-lg font-semibold animate-pulse">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg font-semibold">{fetchError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-4 sm:mb-0">বগুড়ার আইনজীবীদের তালিকা</h1>
          <button 
            onClick={() => navigate('/add-lawyer')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            আইনজীবী নিবন্ধন করুন
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">খুঁজুন</label>
              <input
                type="text"
                id="search"
                placeholder="নাম বা ক্ষেত্র লিখুন"
                className="w-full p-3 pl-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">আইনের ক্ষেত্র</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">সব</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">অঞ্চল</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">সব</option>
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lawyer List */}
        <div className="space-y-6">
          {filteredLawyers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <h3 className="text-lg font-medium text-gray-900">কোন আইনজীবী পাওয়া যায়নি</h3>
              <p className="text-gray-500 mt-2">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
            </div>
          ) : (
            filteredLawyers.map((lawyer) => (
              <div key={lawyer._id || lawyer.id} className="bg-white rounded-xl shadow hover:shadow-lg transition">
                <div className="md:flex">
                  <img
                    src={lawyer.image || '/images/lawyer-default.jpg'}
                    alt={lawyer.name}
                    className="w-full md:w-1/4 h-64 object-cover"
                  />
                  <div className="p-6 md:w-3/4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{lawyer.name}</h2>
                        <p className="text-sm text-gray-600 mt-1">{lawyer.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600 font-bold text-lg">{lawyer.consultationFee} ৳</p>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      <p><strong>অভিজ্ঞতা:</strong> {lawyer.experience} বছর</p>
                      <p><strong>চেম্বার:</strong> {lawyer.chamber}</p>
                      <p><strong>যোগাযোগ:</strong> {lawyer.phone}</p>
                    </div>

                    <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                      অ্যাপয়েন্টমেন্ট নিন
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Lawyer;
