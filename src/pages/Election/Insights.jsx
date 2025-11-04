import React from 'react';

// Simple mock insight data
const INSIGHTS = {
  participationRate: 62, // percent
  popularIssues: [
    { label: 'দুর্নীতি দমন', value: 38 },
    { label: 'সড়ক ও যানবাহন', value: 26 },
    { label: 'স্বাস্থ্য সেবা', value: 18 },
    { label: 'পানি ও গ্যাস', value: 12 },
    { label: 'শিক্ষা', value: 6 },
  ],
  votesByArea: [
    { area: 'সদর', value: 45 },
    { area: 'শেরপুর', value: 20 },
    { area: 'শাহজাহানপুর', value: 15 },
    { area: 'ধুনট', value: 10 },
    { area: 'নন্দীগ্রাম', value: 10 },
  ],
};

function Bar({ label, value, color }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-gray-700"><span>{label}</span><span>{value}%</span></div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className={`h-3 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Insights() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">জনমত বিশ্লেষণ</h1>
        <p className="text-gray-600 mt-1">জরিপ ফলাফল ও ট্রেন্ড (ডেমো)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="font-semibold text-gray-800 mb-2">অংশগ্রহণের হার</div>
          <div className="text-5xl font-extrabold text-blue-600">{INSIGHTS.participationRate}%</div>
          <div className="text-gray-600 mt-2 text-sm">সাম্প্রতিক জরিপে অংশগ্রহণ</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="font-semibold text-gray-800 mb-4">জনপ্রিয় ইস্যু</div>
          <div className="space-y-3">
            {INSIGHTS.popularIssues.map((i, idx) => (
              <Bar key={i.label} label={i.label} value={i.value} color={['bg-blue-500','bg-emerald-500','bg-purple-500','bg-amber-500','bg-rose-500'][idx%5]} />
            ))}
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm md:col-span-2">
          <div className="font-semibold text-gray-800 mb-4">এলাকা অনুযায়ী ভোট</div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {INSIGHTS.votesByArea.map((a, idx) => (
              <div key={a.area} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{a.value}%</div>
                <div className="text-gray-700">{a.area}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;


