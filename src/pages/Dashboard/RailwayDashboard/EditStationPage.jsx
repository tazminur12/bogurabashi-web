import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const daysOfWeek = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const commonFacilities = [
  'অপেক্ষার কক্ষ',
  'শৌচাগার',
  'খাবারের দোকান',
  'পার্কিং',
  'ওয়াইফাই',
  'এটিএম',
  'টিকেট কাউন্টার',
  'প্রতিবন্ধী প্রবেশাধিকার'
];

const EditStationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contact: '',
    address: '',
    division: '',
    platforms: '',
    facilities: [],
    stationMaster: { name: '', contact: '' },
    trains: [{ trainNo: '', name: '', arrival: '', departure: '', days: [] }]
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const res = await axiosSecure.get(`/stations/${id}`);
        setFormData({
          name: res.data.name || '',
          code: res.data.code || '',
          contact: res.data.contact || '',
          address: res.data.address || '',
          division: res.data.division || '',
          platforms: res.data.platforms || '',
          facilities: res.data.facilities || [],
          stationMaster: res.data.stationMaster || { name: '', contact: '' },
          trains: res.data.trains && res.data.trains.length > 0 ? res.data.trains : [{ trainNo: '', name: '', arrival: '', departure: '', days: [] }]
        });
      } catch {
        Swal.fire('ত্রুটি!', 'স্টেশন ডেটা লোড করতে ব্যর্থ হয়েছে', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStation();
  }, [id, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => {
      const facilities = prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility];
      return { ...prev, facilities };
    });
  };

  const handleTrainChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedTrains = [...formData.trains];
    if (type === 'checkbox') {
      if (checked) {
        updatedTrains[index].days = [...updatedTrains[index].days, value];
      } else {
        updatedTrains[index].days = updatedTrains[index].days.filter(day => day !== value);
      }
    } else {
      updatedTrains[index][name] = value;
    }
    setFormData(prev => ({ ...prev, trains: updatedTrains }));
  };

  const addTrain = () => {
    setFormData(prev => ({
      ...prev,
      trains: [
        ...prev.trains,
        { trainNo: '', name: '', arrival: '', departure: '', days: [] }
      ]
    }));
  };

  const removeTrain = (index) => {
    setFormData(prev => ({
      ...prev,
      trains: prev.trains.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ফর্ম সাবমিট রুখে দেয়
    setSubmitting(true); // লোডিং স্টেট চালু
  
    try {
      await axiosSecure.put(`/stations/${id}`, formData); // আপডেট রিকোয়েস্ট
      Swal.fire('সফল!', 'স্টেশন সফলভাবে আপডেট হয়েছে!', 'success');
      navigate('/dashboard/rail-service'); // রিডাইরেক্ট
    } catch (error) {
      Swal.fire('ত্রুটি!', error.response?.data?.message || 'স্টেশন আপডেট করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setSubmitting(false); // লোডিং স্টেট বন্ধ
    }
  };
  

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-500">লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">রেলওয়ে স্টেশন এডিট করুন</h2>
        <button
          onClick={() => navigate('/dashboard/rail-service')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          স্টেশন তালিকায় ফিরে যান
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* মৌলিক তথ্য */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">মৌলিক তথ্য</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">স্টেশনের নাম*</label>
                <input
                  name="name"
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">স্টেশন কোড*</label>
                <input
                  name="code"
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">যোগাযোগ নম্বর</label>
                <input
                  name="contact"
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.contact}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
                <input
                  name="address"
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">রেলওয়ে বিভাগ</label>
                <input
                  name="division"
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.division}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">প্ল্যাটফর্ম সংখ্যা</label>
                <input
                  name="platforms"
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.platforms}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          {/* স্টেশন মাস্টারের তথ্য */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">স্টেশন মাস্টারের তথ্য</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
                <input
                  name="stationMaster.name"
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.stationMaster.name}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">যোগাযোগ নম্বর</label>
                <input
                  name="stationMaster.contact"
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.stationMaster.contact}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
            </div>

            {/* সুবিধাদি */}
            <h3 className="text-lg font-semibold mb-4 mt-6 text-gray-700">সুবিধাদি</h3>
            <div className="grid grid-cols-2 gap-2">
              {commonFacilities.map(facility => (
                <div key={facility} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`facility-${facility}`}
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={submitting}
                  />
                  <label htmlFor={`facility-${facility}`} className="ml-2 text-sm text-gray-700">
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ট্রেনের সময়সূচী */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">ট্রেনের সময়সূচী</h3>
            <button
              type="button"
              onClick={addTrain}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
              disabled={submitting}
            >
              ট্রেন যোগ করুন
            </button>
          </div>

          {formData.trains.map((train, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ট্রেন নম্বর*</label>
                  <input
                    name="trainNo"
                    type="text"
                    value={train.trainNo}
                    onChange={(e) => handleTrainChange(index, e)}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ট্রেনের নাম*</label>
                  <input
                    name="name"
                    type="text"
                    value={train.name}
                    onChange={(e) => handleTrainChange(index, e)}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">আগমনের সময়</label>
                  <input
                    name="arrival"
                    type="time"
                    value={train.arrival}
                    onChange={(e) => handleTrainChange(index, e)}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">নির্গমনের সময়</label>
                  <input
                    name="departure"
                    type="time"
                    value={train.departure}
                    onChange={(e) => handleTrainChange(index, e)}
                    className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">চলাচলের দিন</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`day-${index}-${day}`}
                        value={day}
                        checked={train.days.includes(day)}
                        onChange={(e) => handleTrainChange(index, e)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={submitting}
                      />
                      <label htmlFor={`day-${index}-${day}`} className="ml-2 text-sm text-gray-700">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.trains.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTrain(index)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                  disabled={submitting}
                >
                  ট্রেন বাদ দিন
                </button>
              )}
            </div>
          ))}
        </div>

        {/* সাবমিট বাটন */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/rail-service')}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            disabled={submitting}
          >
            বাতিল করুন
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            disabled={submitting}
          >
            আপডেট করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStationPage;
