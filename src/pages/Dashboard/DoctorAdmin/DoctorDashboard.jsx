import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const DoctorDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterHospital, setFilterHospital] = useState('');

  // ডাক্তার লোড
  const fetchDoctors = async () => {
    try {
      const res = await axiosSecure.get('/api/doctors');
      setDoctors(res.data);
    } catch (error) {
      console.error('ডাক্তার লোড করতে সমস্যা:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // মুছে ফেলা
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'এই তথ্য মুছে ফেলা হলে আর ফিরে পাওয়া যাবে না!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন',
      cancelButtonText: 'না, রাখুন',
      confirmButtonColor: '#14b8a6',
      cancelButtonColor: '#d33'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/api/doctors/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire('মুছে ফেলা হয়েছে!', 'তথ্য সফলভাবে মুছে ফেলা হয়েছে।', 'success');
          fetchDoctors();
        }
      } catch (error) {
        console.error('মুছে ফেলতে সমস্যা:', error);
        Swal.fire('ত্রুটি!', 'ডাটা মুছে ফেলতে ব্যর্থ হয়েছি।', 'error');
      }
    }
  };

  // Unique specialties and hospitals for filter dropdowns
  const specialties = Array.from(new Set(doctors.map(d => d.specialty).filter(Boolean)));
  const hospitals = Array.from(new Set(doctors.map(d => d.hospital).filter(Boolean)));

  // Filtered and searched doctors
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch =
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(search.toLowerCase()) ||
      doc.hospital?.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = filterSpecialty ? doc.specialty === filterSpecialty : true;
    const matchesHospital = filterHospital ? doc.hospital === filterHospital : true;
    return matchesSearch && matchesSpecialty && matchesHospital;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-700">ডাক্তার তালিকা</h2>
        <Link
          to="/dashboard/add-doctor"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
        >
          + নতুন ডাক্তার যুক্ত করুন
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="নাম, বিশেষতা, হাসপাতাল দিয়ে খুঁজুন..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={filterSpecialty}
          onChange={e => setFilterSpecialty(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">সব বিশেষতা</option>
          {specialties.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterHospital}
          onChange={e => setFilterHospital(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">সব হাসপাতাল</option>
          {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">লোড হচ্ছে...</div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-10 text-gray-500">কোনো ডাক্তার পাওয়া যায়নি।</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">ছবি</th>
                <th className="p-3">নাম</th>
                <th className="p-3">বিশেষতা</th>
                <th className="p-3">যোগ্যতা</th>
                <th className="p-3">হাসপাতাল</th>
                <th className="p-3">চেম্বার</th>
                <th className="p-3">অভিজ্ঞতা</th>
                <th className="p-3">ফি</th>
                <th className="p-3">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc) => (
                <tr key={doc._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-2">
                    {doc.image ? (
                      <img src={doc.image} alt={doc.name} className="w-12 h-12 object-cover rounded-full mx-auto" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-400">N/A</div>
                    )}
                  </td>
                  <td className="p-2 font-semibold text-gray-800">{doc.name}</td>
                  <td className="p-2">{doc.specialty}</td>
                  <td className="p-2">{doc.qualification}</td>
                  <td className="p-2">{doc.hospital}</td>
                  <td className="p-2">{doc.chamber}</td>
                  <td className="p-2">{doc.experience}</td>
                  <td className="p-2">{doc.fee ? `${doc.fee}৳` : '-'}</td>
                  <td className="p-2 flex flex-col md:flex-row gap-2 justify-center items-center">
                    <Link
                      to={`/dashboard/edit-doctors/${doc._id}`}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                    >
                      সম্পাদনা
                    </Link>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm"
                    >
                      মুছে ফেলুন
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

export default DoctorDashboard;
