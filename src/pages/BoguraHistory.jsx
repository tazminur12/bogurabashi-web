import React from "react";
import { FaMapMarkerAlt, FaUsers, FaIndustry, FaGraduationCap, FaLeaf, FaLandmark, FaBook, FaHeart } from "react-icons/fa";

const BoguraHistory = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">বগুড়ার ইতিহাস</h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              বাংলাদেশের উত্তরাঞ্চলে অবস্থিত একটি ঐতিহাসিক জেলা যা প্রাচীন পুন্ড্রনগরীর অংশ হিসেবে পরিচিত। 
              বগুড়া ছিল একসময় বৌদ্ধ, হিন্দু ও মুসলিম সভ্যতার গুরুত্বপূর্ণ কেন্দ্র।
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <FaMapMarkerAlt className="inline mr-2" />
                উত্তরাঞ্চলের প্রবেশদ্বার
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <FaLandmark className="inline mr-2" />
                ঐতিহাসিক নগরী
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <FaHeart className="inline mr-2" />
                সংস্কৃতির কেন্দ্র
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Quick Facts Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <FaMapMarkerAlt className="text-3xl text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">আয়তন</h3>
            <p className="text-2xl font-bold text-blue-600">২,৯৬৮ বর্গকিমি</p>
            <p className="text-sm text-gray-600 mt-1">মোট এলাকা</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <FaUsers className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">জনসংখ্যা</h3>
            <p className="text-2xl font-bold text-green-600">৩৫+ লক্ষ</p>
            <p className="text-sm text-gray-600 mt-1">আনুমানিক</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <FaIndustry className="text-3xl text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">উপজেলা</h3>
            <p className="text-2xl font-bold text-purple-600">১২টি</p>
            <p className="text-sm text-gray-600 mt-1">প্রশাসনিক ইউনিট</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <FaGraduationCap className="text-3xl text-orange-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">শিক্ষা</h3>
            <p className="text-2xl font-bold text-orange-600">৮৫%+</p>
            <p className="text-sm text-gray-600 mt-1">সাক্ষরতার হার</p>
          </div>
        </div>

        {/* Geography Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <FaMapMarkerAlt className="text-3xl text-blue-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">ভৌগোলিক অবস্থান</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">অবস্থান ও সীমানা</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                বগুড়া জেলা বাংলাদেশের রাজশাহী বিভাগের অন্তর্গত। উত্তরে জয়পুরহাট জেলা, দক্ষিণে সিরাজগঞ্জ জেলা, 
                পূর্বে জামালপুর ও ময়মনসিংহ জেলা এবং পশ্চিমে নওগাঁ জেলা অবস্থিত।
              </p>
              <p className="text-gray-600 leading-relaxed">
                জেলার প্রধান নদীগুলো হল করতোয়া, বাঙ্গালী, নাগর, ইছামতি ও তুলসীগঙ্গা। 
                এখানকার মাটি উর্বর এবং কৃষিকাজের জন্য উপযুক্ত।
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">জলবায়ু</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                বগুড়ার জলবায়ু উপক্রান্তীয় মৌসুমি। গ্রীষ্মকালে তাপমাত্রা ৩৫-৪০°C এবং শীতকালে ১০-১৫°C থাকে। 
                বার্ষিক বৃষ্টিপাত ১,৫০০-২,০০০ মিমি।
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">প্রধান ফসল</h4>
                <p className="text-blue-700">ধান, গম, আলু, আখ, পাট, সরিষা, ডাল</p>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Timeline */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaBook className="text-3xl text-indigo-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">ঐতিহাসিক কালক্রম</h2>
          </div>
          
          <div className="space-y-8">
            {/* Ancient Period */}
            <div className="border-l-4 border-blue-500 pl-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-blue-800 mb-3">প্রাচীন যুগ (খ্রিস্টপূর্ব ৩য় শতাব্দী - ৭ম শতাব্দী)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">মহাস্থানগড়</h4>
                    <p className="text-gray-600 leading-relaxed">
                      মহাস্থানগড় বগুড়ার অন্যতম প্রাচীন নিদর্শন, যা প্রাচীন পুন্ড্রবর্ধন নগরীর অংশ। 
                      এটি খ্রিস্টপূর্ব ৩য় শতাব্দীর একটি সভ্যতার নিদর্শন হিসেবে পরিচিত।
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">প্রত্নতাত্ত্বিক আবিষ্কার</h4>
                    <p className="text-gray-600 leading-relaxed">
                      এখানে পাওয়া গেছে বিভিন্ন প্রাচীন মুদ্রা, শিলালিপি, মন্দির, স্তূপ ও স্থাপত্যের ধ্বংসাবশেষ, 
                      যা প্রমাণ করে এই এলাকা বৌদ্ধ ও হিন্দু সভ্যতার কেন্দ্র ছিল।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medieval Period */}
            <div className="border-l-4 border-green-500 pl-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-green-800 mb-3">মধ্যযুগ (৭ম - ১৮শ শতাব্দী)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">মুসলিম শাসন</h4>
                    <p className="text-gray-600 leading-relaxed">
                      মুসলিম শাসনের সময় বগুড়া ছিল প্রশাসনিক ও সামরিক দিক দিয়ে গুরুত্বপূর্ণ অঞ্চল। 
                      এখানে বিভিন্ন মসজিদ, মাদ্রাসা ও স্থাপনা গড়ে ওঠে।
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">মুঘল আমল</h4>
                    <p className="text-gray-600 leading-relaxed">
                      মুঘল আমলে বগুড়ার গুরুত্ব বৃদ্ধি পায়। এ সময়ে এখানে বাণিজ্যিক কেন্দ্র হিসেবে বিকাশ ঘটে 
                      এবং বিভিন্ন ধর্মীয় প্রতিষ্ঠান গড়ে ওঠে।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* British Period */}
            <div className="border-l-4 border-purple-500 pl-6">
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-purple-800 mb-3">ব্রিটিশ আমল (১৭৫৭ - ১৯৪৭)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">প্রশাসনিক কাঠামো</h4>
                    <p className="text-gray-600 leading-relaxed">
                      ব্রিটিশ আমলে বগুড়া জেলার প্রশাসনিক কাঠামো গঠিত হয়। ১৮২১ সালে বগুড়া জেলা হিসেবে স্বীকৃতি পায় 
                      এবং এখানে আধুনিক শিক্ষা প্রতিষ্ঠান গড়ে ওঠে।
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">সামাজিক আন্দোলন</h4>
                    <p className="text-gray-600 leading-relaxed">
                      এ সময়ে বগুড়ায় বিভিন্ন সামাজিক আন্দোলন ও সংস্কার আন্দোলন শুরু হয়। 
                      শিক্ষা, স্বাস্থ্য ও নারী শিক্ষার ক্ষেত্রে উল্লেখযোগ্য অগ্রগতি হয়।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Liberation War */}
            <div className="border-l-4 border-red-500 pl-6">
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-red-800 mb-3">মুক্তিযুদ্ধ (১৯৭১)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">গৌরবময় ভূমিকা</h4>
                    <p className="text-gray-600 leading-relaxed">
                      স্বাধীনতা যুদ্ধে বগুড়াবাসীর ভূমিকা ছিল গৌরবময়। এখানে গুরুত্বপূর্ণ কিছু সংঘর্ষ হয় 
                      এবং অসংখ্য মানুষ শহীদ হন। বগুড়া ছিল মুক্তিযোদ্ধাদের একটি গুরুত্বপূর্ণ ঘাঁটি।
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">স্মৃতিসৌধ</h4>
                    <p className="text-gray-600 leading-relaxed">
                      বগুড়ায় রয়েছে মুক্তিযুদ্ধের স্মৃতিসৌধ ও স্মৃতিস্তম্ভ। এখানে শহীদদের স্মরণে 
                      বিভিন্ন স্মৃতিচিহ্ন নির্মিত হয়েছে।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Culture & Heritage */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaHeart className="text-3xl text-pink-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">সংস্কৃতি ও ঐতিহ্য</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-3">বগুড়ার দই</h3>
              <p className="text-gray-700 leading-relaxed">
                বগুড়ার দই সারা দেশে বিখ্যাত। এর স্বাদ ও গুণগত মানের জন্য এটি দেশ-বিদেশে সমাদৃত। 
                বগুড়ার দই শিল্প এখানকার অর্থনীতির একটি গুরুত্বপূর্ণ অংশ।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-teal-800 mb-3">নাট্যচর্চা</h3>
              <p className="text-gray-700 leading-relaxed">
                বগুড়ায় নাট্যচর্চার ঐতিহ্য সুপ্রাচীন। এখানে বিভিন্ন নাট্যদল রয়েছে এবং 
                নিয়মিত নাটক মঞ্চস্থ হয়। বগুড়ার নাটক সারা দেশে সমাদৃত।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-indigo-800 mb-3">শিক্ষা প্রতিষ্ঠান</h3>
              <p className="text-gray-700 leading-relaxed">
                বগুড়ায় রয়েছে অসংখ্য প্রাচীন ও আধুনিক শিক্ষা প্রতিষ্ঠান। 
                এখানকার শিক্ষার মান সারা দেশে স্বীকৃত। বগুড়া বিশ্ববিদ্যালয় এখানকার প্রধান শিক্ষা কেন্দ্র।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-cyan-800 mb-3">হস্তশিল্প</h3>
              <p className="text-gray-700 leading-relaxed">
                বগুড়ার হস্তশিল্প ঐতিহ্যবাহী। এখানে মৃৎশিল্প, বয়নশিল্প, বাঁশের কাজ, 
                কাঠের কাজ ইত্যাদি হস্তশিল্পের প্রচলন রয়েছে।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-800 mb-3">উৎসব</h3>
              <p className="text-gray-700 leading-relaxed">
                বগুড়ায় বিভিন্ন ধর্মীয় ও সাংস্কৃতিক উৎসব পালিত হয়। 
                পূজা, ঈদ, বড়দিন, নববর্ষ ইত্যাদি উৎসব এখানে আনন্দের সাথে পালিত হয়।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-3">সাহিত্য</h3>
              <p className="text-gray-700 leading-relaxed">
                বগুড়ায় সাহিত্যচর্চার ঐতিহ্য রয়েছে। এখানে অনেক কবি, সাহিত্যিক, 
                সাংবাদিক জন্মগ্রহণ করেছেন এবং তাদের রচনা সারা দেশে সমাদৃত।
              </p>
            </div>
          </div>
        </section>

        {/* Economy & Development */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaIndustry className="text-3xl text-green-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">অর্থনীতি ও উন্নয়ন</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">কৃষি</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                বগুড়ার অর্থনীতির মূল ভিত্তি কৃষি। এখানে ধান, গম, আলু, আখ, পাট, সরিষা, 
                ডাল ইত্যাদি ফসল উৎপাদিত হয়। বগুড়ার আলু সারা দেশে বিখ্যাত।
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">প্রধান কৃষি পণ্য</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• আলু (বাংলাদেশের আলুর রাজধানী)</li>
                  <li>• ধান ও গম</li>
                  <li>• আখ ও পাট</li>
                  <li>• শাকসবজি</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">শিল্প</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                বগুড়ায় বিভিন্ন শিল্প প্রতিষ্ঠান রয়েছে। এখানে চিনি শিল্প, বস্ত্র শিল্প, 
                খাদ্য প্রক্রিয়াকরণ শিল্প ইত্যাদি গড়ে উঠেছে।
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">প্রধান শিল্প</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• চিনি শিল্প</li>
                  <li>• বস্ত্র শিল্প</li>
                  <li>• খাদ্য প্রক্রিয়াকরণ</li>
                  <li>• হস্তশিল্প</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tourism */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <FaMapMarkerAlt className="text-3xl text-purple-600 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">পর্যটন আকর্ষণ</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-amber-800 mb-3">মহাস্থানগড়</h3>
              <p className="text-gray-700 leading-relaxed">
                প্রাচীন পুন্ড্রবর্ধন নগরীর ধ্বংসাবশেষ। প্রত্নতাত্ত্বিক নিদর্শন, মন্দির, স্তূপ ও জাদুঘর।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 mb-3">বগুড়া সেনানিবাস</h3>
              <p className="text-gray-700 leading-relaxed">
                বাংলাদেশ সেনাবাহিনীর গুরুত্বপূর্ণ সেনানিবাস। সামরিক ইতিহাস ও ঐতিহ্যের কেন্দ্র।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">বগুড়া বিশ্ববিদ্যালয়</h3>
              <p className="text-gray-700 leading-relaxed">
                উত্তরাঞ্চলের অন্যতম প্রধান শিক্ষা প্রতিষ্ঠান। সুন্দর ক্যাম্পাস ও শিক্ষা পরিবেশ।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-800 mb-3">বগুড়া শহর</h3>
              <p className="text-gray-700 leading-relaxed">
                আধুনিক শহর। বাজার, মসজিদ, মন্দির, পার্ক ও আধুনিক সুবিধা সমৃদ্ধ।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-3">নদী তীর</h3>
              <p className="text-gray-700 leading-relaxed">
                করতোয়া, বাঙ্গালী নদীর তীর। প্রকৃতির সৌন্দর্য উপভোগের স্থান।
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">গ্রামীণ জীবন</h3>
              <p className="text-gray-700 leading-relaxed">
                গ্রামীণ বাংলার ঐতিহ্যবাহী জীবনধারা। কৃষি, হস্তশিল্প ও লোকসংস্কৃতি।
              </p>
            </div>
          </div>
        </section>

        {/* Closing Quote */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-12">
          <h3 className="text-3xl font-bold mb-4">"বগুড়া - ইতিহাস, ঐতিহ্য ও সম্ভাবনার এক অপূর্ব মেলবন্ধন"</h3>
          <p className="text-xl text-blue-100 mb-6">
            প্রাচীন সভ্যতা থেকে আধুনিক উন্নয়ন - বগুড়ার যাত্রা অব্যাহত
          </p>
          <div className="bg-white/20 backdrop-blur-sm inline-block px-6 py-3 rounded-full">
            <p className="text-sm">তথ্যসূত্র: মহাস্থানগড়, সরকারি গেজেট, স্থানীয় ইতিহাসবিদদের রচনাসমূহ ও আধুনিক গবেষণা</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoguraHistory;
