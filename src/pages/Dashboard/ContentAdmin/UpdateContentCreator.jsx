import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSecureAxios from '../../hooks/useSecureAxios';
import Swal from 'sweetalert2';

const UpdateContentCreator = () => {
  const { id } = useParams();
  const axiosSecure = useSecureAxios();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    axiosSecure.get(`/content-creators/${id}`).then((res) => setForm(res.data));
  }, [id, axiosSecure]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.put(`/content-creators/${id}`, form);
      Swal.fire({ icon: 'success', title: 'আপডেট সফল হয়েছে', timer: 1200, showConfirmButton: false });
      navigate('/admin/creators');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'আপডেট ব্যর্থ হয়েছে', text: 'আবার চেষ্টা করুন' });
    }
  };

  if (!form) return <p className="text-center py-10">লোড হচ্ছে...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">কনটেন্ট ক্রিয়েটর আপডেট করুন</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(form).map((field) => (
          <div key={field}>
            <label className="capitalize block mb-1">{field}</label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required={['name', 'specialty', 'image'].includes(field)}
            />
          </div>
        ))}
        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded">আপডেট করুন</button>
      </form>
    </div>
  );
};

export default UpdateContentCreator;
