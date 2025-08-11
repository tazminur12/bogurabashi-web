import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  name: '',
  phone: '',
  address: '',
  officer: '',
  services: [],
  image: ''
};

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

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const PoliceStationFormPage = () => {
  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'services') {
      const updatedServices = checked
        ? [...form.services, value]
        : form.services.filter(service => service !== value);
      setForm({ ...form, services: updatedServices });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // লোকালি প্রিভিউ দেখানোর জন্য
    setImagePreview(URL.createObjectURL(file));

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data?.data?.url) {
        setForm(prev => ({ ...prev, image: data.data.url }));
        Swal.fire('সফল', 'ছবি আপলোড হয়েছে', 'success');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('ত্রুটি', 'ছবি আপলোড ব্যর্থ হয়েছে', 'error');
      setImagePreview(null); // প্রিভিউ ক্লিয়ার
    }

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        officer: form.officer,
        services: form.services,
        image: form.image,
      };
      await axiosSecure.post('/policestations', payload);
      Swal.fire('সফল!', 'নতুন পুলিশ স্টেশন যোগ হয়েছে।', 'success');
      setForm(initialForm);
      setImagePreview(null);
      navigate('/dashboard/police'); // Redirect to dashboard after success
    } catch (error) {
      console.error(error);
      Swal.fire('ত্রুটি', 'পুলিশ স্টেশন যোগ করা যায়নি', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center text-sm text-blue-600 hover:underline"
      >
        ← ফিরে যান
      </button>

      <div className="flex items-start justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">নতুন পুলিশ স্টেশন যোগ করুন</h2>
        {!IMGBB_API_KEY && (
          <div className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 rounded px-2 py-1">
            ImgBB API Key সেট করা হয়নি (.env এ VITE_IMGBB_API_KEY)। ছবি আপলোড কাজ নাও করতে পারে।
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">থানার নাম *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="যেমন: সদর থানা"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">ফোন নম্বর *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="যেমন: ০১৭xxxxxxxx"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">ঠিকানা *</label>
            <input
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="ঠিকানা লিখুন"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">অফিসারের নাম *</label>
            <input
              name="officer"
              value={form.officer}
              onChange={handleInputChange}
              placeholder="দায়িত্বপ্রাপ্ত অফিসারের নাম"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">ছবি আপলোড করুন</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full"
              disabled={uploading}
            />
            {uploading && <p className="text-blue-500 text-sm mt-1">ছবি আপলোড হচ্ছে...</p>}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-48 h-32 object-cover rounded shadow-md"
              />
            )}
            {form.image && (
              <p className="text-xs text-gray-500 mt-1 break-all">আপলোডেড URL: <a className="underline" href={form.image} target="_blank" rel="noreferrer">{form.image}</a></p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">সেবাসমূহ</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allServices.map(service => (
              <label key={service} className="flex items-center gap-2 text-sm p-2 rounded border hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  checked={form.services.includes(service)}
                  onChange={handleInputChange}
                  className="checkbox checkbox-sm"
                />
                {service}
              </label>
            ))}
          </div>
          {form.services.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.services.map(s => (
                <span key={s} className="badge badge-outline">{s}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost"
            disabled={uploading}
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="btn btn-success text-white"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default PoliceStationFormPage;
