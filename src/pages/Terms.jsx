import React from 'react';
import usePageTitle from '../hooks/usePageTitle';

const Terms = () => {
  usePageTitle('ব্যবহারের শর্তাবলী (Terms of Use) | বগুড়াবাসী – Bogurabashi');
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ব্যবহারের শর্তাবলী</h1>
          <p className="text-sm text-gray-500 mb-8">শেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">📋 সাধারণ শর্তাবলী</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  বগুড়াবাসী ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলী মেনে নিচ্ছেন। এই ওয়েবসাইট ব্যবহার করার আগে অনুগ্রহ করে সম্পূর্ণ শর্তাবলী পড়ুন।
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">✅ অনুমোদিত ব্যবহার</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">আপনি যা করতে পারবেন:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• দুর্যোগ/অন্যায় রিপোর্ট জমা দেওয়া</li>
                    <li>• সেবা সম্পর্কিত তথ্য দেখা</li>
                    <li>• যোগাযোগের তথ্য শেয়ার করা</li>
                    <li>• সাইটের content পড়া</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium text-red-900 mb-2">আপনি যা করতে পারবেন না:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• মিথ্যা তথ্য দেওয়া</li>
                    <li>• অন্যদের ক্ষতি করা</li>
                    <li>• সাইটের নিরাপত্তা ভঙ্গ করা</li>
                    <li>• বেআইনি কাজে ব্যবহার করা</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">🔒 ব্যবহারকারীর দায়িত্ব</h2>
              <div className="bg-purple-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    সঠিক ও সত্য তথ্য দেওয়া
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    অন্যদের অধিকার সম্মান করা
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    সাইটের নিয়ম মেনে চলা
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    যোগাযোগের তথ্য আপডেট রাখা
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">📱 সেবার সীমা</h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>সতর্কতা:</strong> আমরা সর্বোচ্চ চেষ্টা করি সেবা প্রদানের জন্য, তবে ইন্টারনেট সংযোগ, সার্ভার সমস্যা বা অন্যান্য কারণে সেবা বাধাগ্রস্ত হতে পারে। আমরা এর জন্য দায়ী নই।
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">🖼️ ছবি আপলোড নীতি</h2>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-900 mb-2">ছবি আপলোড করার সময়:</h3>
                <ul className="text-sm space-y-1">
                  <li>• শুধুমাত্র প্রাসঙ্গিক ছবি আপলোড করুন</li>
                  <li>• অন্যদের ছবি অনুমতি ছাড়া আপলোড করবেন না</li>
                  <li>• অশালীন বা ক্ষতিকারক ছবি আপলোড করবেন না</li>
                  <li>• ছবির কপিরাইট মেনে চলুন</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">⚖️ আইনি দায়বদ্ধতা</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>গুরুত্বপূর্ণ:</strong> এই ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি স্বীকার করছেন যে আমরা আপনার কর্মের জন্য দায়ী নই। আপনি নিজের কর্মের জন্য সম্পূর্ণ দায়ী।
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">📅 শর্তাবলী পরিবর্তন</h2>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm">
                  আমরা প্রয়োজন অনুযায়ী এই শর্তাবলী পরিবর্তন করতে পারি। গুরুত্বপূর্ণ পরিবর্তন হলে আমরা আপনাকে জানাবো। নিয়মিত এই পেজটি দেখুন।
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">📞 যোগাযোগ করুন</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-3">শর্তাবলী সম্পর্কে কোনো প্রশ্ন বা পরামর্শ থাকলে:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="mailto:info@bogurabashi.com" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📧 ইমেইল করুন
                  </a>
                  <a 
                    href="tel:+8801645460095" 
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📞 কল করুন
                  </a>
                  <a 
                    href="https://www.facebook.com/profile.php?id=61579077791828" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    📘 Facebook
                  </a>
                </div>
              </div>
            </section>

            <section className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <h2 className="text-lg font-semibold text-red-900 mb-2">🚨 জরুরি নোট</h2>
              <p className="text-sm text-red-800">
                এই শর্তাবলী পরিবর্তন হতে পারে। গুরুত্বপূর্ণ পরিবর্তন হলে আমরা আপনাকে জানাবো। নিয়মিত এই পেজটি দেখুন এবং শর্তাবলী মেনে চলুন।
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
