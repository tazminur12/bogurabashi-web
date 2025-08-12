import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "স্বাগতম! আমি বগুড়া সম্পর্কে আপনার যেকোনো প্রশ্নের উত্তর দিতে পারি। আপনি বাংলা বা ইংরেজি যেকোনো ভাষায় জিজ্ঞাসা করতে পারেন।",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Advanced AI responses about Bogura - understands both Bengali and English
  const getBoguraResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Bogura history and culture - বাংলা + ইংরেজি
    if (lowerMessage.includes('ইতিহাস') || lowerMessage.includes('history') || lowerMessage.includes('পুরনো') || lowerMessage.includes('ancient')) {
      return "বগুড়া একটি ঐতিহাসিক শহর। এটি প্রাচীন পুণ্ড্র রাজ্যের রাজধানী ছিল। মহাস্থানগড় এখানকার সবচেয়ে গুরুত্বপূর্ণ প্রত্নতাত্ত্বিক স্থান। বগুড়ার ইতিহাস প্রায় ২৫০০ বছরের পুরনো। এখানে অনেক প্রাচীন রাজা-রানী রাজত্ব করেছেন। পুণ্ড্র রাজ্য ছিল বাংলার সবচেয়ে প্রাচীন রাজ্য।";
    }
    
    if (lowerMessage.includes('সংস্কৃতি') || lowerMessage.includes('culture') || lowerMessage.includes('লোক') || lowerMessage.includes('folk')) {
      return "বগুড়ার সংস্কৃতি খুবই সমৃদ্ধ। এখানে বাঙালি সংস্কৃতির পাশাপাশি আদিবাসী সংস্কৃতিও দেখা যায়। লোকগীতি, নৃত্য, উৎসব এখানকার সংস্কৃতির অংশ। এখানে বাউল গান, ভাটিয়ালি গান, জারি গান প্রচলিত। এছাড়া এখানে অনেক ধরনের লোকনৃত্য এবং লোকউৎসব হয়।";
    }
    
    // Famous places - বাংলা + ইংরেজি
    if (lowerMessage.includes('দর্শনীয়') || lowerMessage.includes('tourist') || lowerMessage.includes('place') || lowerMessage.includes('দেখার') || lowerMessage.includes('visit')) {
      return "বগুড়ায় অনেক দর্শনীয় স্থান আছে: মহাস্থানগড়, পাহাড়পুর বৌদ্ধবিহার, নাটোর রাজবাড়ি, বগুড়া জাদুঘর, শালবন বিহার, গোকুল মেধ, ভাসু বিহার, আদমদীঘি, শেরপুর জমিদার বাড়ি ইত্যাদি। এছাড়া এখানে অনেক সুন্দর পার্ক এবং লেক আছে।";
    }
    
    if (lowerMessage.includes('মহাস্থানগড়') || lowerMessage.includes('mahasthangarh') || lowerMessage.includes('পুরনো শহর')) {
      return "মহাস্থানগড় বগুড়ার সবচেয়ে বিখ্যাত প্রত্নতাত্ত্বিক স্থান। এটি প্রাচীন পুণ্ড্র রাজ্যের রাজধানী ছিল। এখানে অনেক প্রাচীন মন্দির, প্রাসাদ এবং দুর্গের ধ্বংসাবশেষ আছে। এটি ইউনেস্কো বিশ্ব ঐতিহ্যের তালিকায় অন্তর্ভুক্ত। এখানে প্রত্নতাত্ত্বিক খনন করে অনেক মূল্যবান জিনিস পাওয়া গেছে।";
    }
    
    if (lowerMessage.includes('পাহাড়পুর') || lowerMessage.includes('paharpur') || lowerMessage.includes('বৌদ্ধ')) {
      return "পাহাড়পুর বৌদ্ধবিহার বিশ্ব ঐতিহ্যের অংশ। এটি ৮ম শতাব্দীতে নির্মিত হয়েছিল। এখানে বৌদ্ধ ধর্মের অনেক নিদর্শন আছে। এটি দক্ষিণ এশিয়ার সবচেয়ে বড় বৌদ্ধবিহার। এখানে বৌদ্ধ ভিক্ষুরা ধ্যান করতেন এবং বৌদ্ধ ধর্মের শিক্ষা দিতেন।";
    }
    
    // Food and cuisine - বাংলা + ইংরেজি
    if (lowerMessage.includes('খাবার') || lowerMessage.includes('food') || lowerMessage.includes('cuisine') || lowerMessage.includes('মিষ্টি') || lowerMessage.includes('sweet')) {
      return "বগুড়ার খাবার খুবই সুস্বাদু। এখানকার বিখ্যাত খাবার: বগুড়ার দই, চমচম, সন্দেশ, রসগোল্লা, কালোজাম, আমসত্ত্ব, পেরা, মালাই, ক্ষীর ইত্যাদি। এছাড়া এখানে অনেক ধরনের মিষ্টি এবং নোনতা খাবার পাওয়া যায়। বগুড়ার দই বাংলাদেশের সেরা।";
    }
    
    if (lowerMessage.includes('দই') || lowerMessage.includes('curd') || lowerMessage.includes('yogurt')) {
      return "বগুড়ার দই বিশ্ববিখ্যাত। এটি খুবই মিষ্টি এবং সুস্বাদু। বগুড়ার দই নিয়ে একটি প্রবাদ আছে: 'বগুড়ার দই, রাজশাহীর ধান, দিনাজপুরের মিষ্টি'। এখানকার দই দুধ থেকে তৈরি হয় এবং খুবই পুষ্টিকর। বগুড়ার দই এর স্বাদ এবং গন্ধ অনন্য।";
    }
    
    // Education and institutions - বাংলা + ইংরেজি
    if (lowerMessage.includes('শিক্ষা') || lowerMessage.includes('education') || lowerMessage.includes('university') || lowerMessage.includes('কলেজ') || lowerMessage.includes('college')) {
      return "বগুড়ায় অনেক শিক্ষা প্রতিষ্ঠান আছে। এখানে বগুড়া মেডিকেল কলেজ, বগুড়া পলিটেকনিক ইনস্টিটিউট, বগুড়া সরকারি কলেজ, বগুড়া সরকারি মহিলা কলেজ, বগুড়া ক্যাডেট কলেজ, বগুড়া বিশ্ববিদ্যালয় কলেজ ইত্যাদি আছে। এখানে উচ্চ শিক্ষার জন্য সব ধরনের সুবিধা আছে।";
    }
    
    if (lowerMessage.includes('মেডিকেল') || lowerMessage.includes('medical') || lowerMessage.includes('ডাক্তার') || lowerMessage.includes('doctor')) {
      return "বগুড়া মেডিকেল কলেজ একটি বিখ্যাত মেডিকেল প্রতিষ্ঠান। এটি ১৯৯২ সালে প্রতিষ্ঠিত হয়েছিল। এখানে অনেক ভালো ডাক্তার তৈরি হয়েছে। এখানে MBBS, BDS এবং অন্যান্য মেডিকেল কোর্স পড়ানো হয়। এখানকার শিক্ষার্থীরা দেশে-বিদেশে সুনাম অর্জন করেছে।";
    }
    
    // Transportation - বাংলা + ইংরেজি
    if (lowerMessage.includes('যাতায়াত') || lowerMessage.includes('transport') || lowerMessage.includes('bus') || lowerMessage.includes('train') || lowerMessage.includes('কিভাবে যাব') || lowerMessage.includes('how to go')) {
      return "বগুড়ায় যাতায়াতের জন্য বাস, ট্রেন, অটোরিকশা সবই আছে। ঢাকা থেকে বগুড়ায় বাসে ৪-৫ ঘণ্টা লাগে। ট্রেনে ৬-৭ ঘণ্টা লাগে। এছাড়া এখানে CNG, রিকশা, সাইকেল রিকশা সবই পাওয়া যায়। বগুড়া শহরের ভিতরে যাতায়াতের জন্য অটোরিকশা এবং রিকশা সবচেয়ে সুবিধাজনক।";
    }
    
    // Weather and climate - বাংলা + ইংরেজি
    if (lowerMessage.includes('আবহাওয়া') || lowerMessage.includes('weather') || lowerMessage.includes('climate') || lowerMessage.includes('গরম') || lowerMessage.includes('ঠান্ডা') || lowerMessage.includes('hot') || lowerMessage.includes('cold')) {
      return "বগুড়ায় গ্রীষ্মকালে গরম, বর্ষাকালে বৃষ্টি এবং শীতকালে ঠান্ডা থাকে। এখানকার আবহাওয়া সাধারণত স্বাস্থ্যকর। এখানে তিনটি ঋতু দেখা যায়: গ্রীষ্ম, বর্ষা এবং শীত। গ্রীষ্মকালে তাপমাত্রা ৩৫-৪০°C হয়, শীতকালে ১০-১৫°C হয়।";
    }
    
    // Economy and business - বাংলা + ইংরেজি
    if (lowerMessage.includes('অর্থনীতি') || lowerMessage.includes('economy') || lowerMessage.includes('business') || lowerMessage.includes('কৃষি') || lowerMessage.includes('agriculture')) {
      return "বগুড়ার অর্থনীতি কৃষি নির্ভর। এখানে ধান, গম, আখ, আলু, পাট চাষ হয়। এছাড়া এখানে অনেক ছোট-বড় শিল্প প্রতিষ্ঠান আছে। এখানে চিনি কল, বস্ত্র শিল্প, খাদ্য শিল্প ইত্যাদি আছে। বগুড়ার কৃষি পণ্য দেশে-বিদেশে রপ্তানি হয়।";
    }
    
    // People and population - বাংলা + ইংরেজি
    if (lowerMessage.includes('মানুষ') || lowerMessage.includes('people') || lowerMessage.includes('population') || lowerMessage.includes('জনসংখ্যা') || lowerMessage.includes('বাসিন্দা')) {
      return "বগুড়ার মানুষ খুবই অতিথিপরায়ণ এবং বন্ধুত্বপূর্ণ। এখানে বাঙালি, আদিবাসী সবাই মিলেমিশে বাস করে। এখানকার মানুষ শিক্ষিত এবং সংস্কৃতিমনা। এখানে হিন্দু, মুসলিম, বৌদ্ধ সব ধর্মের মানুষ বাস করে। বগুড়ার জনসংখ্যা প্রায় ৩৫ লক্ষ।";
    }
    
    // Shopping and markets - বাংলা + ইংরেজি
    if (lowerMessage.includes('শপিং') || lowerMessage.includes('shopping') || lowerMessage.includes('market') || lowerMessage.includes('বাজার') || lowerMessage.includes('কিনতে')) {
      return "বগুড়ায় অনেক বাজার এবং শপিং সেন্টার আছে। এখানে বগুড়া সদর বাজার, শেরপুর বাজার, আদমদীঘি বাজার, শাহজাদপুর বাজার ইত্যাদি বিখ্যাত। এখানে কাপড়, জুতা, ইলেকট্রনিক্স, মিষ্টি, ফল সবই পাওয়া যায়। বগুড়ার বাজারে দাম তুলনামূলক কম।";
    }
    
    // Hotels and accommodation - বাংলা + ইংরেজি
    if (lowerMessage.includes('হোটেল') || lowerMessage.includes('hotel') || lowerMessage.includes('থাকা') || lowerMessage.includes('stay') || lowerMessage.includes('accommodation')) {
      return "বগুড়ায় অনেক ভালো হোটেল এবং গেস্ট হাউস আছে। এখানে বগুড়া গেস্ট হাউস, সিটি ইন, হোটেল স্টার, হোটেল সিলভার, হোটেল প্রিন্স, হোটেল রিভার ভিউ ইত্যাদি বিখ্যাত। এখানে বাজেট থেকে লাক্সারি সব ধরনের হোটেল পাওয়া যায়। দাম ১০০০-৫০০০ টাকা পর্যন্ত।";
    }
    
    // Festivals and events - বাংলা + ইংরেজি
    if (lowerMessage.includes('উৎসব') || lowerMessage.includes('festival') || lowerMessage.includes('পূজা') || lowerMessage.includes('ঈদ') || lowerMessage.includes('celebration')) {
      return "বগুড়ায় অনেক উৎসব পালিত হয়। এখানে দুর্গাপূজা, ঈদুল ফিতর, ঈদুল আজহা, পয়লা বৈশাখ, পহেলা ফাল্গুন ইত্যাদি উৎসব বড় আকারে পালিত হয়। এছাড়া এখানে লোকউৎসব, মেলা, জারি গানের আসর ইত্যাদি হয়।";
    }
    
    // Sports and recreation - বাংলা + ইংরেজি
    if (lowerMessage.includes('খেলা') || lowerMessage.includes('sports') || lowerMessage.includes('ক্রিকেট') || lowerMessage.includes('ফুটবল') || lowerMessage.includes('cricket') || lowerMessage.includes('football')) {
      return "বগুড়ায় অনেক ধরনের খেলা হয়। এখানে ক্রিকেট, ফুটবল, ভলিবল, ব্যাডমিন্টন ইত্যাদি খেলা জনপ্রিয়। বগুড়া স্টেডিয়ামে জাতীয় এবং আন্তর্জাতিক ম্যাচ হয়। এছাড়া এখানে অনেক ক্লাব এবং খেলার মাঠ আছে।";
    }
    
    // General greeting - বাংলা + ইংরেজি
    if (lowerMessage.includes('হ্যালো') || lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('কেমন আছ') || lowerMessage.includes('how are you') || lowerMessage.includes('good morning') || lowerMessage.includes('good evening')) {
      return "হ্যালো! আমি ভালো আছি। আপনি কেমন আছেন? বগুড়া সম্পর্কে কিছু জানতে চান? আমি আপনাকে বগুড়ার ইতিহাস, সংস্কৃতি, দর্শনীয় স্থান, খাবার, শিক্ষা প্রতিষ্ঠান, যাতায়াত, আবহাওয়া, অর্থনীতি, মানুষ, শপিং, হোটেল, উৎসব, খেলা ইত্যাদি সম্পর্কে জানাতে পারি।";
    }
    
    // Help and guidance - বাংলা + ইংরেজি
    if (lowerMessage.includes('সাহায্য') || lowerMessage.includes('help') || lowerMessage.includes('কি জানতে পারি') || lowerMessage.includes('what can you tell') || lowerMessage.includes('সব জানাও')) {
      return "আমি আপনাকে বগুড়া সম্পর্কে অনেক কিছু জানাতে পারি। আপনি জিজ্ঞাসা করতে পারেন: বগুড়ার ইতিহাস, সংস্কৃতি, দর্শনীয় স্থান, বিখ্যাত খাবার, শিক্ষা প্রতিষ্ঠান, যাতায়াত, আবহাওয়া, অর্থনীতি, মানুষ, শপিং, হোটেল, উৎসব, খেলা ইত্যাদি সম্পর্কে। আপনি বাংলা বা ইংরেজি যেকোনো ভাষায় জিজ্ঞাসা করতে পারেন।";
    }
    
    // Default response - বাংলা + ইংরেজি
    return "আপনার প্রশ্নটি বুঝতে পারছি না। আপনি বগুড়ার ইতিহাস, সংস্কৃতি, দর্শনীয় স্থান, খাবার, শিক্ষা প্রতিষ্ঠান, যাতায়াত, আবহাওয়া, অর্থনীতি, মানুষ, শপিং, হোটেল, উৎসব, খেলা ইত্যাদি সম্পর্কে জিজ্ঞাসা করতে পারেন। অথবা 'সাহায্য' লিখে দেখুন আমি কি কি জানাতে পারি। আপনি বাংলা বা ইংরেজি যেকোনো ভাষায় জিজ্ঞাসা করতে পারেন।";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBoguraResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300"
        title="Live Chat"
      >
        {isOpen ? <FaTimes size={24} /> : <FaComments size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaRobot size={20} />
                <div>
                  <h3 className="font-semibold">বগুড়া AI সহকারী</h3>
                  <p className="text-sm text-blue-100">বাংলা/ইংরেজি সব ভাষায় উত্তর দিচ্ছি</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.sender === 'user' ? (
                      <FaUser size={12} className="text-blue-200" />
                    ) : (
                      <FaRobot size={12} className="text-blue-600" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.timestamp.toLocaleTimeString('bn-BD', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg rounded-bl-none shadow-sm px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <FaRobot size={12} className="text-blue-600" />
                    <span className="text-xs text-gray-500">টাইপ করছি...</span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="বাংলা বা ইংরেজিতে প্রশ্ন করুন..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              বাংলা বা ইংরেজি যেকোনো ভাষায় জিজ্ঞাসা করুন
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;
