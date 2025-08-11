import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useSecureAxios from '../../../hooks/useAxiosSecure';

const ContentCreatorAdmin = () => {
  const axiosSecure = useSecureAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ Fetch all creators
  const { data: creators = [], isLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const res = await axiosSecure.get('/content-creators');
      return res.data;
    },
  });

  // ✅ Handle Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'এই কনটেন্ট ক্রিয়েটর মুছে যাবে!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/content-creators/${id}`).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'ডিলিট সফল হয়েছে!',
            timer: 1200,
            showConfirmButton: false,
          });
          queryClient.invalidateQueries(['creators']);
        });
      }
    });
  };

  if (isLoading) return <p className="text-center py-10">লোড হচ্ছে...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Content Creator Management</h2>
          <button
            onClick={() => navigate('/admin/creators/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700"
          >
            <FaPlus className="mr-2" /> Add Creator
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-xl p-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-3">Image</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Specialty</th>
                <th className="py-2 px-3">Social</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {creators.map((creator) => (
                <tr key={creator._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-2 px-3 font-semibold">{creator.name}</td>
                  <td className="py-2 px-3">{creator.specialty}</td>
                  <td className="py-2 px-3">
                    <div className="flex gap-2">
                      {creator.facebook && <a href={creator.facebook}><FaFacebook className="text-blue-600" /></a>}
                      {creator.instagram && <a href={creator.instagram}><FaInstagram className="text-pink-500" /></a>}
                      {creator.youtube && <a href={creator.youtube}><FaYoutube className="text-red-600" /></a>}
                      {creator.tiktok && <a href={creator.tiktok}><FaTiktok className="text-black" /></a>}
                    </div>
                  </td>
                  <td className="py-2 px-3">{creator.email}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => navigate(`/admin/creators/update/${creator._id}`)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(creator._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {creators.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    কোনো কনটেন্ট ক্রিয়েটর পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentCreatorAdmin;
