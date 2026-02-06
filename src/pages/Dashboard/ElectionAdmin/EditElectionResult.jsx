import React, { useState, useEffect } from 'react';
import usePageTitle from '../../../hooks/usePageTitle';
import Swal from 'sweetalert2';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const EditElectionResult = () => {
  usePageTitle('ফলাফল এডিট | বগুড়াবাসী');
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);

  const [constituency, setConstituency] = useState('');
  const [union, setUnion] = useState('');
  const [center, setCenter] = useState('');
  const [totalVoters, setTotalVoters] = useState('');
  const [castedVotes, setCastedVotes] = useState('');
  
  const [candidates, setCandidates] = useState([]);

  const constituencies = [
    'বগুড়া-১', 'বগুড়া-২', 'বগুড়া-৩', 'বগুড়া-৪', 'বগুড়া-৫', 'বগুড়া-৬', 'বগুড়া-৭'
  ];

  useEffect(() => {
    if (id) {
        axiosSecure.get(`/election/results/${id}`)
            .then(res => {
                 const data = res.data;
                 setConstituency(data.constituency || 'বগুড়া-১');
                 setUnion(data.union);
                 setCenter(data.center);
                 setTotalVoters(data.totalVoters);
                 setCastedVotes(data.castedVotes);
                 setCandidates(data.candidates || []);
                 setLoading(false);
            })
            .catch(err => {
                console.error(err);
                Swal.fire('Error', 'Failed to fetch data', 'error');
                setLoading(false);
            });
    }
  }, [id, axiosSecure]);

  const handleAddCandidate = () => {
    setCandidates([...candidates, { id: Date.now() + Math.random(), name: '', party: '', votes: 0 }]);
  };

  const handleRemoveCandidate = (candidateId) => {
    if (candidates.length === 1) {
        Swal.fire('কমপক্ষে একজন প্রার্থী থাকতে হবে');
        return;
    }
    setCandidates(candidates.filter(c => c.id !== candidateId));
  };

  const handleCandidateChange = (candidateId, field, value) => {
    setCandidates(candidates.map(c => 
      c.id === candidateId ? { ...c, [field]: field === 'votes' ? (parseInt(value) || 0) : value } : c
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!union || !center) {
        Swal.fire({
            icon: 'error',
            title: 'দুঃখিত',
            text: 'অনুগ্রহ করে ইউনিয়ন এবং কেন্দ্রের নাম দিন',
        });
        return;
    }

    const invalidCandidates = candidates.some(c => !c.name.trim() || !c.party.trim());
    if (invalidCandidates) {
        Swal.fire({
            icon: 'error',
            title: 'দুঃখিত',
            text: 'সকল প্রার্থীর নাম এবং দলের নাম পূরণ করুন',
        });
        return;
    }

    const updatedData = {
      id,
      constituency,
      union,
      center,
      totalVoters,
      castedVotes,
      candidates,
      updatedAt: new Date().toISOString()
    };

    console.log('Updated Data:', updatedData);
    
    axiosSecure.put(`/election/results/${id}`, updatedData)
        .then(res => {
            if (res.data.message === 'Result updated successfully') {
                Swal.fire({
                    icon: 'success',
                    title: 'সফল হয়েছে',
                    text: 'ফলাফল সফলভাবে আপডেট করা হয়েছে',
                }).then(() => {
                    navigate('/dashboard/election-results-list');
                });
            }
        })
        .catch(err => {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'ত্রুটি',
                text: 'ফলাফল আপডেট করতে সমস্যা হয়েছে',
            });
        });
  };

  if (loading) return <div className="p-10 text-center">লোডিং...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">ফলাফল এডিট করুন</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Location Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">নির্বাচনী এলাকা</label>
            <select
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {constituencies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইউনিয়ন/পৌরসভা</label>
            <input
              type="text"
              value={union}
              onChange={(e) => setUnion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ভোট কেন্দ্র</label>
            <input
              type="text"
              value={center}
              onChange={(e) => setCenter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Voting Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">মোট ভোটার</label>
            <input
              type="number"
              value={totalVoters}
              onChange={(e) => setTotalVoters(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">কাস্ট হওয়া ভোট</label>
            <input
              type="number"
              value={castedVotes}
              onChange={(e) => setCastedVotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Candidate Votes */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">প্রার্থীদের প্রাপ্ত ভোট</h3>
            <button
              type="button"
              onClick={handleAddCandidate}
              className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors"
            >
              <FaPlus /> প্রার্থী যোগ করুন
            </button>
          </div>
          
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="flex flex-col md:flex-row gap-3 items-end border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-500 mb-1">প্রার্থীর নাম</label>
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => handleCandidateChange(candidate.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-500 mb-1">দলের নাম</label>
                  <input
                    type="text"
                    value={candidate.party}
                    onChange={(e) => handleCandidateChange(candidate.id, 'party', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-xs font-medium text-gray-500 mb-1">প্রাপ্ত ভোট</label>
                  <input
                    type="number"
                    value={candidate.votes}
                    onChange={(e) => handleCandidateChange(candidate.id, 'votes', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="pb-1">
                    <button
                        type="button"
                        onClick={() => handleRemoveCandidate(candidate.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="মুছে ফেলুন"
                    >
                        <FaTrash />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/election-results-list')}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            বাতিল
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <FaSave /> আপডেট করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditElectionResult;
