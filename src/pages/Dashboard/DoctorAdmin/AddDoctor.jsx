import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiArrowLeft } from 'react-icons/fi';

const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

const AddDoctor = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    qualification: '',
    hospital: '',
    chamber: '',
    contact: '',
    availability: '',
    image: '',
    fee: '',
    experience: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async () => {
    if (!imageFile) return '';

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        return data.data.display_url;
      } else {
        console.error('Image Upload failed:', data);
        return '';
      }
    } catch (error) {
      console.error('Image Upload Error:', error);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const imageUrl = await handleImageUpload();

    const doctorData = {
      ...formData,
      image: imageUrl,
      fee: parseInt(formData.fee, 10) || 0
    };

    try {
      const res = await axiosSecure.post('/api/doctors', doctorData);

      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire({
          icon: 'success',
          title: 'সফলভাবে যুক্ত হয়েছে!',
          text: `${formData.name} কে ডাক্তার তালিকায় যোগ করা হয়েছে।`,
          confirmButtonColor: '#14b8a6'
        });

        setFormData({
          name: '',
          specialty: '',
          qualification: '',
          hospital: '',
          chamber: '',
          contact: '',
          availability: '',
          image: '',
          fee: '',
          experience: ''
        });
        setImageFile(null);
      } else {
        Swal.fire('ত্রুটি!', 'ডাক্তার যুক্ত করতে ব্যর্থ হয়েছি।', 'error');
      }
    } catch (err) {
      console.error('Doctor Add Error:', err);
      Swal.fire('ত্রুটি!', 'ডাক্তার যুক্ত করতে ব্যর্থ হয়েছি।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-teal-600 hover:text-teal-800 transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" /> ফিরে যান
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">নতুন ডাক্তার যুক্ত করুন</h2>
            <p className="mt-2 text-gray-600">ডাক্তারের তথ্য পূরণ করুন এবং সাবমিট করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  নাম <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="ডাক্তারের নাম"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                  বিশেষতা <span className="text-red-500">*</span>
                </label>
                <input
                  id="specialty"
                  name="specialty"
                  placeholder="বিশেষতা"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                  যোগ্যতা
                </label>
                <input
                  id="qualification"
                  name="qualification"
                  placeholder="যোগ্যতা"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-1">
                  হাসপাতাল
                </label>
                <input
                  id="hospital"
                  name="hospital"
                  placeholder="হাসপাতাল"
                  value={formData.hospital}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="chamber" className="block text-sm font-medium text-gray-700 mb-1">
                  চেম্বার
                </label>
                <input
                  id="chamber"
                  name="chamber"
                  placeholder="চেম্বার"
                  value={formData.chamber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  যোগাযোগ
                </label>
                <input
                  id="contact"
                  name="contact"
                  placeholder="যোগাযোগ"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                  অভ্যর্থনা সময়
                </label>
                <input
                  id="availability"
                  name="availability"
                  placeholder="অভ্যর্থনা সময়"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  অভিজ্ঞতা
                </label>
                <input
                  id="experience"
                  name="experience"
                  placeholder="অভিজ্ঞতা (যেমনঃ ১৫ বছর)"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-1">
                  ফি
                </label>
                <input
                  id="fee"
                  name="fee"
                  placeholder="ফি (যেমনঃ ৫০০)"
                  type="number"
                  value={formData.fee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ডাক্তারের ছবি (ঐচ্ছিক)
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-teal-50 file:text-teal-700
                      hover:file:bg-teal-100"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'সাবমিট করা হচ্ছে...' : 'সাবমিট করুন'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;