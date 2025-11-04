import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

function CandidateDetails() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: candidate, isLoading, error } = useQuery({
    queryKey: ['candidate', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/candidates/${id}`);
      if (res?.data && res.data._id) {
        const c = res.data;
        return {
          id: c._id,
          name: c.name,
          party: c.isIndependent ? 'স্বতন্ত্র' : (c.party || 'দল নেই'),
          area: c.constituency || c.area,
          photo: c.imageUrl || c.photo,
          manifesto: c.manifesto || c.manifestoSummary,
          symbol: c.symbol,
          symbolImageUrl: c.symbolImageUrl,
          seatNumber: c.seatNumber,
          isIndependent: c.isIndependent,
          bio: c.bio,
          education: c.education,
          experience: c.experience,
          achievements: c.achievements,
          electionExpense: c.electionExpense,
          status: c.status,
          contacts: {
            email: c.email,
            phone: c.phone,
            fb: c.facebookLink || c.facebook || c.socialLink,
            website: c.website,
            address: c.address,
          },
        };
      }
      return null;
    },
  });


  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">প্রার্থী বিস্তারিত তথ্য</h1>
        </div>
        <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-indigo-200 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mb-6"></div>
              <p className="text-gray-600 text-xl font-semibold">প্রার্থী তথ্য লোড হচ্ছে...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/election/candidates" className="text-white hover:text-indigo-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl lg:text-4xl font-bold">প্রার্থী বিস্তারিত তথ্য</h1>
          </div>
        </div>
        <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-red-200 rounded-2xl shadow-xl p-8">
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-red-600 font-bold text-2xl mb-3">ত্রুটি</div>
            <div className="text-red-700 text-lg mb-6">
              {error?.response?.data?.message || error?.message || 'প্রার্থী পাওয়া যায়নি'}
            </div>
            <Link 
              to="/election/candidates" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              প্রার্থীদের তালিকায় ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Link to="/election/candidates" className="text-white hover:text-indigo-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-3xl lg:text-4xl font-bold">প্রার্থী বিস্তারিত তথ্য</h1>
            </div>
            <p className="text-indigo-100 text-lg">{candidate.name}</p>
          </div>
          {candidate.status && (
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              candidate.status === 'Active' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-400 text-white'
            }`}>
              {candidate.status === 'Active' ? '✅ সক্রিয়' : '⚪ নিষ্ক্রিয়'}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-indigo-200 rounded-2xl shadow-xl p-8 mb-8">
        {/* Basic Information Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-blue-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">1</div>
            <h2 className="text-2xl font-bold text-gray-800">মৌলিক তথ্য</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Image */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative">
                <img
                  src={candidate.photo || 'https://via.placeholder.com/280x280?text=Profile'}
                  alt={candidate.name}
                  className="w-64 h-64 rounded-full object-cover border-4 border-indigo-200 shadow-2xl"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/280x280?text=Profile'; }}
                />
                {candidate.isIndependent && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    স্বতন্ত্র
                  </div>
                )}
              </div>
              
              {/* Symbol Image */}
              {candidate.symbolImageUrl && (
                <div className="mt-6 text-center">
                  <div className="text-sm text-gray-600 mb-2 font-medium">প্রতীক ছবি</div>
                  <img
                    src={candidate.symbolImageUrl}
                    alt={candidate.symbol || 'Symbol'}
                    className="w-24 h-24 mx-auto object-contain rounded-lg border-2 border-indigo-200 shadow-md"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">{candidate.name}</h3>
                
                {/* Party/Independent Badge */}
                {candidate.party && (
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-5 py-2.5 rounded-full text-base font-semibold ${
                      candidate.isIndependent 
                        ? 'bg-orange-100 text-orange-800 border-2 border-orange-300' 
                        : 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                    }`}>
                      {candidate.party}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidate.area && (
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <div className="text-blue-600 text-xs font-medium mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      নির্বাচনী এলাকা
                    </div>
                    <div className="text-gray-800 font-bold text-lg">{candidate.area}</div>
                  </div>
                )}

                {candidate.symbol && (
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="text-green-600 text-xs font-medium mb-1">প্রতীক</div>
                    <div className="text-gray-800 font-bold text-lg">{candidate.symbol}</div>
                  </div>
                )}

                {candidate.seatNumber && (
                  <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                    <div className="text-purple-600 text-xs font-medium mb-1">সিট নম্বর</div>
                    <div className="text-gray-800 font-bold text-lg">{candidate.seatNumber}</div>
                  </div>
                )}

                {candidate.contacts?.phone && (
                  <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
                    <div className="text-pink-600 text-xs font-medium mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      মোবাইল
                    </div>
                    <div className="text-gray-800 font-bold text-lg">{candidate.contacts.phone}</div>
                  </div>
                )}

                {candidate.contacts?.email && (
                  <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                    <div className="text-yellow-600 text-xs font-medium mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      ইমেইল
                    </div>
                    <div className="text-gray-800 font-semibold break-all">{candidate.contacts.email}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Section */}
        {(candidate.bio || candidate.education || candidate.experience || candidate.achievements) && (
          <div className="mb-8 pt-8 border-t-2 border-gray-200">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-purple-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-lg">2</div>
              <h2 className="text-2xl font-bold text-gray-800">বিস্তারিত তথ্য</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidate.bio && (
                <div className="bg-indigo-50 rounded-lg p-5 border-2 border-indigo-200">
                  <div className="font-semibold text-indigo-800 mb-3 flex items-center gap-2 text-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    সংক্ষিপ্ত জীবনী
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.bio}</div>
                </div>
              )}

              {candidate.education && (
                <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
                  <div className="font-semibold text-blue-800 mb-3 flex items-center gap-2 text-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    শিক্ষাগত যোগ্যতা
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.education}</div>
                </div>
              )}

              {candidate.experience && (
                <div className="bg-green-50 rounded-lg p-5 border-2 border-green-200">
                  <div className="font-semibold text-green-800 mb-3 flex items-center gap-2 text-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    রাজনৈতিক অভিজ্ঞতা / পেশা
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.experience}</div>
                </div>
              )}

              {candidate.achievements && (
                <div className="bg-orange-50 rounded-lg p-5 border-2 border-orange-200">
                  <div className="font-semibold text-orange-800 mb-3 flex items-center gap-2 text-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    পূর্বের অর্জন বা দায়িত্ব
                  </div>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.achievements}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manifesto Section */}
        {candidate.manifesto && (
          <div className="mb-8 pt-8 border-t-2 border-gray-200">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200">
              <div className="font-semibold text-indigo-800 mb-4 flex items-center gap-2 text-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                নির্বাচনী অঙ্গীকার / প্রতিশ্রুতি
              </div>
              <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">{candidate.manifesto}</div>
            </div>
          </div>
        )}

        {/* Election Expense */}
        {candidate.electionExpense && (
          <div className="mb-8 pt-8 border-t-2 border-gray-200">
            <div className="bg-yellow-50 rounded-lg p-5 border-2 border-yellow-200">
              <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2 text-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                নির্বাচনী খরচ ঘোষণা
              </div>
              <div className="text-gray-800 font-bold text-2xl">{parseInt(candidate.electionExpense).toLocaleString('bn-BD')} টাকা</div>
            </div>
          </div>
        )}

        {/* Social Media / Contact Section */}
        <div className="pt-8 border-t-2 border-gray-200">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-pink-200">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-bold text-lg">3</div>
            <h2 className="text-2xl font-bold text-gray-800">সোশ্যাল মিডিয়া / যোগাযোগ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidate.contacts?.fb && (
              <a 
                href={candidate.contacts.fb} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-blue-50 rounded-lg p-5 border-2 border-blue-200 hover:bg-blue-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-blue-600 text-sm font-medium mb-1">ফেসবুক</div>
                    <div className="text-gray-800 font-semibold text-sm break-all">পেজ দেখুন →</div>
                  </div>
                </div>
              </a>
            )}

            {candidate.contacts?.website && (
              <a 
                href={candidate.contacts.website} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-indigo-50 rounded-lg p-5 border-2 border-indigo-200 hover:bg-indigo-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-indigo-600 text-sm font-medium mb-1">ওয়েবসাইট</div>
                    <div className="text-gray-800 font-semibold text-sm break-all">ওয়েবসাইট দেখুন →</div>
                  </div>
                </div>
              </a>
            )}

            {candidate.contacts?.address && (
              <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200 md:col-span-2">
                <div className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  যোগাযোগের ঠিকানা
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.contacts.address}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Opinion box (client-side only placeholder) */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-indigo-200 rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-indigo-200">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">💬</div>
          <h2 className="text-2xl font-bold text-gray-800">আপনার মতামত</h2>
        </div>
        <div className="space-y-4">
          <textarea 
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none" 
            placeholder="ভদ্রভাবে আপনার মতামত লিখুন (ডেমো)"
          ></textarea>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
            প্রেরণ করুন
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetails;


