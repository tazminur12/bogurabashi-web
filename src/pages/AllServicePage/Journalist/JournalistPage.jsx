import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhone, FaUserTie } from 'react-icons/fa';

const JournalistPage = () => {
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournalists = async () => {
      try {
        const response = await axiosSecure.get('/journalists');
        setJournalists(response.data);
      } catch (error) {
        console.error('সাংবাদিক লোড করতে সমস্যা:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJournalists();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg text-blue-600">
        সাংবাদিকদের তালিকা লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate('/add-journalist')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
        >
          ➕ নতুন সাংবাদিক
        </button>
      </div>

      {/* Journalist Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {journalists.map((j) => (
          <div
            key={j._id}
            className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all p-5 flex flex-col items-center text-center"
          >
            {/* Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 mb-4">
              {j.image ? (
                <img src={j.image} alt={j.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 bg-gray-100">
                  {j.name?.charAt(0)}
                </div>
              )}
            </div>

            {/* Name & Designation */}
            <h2 className="text-xl font-bold text-gray-800">{j.name}</h2>
            <p className="text-blue-600 mb-2">{j.designation}</p>

            {/* Media Info */}
            <p className="text-gray-700 text-sm mb-1">
              <FaUserTie className="inline mr-1 text-blue-500" />
              {j.mediaName} ({j.mediaType})
            </p>
            {j.mediaWebsite && (
              <p className="text-sm mb-2">
                <FaGlobe className="inline mr-1 text-green-500" />
                <a href={j.mediaWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Website
                </a>
              </p>
            )}

            {/* Location */}
            <p className="text-sm text-gray-600">
              <FaMapMarkerAlt className="inline mr-1 text-red-400" />
              {j.district}, {j.beat} বিট
            </p>

            {/* Contact Info */}
            <div className="mt-4 space-y-1 text-sm text-gray-700">
              <p>
                <FaPhone className="inline mr-1 text-blue-500" />
                {j.phone}
              </p>
              <p>
                <FaEnvelope className="inline mr-1 text-gray-600" />
                {j.email}
              </p>
            </div>

            {/* Organization */}
            {j.organization && (
              <p className="mt-3 text-sm text-gray-500 italic">📌 {j.organization}</p>
            )}
          </div>
        ))}
      </div>

      {/* If Empty */}
      {journalists.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">কোন সাংবাদিক পাওয়া যায়নি।</p>
      )}
    </div>
  );
};

export default JournalistPage;
