import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
            {/* Header */}
            <header className="mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-2">বগুড়া বাসী</h1>
                <p className="text-gray-600">বগুড়া জেলার তথ্য ও সম্প্রদায়ের প্লাটফর্ম</p>
            </header>
            
            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
                <div className="text-8xl font-bold text-red-500 mb-6">৪০৪</div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                    পৃষ্ঠাটি পাওয়া যায়নি!
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                    দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা আমাদের সাইটে নেই। 
                    এটি মুছে ফেলা হতে পারে বা URL-টি ভুল হতে পারে।
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                    >
                        পূর্বের পৃষ্ঠায় ফিরে যান
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                    >
                        হোমপেজে যান
                    </button>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="mt-8 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} Bogura Bashi. সকল অধিকার সংরক্ষিত।</p>
                <p className="mt-1">এটি একটি উন্মুক্ত ও বিনামূল্যের ওয়েবসাইট</p>
            </footer>
        </div>
    );
};

export default NotFound;