import React from 'react';
import { motion } from 'framer-motion';
import usePageTitle from '../hooks/usePageTitle';
import {
  FaBullseye,
  FaHandsHelping,
  FaUsers,
  FaHeart,
  FaCode,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaGlobe,
  FaMobileAlt,
  FaUniversity,
  FaMoneyCheckAlt,
  FaCopy,
  FaCheck
} from 'react-icons/fa';
import aboutImg from '../assets/bogura.png';

// Ensure linter recognizes usage of motion in JSX context
const _MOTION_USED = motion;

const About = () => {
  usePageTitle('আমাদের সম্পর্কে | বগুড়াবাসী – Bogurabashi');
  const features = [
    {
      icon: <FaBullseye className="text-blue-600 text-3xl" />,
      title: "আমাদের লক্ষ্য",
      description: "বগুড়াবাসীর জন্য সকল প্রয়োজনীয় সেবা এক জায়গায় উপস্থাপন।"
    },
    {
      icon: <FaHandsHelping className="text-green-600 text-3xl" />,
      title: "সামাজিক দায়িত্ব",
      description: "সমাজসেবামূলক কার্যক্রমে আমাদের সক্রিয় অংশগ্রহণ।"
    },
    {
      icon: <FaUsers className="text-purple-600 text-3xl" />,
      title: "সাম্প্রদায়িকতা",
      description: "সকল ধর্ম ও বর্ণের মানুষের জন্য উন্মুক্ত প্ল্যাটফর্ম।"
    },
    {
      icon: <FaHeart className="text-red-600 text-3xl" />,
      title: "স্বেচ্ছাসেবক",
      description: "১০০% ফ্রি ও মানবিক ভিত্তিক সেবা প্রদান।"
    }
  ];

  // অনুদান নম্বর/অ্যাকাউন্টগুলো এখানে পরিবর্তন করতে পারবেন
  const donationAccounts = {
    bkashPersonal: {
      label: 'bKash (Personal)',
      number: '01645460095'
    },
    nagadPersonal: {
      label: 'Nagad (Personal)',
      number: '01645460095'
    },
    dbblRocket: {
      label: 'Dutch-Bangla Rocket',
      number: '01645460095'
    },
    bank: {
      bankName: 'Sonali Bank PLC',
      accountName: 'Tazminur Rahman Tanim',
      accountNumber: '0629601001712',
      branch: 'Shibganj Branch'
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 relative inline-block">
              <span className="relative z-10">আমাদের সম্পর্কে</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 z-0 opacity-70"></span>
            </h2>
            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              "বগুড়াবাসী" একটি আধুনিক ওয়েব প্ল্যাটফর্ম, যা বগুড়া জেলার নাগরিকদের জন্য জরুরি তথ্য, সেবা এবং মানবিক সহায়তা একত্রিত করে সহজে উপস্থাপন করে।
            </motion.p>
          </motion.div>


          {/* Vision & Image */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
          >
            <motion.div variants={itemVariants}>
              <img
                src={aboutImg}
                alt="About Us"
                className="rounded-xl shadow-xl w-full h-auto object-cover"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-3xl font-semibold text-gray-800">আমাদের লক্ষ্য</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                আমাদের উদ্দেশ্য হলো বগুড়ার প্রতিটি মানুষের জন্য তথ্য ও সেবা সহজলভ্য করা। যেমন: রক্তদাতা, হাসপাতাল, পুলিশ, ফায়ার সার্ভিস, ডাক্তার, ট্রান্সপোর্ট, শিক্ষা প্রতিষ্ঠান, আইনজীবী ও আরও অনেক দরকারি তথ্য।
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                এই প্ল্যাটফর্ম একদম ফ্রি। লগইন ছাড়াও তথ্য দেখা যাবে। রক্তদাতা হিসেবে যুক্ত হতে চাইলে রেজিস্ট্রেশন করে প্রোফাইল তৈরি করা যাবে।
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                চলুন একসাথে একটি ডিজিটাল, তথ্যসমৃদ্ধ ও মানবিক বগুড়া গড়ি।
              </p>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Developer Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-28 text-center"
          >
            <h3 className="text-4xl font-bold text-gray-800 mb-4 relative inline-block">
              <span className="relative z-10">ডেভেলপার</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200 z-0 opacity-70 -mb-1 rounded-full"></span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-12">
              এই প্রজেক্টটি আমি নিজে সম্পূর্ণভাবে পরিকল্পনা, ডিজাইন ও ডেভেলপ করেছি — বগুড়াবাসীর জন্য একটি এক্সক্লুসিভ ডিজিটাল প্ল্যাটফর্ম হিসেবে।
            </p>

            <div className="flex justify-center">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 max-w-xl w-full"
              >
                <div className="p-8">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                      <FaCode className="text-blue-600 text-3xl" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800">Tazminur Rahman Tanim</h4>
                    <p className="text-blue-600 text-sm mt-1 mb-4">Full-Stack Web Developer</p>
                    <p className="text-gray-700 text-center mb-6">
                      I'm a passionate web developer from Bogura, skilled in modern technologies. I love creating meaningful digital solutions for real-life problems.
                    </p>
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 mb-2">দক্ষতা:</h5>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {["React", "Node.js", "Firebase", "MongoDB", "Express.js", "Tailwind CSS", "Framer Motion"].map((skill, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-5 mt-6 justify-center">
                      <a href="https://linkedin.com/in/tazminur-rahman-tanim-305315336" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <FaLinkedin className="text-2xl" />
                      </a>
                      <a href="https://github.com/tazminur12" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black">
                        <FaGithub className="text-2xl" />
                      </a>
                      <a href="tanimkhalifa55@gmail.com" className="text-red-500 hover:text-red-700">
                        <FaEnvelope className="text-2xl" />
                      </a>
                      <a href="https://tanimportfolio1.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                        <FaGlobe className="text-2xl" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>


          {/* Donation Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-6 md:px-10 py-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white">ওয়েবসাইট উন্নয়নে অনুদান</h3>
                <p className="text-rose-100 mt-2 max-w-3xl">“বগুড়াবাসী” প্ল্যাটফর্মটিকে আরও সমৃদ্ধ করতে আপনার ছোট একটি অনুদান অনেক বড় পরিবর্তন আনতে পারে। চাইলে নিচের মাধ্যমগুলোতে অনুদান পাঠাতে পারেন।</p>
              </div>
              <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mobile Wallets */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaMobileAlt className="mr-2 text-rose-600" /> মোবাইল ব্যাংকিং
                  </h4>
                  <DonationRow label={donationAccounts.bkashPersonal.label} value={donationAccounts.bkashPersonal.number} />
                  <DonationRow label={donationAccounts.nagadPersonal.label} value={donationAccounts.nagadPersonal.number} />
                  <DonationRow label={donationAccounts.dbblRocket.label} value={donationAccounts.dbblRocket.number} />
                </div>

                {/* Bank Account */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaUniversity className="mr-2 text-rose-600" /> ব্যাংক একাউন্ট
                  </h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                    <p className="text-gray-700"><span className="font-semibold">Bank:</span> {donationAccounts.bank.bankName}</p>
                    <p className="text-gray-700"><span className="font-semibold">Account Name:</span> {donationAccounts.bank.accountName}</p>
                    <p className="text-gray-700"><span className="font-semibold">Account No:</span> {donationAccounts.bank.accountNumber}</p>
                    <p className="text-gray-700"><span className="font-semibold">Branch:</span> {donationAccounts.bank.branch}</p>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <FaMoneyCheckAlt /> অনুগ্রহ করে রেফারেন্সে “Bogurabashi” লিখে দিন।
                  </div>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center bg-blue-600 rounded-xl p-8 shadow-lg"
          >
            <h4 className="text-2xl font-semibold text-white mb-4">আপনিও আমাদের সাথে যুক্ত হোন</h4>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              যদি আপনি আমাদের কার্যক্রমে সহযোগী হতে চান, কিংবা কোনো মতামত দিতে চান—যোগাযোগ করতে দ্বিধা করবেন না।
            </p>
            <motion.a
              href="/contact"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-100 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              যোগাযোগ করুন
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default About;

function DonationRow({ label, value }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore clipboard error
    }
  };
  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-3">
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="font-semibold text-gray-800 tracking-wider">{value}</div>
      </div>
      <button onClick={copy} className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
        {copied ? <FaCheck className="text-green-600" /> : <FaCopy />}
        {copied ? 'কপি হয়েছে' : 'কপি'}
      </button>
    </div>
  );
}
