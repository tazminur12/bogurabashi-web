import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaUserTie, FaShieldAlt, FaExclamationTriangle, FaCar, FaLaptop, FaUsers, FaHandshake } from 'react-icons/fa';

const PoliceService = () => {
  const axiosSecure = useAxiosSecure();

  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThana, setSelectedThana] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const allServices = [
    'জরুরী সহায়তা',
    'এফআইআর',
    'সাধারণ অভিযোগ',
    'নারী ও শিশু সহায়তা',
    'অপরাধ রিপোর্ট',
    'ট্রাফিক ম্যানেজমেন্ট',
    'সাইবার ক্রাইম',
    'সামাজিক নিরাপত্তা'
  ];

  const getServiceIcon = (service) => {
    const iconMap = {
      'জরুরী সহায়তা': <FaExclamationTriangle className="text-red-500" />,
      'এফআইআর': <FaShieldAlt className="text-blue-500" />,
      'সাধারণ অভিযোগ': <FaHandshake className="text-green-500" />,
      'নারী ও শিশু সহায়তা': <FaUsers className="text-pink-500" />,
      'অপরাধ রিপোর্ট': <FaShieldAlt className="text-purple-500" />,
      'ট্রাফিক ম্যানেজমেন্ট': <FaCar className="text-orange-500" />,
      'সাইবার ক্রাইম': <FaLaptop className="text-indigo-500" />,
      'সামাজিক নিরাপত্তা': <FaShieldAlt className="text-teal-500" />
    };
    return iconMap[service] || <FaShieldAlt className="text-gray-500" />;
  };

  useEffect(() => {
    const fetchPoliceStations = async () => {
      try {
        const res = await axiosSecure.get('/policestations');
        setPoliceStations(res.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('ডেটা লোড করতে সমস্যা হয়েছে।');
      } finally {
        setLoading(false);
      }
    };
    fetchPoliceStations();
  }, [axiosSecure]);

  const filteredStations = policeStations.filter(station => {
    const matchesSearch =
      station.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesThana = selectedThana ? station.name === selectedThana : true;
    const matchesService = selectedService ? station.services?.includes(selectedService) : true;

    return matchesSearch && matchesThana && matchesService;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-200 border-t-blue-600 mx-auto mb-3"></div>
          <p className="text-blue-600 font-semibold text-lg">তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <FaShieldAlt className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              বগুড়া জেলা পুলিশ
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              জননিরাপত্তা ও পুলিশ সেবা সম্পর্কিত তথ্য - আপনার নিরাপত্তার জন্য আমাদের সেবা
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-full inline-block mb-3">
              <FaShieldAlt className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{policeStations.length}</h3>
            <p className="text-gray-600 text-sm font-medium">মোট থানা</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-full inline-block mb-3">
              <FaUsers className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{allServices.length}</h3>
            <p className="text-gray-600 text-sm font-medium">সেবার ধরন</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-full inline-block mb-3">
              <FaPhone className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">২৪/৭</h3>
            <p className="text-gray-600 text-sm font-medium">সেবা সময়</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 text-center transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-full inline-block mb-3">
              <FaExclamationTriangle className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">জরুরী</h3>
            <p className="text-gray-600 text-sm font-medium">সহায়তা</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <FaSearch className="mr-2 text-blue-600" />
            থানা খুঁজুন
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">খুঁজুন</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="থানা নাম বা ঠিকানা লিখুন..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">থানা নির্বাচন</label>
              <select
                value={selectedThana}
                onChange={e => setSelectedThana(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm cursor-pointer"
              >
                <option value="">সব থানা</option>
                {policeStations.map(st => (
                  <option key={st._id} value={st.name}>{st.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">সেবা নির্বাচন</label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm cursor-pointer"
              >
                <option value="">সব সেবা</option>
                {allServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-md border border-gray-100">
            <FaSearch className="text-blue-600 mr-2 text-sm" />
            <span className="text-gray-700 text-sm">
              <span className="font-bold text-blue-600">{filteredStations.length}</span> টি থানা পাওয়া গেছে
            </span>
          </div>
        </div>

        {/* Station Cards */}
        <div className="space-y-4">
          {filteredStations.length === 0 ? (
            <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="text-gray-400 text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">কোনো থানা খুঁজে পাওয়া যায়নি</h3>
              <p className="text-gray-500 text-sm mb-4">অনুগ্রহ করে অন্য শব্দ দিয়ে খুঁজুন</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedThana('');
                  setSelectedService('');
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-sm"
              >
                সব ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            filteredStations.map(station => (
              <div key={station._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                <div className="p-5">
                  {/* Header */}
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-3">
                      <FaShieldAlt className="text-white text-lg" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{station.name}</h2>
                    <div className="flex items-center justify-center text-gray-600 text-sm">
                      <FaMapMarkerAlt className="text-blue-500 mr-2" />
                      {station.address}
                    </div>
                  </div>

                  {/* Officer Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <div className="flex items-center justify-center">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg mr-3">
                        <FaUserTie className="text-lg" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-blue-800 text-sm mb-1">অফিসার ইন চার্জ</p>
                        <p className="text-blue-700 text-base">{station.officer}</p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-gray-800 mb-4 text-center">সেবাসমূহ</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {(station.services || []).map((service, index) => (
                        <div key={index} className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-full text-xs font-semibold hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 flex items-center gap-1 shadow-sm">
                          {getServiceIcon(service)}
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="font-bold text-gray-800 text-base mb-4 text-center flex items-center justify-center">
                      <FaPhone className="mr-2 text-blue-600" />
                      যোগাযোগের তথ্য
                    </h3>
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                        <span className="text-gray-600 mr-2 text-sm">ফোন নম্বর:</span>
                        <span className="font-bold text-gray-800 text-sm">{station.contact || 'উপলব্ধ নয়'}</span>
                      </div>
                    </div>
                    
                    {/* Call Button */}
                    <div className="text-center">
                      <a
                        href={`tel:${station.contact?.replace(/-/g, '') || ''}`}
                        className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <FaPhone className="mr-2" />
                        কল করুন
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        {!loading && filteredStations.length > 0 && (
          <div className="mt-8 text-center p-6 bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-3">
              <FaShieldAlt className="text-white text-lg" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-2">জরুরী নম্বর</h3>
            <p className="text-gray-600 text-sm mb-3">সর্বদা আপনার নিরাপত্তার জন্য প্রস্তুত</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-xl mx-auto">
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-red-800 font-bold text-sm">জরুরী: ৯৯৯</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-bold text-sm">পুলিশ: ১০০</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-green-800 font-bold text-sm">অগ্নিনির্বাপণ: ১৬১</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliceService;
