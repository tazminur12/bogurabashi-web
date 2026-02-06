import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaNewspaper, FaPoll, FaCogs, FaChartPie, FaFlag } from "react-icons/fa";

const ElectionAdmin = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">ইলেকশন সেন্টার অ্যাডমিন</h2>
        <p className="text-gray-600 mt-1">এখান থেকে নির্বাচনের কনটেন্ট ম্যানেজ করুন।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminCard
          icon={<FaUsers className="text-3xl text-blue-600" />}
          title="প্রার্থী ব্যবস্থাপনা"
          desc="প্রার্থী যোগ, আপডেট, মুছুন"
          to="/election/candidates"
          manageTo="/dashboard/election-candidates-list"
          cta="পাবলিক ভিউ"
        />
        <AdminCard
          icon={<FaFlag className="text-3xl text-red-600" />}
          title="দল ব্যবস্থাপনা"
          desc="দলের নাম, প্রতীক, ও রঙ সেটআপ"
          to="#"
          manageTo="/dashboard/election-parties"
          cta=""
        />
        <AdminCard
          icon={<FaPoll className="text-3xl text-violet-600" />}
          title="জরিপ (Polls)"
          desc="পোল কনফিগারেশন ও রেজাল্ট"
          to="/election/polls"
          manageTo="/dashboard/election-polls"
          cta="পাবলিক ভিউ"
        />
        <AdminCard
          icon={<FaChartPie className="text-3xl text-orange-600" />}
          title="নির্বাচন ফলাফল"
          desc="ইউনিয়ন ও কেন্দ্র ভিত্তিক ফলাফল"
          to="/election/results"
          manageTo="/dashboard/election-results-list"
          cta="পাবলিক ভিউ"
        />
        <AdminCard
          icon={<FaNewspaper className="text-3xl text-emerald-600" />}
          title="নির্বাচন সংবাদ"
          desc="খবর যোগ/আপডেট/ম্যানেজ"
          to="/election/news"
          cta="পাবলিক ভিউ"
        />
        <AdminCard
          icon={<FaCogs className="text-3xl text-gray-600" />}
          title="ভোটার সহায়তা"
          desc="সহায়তা পোস্ট, কেন্দ্র, ঘোষণা"
          to="/dashboard/voter-assistance"
          manageTo="/dashboard/voter-assistance"
          cta="পাবলিক ভিউ"
        />
      </div>

      <div className="mt-10 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FaCogs className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">দ্রুত সেটআপ</h3>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>ডেটা সোর্স যুক্ত করুন (API/Spreadsheet)</li>
          <li>ক্যাটাগরি/ট্যাগ নির্ধারণ করুন</li>
          <li>পাবলিক পেজে কনটেন্ট যাচাই করুন</li>
        </ul>
      </div>
    </div>
  );
};

const AdminCard = ({ icon, title, desc, to, cta, manageTo }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="mb-3">{icon}</div>
      <div className="text-lg font-semibold text-gray-800">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
      <div className="mt-4 flex items-center gap-3">
        {manageTo ? (
          <Link to={manageTo} className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
            অ্যাড/এডিট
          </Link>
        ) : (
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
            অ্যাড/এডিট
          </button>
        )}
        <Link to={to} className="text-blue-600 text-sm hover:underline">
          {cta}
        </Link>
      </div>
    </div>
  );
};

export default ElectionAdmin;


