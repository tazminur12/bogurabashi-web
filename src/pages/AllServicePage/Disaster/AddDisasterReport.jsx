import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import imageCompression from 'browser-image-compression';

const AddDisasterReport = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'corruption',
    priority: 'medium',
    evidence: '',
    contactInfo: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const addMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosSecure.post('/disaster-reports', payload);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire('সফল!', 'রিপোর্ট সফলভাবে যোগ হয়েছে!', 'success');
      navigate('/disaster-reports');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error.message || 'রিপোর্ট যোগ করতে সমস্যা হয়েছে!';
      Swal.fire('ত্রুটি', errorMessage, 'error');
    }
  });

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = [];
    const previews = [];
    
    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        Swal.fire('ত্রুটি', 'শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে', 'error');
        continue;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
      if (validFiles.length >= 5) break;
    }
    
    setSelectedFiles(validFiles);
    setPreviewUrls(previews);
  };

  const uploadImagesToImgBB = async () => {
    if (selectedFiles.length === 0) return [];
    
    setIsUploading(true);
    const uploadedUrls = [];
    
    try {
      for (const file of selectedFiles) {
        // Compress image before upload
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true
        });
        
        const formData = new FormData();
        formData.append('image', compressedFile);
        
        // Upload to ImgBB
        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
        if (!imgbbApiKey) {
          throw new Error('ImgBB API key not found. Please add VITE_IMGBB_API_KEY to your .env file');
        }
        
        console.log('Uploading to ImgBB with key:', imgbbApiKey.substring(0, 10) + '...');
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`ImgBB upload failed: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('ImgBB response:', result);
        
        if (result.success) {
          uploadedUrls.push({
            url: result.data.url,
            delete_url: result.data.delete_url,
            title: result.data.title
          });
          console.log('Image uploaded successfully:', result.data.url);
        } else {
          throw new Error(`ImgBB upload failed: ${result.error?.message || 'Unknown error'}`);
        }
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Image upload error:', error);
      Swal.fire('ত্রুটি', `ছবি আপলোড করতে সমস্যা হয়েছে: ${error.message}`, 'error');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      Swal.fire('ত্রুটি', 'শিরোনাম এবং বিবরণ প্রয়োজন', 'error');
      return;
    }

    try {
      // Upload images first
      const imageUrls = await uploadImagesToImgBB();
      
      // Prepare report data
      const reportData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        priority: formData.priority,
        evidence: formData.evidence,
        contactInfo: formData.contactInfo,
        status: 'pending',
        createdAt: new Date().toISOString(),
        images: imageUrls.map((img) => (typeof img === 'string' ? img : img.url))
      };

      addMutation.mutate(reportData);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">নতুন রিপোর্ট যোগ করুন</h1>
          <Link to="/disaster-reports" className="text-red-600 hover:text-red-700">সব রিপোর্ট</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">শিরোনাম *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="রিপোর্টের শিরোনাম লিখুন"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">বিবরণ *</label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="বিস্তারিত বিবরণ লিখুন"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">অবস্থান</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="ঘটনার অবস্থান"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">বিভাগ *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="corruption">দুর্নীতি</option>
                <option value="disaster">দুর্যোগ</option>
                <option value="injustice">অন্যায়</option>
                <option value="other">অন্যান্য</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">অগ্রাধিকার *</label>
              <select
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                <option value="low">নিম্ন</option>
                <option value="medium">মাঝারি</option>
                <option value="high">উচ্চ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">প্রমাণ/সাক্ষ্য</label>
            <textarea
              rows="3"
              value={formData.evidence}
              onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="প্রমাণ বা সাক্ষ্যের বিবরণ (ঐচ্ছিক)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ছবি আপলোড (সর্বোচ্চ ৫টি, প্রতি ছবি ৫MB)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            {previewUrls.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                {previewUrls.map((src, idx) => (
                  <div key={idx} className="relative w-full h-24 rounded-md overflow-hidden border">
                    <img src={src} alt={`attachment-${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">যোগাযোগের তথ্য</label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="ফোন নম্বর বা ইমেইল (ঐচ্ছিক)"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Link to="/disaster-reports" className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">বাতিল</Link>
            <button
              type="submit"
              disabled={addMutation.isPending || isUploading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'ছবি আপলোড হচ্ছে...' : 
               addMutation.isPending ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDisasterReport;


