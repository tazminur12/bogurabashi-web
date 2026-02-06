import React, { useState } from 'react';
import usePageTitle from '../../../hooks/usePageTitle';
import Swal from 'sweetalert2';
import { FaTrash, FaPlus, FaFlag } from 'react-icons/fa';

const ManageParties = () => {
  usePageTitle('দল ব্যবস্থাপনা | বগুড়াবাসী');

  // Mock data for parties
  const [parties, setParties] = useState([
    { id: 1, name: 'বাংলাদেশ আওয়ামী লীগ', symbol: 'নৌকা', color: '#008000' },
    { id: 2, name: 'বাংলাদেশ জাতীয়তাবাদী দল', symbol: 'ধানের শীষ', color: '#0000FF' },
    { id: 3, name: 'জাতীয় পার্টি', symbol: 'লাঙ্গল', color: '#FFFF00' },
  ]);

  const [newPartyName, setNewPartyName] = useState('');
  const [newPartySymbol, setNewPartySymbol] = useState('');
  const [newPartyColor, setNewPartyColor] = useState('#000000');

  const handleAddParty = (e) => {
    e.preventDefault();

    if (!newPartyName || !newPartySymbol) {
      Swal.fire({
        icon: 'error',
        title: 'দুঃখিত',
        text: 'দলের নাম এবং প্রতীক আবশ্যক',
      });
      return;
    }

    const newParty = {
      id: Date.now(),
      name: newPartyName,
      symbol: newPartySymbol,
      color: newPartyColor,
    };

    setParties([...parties, newParty]);
    setNewPartyName('');
    setNewPartySymbol('');
    setNewPartyColor('#000000');

    Swal.fire({
      icon: 'success',
      title: 'সফল হয়েছে',
      text: 'নতুন দল সফলভাবে যুক্ত করা হয়েছে',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDeleteParty = (id) => {
    Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: "আপনি এটি আর ফিরে পাবেন না!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন!',
      cancelButtonText: 'বাতিল'
    }).then((result) => {
      if (result.isConfirmed) {
        setParties(parties.filter(party => party.id !== id));
        Swal.fire(
          'মুছে ফেলা হয়েছে!',
          'দলটি সফলভাবে মুছে ফেলা হয়েছে।',
          'success'
        );
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Add Party Form */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaPlus className="text-blue-600" />
              নতুন দল যোগ করুন
            </h2>
            <form onSubmit={handleAddParty} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">দলের নাম</label>
                <input
                  type="text"
                  value={newPartyName}
                  onChange={(e) => setNewPartyName(e.target.value)}
                  placeholder="দলের নাম লিখুন"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">প্রতীক (Symbol)</label>
                <input
                  type="text"
                  value={newPartySymbol}
                  onChange={(e) => setNewPartySymbol(e.target.value)}
                  placeholder="প্রতীক লিখুন (যেমন: নৌকা)"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">রঙ (Color Code)</label>
                <div className="flex gap-2">
                    <input
                    type="color"
                    value={newPartyColor}
                    onChange={(e) => setNewPartyColor(e.target.value)}
                    className="h-10 w-14 p-1 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                    type="text"
                    value={newPartyColor}
                    onChange={(e) => setNewPartyColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 uppercase"
                    />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                দল যুক্ত করুন
              </button>
            </form>
          </div>
        </div>

        {/* Parties List */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaFlag className="text-green-600" />
              দলের তালিকা ({parties.length})
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 font-semibold text-gray-600">রঙ</th>
                    <th className="p-3 font-semibold text-gray-600">দলের নাম</th>
                    <th className="p-3 font-semibold text-gray-600">প্রতীক</th>
                    <th className="p-3 font-semibold text-gray-600 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {parties.length > 0 ? (
                    parties.map((party) => (
                      <tr key={party.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3">
                          <div 
                            className="w-8 h-8 rounded-full shadow-sm border border-gray-200" 
                            style={{ backgroundColor: party.color }}
                            title={party.color}
                          ></div>
                        </td>
                        <td className="p-3 font-medium text-gray-800">{party.name}</td>
                        <td className="p-3 text-gray-600">{party.symbol}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteParty(party.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colspan="4" className="p-8 text-center text-gray-500">
                        কোনো দল পাওয়া যায়নি। নতুন দল যুক্ত করুন।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageParties;
