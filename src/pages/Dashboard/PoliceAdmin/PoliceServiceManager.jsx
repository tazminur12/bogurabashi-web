import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PoliceServiceManager = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const axiosSecure = useAxiosSecure();

  const fetchStations = useCallback(async () => {
    try {
      const res = await axiosSecure.get('/policestations');
      setStations(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'ডেটা লোড করা যায়নি', 'error');
      setLoading(false);
    }
  }, [axiosSecure]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'এই তথ্য মুছে ফেলা হবে!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
      cancelButtonText: 'বাতিল',
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/policestations/${id}`);
        Swal.fire('Deleted!', 'তথ্য সফলভাবে ডিলিট হয়েছে।', 'success');
        fetchStations();
      } catch (_error) {
        console.error(_error);
        Swal.fire('Error', 'তথ্য ডিলিট করা যায়নি।', 'error');
      }
    }
  };

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const filteredStations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return stations;
    return stations.filter((s) =>
      [s.name, s.address, s.officer]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term))
    );
  }, [stations, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredStations.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const currentPageItems = filteredStations.slice(startIndex, startIndex + pageSize);

  const onImageError = (e) => {
    e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Img';
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">পুলিশ স্টেশন ব্যবস্থাপনা</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="অনুসন্ধান করুন (নাম/ঠিকানা/অফিসার)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="input input-bordered w-full sm:w-64"
          />
          <div className="flex items-center gap-2">
            <select
              className="select select-bordered"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <Link to="/dashboard/police-add" className="btn btn-primary">+ নতুন স্টেশন</Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="animate-pulse h-12 bg-gray-100 rounded" />
          ))}
        </div>
      ) : filteredStations.length === 0 ? (
        <div className="text-center p-10 bg-white rounded shadow">
          <p className="text-gray-600 mb-4">কোনো তথ্য পাওয়া যায়নি।</p>
          <Link to="/dashboard/police-add" className="btn btn-primary">নতুন স্টেশন যোগ করুন</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border text-left">নাম</th>
                <th className="p-3 border text-left">ঠিকানা</th>
                <th className="p-3 border text-left">অফিসার</th>
                <th className="p-3 border text-center">ছবি</th>
                <th className="p-3 border text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {currentPageItems.map((station) => (
                <tr key={station._id} className="hover:bg-gray-50">
                  <td className="p-3 border align-top">
                    <div className="font-medium text-gray-800">{station.name}</div>
                    {station.phone && (
                      <div className="text-sm text-gray-500">ফোন: {station.phone}</div>
                    )}
                  </td>
                  <td className="p-3 border align-top">{station.address}</td>
                  <td className="p-3 border align-top">{station.officer}</td>
                  <td className="p-3 border text-center">
                    {station.image ? (
                      <img
                        src={station.image}
                        onError={onImageError}
                        alt={station.name}
                        className="h-12 w-12 object-cover mx-auto rounded ring-1 ring-gray-200"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">ছবি নেই</span>
                    )}
                  </td>
                  <td className="p-3 border text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/dashboard/police-edit/${station._id}`}
                        className="btn btn-sm btn-warning text-white"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(station._id)}
                        className="btn btn-sm btn-error text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <div className="text-sm text-gray-600">
              মোট {filteredStations.length} টি, পেজ {currentPageSafe} / {totalPages}
            </div>
            <div className="join">
              <button
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPageSafe === 1}
              >
                « Prev
              </button>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
                const page = idx + 1;
                return (
                  <button
                    key={page}
                    className={`join-item btn btn-sm ${currentPageSafe === page ? 'btn-active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPageSafe === totalPages}
              >
                Next »
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliceServiceManager;
