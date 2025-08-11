import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

const JournalistAdmin = () => {
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // সাংবাদিকদের তালিকা লোড করা
  const fetchJournalists = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get('/journalists');
      setJournalists(res.data);
    } catch (error) {
      console.error('সাংবাদিক লোড করতে সমস্যা:', error);
      Swal.fire('ত্রুটি', 'সাংবাদিকদের তথ্য লোড করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalists();
  }, []);

  // সাংবাদিক মুছে ফেলা
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: "আপনি এই তথ্যটি পুনরুদ্ধার করতে পারবেন না!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন',
      cancelButtonText: 'বাতিল',
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/journalists/${id}`);
        Swal.fire('মুছে ফেলা হয়েছে!', 'সাংবাদিকের তথ্য মুছে ফেলা হয়েছে।', 'success');
        fetchJournalists(); // তালিকা রিফ্রেশ করুন
      } catch (error) {
        Swal.fire('ত্রুটি!', 'সাংবাদিক মুছতে ব্যর্থ হয়েছে', 'error');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">সাংবাদিক ব্যবস্থাপনা</h2>
        <button
          onClick={() => navigate('/add-journalist')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaUserPlus /> নতুন সাংবাদিক যোগ করুন
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">সাংবাদিকদের লোড করা হচ্ছে...</p>
        </div>
      ) : journalists.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">কোনো সাংবাদিক পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">নাম</th>
                <th className="border border-gray-300 p-3 text-left">ইমেইল</th>
                <th className="border border-gray-300 p-3 text-left">ফোন নম্বর</th>
                <th className="border border-gray-300 p-3 text-center">কর্ম</th>
              </tr>
            </thead>
            <tbody>
              {journalists.map((journalist) => (
                <tr key={journalist._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{journalist.name}</td>
                  <td className="border border-gray-300 p-3">{journalist.email}</td>
                  <td className="border border-gray-300 p-3">{journalist.phone || 'N/A'}</td>
                  <td className="border border-gray-300 p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/edit-journalist/${journalist._id}`)}
                        className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                        title="সম্পাদনা করুন"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(journalist._id)}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <FaTrash />
                      </button>
                    </div>
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

export default JournalistAdmin;