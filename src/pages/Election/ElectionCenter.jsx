import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import usePageTitle from '../../hooks/usePageTitle';

function ElectionCenter() {
  usePageTitle('ত্রয়োদশ জাতীয় সংসদ নির্বাচন কেন্দ্র | বগুড়াবাসী – Bogurabashi');
  const axiosSecure = useAxiosSecure();

  // নির্বাচনের তারিখ (পরিবর্তনযোগ্য) - ১২ ফেব্রুয়ারি ২০২৬, সকাল ৮:০০
  const electionDate = useMemo(() => new Date('2026-02-12T08:00:00'), []);
  
  // কাউন্টডাউন টাইমার স্টেট
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [minutesRemaining, setMinutesRemaining] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // লাইভ নিউজ টিকার ডেটা (API থেকে)
  const { data: electionNews = [], isLoading: isNewsLoading } = useQuery({
    queryKey: ['election-news'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/news');
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        // শুধুমাত্র "নির্বাচন" ক্যাটাগরির নিউজ দেখাবে
        const filtered = list.filter((n) => n.category === 'নির্বাচন');
        return filtered
          .filter((n) => n.status === 'Published')
          .sort((a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0))
          .slice(0, 10); // সর্বশেষ ১০টি খবর
      } catch (e) {
        console.error('Election news fetch failed', e);
        return [];
      }
    },
    retry: 1,
  });

  // বাংলা সংখ্যা রূপান্তর ফাংশন
  const toBengaliNumber = (num) => {
    if (num === null || num === undefined) return '০';
    return String(num).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
  };

  // টিকারের জন্য শুধু শিরোনামগুলো নিচ্ছি
  const newsTicker = isNewsLoading 
    ? ['খবর লোড হচ্ছে...'] 
    : electionNews.length > 0 
      ? electionNews.map(n => n.title) 
      : ['নির্বাচন সংক্রান্ত কোনো ব্রেকিং নিউজ নেই'];

  // কাউন্টডাউন টাইমার ক্যালকুলেশন
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const diff = electionDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setDaysRemaining(days);
        setHoursRemaining(hours);
        setMinutesRemaining(minutes);
        setSecondsRemaining(seconds);
      } else {
        setDaysRemaining(0);
        setHoursRemaining(0);
        setMinutesRemaining(0);
        setSecondsRemaining(0);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000); // প্রতি সেকেন্ডে আপডেট

    return () => clearInterval(interval);
  }, [electionDate]);

  // ডামি ডেটা (পরে API যুক্ত করা যাবে)
  const headlineStats = [
    { label: 'মোট ভোটার', value: 342155 },
    { label: 'পুরুষ', value: 171497 },
    { label: 'মহিলা', value: 170653 },
    { label: 'অন্যান্য', value: 5 },
    { label: 'মোট প্রার্থী', value: 7 },
    { label: 'স্বতন্ত্র প্রার্থী', value: 1 },
  ];

  // নমুনা পোল ডেটা (API হলে এখানে ফেচ করে সেট করবেন)
  const [pollsSummary, setPollsSummary] = useState(null);
  const [pollsSummaryLoading, setPollsSummaryLoading] = useState(true);
  const [pollsSummaryError, setPollsSummaryError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchSummary = async () => {
      try {
        setPollsSummaryLoading(true);
        setPollsSummaryError(false);
        const res = await axiosSecure.get('/polls/summary');
        if (mounted) {
          setPollsSummary(res.data);
        }
      } catch (error) {
        console.error('Polls summary error:', error);
        if (mounted) {
          setPollsSummaryError(true);
          setPollsSummary(null);
        }
      } finally {
        if (mounted) {
          setPollsSummaryLoading(false);
        }
      }
    };
    fetchSummary();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sections = [
    { to: '/election/polls', title: 'নির্বাচন জরিপ', desc: 'ভোট দিন ও ফলাফল দেখুন', emoji: '🗳️' },
    { to: '/election/candidates', title: 'প্রার্থী তথ্য', desc: 'প্রার্থীদের প্রোফাইল দেখুন', emoji: '👤' },
    { to: '/election/results', title: 'নির্বাচনের ফলাফল', desc: 'লাইভ ভোট গণনা ও ফলাফল', emoji: '🏆' },
    { to: '/election/insights', title: 'জনমত বিশ্লেষণ', desc: 'চার্টে ট্রেন্ড দেখুন', emoji: '📊' },
    { to: '/election/news', title: 'নির্বাচনী আপডেটস (News & Alerts)', desc: 'নির্বাচনের সর্বশেষ খবর', emoji: '📰' },
    { to: '/election/voting-day-assistance', title: 'ভোট দিবস সহায়তা', desc: 'ভোট দিবসের প্রয়োজনীয় তথ্য ও সহায়তা', emoji: '✅' },
  ];

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    // if (Math.abs(num) >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    // if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + 'k';
    return toBengaliNumber(num);
  };

  const ProgressBar = ({ value, color = 'bg-blue-600' }) => {
    const clamped = Math.max(0, Math.min(100, value));
    return (
      <div className="w-full h-2.5 bg-gray-100 rounded">
        <div className={`${color} h-2.5 rounded`} style={{ width: `${clamped}%` }} />
      </div>
    );
  };

  const PollBarChart = ({ items }) => {
    return (
      <div className="space-y-3">
        {items.map((row) => (
          <div key={row.name} className="">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-700 font-medium">{row.name}</span>
              <span className="text-gray-600">{toBengaliNumber(row.percent)}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded">
              <div
                className="h-2.5 rounded"
                style={{ width: `${Math.max(0, Math.min(100, row.percent))}%`, backgroundColor: row.color }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // নিউজ টিকার কম্পোনেন্ট
  const NewsTicker = ({ news }) => {
    return (
      <>
        <style>{`
          @keyframes newsScroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .news-scroll {
            animation: newsScroll 30s linear infinite;
          }
        `}</style>
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 px-4 bg-blue-800 py-1 rounded-r-lg">
              <span className="text-sm font-bold flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                লাইভ
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="news-scroll flex gap-8 whitespace-nowrap">
                {news.map((item, idx) => (
                  <span key={idx} className="text-sm font-medium">
                    {item} •
                  </span>
                ))}
                {/* Duplicate for seamless loop */}
                {news.map((item, idx) => (
                  <span key={`dup-${idx}`} className="text-sm font-medium">
                    {item} •
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // কাউন্টডাউন টাইমার কম্পোনেন্ট
  const CountdownTimer = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-4 md:p-5 shadow-lg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="text-center mb-3">
            <h2 className="text-lg md:text-xl font-bold mb-1">ত্রয়োদশ জাতীয় সংসদ নির্বাচন</h2>
            <p className="text-blue-100 text-xs md:text-sm">ভোটের দিন শুরু হতে বাকি</p>
          </div>
          <div className="flex justify-center items-center gap-1.5 md:gap-2 flex-wrap">
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[55px] md:min-w-[65px]">
              <div className="text-xl md:text-2xl font-bold">{toBengaliNumber(days.toString().padStart(2, '0'))}</div>
              <div className="text-[10px] md:text-xs text-blue-100 mt-0.5">দিন</div>
            </div>
            <div className="text-lg md:text-xl font-bold">:</div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[55px] md:min-w-[65px]">
              <div className="text-xl md:text-2xl font-bold">{toBengaliNumber(hours.toString().padStart(2, '0'))}</div>
              <div className="text-[10px] md:text-xs text-blue-100 mt-0.5">ঘন্টা</div>
            </div>
            <div className="text-lg md:text-xl font-bold">:</div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[55px] md:min-w-[65px]">
              <div className="text-xl md:text-2xl font-bold">{toBengaliNumber(minutes.toString().padStart(2, '0'))}</div>
              <div className="text-[10px] md:text-xs text-blue-100 mt-0.5">মিনিট</div>
            </div>
            <div className="text-lg md:text-xl font-bold">:</div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[55px] md:min-w-[65px]">
              <div className="text-xl md:text-2xl font-bold">{toBengaliNumber(seconds.toString().padStart(2, '0'))}</div>
              <div className="text-[10px] md:text-xs text-blue-100 mt-0.5">সেকেন্ড</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* হিরো সেকশন */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-3">ত্রয়োদশ জাতীয় সংসদ নির্বাচন</h1>
        <p className="text-gray-600 text-lg">স্বচ্ছ তথ্য, অংশগ্রহণ ও জনমত—সব এক জায়গায়</p>
      </div>

      {/* কাউন্টডাউন টাইমার */}
      <div className="mb-8">
        <CountdownTimer days={daysRemaining} hours={hoursRemaining} minutes={minutesRemaining} seconds={secondsRemaining} />
      </div>

      {/* লাইভ নিউজ টিকার */}
      <div className="mb-8">
        <NewsTicker news={newsTicker} />
      </div>

      {/* হেডলাইন স্ট্যাটস */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {headlineStats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="mt-1 flex items-baseline gap-1">
              <div className="text-2xl font-bold text-gray-900">{s.unit ? `${s.value}${s.unit}` : formatNumber(s.value)}</div>
              {typeof s.delta === 'number' && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${s.delta > 0 ? 'bg-green-50 text-green-700' : s.delta < 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
                  {s.delta > 0 ? '+' : ''}{s.delta}%
                </span>
              )}
            </div>
            {s.unit === '%' && (
              <div className="mt-3">
                <ProgressBar value={s.value} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* পোল অ্যানালিটিক্স (লাইভ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-gray-800">পোল সারাংশ (লাইভ)</div>
            <Link to="/election/polls" className="text-sm text-blue-600 hover:underline">সব দেখুন</Link>
          </div>
          {pollsSummaryLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          ) : pollsSummaryError ? (
            <div className="text-sm text-red-600">ডেটা লোড করা যায়নি। পরে চেষ্টা করুন।</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="text-xs text-gray-500">মোট পোল</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{toBengaliNumber(pollsSummary?.totalPolls ?? 0)}</div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="text-xs text-gray-500">সক্রিয় পোল</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{toBengaliNumber(pollsSummary?.activePolls ?? 0)}</div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="text-xs text-gray-500">মোট ভোট</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{toBengaliNumber(pollsSummary?.totalVotes ?? 0)}</div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="text-xs text-gray-500">ডেটা আপডেট</div>
                <div className="text-sm font-medium text-gray-800 mt-1">লাইভ</div>
              </div>
            </div>
          )}
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="font-semibold text-gray-800 mb-2">সর্বাধিক ভোটপ্রাপ্ত পোল</div>
          {pollsSummaryLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded" />
              <div className="h-3 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          ) : pollsSummaryError ? (
            <div className="text-sm text-red-600">ডেটা লোড করা যায়নি।</div>
          ) : pollsSummary?.topPoll ? (
            <>
              <div className="text-gray-800 font-medium">{pollsSummary.topPoll.question}</div>
              <div className="text-sm text-gray-600 mt-1">মোট ভোট: {toBengaliNumber(pollsSummary.topPoll.votes)}</div>
              <div className="mt-4">
                <div className="w-full h-2.5 bg-gray-100 rounded">
                  <div
                    className="h-2.5 rounded bg-gradient-to-r from-blue-600 to-sky-500"
                    style={{ width: `${Math.min(100, Math.max(5, (pollsSummary.topPoll.votes || 0) && (pollsSummary.totalVotes ? Math.round((pollsSummary.topPoll.votes * 100) / (pollsSummary.totalVotes || 1)) : 100)))}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">সকল ভোটের অনুপাত</div>
              </div>
              <div className="mt-4">
                <Link to="/election/polls" className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700">
                  পোলসে যান
                </Link>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600">কোনো পোল তথ্য নেই।</div>
          )}
        </div>
      </div>

      {/* নেভিগেশন কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="text-4xl mb-3">{s.emoji}</div>
            <div className="text-xl font-bold text-gray-800 group-hover:text-blue-600">{s.title}</div>
            <div className="text-gray-600 mt-1">{s.desc}</div>
            <div className="mt-4 inline-flex items-center text-blue-600 font-medium">
              দেখুন →
            </div>
          </Link>
        ))}
      </div>

      {/* নির্বাচন সংক্ষিপ্ত পরিচিতি */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8 mb-8 border border-blue-100 shadow-lg">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🗳️</span>
              নির্বাচন সম্পর্কে
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ত্রয়োদশ জাতীয় সংসদ নির্বাচন বাংলাদেশের গণতন্ত্রের একটি গুরুত্বপূর্ণ অধ্যায়। 
              এই নির্বাচনের মাধ্যমে দেশের নাগরিকরা তাদের প্রতিনিধি নির্বাচন করবেন যারা 
              পরবর্তী পাঁচ বছর জাতীয় সংসদে জনগণের স্বার্থে কাজ করবেন।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                <div className="text-sm text-gray-500 mb-1">নির্বাচনের তারিখ</div>
                <div className="text-lg font-semibold text-gray-900">১২ ফেব্রুয়ারি, ২০২৬</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                <div className="text-sm text-gray-500 mb-1">ভোটের সময়</div>
                <div className="text-lg font-semibold text-gray-900">সকাল ৭:০০ - বিকাল ৪:৩০</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                <div className="text-sm text-gray-500 mb-1">নির্বাচনী এলাকা</div>
                <div className="text-lg font-semibold text-gray-900">সমগ্র বাংলাদেশ</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                <div className="text-sm text-gray-500 mb-1">মোট আসন</div>
                <div className="text-lg font-semibold text-gray-900">৩০০ টি</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">🇧🇩</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">নির্বাচনের উদ্দেশ্য</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>গণতান্ত্রিক প্রক্রিয়ায় অংশগ্রহণ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>জনপ্রতিনিধি নির্বাচন</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>স্বচ্ছ ও নিরপেক্ষ নির্বাচন</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>জাতীয় উন্নয়ন ও সমৃদ্ধি</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElectionCenter;


