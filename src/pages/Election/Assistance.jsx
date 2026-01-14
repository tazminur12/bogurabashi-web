import React, { useMemo, useState } from 'react';
import usePageTitle from '../../hooks/usePageTitle';

const MOCK_CENTERS = [
  { id: 'pc-01', name: 'শহীদ জিয়াউর রহমান কলেজ', area: 'সদর', map: 'https://maps.google.com' },
  { id: 'pc-02', name: 'বগুড়া সরকারি বালিকা উচ্চ বিদ্যালয়', area: 'সদর', map: 'https://maps.google.com' },
  { id: 'pc-03', name: 'শেরপুর ডিগ্রি কলেজ', area: 'শেরপুর', map: 'https://maps.google.com' },
];

function Assistance() {
  const [q, setQ] = useState('');
  usePageTitle('ভোটার সহায়তা ও ভোট কেন্দ্র | বগুড়াবাসী – Bogurabashi');
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return MOCK_CENTERS;
    return MOCK_CENTERS.filter((c) => c.name.toLowerCase().includes(s) || c.area.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">ভোটার সহায়তা ও সুবিধা</h1>
        <p className="text-gray-600 mt-1">ভোট কেন্দ্র খুঁজুন, গুরুত্বপূর্ণ লিংক দেখুন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="এলাকা/কেন্দ্রের নাম দিয়ে খুঁজুন"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-3">
            {results.map((c) => (
              <div key={c.id} className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">{c.name}</div>
                  <div className="text-gray-600 text-sm">এলাকা: {c.area}</div>
                </div>
                <a href={c.map} target="_blank" rel="noreferrer" className="text-blue-600 font-medium">ম্যাপ দেখুন →</a>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="font-semibold text-gray-800 mb-2">গুরুত্বপূর্ণ লিংক</div>
            <div className="space-y-2 text-blue-600">
              <a href="https://services.nidw.gov.bd/" target="_blank" rel="noreferrer" className="block">ভোটার লিস্ট যাচাই</a>
              <a href="https://www.ecs.gov.bd/" target="_blank" rel="noreferrer" className="block">নির্বাচন কমিশন</a>
              <a href="https://bangladesh.gov.bd/" target="_blank" rel="noreferrer" className="block">জাতীয় তথ্য বাতায়ন</a>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="font-semibold text-gray-800 mb-2">ভোটের দিন ও সময়</div>
            <div className="text-gray-700 text-sm">পরবর্তী নির্বাচন: ঘোষণা না হওয়া পর্যন্ত অপেক্ষমান</div>
            <div className="text-gray-700 text-sm">সাধারণ সময়সূচি: সকাল ৮টা - বিকাল ৪টা</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="font-semibold text-gray-800 mb-2">ঘোষণা/নির্দেশিকা</div>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              <li>জাতীয় পরিচয়পত্র সঙ্গে আনুন</li>
              <li>শান্তি-শৃঙ্খলা বজায় রাখুন</li>
              <li>ভোট দেওয়ার আগে বুথের নির্দেশনা পড়ুন</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assistance;


