import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaArrowLeft, FaShare, FaHeart, FaWhatsapp, FaGlobe, FaUser, FaStar } from 'react-icons/fa';
import useSecureAxios from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ContentCreatorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useSecureAxios();
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Fetch creator details
  const { data: creator, isLoading, error } = useQuery({
    queryKey: ['content-creator', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/content-creators/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  // Fetch related creators (same specialty)
  const { data: relatedCreators = [] } = useQuery({
    queryKey: ['related-creators', creator?.specialty],
    queryFn: async () => {
      const res = await axiosSecure.get(`/content-creators?specialty=${creator?.specialty}&limit=4`);
      return res.data.filter(c => c._id !== id);
    },
    enabled: !!creator?.specialty
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the contact form data to your backend
    Swal.fire({
      icon: 'success',
      title: 'বার্তা পাঠানো হয়েছে!',
      text: 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।',
      timer: 3000,
      showConfirmButton: false
    });
    setShowContactForm(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${creator?.name} - কনটেন্ট ক্রিয়েটর`,
        text: `${creator?.name} এর প্রোফাইল দেখুন`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: 'success',
        title: 'লিংক কপি হয়েছে!',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const handleWhatsApp = () => {
    const message = `হ্যালো ${creator?.name}! আমি আপনার কাজ দেখে আগ্রহী।`;
    const whatsappUrl = `https://wa.me/${creator?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">কনটেন্ট ক্রিয়েটর পাওয়া যায়নি</h3>
          <p className="text-gray-500 mb-4">অনুগ্রহ করে আবার চেষ্টা করুন</p>
          <button
            onClick={() => navigate('/content-creators')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            কনটেন্ট ক্রিয়েটর তালিকায় ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/content-creators"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2" />
              কনটেন্ট ক্রিয়েটর তালিকায় ফিরে যান
            </Link>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <FaHeart size={20} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                <FaShare size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Creator Info */}
          <div className="lg:col-span-2">
            {/* Creator Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <img
                    src={creator.image}
                    alt={creator.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <FaUser className="text-white text-xs" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{creator.name}</h1>
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {creator.specialty}
                    </span>
                    {creator.experience && (
                      <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        <FaClock className="mr-1" />
                        {creator.experience}
                      </span>
                    )}
                  </div>
                  
                  {creator.location && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <FaMapMarkerAlt className="mr-2" />
                      {creator.location}
                    </div>
                  )}

                  {/* Social Media Links */}
                  <div className="flex space-x-3">
                    {creator.facebook && (
                      <a
                        href={creator.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                        title="Facebook"
                      >
                        <FaFacebook size={18} />
                      </a>
                    )}
                    {creator.instagram && (
                      <a
                        href={creator.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-colors duration-200"
                        title="Instagram"
                      >
                        <FaInstagram size={18} />
                      </a>
                    )}
                    {creator.youtube && (
                      <a
                        href={creator.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                        title="YouTube"
                      >
                        <FaYoutube size={18} />
                      </a>
                    )}
                    {creator.tiktok && (
                      <a
                        href={creator.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
                        title="TikTok"
                      >
                        <FaTiktok size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

                         {/* About Section */}
             {creator.description && (
               <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">নিজের সম্পর্কে</h2>
                 <p className="text-gray-700 leading-relaxed">{creator.description}</p>
               </div>
             )}

             {/* Additional Information */}
             {(creator.experience || creator.location || creator.portfolio) && (
               <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6">অতিরিক্ত তথ্য</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {creator.experience && (
                     <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                         <FaClock className="text-blue-600" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-gray-800">অভিজ্ঞতা</h3>
                         <p className="text-gray-600">{creator.experience}</p>
                       </div>
                     </div>
                   )}
                   
                   {creator.location && (
                     <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                         <FaMapMarkerAlt className="text-green-600" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-gray-800">অবস্থান</h3>
                         <p className="text-gray-600">{creator.location}</p>
                       </div>
                     </div>
                   )}
                   
                   {creator.portfolio && (
                     <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                         <FaGlobe className="text-purple-600" />
                       </div>
                       <div>
                         <h3 className="font-semibold text-gray-800">পোর্টফোলিও</h3>
                         <a
                           href={creator.portfolio}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                         >
                           পোর্টফোলিও দেখুন
                         </a>
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             )}

             {/* Social Media Links Section */}
             {(creator.facebook || creator.instagram || creator.youtube || creator.tiktok) && (
               <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6">সোশ্যাল মিডিয়া লিংক</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {creator.facebook && (
                     <a
                       href={creator.facebook}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                     >
                       <FaFacebook className="text-blue-600 mr-3 text-xl" />
                       <div>
                         <h3 className="font-semibold text-gray-800">Facebook</h3>
                         <p className="text-sm text-gray-600">প্রোফাইল দেখুন</p>
                       </div>
                     </a>
                   )}
                   
                   {creator.instagram && (
                     <a
                       href={creator.instagram}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-200"
                     >
                       <FaInstagram className="text-pink-500 mr-3 text-xl" />
                       <div>
                         <h3 className="font-semibold text-gray-800">Instagram</h3>
                         <p className="text-sm text-gray-600">প্রোফাইল দেখুন</p>
                       </div>
                     </a>
                   )}
                   
                   {creator.youtube && (
                     <a
                       href={creator.youtube}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                     >
                       <FaYoutube className="text-red-600 mr-3 text-xl" />
                       <div>
                         <h3 className="font-semibold text-gray-800">YouTube</h3>
                         <p className="text-sm text-gray-600">চ্যানেল দেখুন</p>
                       </div>
                     </a>
                   )}
                   
                   {creator.tiktok && (
                     <a
                       href={creator.tiktok}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                     >
                       <FaTiktok className="text-black mr-3 text-xl" />
                       <div>
                         <h3 className="font-semibold text-gray-800">TikTok</h3>
                         <p className="text-sm text-gray-600">প্রোফাইল দেখুন</p>
                       </div>
                     </a>
                   )}
                 </div>
               </div>
             )}

            

            {/* Related Creators */}
            {relatedCreators.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">সম্পর্কিত কনটেন্ট ক্রিয়েটর</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedCreators.slice(0, 4).map((relatedCreator) => (
                    <Link
                      key={relatedCreator._id}
                      to={`/content-creator/${relatedCreator._id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={relatedCreator.image}
                          alt={relatedCreator.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">{relatedCreator.name}</h3>
                          <p className="text-sm text-blue-600">{relatedCreator.specialty}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">যোগাযোগ করুন</h3>
              
              <div className="space-y-4">
                {creator.email && (
                  <a
                    href={`mailto:${creator.email}`}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <FaEnvelope className="text-blue-600 mr-3" />
                    <span className="text-gray-700">{creator.email}</span>
                  </a>
                )}
                
                {creator.phone && (
                  <a
                    href={`tel:${creator.phone}`}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <FaPhone className="text-blue-600 mr-3" />
                    <span className="text-gray-700">{creator.phone}</span>
                  </a>
                )}

                                 {creator.email && (
                   <a
                     href={`mailto:${creator.email}`}
                     className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center"
                   >
                     <FaEnvelope className="mr-2" />
                     ইমেইল করুন
                   </a>
                 )}

                 {creator.youtube && (
                   <a
                     href={creator.youtube}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center"
                   >
                     <FaYoutube className="mr-2" />
                     YouTube চ্যানেল
                   </a>
                 )}

                 {creator.tiktok && (
                   <a
                     href={creator.tiktok}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium flex items-center justify-center"
                   >
                     <FaTiktok className="mr-2" />
                     TikTok প্রোফাইল
                   </a>
                 )}
              </div>
            </div>

            

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">দ্রুত কর্ম</h3>
              <div className="space-y-3">
                <Link
                  to="/add-content-creator"
                  className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-center font-medium"
                >
                  কনটেন্ট ক্রিয়েটর হন
                </Link>
                <Link
                  to="/content-creators"
                  className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center font-medium"
                >
                  সব ক্রিয়েটর দেখুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">বার্তা পাঠান</h3>
              <p className="text-gray-600 mt-1">{creator.name} কে বার্তা পাঠান</p>
            </div>

            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">আপনার নাম</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ইমেইল</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ফোন নম্বর</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">বার্তা</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="আপনার বার্তা লিখুন..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  পাঠান
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCreatorDetails; 