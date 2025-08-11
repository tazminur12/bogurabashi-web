// src/pages/dashboard/EditHospital.jsx

import React from "react";
import HospitalForm from "../../Dashboard/HospitalAdmin/HospitalForm";

const EditHospital = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        হাসপাতাল তথ্য সম্পাদনা করুন
      </h1>
      {/* HospitalForm কম্পোনেন্টটি ইউজ করলাম, যেটা id প্যারাম থেকে বুঝে আপডেট করে */}
      <HospitalForm />
    </div>
  );
};

export default EditHospital;
