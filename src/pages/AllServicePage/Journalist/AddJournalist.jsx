import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const AddJournalist = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    mediaType: 'newspaper',
    mediaName: '',
    mediaWebsite: '',
    beat: '',
    district: '',
    image: ''
  });

  const mediaTypes = [
    { value: 'newspaper', label: 'সংবাদপত্র' },
    { value: 'tv', label: 'টেলিভিশন' },
    { value: 'online', label: 'অনলাইন পোর্টাল' },
    { value: 'radio', label: 'রেডিও' },
    { value: 'magazine', label: 'ম্যাগাজিন' }
  ];

  const beats = ['রাজনীতি', 'অপরাধ', 'খেলা', 'বিনোদন', 'অর্থনীতি', 'আন্তর্জাতিক', 'স্বাস্থ্য', 'শিক্ষা', 'প্রযুক্তি'];

  const districts = ['চাঁপাইনবাবগঞ্জ',
    'নওগাঁ',
    'রাজশাহী',
    'সিরাজগঞ্জ',
    'পাবনা',
    'বগুড়া',
    'জয়পুরহাট'];

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'নাম প্রয়োজন';
    if (!formData.email.trim()) {
      newErrors.email = 'ইমেইল প্রয়োজন';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'সঠিক ইমেইল দিন';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'ফোন নম্বর প্রয়োজন';
    } else if (!/^(?:\+88|01)?\d{11}$/.test(formData.phone)) {
      newErrors.phone = 'সঠিক ফোন নম্বর দিন';
    }
    if (!formData.designation.trim()) newErrors.designation = 'পদবি প্রয়োজন';
    if (!formData.mediaName.trim()) newErrors.mediaName = 'মিডিয়ার নাম প্রয়োজন';
    if (!formData.beat) newErrors.beat = 'বিট নির্বাচন করুন';
    if (!formData.district) newErrors.district = 'জেলা নির্বাচন করুন';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file) => {
    if (!file) return '';
    setUploading(true);
    try {
      const imgData = new FormData();
      imgData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: imgData
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error('Image upload failed');
      }
      return data.data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      Swal.fire('Error', 'ছবি আপলোড করতে ব্যর্থ', 'error');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await handleImageUpload(file);
      if (url) {
        setFormData(prev => ({ ...prev, image: url }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (uploading) {
      Swal.fire('অনুগ্রহ করে অপেক্ষা করুন', 'ছবি আপলোড শেষ না হওয়া পর্যন্ত অপেক্ষা করুন', 'info');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.post('/journalists', formData);
      if (res.data.insertedId) {
        Swal.fire('সফল!', 'সাংবাদিক সফলভাবে যোগ করা হয়েছে', 'success');
        navigate('/dashboard/journalists');
      } else {
        Swal.fire('ত্রুটি!', 'সার্ভার থেকে সঠিক রেসপন্স পাওয়া যায়নি', 'error');
      }
    } catch (err) {
      Swal.fire('ত্রুটি!', err.response?.data?.message || 'যোগ করতে সমস্যা হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-blue-600 hover:underline"
      >
        ← ফিরে যান
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">নতুন সাংবাদিক যোগ করুন</h2>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* নাম, ইমেইল, ফোন, পদবি */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">নাম *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">ইমেইল *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">ফোন *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">পদবি *</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.designation ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.designation && <p className="text-red-600 text-sm mt-1">{errors.designation}</p>}
          </div>
        </div>

        {/* সংস্থা, মিডিয়ার ধরন, মিডিয়ার নাম, ওয়েবসাইট */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">মিডিয়ার ধরন *</label>
            <select
              name="mediaType"
              value={formData.mediaType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              {mediaTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">মিডিয়ার নাম *</label>
            <input
              type="text"
              name="mediaName"
              value={formData.mediaName}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.mediaName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.mediaName && <p className="text-red-600 text-sm mt-1">{errors.mediaName}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">ওয়েবসাইট</label>
            <input
              type="url"
              name="mediaWebsite"
              value={formData.mediaWebsite}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* বিট, জেলা */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">বিট *</label>
            <select
              name="beat"
              value={formData.beat}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.beat ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">নির্বাচন করুন</option>
              {beats.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {errors.beat && <p className="text-red-600 text-sm mt-1">{errors.beat}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">জেলা *</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">নির্বাচন করুন</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district}</p>}
          </div>
        </div>

        {/* ছবি আপলোড */}
        <div>
          <label className="block mb-1 font-medium">ছবি (ঐচ্ছিক)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && <p className="text-blue-600 text-sm mt-1">ছবি আপলোড হচ্ছে...</p>}
          {formData.image && !uploading && (
            <img src={formData.image} alt="uploaded" className="mt-3 w-32 rounded shadow" />
          )}
        </div>

        {/* সাবমিট বাটন */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'সাংবাদিক যোগ করুন'}
        </button>
      </form>
    </div>
  );
};

export default AddJournalist;
