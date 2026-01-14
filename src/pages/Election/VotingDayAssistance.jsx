import React from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';

function VotingDayAssistance() {
  usePageTitle('ভোট দিবস সহায়তা ও নিয়মাবলী | বগুড়াবাসী – Bogurabashi');
  // ভোট কেন্দ্রের নিয়মাবলী
  const pollingCenterRules = [
    {
      title: 'ভোট কেন্দ্রে প্রবেশের নিয়ম',
      rules: [
        'ভোটার সকাল ৮টা থেকে বিকাল ৪টা পর্যন্ত ভোট দিতে পারবেন',
        'ভোট কেন্দ্রে প্রবেশের সময় জাতীয় পরিচয়পত্র (NID) সঙ্গে আনতে হবে',
        'ভোট কেন্দ্রে শান্তি-শৃঙ্খলা বজায় রাখতে হবে',
        'কোনো প্রকার শব্দযন্ত্র, মোবাইল ফোনের ক্যামেরা ব্যবহার করা যাবে না',
        'ভোট কেন্দ্রের ভিতরে রাজনৈতিক প্রচারণা বা স্লোগান দেওয়া নিষিদ্ধ',
        'ভোট দেওয়ার পর বুথ থেকে নির্দেশিত রাস্তা দিয়ে বের হতে হবে',
      ],
    },
    {
      title: 'ভোট দেওয়ার প্রক্রিয়া',
      rules: [
        'প্রথমে ভোটার তালিকায় আপনার নাম খুঁজে নিন',
        'অফিসার আপনার জাতীয় পরিচয়পত্র যাচাই করবেন',
        'আপনার আঙুলে অদৃশ্য কালি লাগানো হবে',
        'আপনাকে একটি ব্যালট পেপার দেওয়া হবে',
        'নিরাপদ কক্ষে গিয়ে ব্যালট পেপারে আপনার পছন্দের প্রার্থীর প্রতীক চিহ্নিত করুন',
        'ব্যালট পেপারটি সিল করা ব্যালট বাক্সে ফেলুন',
      ],
    },
    {
      title: 'ভোট কেন্দ্রে আচরণ',
      rules: [
        'ভোট কেন্দ্রে ধৈর্য্য ধারণ করুন এবং শান্তি বজায় রাখুন',
        'অফিসারদের নির্দেশনা মেনে চলুন',
        'অন্যান্য ভোটারদের গোপনীয়তা সম্মান করুন',
        'কোনো প্রকার বিতর্ক বা ঝগড়া থেকে বিরত থাকুন',
        'ভোট দেওয়ার পর অবিলম্বে ভোট কেন্দ্র ত্যাগ করুন',
      ],
    },
  ];

  // কী সঙ্গে নিতে হবে
  const requiredItems = [
    {
      icon: '🆔',
      title: 'জাতীয় পরিচয়পত্র (NID)',
      description: 'মূল NID কার্ড বা স্মার্ট কার্ড অবশ্যই সঙ্গে আনতে হবে',
      mandatory: true,
    },
    {
      icon: '📱',
      title: 'মোবাইল ফোন',
      description: 'জরুরি যোগাযোগের জন্য (ক্যামেরা বন্ধ রাখুন)',
      mandatory: false,
    },
    {
      icon: '💧',
      title: 'পানি',
      description: 'দীর্ঘ অপেক্ষার জন্য পানি সঙ্গে রাখতে পারেন',
      mandatory: false,
    },
    {
      icon: '☂️',
      title: 'ছাতা',
      description: 'বৃষ্টির দিনে প্রয়োজন হতে পারে',
      mandatory: false,
    },
  ];

  // কী নিষিদ্ধ
  const prohibitedItems = [
    {
      icon: '🚫',
      title: 'মোবাইল ফোনের ক্যামেরা',
      description: 'ভোট কেন্দ্রে ফটো বা ভিডিও তোলা সম্পূর্ণ নিষিদ্ধ',
    },
    {
      icon: '🚫',
      title: 'রাজনৈতিক পোস্টার/প্ল্যাকার্ড',
      description: 'কোনো প্রকার রাজনৈতিক উপকরণ সঙ্গে আনা যাবে না',
    },
    {
      icon: '🚫',
      title: 'শব্দযন্ত্র',
      description: 'লাউডস্পিকার, মাইক, বা বড় আকারের শব্দযন্ত্র নিষিদ্ধ',
    },
    {
      icon: '🚫',
      title: 'অস্ত্র বা ক্ষতিকর বস্তু',
      description: 'কোনো প্রকার অস্ত্র বা ক্ষতিকর বস্তু সঙ্গে আনা সম্পূর্ণ নিষিদ্ধ',
    },
    {
      icon: '🚫',
      title: 'মদ বা নেশাদ্রব্য',
      description: 'মাদকদ্রব্য বা মদ সঙ্গে আনা কঠোরভাবে নিষিদ্ধ',
    },
    {
      icon: '🚫',
      title: 'বড় ব্যাগ',
      description: 'বড় ব্যাগ বা জিনিসপত্র সঙ্গে আনা যাবে না',
    },
  ];

  // জরুরি যোগাযোগ নম্বর
  const emergencyContacts = [
    {
      category: 'নির্বাচন কমিশন',
      contacts: [
        { name: 'কেন্দ্রীয় নির্বাচন কমিশন', phone: '02-55166333', email: 'info@ecs.gov.bd' },
        { name: 'বগুড়া জেলা নির্বাচন অফিসার', phone: '051-66666', email: 'bogura@ecs.gov.bd' },
        { name: 'হেল্পলাইন (২৪/৭)', phone: '16123', email: '' },
      ],
      color: 'bg-blue-50 border-blue-200',
      icon: '📞',
    },
    {
      category: 'পুলিশ',
      contacts: [
        { name: 'জরুরি পুলিশ সহায়তা', phone: '999', email: '' },
        { name: 'বগুড়া পুলিশ সুপার', phone: '051-66667', email: '' },
        { name: 'থানা পুলিশ (সদর)', phone: '051-66668', email: '' },
      ],
      color: 'bg-red-50 border-red-200',
      icon: '🚔',
    },
    {
      category: 'প্রার্থী অফিস',
      contacts: [
        { name: 'প্রধানমন্ত্রী কার্যালয়', phone: '02-9540001', email: 'info@pmo.gov.bd' },
        { name: 'স্থানীয় প্রার্থী অফিস', phone: '051-XXXXX', email: 'local@example.com' },
      ],
      color: 'bg-green-50 border-green-200',
      icon: '🏛️',
    },
    {
      category: 'অন্যান্য জরুরি',
      contacts: [
        { name: 'জরুরি চিকিৎসা', phone: '999', email: '' },
        { name: 'আগুন নিয়ন্ত্রণ', phone: '16163', email: '' },
        { name: 'নাগরিক তথ্য সেবা', phone: '333', email: '' },
      ],
      color: 'bg-yellow-50 border-yellow-200',
      icon: '🆘',
    },
  ];

  // ভোট দিবসের গুরুত্বপূর্ণ তথ্য
  const importantInfo = [
    {
      title: 'ভোটের সময়',
      content: 'সকাল ৮:০০ টা - বিকাল ৪:০০ টা',
      icon: '⏰',
    },
    {
      title: 'ভোটের তারিখ',
      content: '১৫ ফেব্রুয়ারি, ২০২৬',
      icon: '📅',
    },
    {
      title: 'ভোট কেন্দ্র খুঁজে বের করুন',
      content: 'আপনার জাতীয় পরিচয়পত্রের নম্বর দিয়ে NID ওয়েবসাইটে ভোট কেন্দ্র খুঁজে নিন',
      icon: '📍',
    },
    {
      title: 'ভোটার তালিকা যাচাই',
      content: 'ভোট দেওয়ার আগে অবশ্যই ভোটার তালিকায় আপনার নাম যাচাই করে নিন',
      icon: '✅',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* হিরো সেকশন */}
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
          <span className="text-4xl">✅</span>
          ভোট দিবস সহায়তা
        </h1>
        <p className="text-gray-600 text-lg">ভোট দিবসের সকল প্রয়োজনীয় তথ্য ও নির্দেশিকা এক জায়গায়</p>
      </div>

      {/* গুরুত্বপূর্ণ তথ্য কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {importantInfo.map((info, idx) => (
          <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
            <div className="text-3xl mb-2">{info.icon}</div>
            <div className="font-bold text-gray-900 mb-1">{info.title}</div>
            <div className="text-sm text-gray-700">{info.content}</div>
          </div>
        ))}
      </div>

      {/* ভোট কেন্দ্রের নিয়মাবলী */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-3xl">📋</span>
          ভোট কেন্দ্রের নিয়মাবলী
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pollingCenterRules.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.rules.map((rule, ruleIdx) => (
                  <li key={ruleIdx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                    <span className="text-sm leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* কী সঙ্গে নিতে হবে */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-3xl">✅</span>
          কী সঙ্গে নিতে হবে
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {requiredItems.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl border-2 p-5 shadow-sm ${
                item.mandatory ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                {item.mandatory && (
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">অবশ্যই</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* কী নিষিদ্ধ */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-3xl">🚫</span>
          কী সঙ্গে আনা নিষিদ্ধ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prohibitedItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border-2 border-red-200 p-5 shadow-sm bg-red-50">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* জরুরি যোগাযোগ নম্বর */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-3xl">📞</span>
          জরুরি যোগাযোগ নম্বর
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {emergencyContacts.map((group, idx) => (
            <div key={idx} className={`rounded-xl border-2 p-6 shadow-sm ${group.color}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{group.icon}</span>
                <h3 className="text-xl font-bold text-gray-900">{group.category}</h3>
              </div>
              <div className="space-y-3">
                {group.contacts.map((contact, contactIdx) => (
                  <div key={contactIdx} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="font-semibold text-gray-900 mb-2">{contact.name}</div>
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm mb-1"
                      >
                        <span>📞</span>
                        <span>{contact.phone}</span>
                      </a>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        <span>✉️</span>
                        <span>{contact.email}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* অতিরিক্ত সহায়তা */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-3xl">💡</span>
          অতিরিক্ত সহায়তা
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">ভোটার তালিকা যাচাই করুন</h3>
            <p className="text-gray-700 text-sm mb-4">আপনার জাতীয় পরিচয়পত্র নম্বর দিয়ে NID ওয়েবসাইটে ভোটার তালিকায় আপনার নাম যাচাই করুন</p>
            <a
              href="https://services.nidw.gov.bd/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              NID ওয়েবসাইটে যান →
            </a>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">ভোট কেন্দ্র খুঁজুন</h3>
            <p className="text-gray-700 text-sm mb-4">আপনার এলাকার ভোট কেন্দ্রের অবস্থান এবং বিস্তারিত তথ্য জানুন</p>
            <Link
              to="/election/assistance"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ভোট কেন্দ্র খুঁজুন →
            </Link>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">প্রার্থী সম্পর্কে জানুন</h3>
            <p className="text-gray-700 text-sm mb-4">আপনার এলাকার প্রার্থীদের প্রোফাইল এবং নির্বাচনী ইশতেহার দেখুন</p>
            <Link
              to="/election/candidates"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              প্রার্থী দেখুন →
            </Link>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">নির্বাচনী সংবাদ</h3>
            <p className="text-gray-700 text-sm mb-4">নির্বাচনের সর্বশেষ সংবাদ এবং আপডেট দেখুন</p>
            <Link
              to="/election/news"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              সংবাদ দেখুন →
            </Link>
          </div>
        </div>
      </div>

      {/* ফিরে যাওয়ার লিংক */}
      <div className="text-center">
        <Link
          to="/election"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-lg"
        >
          ← নির্বাচন কেন্দ্রে ফিরে যান
        </Link>
      </div>
    </div>
  );
}

export default VotingDayAssistance;

