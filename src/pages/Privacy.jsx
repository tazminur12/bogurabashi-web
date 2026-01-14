import React from 'react';
import usePageTitle from '../hooks/usePageTitle';

const Privacy = () => {
  usePageTitle('গোপনীয়তা নীতি (Privacy Policy) | বগুড়াবাসী – Bogurabashi');
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">গোপনীয়তা নীতি</h1>
          <p className="text-sm text-gray-500 mb-8">শেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">🎯 আমাদের উদ্দেশ্য</h2>
              <p>
                বগুড়াবাসী ওয়েবসাইটে আমরা আপনার গোপনীয়তা রক্ষা করি। এই নীতিতে বর্ণিত হয়েছে আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">📊 আমরা কী তথ্য সংগ্রহ করি</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">রিপোর্টের তথ্য:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>দুর্যোগ/অন্যায়ের বিবরণ ও ছবি</li>
                  <li>রিপোর্টের সময় ও স্থান</li>
                </ul>
                <div className="mt-3 p-3 bg-blue-100 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-blue-800 font-medium">
                    🔒 গুরুত্বপূর্ণ: আমরা আপনার ব্যক্তিগত তথ্য (ফোন নম্বর, ঠিকানা ইত্যাদি) কখনোই প্রকাশ করি না। শুধুমাত্র প্রয়োজনীয় তথ্যই দেখানো হয়।
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">🔒 তথ্য সুরক্ষা</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">✅ আমরা যা করি:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• আপনার তথ্য এনক্রিপ্ট করে রাখি</li>
                    <li>• শুধুমাত্র প্রয়োজনীয় তথ্য সংগ্রহ করি</li>
                    <li>• তৃতীয় পক্ষের সাথে শেয়ার করি না</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-900 mb-2">⚠️ সতর্কতা:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• ইন্টারনেটে ১০০% নিরাপত্তা নিশ্চিত নয়</li>
                    <li>• আপনার পাসওয়ার্ড কাউকে বলবেন না</li>
                    <li>• সন্দেহজনক লিংক এড়িয়ে চলুন</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">🖼️ ছবি আপলোড সম্পর্কে</h2>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>ImgBB সেবা:</strong> আমরা ছবি হোস্টিংয়ের জন্য ImgBB ব্যবহার করি। আপনার ছবি তাদের সার্ভারে সংরক্ষিত হয় এবং আমরা শুধুমাত্র URL লিংক রাখি। ImgBB-এর নিজস্ব গোপনীয়তা নীতি রয়েছে।
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">🍪 কুকিজ (Cookies)</h2>
              <p>
                আমাদের ওয়েবসাইটে কুকিজ ব্যবহার করা হয় যা আপনার অভিজ্ঞতা উন্নত করে। আপনি চাইলে ব্রাউজার সেটিংস থেকে কুকিজ বন্ধ করতে পারেন।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">📱 আপনার অধিকার</h2>
              <div className="bg-orange-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    আপনার দেওয়া তথ্য দেখার অধিকার
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    ভুল তথ্য সংশোধনের অধিকার
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    তথ্য মুছে ফেলার অনুরোধ করার অধিকার
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">📞 যোগাযোগ করুন</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-3">গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন বা পরামর্শ থাকলে:</p>
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
                এই গোপনীয়তা নীতি পরিবর্তন হতে পারে। গুরুত্বপূর্ণ পরিবর্তন হলে আমরা আপনাকে জানাবো। নিয়মিত এই পেজটি দেখুন।
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;


