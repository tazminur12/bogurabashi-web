import React, { useEffect, useMemo, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

function ProgressBar({ percent, color }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div className={`h-2.5 ${color}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const then = new Date(dateString).getTime();
  if (Number.isNaN(then)) return '';
  const now = Date.now();
  const diff = Math.max(0, Math.floor((now - then) / 1000));
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function useLocalVoteGuard(pollId) {
  const storageKey = `poll-vote-${pollId}`;
  const hasVoted = useMemo(() => !!localStorage.getItem(storageKey), [storageKey]);
  const markVoted = () => localStorage.setItem(storageKey, 'true');
  return { hasVoted, markVoted };
}

function PollCard({ poll, onRefetch }) {
  const axiosSecure = useAxiosSecure();
  const [selected, setSelected] = useState('');
  const { hasVoted, markVoted } = useLocalVoteGuard(poll._id || poll.id);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState('');
  const [results, setResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState('');

  const totalVotes = results ? (results.totalVotes || 0) : (poll.votes || 0);
  const optionStats = results ? (results.optionStats || []) : (poll.optionStats || []);

  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
  ];

  const handleVote = () => {
    if (!selected || hasVoted) return;
    const optionIndex = optionStats.findIndex(op => op.label === selected);
    setIsVoting(true);
    setVoteError('');
    axiosSecure
      .post(`/polls/${poll._id || poll.id}/vote`, {
        optionLabel: selected,
        optionIndex: optionIndex >= 0 ? optionIndex : undefined,
      })
      .then(() => {
        markVoted();
        onRefetch && onRefetch();
        // Fetch latest results after successful vote
        fetchResults();
        Swal.fire({
          icon: 'success',
          title: 'ধন্যবাদ! ✅',
          text: 'আপনার ভোট রেকর্ড হয়েছে।',
          timer: 1600,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        console.error('Vote error:', error);
        setVoteError('দুঃখিত, ভোট রেকর্ড করা যায়নি।');
      })
      .finally(() => setIsVoting(false));
  };

  const fetchResults = async () => {
    try {
      setResultsLoading(true);
      setResultsError('');
      const res = await axiosSecure.get(`/polls/${poll._id || poll.id}/results`);
      setResults(res.data);
    } catch (error) {
      console.error('Poll results fetch error:', error);
      setResultsError('ফলাফল লোড করা যায়নি।');
    } finally {
      setResultsLoading(false);
    }
  };

  useEffect(() => {
    if (hasVoted || poll.status !== 'Active') {
      fetchResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVoted, poll.status]);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-blue-200 hover:ring-1 hover:ring-blue-50 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-sm font-bold">
            ?
          </div>
          <div>
            <div className="text-base font-semibold text-gray-800 leading-snug">{poll.question}</div>
            <div className="mt-1 flex items-center gap-2">
              <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                (poll.status || 'Active') === 'Active'
                  ? 'bg-green-50 text-green-700 border-green-100'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {poll.status || 'Active'}
              </span>
              {poll.category && (
                <span className="text-[11px] px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-100">
                  {poll.category}
                </span>
              )}
            </div>
          </div>
        </div>
        {typeof totalVotes === 'number' && totalVotes > 0 && (
          <div className="text-[12px] text-gray-600 whitespace-nowrap">মোট ভোট: <span className="font-semibold text-gray-800">{totalVotes}</span></div>
        )}
      </div>
      {poll.description && (
        <div className="text-[13px] text-gray-600 mb-3">
          {poll.description}
        </div>
      )}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3" />

      {!hasVoted && poll.status === 'Active' ? (
        <div className="space-y-2">
          {optionStats.map((op) => (
            <label key={op.label} className="group flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <span className="relative flex h-4 w-4 items-center justify-center">
                <input
                  type="radio"
                  name={poll._id || poll.id}
                  value={op.label}
                  onChange={(e) => setSelected(e.target.value)}
                  className="peer sr-only"
                />
                <span className="h-4 w-4 rounded-full border border-gray-300 peer-checked:border-blue-600 flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-blue-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
                </span>
              </span>
              <span className="text-gray-800 text-[15px]">{op.label}</span>
            </label>
          ))}
          <button
            onClick={handleVote}
            disabled={!selected || isVoting}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2 rounded-lg hover:from-blue-700 hover:to-sky-700 transition-colors text-[15px]"
          >
            {isVoting ? 'ভোট রেকর্ড হচ্ছে...' : 'ভোট দিন'}
            {!isVoting && <span>➡️</span>}
          </button>
          {voteError && <div className="text-[13px] text-red-600">{voteError}</div>}
        </div>
      ) : (
        <div>
          <div className="text-[13px] text-gray-600 mb-3">ফলাফল (মোট {totalVotes} ভোট)</div>
          {resultsError && (
            <div className="text-[12px] text-red-600 mb-2">{resultsError}</div>
          )}
          <div className="space-y-2">
            {(resultsLoading ? (poll.optionStats || []) : optionStats).map((op, idx) => {
              const percent = results && typeof op.percent === 'number'
                ? op.percent
                : (totalVotes > 0 ? Math.round(((op.votes || 0) * 100) / totalVotes) : 0);
              return (
                <div key={op.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-800">{op.label}</span>
                    <span className="text-gray-600">{percent}% ({op.votes || 0})</span>
                  </div>
                  <ProgressBar percent={percent} color={colors[idx % colors.length]} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between text-[12px] text-gray-500">
        <span className="flex items-center gap-1">📅 <span>{formatTimeAgo(results?.createdAt || poll.createdAt)}</span></span>
        <span className="">{poll.source || ''}</span>
      </div>
    </div>
  );
}

function PollSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm animate-pulse">
      <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
      <div className="space-y-2">
        <div className="h-9 bg-gray-100 rounded-lg border" />
        <div className="h-9 bg-gray-100 rounded-lg border" />
        <div className="h-9 bg-gray-100 rounded-lg border" />
      </div>
    </div>
  );
}

function Polls() {
  const axiosSecure = useAxiosSecure();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosSecure.get('/polls', { params: { status: 'Active' } });
      if (Array.isArray(res.data)) setPolls(res.data);
      else if (res.data && Array.isArray(res.data.data)) setPolls(res.data.data);
      else setPolls([]);
    } catch (error) {
      console.error('Polls fetch error:', error);
      setError('ডেটা লোড করা যায়নি। পরে আবার চেষ্টা করুন।');
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-3 py-8">
      {/* Page Header */}
      <div className="mb-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-5 shadow-lg">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 20%, white 2px, transparent 2px)', backgroundSize:'16px 16px'}} />
          <div className="relative z-10 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center text-xl">🗳️</div>
            <div>
              <h1 className="text-white text-[20px] lg:text-[24px] font-bold leading-tight">নির্বাচন জরিপ</h1>
              <p className="text-blue-100 text-[13px] mt-0.5">আপনার একটি ভোটই গুরুত্বপূর্ণ—ভোট দিন ও ফলাফল দেখুন</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[13px] text-gray-600">
          সক্রিয় পোল: <span className="font-semibold text-gray-800">{loading ? '...' : polls.length}</span>
        </div>
        <button
          onClick={fetchPolls}
          className="inline-flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-800"
          disabled={loading}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-blue-600" /> রিফ্রেশ
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 text-red-700 p-3 text-[14px] mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {loading && (
          <>
            <PollSkeleton />
            <PollSkeleton />
          </>
        )}

        {!loading && polls.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-gray-600">
            বর্তমানে কোনো সক্রিয় জরিপ নেই।
          </div>
        )}

        {polls.map((poll) => (
          <div key={poll._id || poll.id} className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-1">
            <PollCard poll={poll} onRefetch={fetchPolls} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Polls;


