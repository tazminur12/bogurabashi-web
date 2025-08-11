import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const RailwayService = () => {
  const axiosSecure = useAxiosSecure();
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch stations + trains
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get('/stations');
        setStations(res.data);
      } catch (error) {
        console.error('ডেটা লোড করতে সমস্যা:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  // Filter trains by search term
  const filterTrains = (trains) =>
    trains.filter(
      (train) =>
        train.name.toLowerCase().includes(search.toLowerCase()) ||
        train.trainNo.includes(search)
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600 text-lg">
        ডেটা লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        বগুড়া রেলওয়ে সার্ভিস
      </h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="ট্রেন নাম বা নম্বর লিখুন"
          className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Station Cards */}
      <div className="space-y-8">
        {stations.map((station) => {
          const filteredTrainList = filterTrains(station.trains || []);
          return (
            <div
              key={station._id}
              className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
            >
              {/* Station Info */}
              <div className="md:flex md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {station.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">স্টেশন কোড: {station.code}</p>
                  <p className="text-sm text-gray-600 mb-1">ঠিকানা: {station.address}</p>
                  <p className="text-sm text-gray-600 mb-1">যোগাযোগ: {station.contact}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    স্টেশন মাস্টার: {station.stationMaster?.name} ({station.stationMaster?.contact})
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(station.facilities || []).map((facility, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Station Image (optional) */}
                {station.image && (
                  <img
                    src={station.image}
                    alt={station.name}
                    className="w-full md:w-60 rounded-lg mt-4 md:mt-0 shadow"
                  />
                )}
              </div>

              {/* Trains under this station */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">ট্রেন সমূহ</h3>

                {filteredTrainList.length === 0 ? (
                  <p className="text-sm text-gray-500">এই স্টেশনের সাথে কোন ট্রেন পাওয়া যায়নি।</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">নাম</th>
                          <th className="px-4 py-2 text-left">নম্বর</th>
                          <th className="px-4 py-2 text-left">ধরন</th>
                          <th className="px-4 py-2 text-left">আগমন</th>
                          <th className="px-4 py-2 text-left">নির্গমন</th>
                          <th className="px-4 py-2 text-left">দিন</th>
                          <th className="px-4 py-2 text-left">বুকিং</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredTrainList.map((train, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{train.name}</td>
                            <td className="px-4 py-2">{train.trainNo}</td>
                            <td className="px-4 py-2">{train.type}</td>
                            <td className="px-4 py-2">{train.arrival || '-'}</td>
                            <td className="px-4 py-2">{train.departure || '-'}</td>
                            <td className="px-4 py-2">
                              {train.days?.length > 0 ? train.days.join(', ') : 'N/A'}
                            </td>
                            <td className="px-4 py-2">
                              <a
                                href="https://train.shohoz.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:underline"
                              >
                                বুক করুন
                              </a>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RailwayService;
