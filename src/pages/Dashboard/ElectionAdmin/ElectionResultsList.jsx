import React, { useState, useEffect } from 'react';
import usePageTitle from '../../../hooks/usePageTitle';
import { FaEdit, FaTrash, FaPlus, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ElectionResultsList = () => {
  usePageTitle('নির্বাচন ফলাফলের তালিকা | বগুড়াবাসী');
  const axiosSecure = useAxiosSecure();

  // Data state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axiosSecure.get('/election/results')
      .then(res => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [axiosSecure]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: "আপনি এটি আর ফিরে পাবেন না!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন!',
      cancelButtonText: 'বাতিল'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/election/results/${id}`)
          .then(res => {
             if(res.data.deletedCount > 0 || res.data.message === 'Result deleted successfully'){
                 setResults(results.filter(item => item._id !== id));
                 Swal.fire(
                  'মুছে ফেলা হয়েছে!',
                  'ফলাফলটি সফলভাবে মুছে ফেলা হয়েছে।',
                  'success'
                );
             }
          })
          .catch(err => {
             console.error(err);
             Swal.fire('Error', 'Failed to delete', 'error');
          });
      }
    });
  };

  const getWinner = (candidates) => {
    if (!candidates || candidates.length === 0) return 'N/A';
    // Sort by votes descending
    const sorted = [...candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));
    // Return top candidate
    return `${sorted[0].name} (${sorted[0].party})`;
  };

  const filteredResults = results.filter(item => 
    (item.constituency?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (item.union?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (item.center?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
      return <div className="p-10 text-center">লোডিং...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">নির্বাচন ফলাফলের তালিকা</h2>
          <p className="text-gray-600 text-sm mt-1">কেন্দ্র ও ইউনিয়ন ভিত্তিক সকল ফলাফল</p>
        </div>
        <Link 
          to="/dashboard/election-results-manage" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FaPlus /> নতুন ফলাফল যোগ করুন
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Filter */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <input 
                type="text" 
                placeholder="আসন, ইউনিয়ন বা কেন্দ্রের নাম দিয়ে খুঁজুন..." 
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-600">
                <th className="p-4 font-semibold">আসন</th>
                <th className="p-4 font-semibold">ইউনিয়ন/পৌরসভা</th>
                <th className="p-4 font-semibold">ভোট কেন্দ্র</th>
                <th className="p-4 font-semibold text-center">মোট ভোটার</th>
                <th className="p-4 font-semibold text-center">কাস্ট ভোট</th>
                <th className="p-4 font-semibold">বিজয়ী (প্রাথমিক)</th>
                <th className="p-4 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors text-sm md:text-base">
                    <td className="p-4 font-medium text-gray-800">{item.constituency}</td>
                    <td className="p-4 text-gray-700">{item.union}</td>
                    <td className="p-4 text-gray-700">{item.center}</td>
                    <td className="p-4 text-center text-gray-600">{(item.totalVoters || 0).toLocaleString()}</td>
                    <td className="p-4 text-center text-gray-600">{(item.castedVotes || 0).toLocaleString()}</td>
                    <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            {getWinner(item.candidates)}
                        </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                            to={`/dashboard/election-results-edit/${item._id}`} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="এডিট"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    কোনো ফলাফল পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 text-center">
            মোট ফলাফল: {filteredResults.length} টি
        </div>
      </div>
    </div>
  );
};

export default ElectionResultsList;
