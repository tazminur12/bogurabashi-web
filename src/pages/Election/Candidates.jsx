import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import usePageTitle from '../../hooks/usePageTitle';

function CandidateCard({ candidate, onView }) {
  const partyDisplay = candidate.isIndependent ? 'স্বতন্ত্র' : (candidate.party || 'দল নেই');
  const candidateId = candidate._id || candidate.id;

  return (
    <div className="group relative">
      {/* Main Card - Clean Minimalist Design */}
      <div className="relative bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-indigo-200 transform group-hover:-translate-y-2">
        {/* Status Badge - Top Right */}
        {candidate.status === 'Active' && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              সক্রিয়
            </div>
          </div>
        )}

        {/* Profile Image Section - Elevated on Pedestal */}
        <div className="bg-gradient-to-b from-gray-50 to-white p-8 pt-12 flex items-center justify-center">
          <div className="relative">
            {/* White Pedestal Base */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-3 bg-white rounded-full shadow-md"></div>
            {/* Image */}
            <img 
              src={candidate.imageUrl || 'https://via.placeholder.com/180x180?text=Profile'} 
              alt={candidate.name} 
              className="h-44 w-44 object-cover rounded-lg border-2 border-gray-200 shadow-2xl relative z-10"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/180x180?text=Profile';
              }}
            />
          </div>
        </div>

        {/* Card Content */}
        <div className="px-6 pb-6 pt-4">
          {/* Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center line-clamp-2 min-h-[3rem]">
            {candidate.name}
          </h3>

          {/* Party/Independent Badge */}
          <div className="flex justify-center mb-3">
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold ${
              candidate.isIndependent 
                ? 'bg-orange-100 text-orange-800 border border-orange-300' 
                : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
            }`}>
              {partyDisplay}
            </span>
          </div>

          {/* Symbol Name */}
          {candidate.symbol && (
            <div className="text-center mb-3">
              <span className="text-sm text-gray-700 font-medium bg-gray-50 px-3 py-1 rounded">প্রতীক: {candidate.symbol}</span>
            </div>
          )}

          {/* Constituency */}
          <div className="flex items-center justify-center gap-2 mb-3 text-sm text-gray-600">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{candidate.constituency || 'এলাকা উল্লেখ নেই'}</span>
          </div>

          {/* Seat Number */}
          {candidate.seatNumber && (
            <div className="text-center mb-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">সিট নম্বর: {candidate.seatNumber}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-5">
            <button 
              onClick={() => onView(candidate)} 
              className="bg-gray-100 text-gray-800 py-2.5 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm shadow-sm hover:shadow-md"
            >
              কুইক ভিউ
            </button>
            <Link 
              to={`/election/candidates/${candidateId}`} 
              className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-sm shadow-sm hover:shadow-md"
            >
              বিস্তারিত
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateModal({ open, onClose, candidate }) {
  if (!open || !candidate) return null;
  
  const partyDisplay = candidate.isIndependent ? 'স্বতন্ত্র' : (candidate.party || 'দল নেই');
  const candidateId = candidate._id || candidate.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative flex items-center justify-between">
            <h3 className="text-xl font-bold">{candidate.name}</h3>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-200 transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Profile Image and Info */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <img 
              src={candidate.imageUrl || 'https://via.placeholder.com/80x80?text=Profile'} 
              alt={candidate.name} 
              className="h-20 w-20 rounded-lg object-cover border-4 border-indigo-100 shadow-md"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Profile';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  candidate.isIndependent 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {partyDisplay}
                </span>
                {candidate.symbol && (
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">প্রতীক: {candidate.symbol}</span>
                )}
              </div>
              <div className="text-sm text-gray-700 font-medium">
                <svg className="w-4 h-4 inline mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {candidate.constituency || 'এলাকা উল্লেখ নেই'}
              </div>
              {candidate.seatNumber && (
                <div className="text-xs text-gray-500 mt-1">সিট নম্বর: {candidate.seatNumber}</div>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-3">
            {candidate.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{candidate.phone}</span>
              </div>
            )}
            {candidate.email && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{candidate.email}</span>
              </div>
            )}
            {candidate.facebookLink && (
              <div>
                <a 
                  href={candidate.facebookLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  ফেসবুক পেজ
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
          >
            বন্ধ করুন
          </button>
          <Link 
            to={`/election/candidates/${candidateId}`} 
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 font-medium transition-all shadow-sm hover:shadow-md"
          >
            বিস্তারিত দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}

function Candidates() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  usePageTitle('প্রার্থী তথ্য | জাতীয় সংসদ নির্বাচন | বগুড়াবাসী – Bogurabashi');

  // Fetch candidates from API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosSecure.get('/candidates');
        // Filter only active candidates
        const activeCandidates = res.data.filter(c => c.status === 'Active' || !c.status);
        setCandidates(activeCandidates);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('প্রার্থী তথ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [axiosSecure]);

  // Filter candidates based on search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidates;
    
    return candidates.filter((c) => {
      const name = (c.name || '').toLowerCase();
      const party = (c.party || '').toLowerCase();
      const constituency = (c.constituency || '').toLowerCase();
      const symbol = (c.symbol || '').toLowerCase();
      
      return name.includes(q) || 
             party.includes(q) || 
             constituency.includes(q) ||
             symbol.includes(q) ||
             (c.isIndependent && 'স্বতন্ত্র'.includes(q));
    });
  }, [query, candidates]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">প্রার্থী তথ্য</h1>
          <p className="text-indigo-100 text-lg">প্রার্থীদের সম্পর্কে জানুন এবং বিস্তারিত তথ্য দেখুন</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="নাম/দল/এলাকা/প্রতীক দিয়ে খুঁজুন..."
              className="w-full sm:w-96 border-2 border-gray-200 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {query && (
            <p className="text-sm text-gray-600 mt-2">
              {filtered.length} জন প্রার্থী পাওয়া গেছে
            </p>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">প্রার্থী তথ্য লোড হচ্ছে...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 font-semibold text-lg mb-2">⚠️ ত্রুটি</div>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* No Candidates Found */}
      {!loading && !error && filtered.length === 0 && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <div className="text-gray-600 font-semibold text-xl mb-2">
            {query ? 'কোন প্রার্থী পাওয়া যায়নি' : 'কোন প্রার্থী নেই'}
          </div>
          <p className="text-gray-500">
            {query ? 'অনুগ্রহ করে অন্য শব্দ দিয়ে খুঁজুন' : 'শীঘ্রই প্রার্থী যোগ করা হবে'}
          </p>
        </div>
      )}

      {/* Candidates Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cand) => (
            <CandidateCard 
              key={cand._id || cand.id} 
              candidate={cand} 
              onView={setActive} 
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <CandidateModal open={!!active} onClose={() => setActive(null)} candidate={active} />
    </div>
  );
}

export default Candidates;


