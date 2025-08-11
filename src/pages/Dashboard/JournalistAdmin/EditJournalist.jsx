import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const EditJournalist = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    organization: '',
    mediaType: 'newspaper',
    mediaName: '',
    mediaWebsite: '',
    beat: '',
    district: '',
    image: '',
  });

  const [loading, setLoading] = useState(true);

  // Fetch existing journalist
  useEffect(() => {
    const fetchJournalist = async () => {
      try {
        const response = await axiosSecure.get(`/journalists/${id}`);
        setFormData(response.data);
      } catch (error) {
        Swal.fire('ত্রুটি', 'তথ্য লোড করতে ব্যর্থ', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchJournalist();
  }, [id, axiosSecure]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.put(`/journalists/${id}`, formData);
      if (res.data.message) {
        Swal.fire('সফল', 'তথ্য সফলভাবে আপডেট হয়েছে', 'success');
        navigate('/dashboard/journalists');
      }
    } catch (err) {
      Swal.fire('ত্রুটি', 'আপডেট করতে সমস্যা হয়েছে', 'error');
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-blue-600">তথ্য লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">সাংবাদিক সম্পাদনা করুন</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input name="name" value={formData.name} onChange={handleChange} className="input" placeholder="নাম" required />
          <input name="email" value={formData.email} onChange={handleChange} className="input" placeholder="ইমেইল" required />
          <input name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="ফোন নম্বর" required />
          <input name="designation" value={formData.designation} onChange={handleChange} className="input" placeholder="পদবি" />
          <input name="organization" value={formData.organization} onChange={handleChange} className="input" placeholder="সংস্থা" />
          <input name="mediaName" value={formData.mediaName} onChange={handleChange} className="input" placeholder="মিডিয়ার নাম" />
          <input name="mediaWebsite" value={formData.mediaWebsite} onChange={handleChange} className="input" placeholder="মিডিয়া ওয়েবসাইট" />
          <input name="image" value={formData.image} onChange={handleChange} className="input" placeholder="ইমেজ URL" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <select name="mediaType" value={formData.mediaType} onChange={handleChange} className="input">
            <option value="newspaper">সংবাদপত্র</option>
            <option value="tv">টেলিভিশন</option>
            <option value="online">অনলাইন</option>
            <option value="radio">রেডিও</option>
            <option value="magazine">ম্যাগাজিন</option>
          </select>

          <select name="beat" value={formData.beat} onChange={handleChange} className="input">
            <option value="">বিট নির্বাচন করুন</option>
            <option value="রাজনীতি">রাজনীতি</option>
            <option value="অপরাধ">অপরাধ</option>
            <option value="খেলা">খেলা</option>
            <option value="বিনোদন">বিনোদন</option>
            <option value="অর্থনীতি">অর্থনীতি</option>
            <option value="আন্তর্জাতিক">আন্তর্জাতিক</option>
            <option value="স্বাস্থ্য">স্বাস্থ্য</option>
            <option value="শিক্ষা">শিক্ষা</option>
            <option value="প্রযুক্তি">প্রযুক্তি</option>
          </select>

          <select name="district" value={formData.district} onChange={handleChange} className="input">
            <option value="">জেলা নির্বাচন করুন</option>
            <option value="ঢাকা">ঢাকা</option>
            <option value="চট্টগ্রাম">চট্টগ্রাম</option>
            <option value="রাজশাহী">রাজশাহী</option>
            <option value="খুলনা">খুলনা</option>
            <option value="বরিশাল">বরিশাল</option>
            <option value="সিলেট">সিলেট</option>
            <option value="রংপুর">রংপুর</option>
            <option value="ময়মনসিংহ">ময়মনসিংহ</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          তথ্য আপডেট করুন
        </button>
      </form>
    </div>
  );
};

export default EditJournalist;
