
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure'; // adjust path

const AddLawyer = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: '',
    chamberAddress: '',
    experience: '',
    consultationFee: '',
    bio: '',
    image: null
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const lawyerCategories = [
    'ফৌজদারি আইন',
    'পারিবারিক আইন',
    'জমিজমা আইন',
    'শ্রম আইন',
    'ব্যবসায়িক আইন',
    'সাইবার আইন',
    'সংবিধানিক আইন',
    'অন্যান্য'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'নাম প্রয়োজন';
    if (!formData.phone.trim()) newErrors.phone = 'ফোন নম্বর প্রয়োজন';
    else if (!/^01[3-9]\d{8}$/.test(formData.phone)) newErrors.phone = 'সঠিক মোবাইল নম্বর লিখুন';
    if (!formData.category) newErrors.category = 'বিশেষায়িত ক্ষেত্র নির্বাচন করুন';
    if (!formData.chamberAddress) newErrors.chamberAddress = 'চেম্বার ঠিকানা প্রয়োজন';
    if (!formData.experience) newErrors.experience = 'অভিজ্ঞতা প্রয়োজন';
    if (!formData.consultationFee) newErrors.consultationFee = 'কনসাল্টেশন ফি প্রয়োজন';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('ফর্মে কিছু ত্রুটি আছে', { position: 'top-center' });
      return;
    }

    try {
      setUploading(true);

      let imageUrl = '';
      if (formData.image) {
        const imgData = new FormData();
        imgData.append('image', formData.image);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: 'POST',
          body: imgData
        });

        const imgResponse = await res.json();
        if (imgResponse.success) {
          imageUrl = imgResponse.data.url;
        } else {
          throw new Error('ইমেজ আপলোড ব্যর্থ হয়েছে');
        }
      }

      const lawyerData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        category: formData.category,
        chamber: formData.chamberAddress,
        experience: formData.experience,
        consultationFee: formData.consultationFee,
        bio: formData.bio,
        image: imageUrl,
        approved: false,
        createdAt: new Date()
      };

      const result = await axiosSecure.post('/lawyers', lawyerData);

      if (result.data.insertedId) {
        await Swal.fire({
          title: 'সফল!',
          text: 'আইনজীবী সফলভাবে নিবন্ধিত হয়েছে',
          icon: 'success',
          confirmButtonText: 'ঠিক আছে'
        });

        // Redirect to lawyer list after success alert
        navigate('/lawyers');
      } else {
        throw new Error('সাবমিশন ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('ত্রুটি', error.message || 'কিছু ভুল হয়েছে', 'error');
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/lawyers')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            পিছনে যান
          </button>

          <h1 className="text-3xl font-bold text-blue-800 mb-2">আইনজীবী হিসেবে নিবন্ধন করুন</h1>
          <p className="text-gray-600">আপনার তথ্য প্রদান করে আইনজীবী হিসেবে যোগ দিন</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="০১XXXXXXXXX"
                  className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  ইমেইল (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="আপনার ইমেইল লিখুন"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Category Field */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  বিশেষায়িত ক্ষেত্র <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className={`w-full p-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">বিশেষায়িত ক্ষেত্র নির্বাচন করুন</option>
                  {lawyerCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              {/* Experience Field */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  অভিজ্ঞতা (বছর) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  min="0"
                  placeholder="অভিজ্ঞতার বছর সংখ্যা"
                  className={`w-full p-3 border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={formData.experience}
                  onChange={handleChange}
                />
                {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
              </div>

              {/* Consultation Fee Field */}
              <div>
                <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
                  কনসাল্টেশন ফি <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="consultationFee"
                  name="consultationFee"
                  min="0"
                  placeholder="টাকার পরিমাণ"
                  className={`w-full p-3 border ${errors.consultationFee ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={formData.consultationFee}
                  onChange={handleChange}
                />
                {errors.consultationFee && <p className="mt-1 text-sm text-red-600">{errors.consultationFee}</p>}
              </div>

              {/* Chamber Address Field */}
              <div className="md:col-span-2">
                <label htmlFor="chamberAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  চেম্বার ঠিকানা <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="chamberAddress"
                  name="chamberAddress"
                  rows="3"
                  placeholder="আপনার চেম্বারের সম্পূর্ণ ঠিকানা লিখুন"
                  className={`w-full p-3 border ${errors.chamberAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={formData.chamberAddress}
                  onChange={handleChange}
                ></textarea>
                {errors.chamberAddress && <p className="mt-1 text-sm text-red-600">{errors.chamberAddress}</p>}
              </div>

              {/* Bio Field */}
              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  সংক্ষিপ্ত পরিচয় (ঐচ্ছিক)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  placeholder="আপনার পেশাগত পরিচয় ও বিশেষজ্ঞতা সম্পর্কে লিখুন"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bio}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  আপনার ছবি আপলোড করুন (ঐচ্ছিক)
                </label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    {formData.image ? (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </span>
                  <label htmlFor="image-upload" className="ml-5 cursor-pointer">
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      ছবি নির্বাচন করুন
                    </span>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300"
              >
                নিবন্ধন সম্পন্ন করুন
              </button>
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>আপনার তথ্য যাচাই করার পর আমাদের টিম আপনার প্রোফাইল একটিভ করবে</p>
          <p className="mt-1">যেকোনো জিজ্ঞাসার জন্য যোগাযোগ করুন: legal@bogura.com</p>
        </div>
      </div>
    </div>
  );
};

export default AddLawyer;