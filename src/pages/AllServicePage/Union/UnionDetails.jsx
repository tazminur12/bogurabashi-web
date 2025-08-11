import React, { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaUsers, FaBuilding, FaCode, FaCalendarAlt, FaArrowLeft, FaPrint, FaShareAlt, FaDownload } from "react-icons/fa";

const UnionDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [union, setUnion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    const fetchUnion = async () => {
      try {
        setIsLoading(true);
        const res = await axiosSecure.get(`/unions/${id}`);
        setUnion(res.data);
      } catch (error) {
        setUnion(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnion();
  }, [id, axiosSecure]);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Share handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: union?.name,
          text: `ইউনিয়ন: ${union?.name} (${union?.upazila})`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      alert("আপনার ব্রাউজারে শেয়ার ফিচারটি নেই।");
    }
  };

  // Download as PDF handler (simple print-to-pdf)
  const handleDownload = () => {
    handlePrint();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-600">লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  if (!union) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">ইউনিয়ন পাওয়া যায়নি</h3>
        <p className="text-gray-500 text-sm mb-4">অনুরোধকৃত ইউনিয়ন পাওয়া যায়নি।</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition duration-200"
        >
          ← ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium"
          >
            <FaArrowLeft /> ফিরে যান
          </button>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <FaPrint /> প্রিন্ট
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <FaShareAlt /> শেয়ার
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <FaDownload /> ডাউনলোড
            </button>
          </div>
        </div>

        {/* Details Card */}
        <div ref={printRef} className="bg-white rounded-lg shadow-md p-8 print:shadow-none print:border print:border-gray-300">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">{union.name}</h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
              <FaMapMarkerAlt className="text-red-500" />
              <span>{union.upazila}</span>
            </div>
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              কোড: {union.code}
            </span>
          </div>

          {/* Description */}
          {union.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">বিবরণ</h3>
              <p className="text-gray-700 text-sm whitespace-pre-line">{union.description}</p>
            </div>
          )}

          {/* Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {union.population && (
              <div className="flex items-center gap-2">
                <FaUsers className="text-green-500" />
                <span className="text-gray-700 text-sm">জনসংখ্যা: {union.population.toLocaleString()}</span>
              </div>
            )}
            {union.area && (
              <div className="flex items-center gap-2">
                <FaBuilding className="text-purple-500" />
                <span className="text-gray-700 text-sm">আয়তন: {union.area} বর্গ কিমি</span>
              </div>
            )}
            {union.wardCount && (
              <div className="flex items-center gap-2">
                <FaCode className="text-blue-500" />
                <span className="text-gray-700 text-sm">ওয়ার্ড সংখ্যা: {union.wardCount}</span>
              </div>
            )}
            {union.villageCount && (
              <div className="flex items-center gap-2">
                <FaCode className="text-blue-500" />
                <span className="text-gray-700 text-sm">গ্রাম সংখ্যা: {union.villageCount}</span>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">যোগাযোগ</h3>
            <div className="space-y-2">
              {union.officeAddress && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span className="text-gray-700 text-sm">{union.officeAddress}</span>
                </div>
              )}
              {union.officePhone && (
                <div className="flex items-center gap-2">
                  <FaPhone className="text-green-500" />
                  <span className="text-gray-700 text-sm">{union.officePhone}</span>
                </div>
              )}
              {union.officeEmail && (
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" />
                  <span className="text-gray-700 text-sm">{union.officeEmail}</span>
                </div>
              )}
              {union.website && (
                <div className="flex items-center gap-2">
                  <FaGlobe className="text-purple-500" />
                  <a href={union.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    ওয়েবসাইট দেখুন
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Leadership */}
          {(union.chairmanName || union.secretaryName) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">নেতৃত্ব</h3>
              <div className="space-y-1">
                {union.chairmanName && (
                  <div className="text-gray-700 text-sm">
                    <span className="font-medium">চেয়ারম্যান:</span> {union.chairmanName}
                    {union.chairmanPhone && ` (${union.chairmanPhone})`}
                  </div>
                )}
                {union.secretaryName && (
                  <div className="text-gray-700 text-sm">
                    <span className="font-medium">সচিব:</span> {union.secretaryName}
                    {union.secretaryPhone && ` (${union.secretaryPhone})`}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Establishment Date */}
          {union.establishmentDate && (
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-orange-500" />
                <span className="text-gray-700 text-sm">
                  প্রতিষ্ঠার তারিখ: {new Date(union.establishmentDate).toLocaleDateString('bn-BD')}
                </span>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-1 rounded-full text-xs font-medium ${
              union.status === "Active"
                ? "bg-green-100 text-green-800"
                : union.status === "Inactive"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {union.status === "Active"
                ? "সক্রিয়"
                : union.status === "Inactive"
                ? "নিষ্ক্রিয়"
                : "অপেক্ষমান"}
            </span>
          </div>

          {/* ID */}
          <div className="text-xs text-gray-400 text-right">আইডি: {union._id?.slice(-8)}</div>
        </div>
      </div>
    </div>
  );
};

export default UnionDetails; 