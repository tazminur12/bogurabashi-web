import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

function ElectionNews() {
  const axiosSecure = useAxiosSecure();

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['election-news'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/news');
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        // শুধুমাত্র "নির্বাচন" ক্যাটাগরির নিউজ দেখাবে
        const filtered = list.filter((n) => n.category === 'নির্বাচন');
        return filtered
          .filter((n) => n.status === 'Published')
          .sort((a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0))
          .slice(0, 9);
      } catch (e) {
        console.error('Election news fetch failed', e);
        return [];
      }
    },
    retry: 1,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">নির্বাচন সংবাদ ও আপডেট</h1>
        <p className="text-gray-600 mt-1">অফিসিয়াল ঘোষণা, প্রচারণা খবর ও ফলাফল</p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-600">খবর লোড হচ্ছে...</div>
      ) : news.length === 0 ? (
        <div className="py-12 text-center text-gray-600">কোনো নির্বাচন-সংক্রান্ত খবর পাওয়া যায়নি</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n) => (
            <div key={n._id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
              {n.imageUrl && (
                <img src={n.imageUrl} alt={n.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-5">
                <div className="text-sm text-blue-600 font-medium mb-2">{n.category || 'Election'}</div>
                <div className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{n.title}</div>
                <div className="text-sm text-gray-600 line-clamp-3 mb-3">{n.content}</div>
                <Link to={`/news/${n._id}`} className="text-blue-600 font-medium">Read more →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ElectionNews;


