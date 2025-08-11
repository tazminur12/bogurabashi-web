import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const RailwayAdmin = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStations = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get('/stations');
      setStations(res.data);
    } catch (error) {
      Swal.fire('ত্রুটি!', 'স্টেশন ডেটা লোড করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const deleteStation = (id, name) => {
    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: `"${name}" স্টেশনটি সম্পূর্ণ ডিলিট হয়ে যাবে!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন!',
      cancelButtonText: 'বাতিল করুন'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/stations/${id}`);
          Swal.fire('ডিলিট হয়েছে!', 'স্টেশন সফলভাবে ডিলিট হয়েছে।', 'success');
          fetchStations();
        } catch {
          Swal.fire('ত্রুটি!', 'ডিলিট করতে ব্যর্থ হয়েছে', 'error');
        }
      }
    });
  };

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded shadow-lg">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">রেলওয়ে স্টেশন এডমিন ড্যাশবোর্ড</h1>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="স্টেশন খুঁজুন (নাম, কোড বা ঠিকানা)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <button
          onClick={() => navigate('/dashboard/add-station')}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          aria-label="Add new station"
        >
          <PlusIcon className="h-6 w-6" />
          নতুন স্টেশন যোগ করুন
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-indigo-600 font-semibold">স্টেশন লোড হচ্ছে...</p>
        </div>
      ) : filteredStations.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'কোন স্টেশন পাওয়া যায়নি' : 'কোন স্টেশন পাওয়া যায়নি, নতুন স্টেশন যোগ করুন'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-indigo-700 border-b border-indigo-100">স্টেশনের নাম</th>
                <th className="px-6 py-3 font-semibold text-indigo-700 border-b border-indigo-100">কোড</th>
                <th className="px-6 py-3 font-semibold text-indigo-700 border-b border-indigo-100">যোগাযোগ</th>
                <th className="px-6 py-3 font-semibold text-indigo-700 border-b border-indigo-100">ঠিকানা</th>
                <th className="px-6 py-3 font-semibold text-indigo-700 border-b border-indigo-100">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((station) => (
                <tr
                  key={station.id || station._id}
                  className="hover:bg-indigo-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 border-b border-indigo-100 font-medium">{station.name}</td>
                  <td className="px-6 py-4 border-b border-indigo-100 font-mono">{station.code}</td>
                  <td className="px-6 py-4 border-b border-indigo-100">{station.contact || '-'}</td>
                  <td className="px-6 py-4 border-b border-indigo-100">{station.address || '-'}</td>
                  <td className="px-6 py-4 border-b border-indigo-100 space-x-3">
                    <button
                      onClick={() => navigate(`/dashboard/edit-railway/${station._id}`)}
                      className="inline-flex items-center gap-1 bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 transition shadow-sm"
                      title="এডিট করুন"
                    >
                      <PencilIcon className="h-5 w-5 text-white" />
                      <span className="hidden md:inline">এডিট</span>
                    </button>
                    <button
                      onClick={() => deleteStation(station.id || station._id, station.name)}
                      className="inline-flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition shadow-sm"
                      title="ডিলিট করুন"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="hidden md:inline">ডিলিট</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RailwayAdmin;
