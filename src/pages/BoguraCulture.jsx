import React from "react";
import {
  FaMusic,
  FaUtensils,
  FaPalette,
  FaTheaterMasks,
  FaPray,
  FaHandsHelping,
  FaBook,
  FaHeart,
  FaStar,
  FaLeaf,
  FaDrum,
  FaGuitar,
  FaPaintBrush,
  FaCamera,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrophy
} from "react-icons/fa";

const BoguraCulture = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                <FaHeart className="mr-2" />
                সাংস্কৃতিক ঐতিহ্য
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">বগুড়ার সংস্কৃতি</h1>
            <p className="text-xl md:text-2xl leading-relaxed max-w-5xl mx-auto opacity-95 mb-8">
              বহু পুরনো সাংস্কৃতিক ঐতিহ্য, কৃষিভিত্তিক জীবনযাপন, লোকজ শিল্পকলা ও ধর্মীয় সহাবস্থানের এক অনন্য উদাহরণ
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <FaMusic className="inline mr-2" />
                লোকসংগীত
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <FaUtensils className="inline mr-2" />
                ঐতিহ্যবাহী খাবার
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <FaTheaterMasks className="inline mr-2" />
                নাট্যচর্চা
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <FaPray className="inline mr-2" />
                ধর্মীয় উৎসব
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Cultural Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <FaMusic className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">লোকসংগীত</h3>
            <p className="text-2xl font-bold text-green-600">১০০+</p>
            <p className="text-sm text-gray-600 mt-1">গানের ধরন</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <FaTheaterMasks className="text-3xl text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">নাট্যদল</h3>
            <p className="text-2xl font-bold text-emerald-600">৫০+</p>
            <p className="text-sm text-gray-600 mt-1">সক্রিয় দল</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <FaUtensils className="text-3xl text-teal-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">ঐতিহ্যবাহী খাবার</h3>
            <p className="text-2xl font-bold text-teal-600">২৫+</p>
            <p className="text-sm text-gray-600 mt-1">বিশেষ খাবার</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <FaCalendarAlt className="text-3xl text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">উৎসব</h3>
            <p className="text-2xl font-bold text-blue-600">১২+</p>
            <p className="text-sm text-gray-600 mt-1">বছরে পালিত</p>
          </div>
        </div>

        {/* Language and Literature */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaBook className="text-3xl text-green-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">ভাষা ও সাহিত্য</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">আঞ্চলিক ভাষা</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                বগুড়ার আঞ্চলিক ভাষা বাংলার একটি মিষ্টিভাষী উপভাষা। এখানকার কথ্যভাষা ও সাহিত্যে গ্রামীণ জীবন ও মানবিকতার ছাপ স্পষ্ট।
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">ভাষার বৈশিষ্ট্য</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• মিষ্টি উচ্চারণ</li>
                  <li>• গ্রামীণ শব্দভাণ্ডার</li>
                  <li>• সহজ-সরল বাক্য গঠন</li>
                  <li>• লোকজ অভিব্যক্তি</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">সাহিত্যিক ঐতিহ্য</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                বগুড়ায় বহু কবি, সাহিত্যিক ও নাট্যকার জন্মগ্রহণ করেছেন। নাট্যচর্চা ও কবিতাপাঠের আসর আজও জনপ্রিয়।
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">সাহিত্যিক অবদান</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• কবিতা ও গল্প</li>
                  <li>• নাটক ও উপন্যাস</li>
                  <li>• লোকসাহিত্য সংগ্রহ</li>
                  <li>• সাংবাদিকতা</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Music and Folk Tradition */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaMusic className="text-3xl text-emerald-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">লোকসংগীত ও লোকঐতিহ্য</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <FaDrum className="text-3xl text-orange-600 mr-3" />
                <h3 className="text-xl font-bold text-orange-800">পালাগান</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                প্রাচীন লোকগাথা ও মহাকাব্যিক কাহিনী নিয়ে রচিত গান। এতে বীরত্ব, প্রেম ও নৈতিক শিক্ষার গল্প বর্ণিত হয়।
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-cyan-200">
              <div className="flex items-center mb-4">
                <FaGuitar className="text-3xl text-cyan-600 mr-3" />
                <h3 className="text-xl font-bold text-cyan-800">জারি-সারি</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                ধর্মীয় বিষয় নিয়ে রচিত লোকগান। বিশেষত কারবালার ঘটনা নিয়ে রচিত গানগুলো খুবই জনপ্রিয়।
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-emerald-200">
              <div className="flex items-center mb-4">
                <FaMusic className="text-3xl text-emerald-600 mr-3" />
                <h3 className="text-xl font-bold text-emerald-800">ভাটিয়ালি</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                নদী ও প্রকৃতির সাথে মানুষের সম্পর্ক নিয়ে রচিত গান। মাঝি ও নদীপারের মানুষের জীবনধারা ফুটে ওঠে।
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-indigo-200">
              <div className="flex items-center mb-4">
                <FaHeart className="text-3xl text-indigo-600 mr-3" />
                <h3 className="text-xl font-bold text-indigo-800">বাউল গান</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                আধ্যাত্মিক প্রেম ও মানবতাবাদী দর্শন নিয়ে রচিত গান। বাউল শিল্পীরা এখনও গ্রামীণ মেলাতে পরিবেশন করেন।
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-pink-200">
              <div className="flex items-center mb-4">
                <FaUsers className="text-3xl text-pink-600 mr-3" />
                <h3 className="text-xl font-bold text-pink-800">লোকনৃত্য</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                বিভিন্ন উৎসব ও অনুষ্ঠানে পরিবেশিত লোকনৃত্য। এতে গ্রামীণ জীবনের আনন্দ ও উচ্ছ্বাস ফুটে ওঠে।
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <FaHandsHelping className="text-3xl text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-green-800">লোকজ ঐতিহ্য</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                প্রজন্ম থেকে প্রজন্মে চলে আসা লোকজ জ্ঞান ও ঐতিহ্য। এতে রয়েছে গল্প, প্রবাদ, রীতি-নীতি।
              </p>
            </div>
          </div>
        </section>

        {/* Traditional Food */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaUtensils className="text-3xl text-orange-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">ঐতিহ্যবাহী খাবার</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">বগুড়ার দই</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                বগুড়ার সবচেয়ে জনপ্রিয় খাবার হলো "বগুড়ার দই" – যা শুধু দেশের মধ্যেই নয়, আন্তর্জাতিক ক্ষেত্রেও সমাদৃত।
              </p>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">দইয়ের বৈশিষ্ট্য</h4>
                <ul className="text-orange-700 space-y-1">
                  <li>• মিষ্টি স্বাদ</li>
                  <li>• ঘন গঠন</li>
                  <li>• স্বাস্থ্যকর</li>
                  <li>• দীর্ঘদিন সংরক্ষণযোগ্য</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">অন্যান্য মিষ্টান্ন</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                এছাড়া ক্ষীর, পিঠা, ঘি ও গরম জিলাপি খুবই জনপ্রিয়। প্রতিটি খাবারই বগুড়ার ঐতিহ্যের অংশ।
              </p>
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">জনপ্রিয় মিষ্টান্ন</h4>
                <ul className="text-yellow-700 space-y-1">
                  <li>• ক্ষীর</li>
                  <li>• পিঠা</li>
                  <li>• ঘি</li>
                  <li>• গরম জিলাপি</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200 text-center">
              <FaUtensils className="text-3xl text-orange-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-orange-800 mb-2">দই</h3>
              <p className="text-sm text-gray-600">বগুড়ার গর্ব</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200 text-center">
              <FaStar className="text-3xl text-yellow-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-yellow-800 mb-2">ক্ষীর</h3>
              <p className="text-sm text-gray-600">ঐতিহ্যবাহী মিষ্টি</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 text-center">
              <FaLeaf className="text-3xl text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-800 mb-2">পিঠা</h3>
              <p className="text-sm text-gray-600">শীতকালীন খাবার</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200 text-center">
              <FaTrophy className="text-3xl text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-purple-800 mb-2">জিলাপি</h3>
              <p className="text-sm text-gray-600">উৎসবের খাবার</p>
            </div>
          </div>
        </section>

        {/* Clothing and Handicrafts */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaPalette className="text-3xl text-purple-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">পোশাক ও হস্তশিল্প</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">ঐতিহ্যবাহী পোশাক</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                এখানকার মানুষ সাধারণত সাদামাটা পোশাকে অভ্যস্ত হলেও উৎসব বা সামাজিক অনুষ্ঠানে তাঁতের শাড়ি, লুঙ্গি ও দেশি জামদানি খুব জনপ্রিয়।
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">পোশাকের ধরন</h4>
                <ul className="text-purple-700 space-y-1">
                  <li>• তাঁতের শাড়ি</li>
                  <li>• লুঙ্গি</li>
                  <li>• দেশি জামদানি</li>
                  <li>• গ্রামীণ পোশাক</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">হস্তশিল্প</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                কাঁথা সেলাই ও বাঁশের হস্তশিল্প বগুড়ার গৃহস্থালি ও উৎসবের অবিচ্ছেদ্য অংশ। এগুলো শুধু ব্যবহার্য নয়, শিল্পকর্মও বটে।
              </p>
              <div className="bg-teal-50 rounded-lg p-4">
                <h4 className="font-semibold text-teal-800 mb-2">হস্তশিল্পের ধরন</h4>
                <ul className="text-teal-700 space-y-1">
                  <li>• কাঁথা সেলাই</li>
                  <li>• বাঁশের কাজ</li>
                  <li>• মৃৎশিল্প</li>
                  <li>• বয়নশিল্প</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Festivals and Theatre */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaTheaterMasks className="text-3xl text-blue-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">উৎসব ও নাট্যচর্চা</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">ধর্মীয় উৎসব</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                নববর্ষ, ঈদ, দুর্গাপূজা, পিঠা উৎসব ও গ্রামীণ মেলা বগুড়ায় উদ্দীপনায় পালিত হয়। প্রতিটি উৎসবেই রয়েছে নিজস্ব ঐতিহ্য।
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">প্রধান উৎসব</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• বাংলা নববর্ষ</li>
                  <li>• ঈদুল ফিতর ও ঈদুল আজহা</li>
                  <li>• দুর্গাপূজা</li>
                  <li>• পিঠা উৎসব</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">নাট্যচর্চা</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                নাট্যচর্চা বগুড়ার অন্যতম শক্তিশালী সাংস্কৃতিক অংশ, যেখান থেকে অনেক বিখ্যাত নাট্যশিল্পী উঠে এসেছেন।
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">নাট্যচর্চার ধরন</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• লোকনাটক</li>
                  <li>• আধুনিক নাটক</li>
                  <li>• পথনাটক</li>
                  <li>• নাট্য উৎসব</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cultural Organizations */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaUsers className="text-3xl text-indigo-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">সাংস্কৃতিক সংগঠন</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
              <h3 className="text-xl font-bold text-indigo-800 mb-3">নাট্যদল</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                বগুড়ায় অসংখ্য নাট্যদল রয়েছে। এরা নিয়মিত নাটক মঞ্চস্থ করে এবং নতুন প্রতিভা বিকাশে সহায়তা করে।
              </p>
              <div className="text-sm text-indigo-600 font-medium">
                সক্রিয় দল: ৫০+
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-3">সংগীত সংগঠন</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                লোকসংগীত ও আধুনিক সংগীতের চর্চা করে বিভিন্ন সংগঠন। এরা উৎসব ও অনুষ্ঠানে পরিবেশন করে।
              </p>
              <div className="text-sm text-green-600 font-medium">
                সংগঠন: ৩০+
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
              <h3 className="text-xl font-bold text-orange-800 mb-3">সাহিত্য সংগঠন</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                কবিতা, গল্প, উপন্যাসের চর্চা করে সাহিত্য সংগঠনগুলো। এরা নিয়মিত সাহিত্য আসর আয়োজন করে।
              </p>
              <div className="text-sm text-orange-600 font-medium">
                সংগঠন: ২০+
              </div>
            </div>
          </div>
        </section>

        {/* Cultural Tourism */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaMapMarkerAlt className="text-3xl text-teal-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">সাংস্কৃতিক পর্যটন</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-200">
              <div className="flex items-center mb-4">
                <FaCamera className="text-3xl text-teal-600 mr-3" />
                <h3 className="text-xl font-bold text-teal-800">সাংস্কৃতিক উৎসব</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                বিভিন্ন সাংস্কৃতিক উৎসবে পর্যটকরা বগুড়ার ঐতিহ্য দেখতে পারেন। এতে রয়েছে নাটক, সংগীত, নৃত্য।
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <FaPaintBrush className="text-3xl text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-purple-800">হস্তশিল্প কেন্দ্র</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                হস্তশিল্প কেন্দ্রগুলোতে পর্যটকরা ঐতিহ্যবাহী শিল্পকর্ম দেখতে ও কেনার সুযোগ পান।
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
              <div className="flex items-center mb-4">
                <FaUtensils className="text-3xl text-yellow-600 mr-3" />
                <h3 className="text-xl font-bold text-yellow-800">খাবার উৎসব</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                বিভিন্ন খাবার উৎসবে বগুড়ার ঐতিহ্যবাহী খাবার উপভোগ করা যায়। বিশেষত দই উৎসব খুবই জনপ্রিয়।
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl p-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">বগুড়ার সংস্কৃতি সম্পর্কে আরও জানুন</h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              বগুড়ার সংস্কৃতি শুধু স্থানীয় নয়, জাতীয় সম্পদ। এখানকার লোকজ ঐতিহ্য, শিল্পকলা ও উৎসব
              বাংলাদেশের সাংস্কৃতিক ঐতিহ্যের গুরুত্বপূর্ণ অংশ।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors shadow-lg font-semibold">
                সাংস্কৃতিক উৎসবে যোগ দিন
              </button>
              <button className="px-8 py-3 bg-green-500 text-white border border-green-400 rounded-lg hover:bg-green-600 transition-colors shadow-lg font-semibold">
                হস্তশিল্প কেনা
              </button>
              <button className="px-8 py-3 bg-green-500 text-white border border-green-400 rounded-lg hover:bg-green-600 transition-colors shadow-lg font-semibold">
                ঐতিহ্যবাহী খাবার
              </button>
            </div>
          </div>
        </section>

        {/* Footer Quote */}
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <FaHeart className="text-3xl text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            "বগুড়ার সংস্কৃতি - মাটির ঘ্রাণে গাঁথা মানুষের জীবনধারা"
          </h3>
          <p className="text-gray-600 text-lg mb-4">
            প্রজন্ম থেকে প্রজন্মে চলে আসা ঐতিহ্য ও সংস্কৃতির ধারক
          </p>
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">
              তথ্যসূত্র: স্থানীয় সাংস্কৃতিক সংগঠন, ইতিহাসবিদ ও বগুড়াবাসীর অভিজ্ঞতা
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoguraCulture;
