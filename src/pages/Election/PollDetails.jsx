import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';

function ProgressBar({ percent, color }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div className={`h-2.5 ${color}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

function PieChart({ parts, size = 140 }) {
  const gradient = useMemo(() => {
    let acc = 0;
    const stops = parts.map((p) => {
      const from = acc;
      const to = acc + p.percent;
      acc = to;
      return `${p.color} ${from}% ${to}%`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }, [parts]);

  return (
    <div
      className="rounded-full shadow-inner border border-gray-200"
      style={{ width: size, height: size, background: gradient }}
    />
  );
}

export default function PollDetails() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
  ];

  const colorHex = [
    '#3b82f6',
    '#10b981',
    '#8b5cf6',
    '#f59e0b',
    '#f43f5e',
    '#6366f1',
  ];

  const totalVotes = results?.totalVotes ?? poll?.votes ?? 0;
  const optionStats = results?.optionStats ?? poll?.optionStats ?? [];

  const pieParts = optionStats.map((op, idx) => ({
    label: op.label,
    percent: totalVotes > 0 ? Math.round(((op.votes || 0) * 100) / totalVotes) : 0,
    color: colorHex[idx % colorHex.length],
  }));

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError('');
      const [pollRes, resultRes] = await Promise.all([
        axiosSecure.get(`/polls/${id}`),
        axiosSecure.get(`/polls/${id}/results`),
      ]);
      setPoll(pollRes.data?.data || pollRes.data);
      setResults(resultRes.data?.data || resultRes.data);
    } catch (e) {
      console.error('Poll details load failed', e);
      setError('ডেটা লোড করা যায়নি। পরে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto px-3 py-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-5 shadow-lg flex-1 mr-3">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 20%, white 2px, transparent 2px)', backgroundSize:'16px 16px'}} />
          <div className="relative z-10">
            <h1 className="text-white text-[20px] lg:text-[24px] font-bold leading-tight">জরিপের বিস্তারিত</h1>
            <p className="text-blue-100 text-[13px] mt-0.5">ফলাফলের ভিজ্যুয়াল বিশ্লেষণ</p>
          </div>
        </div>
        <Link to="/election/polls" className="shrink-0 inline-flex items-center gap-2 text-[13px] px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-800">পিছনে যান</Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 text-red-700 p-3 text-[14px] mb-4">{error}</div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-gray-600">লোড হচ্ছে...</div>
      ) : (
        poll && (
          <>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm mb-5">
              <div className="text-base font-semibold text-gray-800 leading-snug mb-2">{poll.question}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  (poll.status || 'Active') === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>{poll.status || 'Active'}</span>
                {poll.category && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-100">{poll.category}</span>
                )}
                <span className="ml-auto text-[13px] text-gray-600">মোট ভোট: <span className="font-semibold text-gray-800">{totalVotes}</span></span>
              </div>
              {poll.description && (
                <div className="text-[13px] text-gray-600">{poll.description}</div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-3">Pie Chart</div>
                <div className="flex items-center justify-center">
                  <PieChart parts={pieParts} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {pieParts.map((p) => (
                    <div key={p.label} className="flex items-center gap-2 text-[13px] text-gray-700">
                      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: p.color }} />
                      <span className="truncate">{p.label}</span>
                      <span className="ml-auto">{p.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-800 mb-3">Bar Chart</div>
                <div className="space-y-3">
                  {optionStats.map((op, idx) => {
                    const percent = totalVotes > 0 ? Math.round(((op.votes || 0) * 100) / totalVotes) : 0;
                    return (
                      <div key={op.label}>
                        <div className="flex items-center justify-between text-[13px] mb-1">
                          <span className="text-gray-800">{op.label}</span>
                          <span className="text-gray-600">{percent}% ({op.votes || 0})</span>
                        </div>
                        <ProgressBar percent={percent} color={colors[idx % colors.length]} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm mt-5">
              <div className="text-sm font-semibold text-gray-800 mb-3">Detailed Statistics</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[13px]">
                  <thead>
                    <tr className="text-gray-600">
                      <th className="py-2 border-b border-gray-100">Option</th>
                      <th className="py-2 border-b border-gray-100">Votes</th>
                      <th className="py-2 border-b border-gray-100">Percentage</th>
                      <th className="py-2 border-b border-gray-100">Visual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optionStats.map((op, idx) => {
                      const votes = op.votes || 0;
                      const percent = totalVotes > 0 ? Math.round((votes * 100) / totalVotes) : 0;
                      return (
                        <tr key={op.label} className="text-gray-800">
                          <td className="py-3 border-b border-gray-100">{op.label}</td>
                          <td className="py-3 border-b border-gray-100">{votes}</td>
                          <td className="py-3 border-b border-gray-100">{percent}%</td>
                          <td className="py-3 border-b border-gray-100 w-64">
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`${colors[idx % colors.length]} h-2.5`} style={{ width: `${percent}%` }} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}


