import React, { useState, useEffect } from 'react';
import usePageTitle from '../../hooks/usePageTitle';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaChartBar, FaCheckCircle, FaVoteYea, FaSpinner } from 'react-icons/fa';

function ElectionResults() {
  usePageTitle('নির্বাচনের ফলাফল | বগুড়াবাসী – Bogurabashi');
  const axiosSecure = useAxiosSecure();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [resultsRes, summaryRes] = await Promise.all([
                axiosSecure.get('/election/results'),
                axiosSecure.get('/election/results/summary')
            ]);

            const data = resultsRes.data;
            setSummary(summaryRes.data);

            // Aggregate data by constituency
            const aggregated = {};
            
            data.forEach(item => {
                const constituency = item.constituency || 'অজানা';
                if (!aggregated[constituency]) {
                    aggregated[constituency] = {
                        constituency,
                        totalCenters: 120, // Placeholder, ideally dynamic
                        reportedCenters: 0,
                        totalCastedVotes: 0,
                        candidates: {}
                    };
                }
                
                aggregated[constituency].reportedCenters += 1;

                if (item.candidates && Array.isArray(item.candidates)) {
                    item.candidates.forEach(cand => {
                        const key = `${cand.name}-${cand.party}`;
                        if (!aggregated[constituency].candidates[key]) {
                            aggregated[constituency].candidates[key] = {
                                name: cand.name,
                                party: cand.party,
                                votes: 0,
                                color: 'bg-blue-600'
                            };
                        }
                        aggregated[constituency].candidates[key].votes += (parseInt(cand.votes) || 0);
                        aggregated[constituency].totalCastedVotes += (parseInt(cand.votes) || 0);
                    });
                }
            });

            // Convert object to array and sort candidates
            const formattedResults = Object.values(aggregated).map(item => ({
                ...item,
                candidates: Object.values(item.candidates).sort((a, b) => b.votes - a.votes)
            }));

            setResults(formattedResults);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [axiosSecure]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">ফলাফল লোড হচ্ছে...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-12 px-4 mb-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <div className="inline-block p-2 bg-white/10 rounded-full mb-3 backdrop-blur-sm">
                        <FaChartBar className="text-2xl text-yellow-400" />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold mb-2">নির্বাচনের ফলাফল ২০২৬</h1>
                    <p className="text-blue-100 text-sm md:text-base max-w-xl">
                        বগুড়ার সকল আসনের লাইভ ভোট গণনা ও ফলাফল
                    </p>
                </div>
                
                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full md:w-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4 text-center border border-white/10">
                            <h3 className="text-2xl font-bold text-yellow-400">{summary.totalCenters}</h3>
                            <p className="text-xs text-blue-100">মোট কেন্দ্র</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4 text-center border border-white/10">
                            <h3 className="text-2xl font-bold text-green-400">
                                {summary.castedVotes ? (summary.castedVotes / 1000).toFixed(1) + 'k' : '0'}
                            </h3>
                            <p className="text-xs text-blue-100">কাস্ট ভোট</p>
                        </div>
                         <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4 text-center border border-white/10 col-span-2 md:col-span-1">
                            <h3 className="text-2xl font-bold text-white">
                                {summary.totalVoters ? ((summary.castedVotes / summary.totalVoters) * 100).toFixed(0) : 0}%
                            </h3>
                            <p className="text-xs text-blue-100">ভোটের হার</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {results.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <p className="text-gray-500 text-lg">এখনো কোনো ফলাফল প্রকাশিত হয়নি।</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((constituency, idx) => {
                    const leadingCandidate = constituency.candidates[0];
                    const totalVotes = constituency.totalCastedVotes;
                    
                    return (
                        <div key={idx} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{constituency.constituency}</h2>
                                    <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wide">
                                        বগুড়া জেলা
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                        {constituency.reportedCenters} / {constituency.totalCenters} কেন্দ্র
                                    </span>
                                </div>
                            </div>

                            {/* Leading Candidate Highlight */}
                            {leadingCandidate && (
                                <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-50 flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 font-semibold uppercase">এগিয়ে আছেন</p>
                                        <h3 className="text-lg font-bold text-gray-900">{leadingCandidate.name}</h3>
                                        <p className="text-sm text-gray-600">{leadingCandidate.party}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xl font-extrabold text-blue-700">
                                            {leadingCandidate.votes.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500">ভোট</span>
                                    </div>
                                </div>
                            )}

                            {/* All Candidates List */}
                            <div className="p-6 space-y-5 flex-grow">
                                {constituency.candidates.map((candidate, cIdx) => {
                                    const percentage = totalVotes === 0 ? 0 : ((candidate.votes / totalVotes) * 100).toFixed(1);
                                    
                                    return (
                                        <div key={cIdx} className="group">
                                            <div className="flex justify-between items-end mb-2">
                                                <div>
                                                    <span className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                                                        {candidate.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                                                        {candidate.party}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-gray-900 text-sm">{candidate.votes.toLocaleString()}</span>
                                                    <span className="text-xs text-gray-400 ml-1">({percentage}%)</span>
                                                </div>
                                            </div>
                                            
                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${candidate.color} transition-all duration-1000 ease-out relative`} 
                                                    style={{ width: `${percentage}%` }}
                                                >
                                                    {/* Shimmer effect */}
                                                    <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-shimmer"></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer Stats */}
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-center">
                                <p className="text-xs text-gray-500">
                                    মোট কাস্ট ভোট: <span className="font-bold text-gray-700">{totalVotes.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm bg-white inline-block px-6 py-3 rounded-full shadow-sm border border-gray-100">
                * ফলাফল বেসরকারি এবং কেন্দ্র থেকে প্রাপ্ত তথ্যের ভিত্তিতে আপডেট করা হচ্ছে। সর্বশেষ আপডেট: {new Date().toLocaleTimeString()}
            </p>
            <div className="mt-8">
                <Link
                    to="/election"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg hover:underline transition-all"
                >
                    ← নির্বাচন কেন্দ্রে ফিরে যান
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ElectionResults;
