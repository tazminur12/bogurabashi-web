import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaDownload,
  FaTint,
  FaUserFriends,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminBloodDonorList = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
    bloodGroups: {}
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  
  // Advanced search state
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    name: "",
    mobile: "",
    address: "",
    bloodGroup: "",
    status: "",
    lastDonationFrom: "",
    lastDonationTo: ""
  });
  
  const axiosSecure = useAxiosSecure();

  // Blood group options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statusOptions = [
    { value: "", label: "সব স্ট্যাটাস" },
    { value: "available", label: "উপলব্ধ" },
    { value: "unavailable", label: "অনুপলব্ধ" }
  ];

  // Fetch all donors
  const fetchDonors = async () => {
    try {
      setIsLoading(true);
      const res = await axiosSecure.get(`/donors`);
      const donorList = Array.isArray(res.data?.data) ? res.data.data : [];
      
      // Debug: Log the donor data to see what's coming
      console.log("Raw donor data:", donorList);
      console.log("Sample donor:", donorList[0]);
      
      setDonors(donorList);
      setFilteredDonors(donorList);
      calculateStats(donorList);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      console.error("Error fetching donors:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "রক্তদাতাদের তথ্য লোড করতে ব্যর্থ হয়েছে।",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (donorList) => {
    const total = donorList.length;
    const available = donorList.filter(donor => canDonateNow(donor)).length;
    const unavailable = total - available;
    
    const bloodGroups = {};
    donorList.forEach(donor => {
      bloodGroups[donor.bloodGroup] = (bloodGroups[donor.bloodGroup] || 0) + 1;
    });

    setStats({ total, available, unavailable, bloodGroups });
  };

  // Check if donor can donate now (4 months rule)
  const canDonateNow = (donor) => {
    if (!donor.lastDonationDate) {
      return true; // Never donated, can donate
    }
    
    const lastDonation = new Date(donor.lastDonationDate);
    const currentDate = new Date();
    const monthsDifference = (currentDate.getFullYear() - lastDonation.getFullYear()) * 12 + 
                           (currentDate.getMonth() - lastDonation.getMonth());
    
    return monthsDifference >= 4;
  };

  // Get donation status with time information
  const getDonationStatus = (donor) => {
    if (!donor.lastDonationDate) {
      return {
        canDonate: true,
        status: "দিতে পারবেন",
        statusClass: "bg-green-100 text-green-800",
        timeInfo: "কখনও দেননি",
        timeClass: "text-gray-500"
      };
    }
    
    const lastDonation = new Date(donor.lastDonationDate);
    const currentDate = new Date();
    const monthsDifference = (currentDate.getFullYear() - lastDonation.getFullYear()) * 12 + 
                           (currentDate.getMonth() - lastDonation.getMonth());
    const daysDifference = Math.floor((currentDate - lastDonation) / (1000 * 60 * 60 * 24));
    
    if (monthsDifference >= 4) {
      return {
        canDonate: true,
        status: "সময় হয়েছে",
        statusClass: "bg-green-100 text-green-800",
        timeInfo: `${monthsDifference} মাস ${daysDifference % 30} দিন আগে`,
        timeClass: "text-green-600"
      };
    } else {
      const remainingMonths = 4 - monthsDifference;
      const remainingDays = 30 - (daysDifference % 30);
      return {
        canDonate: false,
        status: "সময় হয়নি",
        statusClass: "bg-yellow-100 text-yellow-800",
        timeInfo: `${remainingMonths} মাস ${remainingDays} দিন বাকি`,
        timeClass: "text-yellow-600"
      };
    }
  };

  // Advanced search function
  const performAdvancedSearch = (donorList) => {
    return donorList.filter(donor => {
      // Name search
      if (advancedFilters.name && !donor.name.toLowerCase().includes(advancedFilters.name.toLowerCase())) {
        return false;
      }
      
      // Mobile search
      if (advancedFilters.mobile && !donor.mobile.includes(advancedFilters.mobile)) {
        return false;
      }
      
      // Address search
      if (advancedFilters.address && donor.address && !donor.address.toLowerCase().includes(advancedFilters.address.toLowerCase())) {
        return false;
      }
      
      // Blood group filter
      if (advancedFilters.bloodGroup && donor.bloodGroup !== advancedFilters.bloodGroup) {
        return false;
      }
      
      // Status filter
      if (advancedFilters.status !== "") {
        if (advancedFilters.status === "available" && !canDonateNow(donor)) return false;
        if (advancedFilters.status === "unavailable" && canDonateNow(donor)) return false;
      }
      
      // Date range filter
      if (advancedFilters.lastDonationFrom || advancedFilters.lastDonationTo) {
        if (donor.lastDonationDate) {
          const donationDate = new Date(donor.lastDonationDate);
          if (advancedFilters.lastDonationFrom) {
            const fromDate = new Date(advancedFilters.lastDonationFrom);
            if (donationDate < fromDate) return false;
          }
          if (advancedFilters.lastDonationTo) {
            const toDate = new Date(advancedFilters.lastDonationTo);
            if (donationDate > toDate) return false;
          }
        } else {
          return false; // No donation date
        }
      }
      
      return true;
    });
  };

  // Filter donors based on search and filters
  useEffect(() => {
    let filtered = donors;

    // Basic search
    if (searchTerm) {
      filtered = filtered.filter(donor =>
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.mobile.includes(searchTerm) ||
        donor.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Basic filters
    if (selectedBloodGroup) {
      filtered = filtered.filter(donor => donor.bloodGroup === selectedBloodGroup);
    }

    if (selectedStatus !== "") {
      filtered = filtered.filter(donor => 
        selectedStatus === "available" ? donor.canDonate : !donor.canDonate
      );
    }

    // Advanced filters
    filtered = performAdvancedSearch(filtered);

    setFilteredDonors(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [donors, searchTerm, selectedBloodGroup, selectedStatus, advancedFilters]);

  // Calculate pagination
  useEffect(() => {
    const total = Math.ceil(filteredDonors.length / itemsPerPage);
    setTotalPages(total);
    if (currentPage > total && total > 0) {
      setCurrentPage(total);
    }
  }, [filteredDonors, itemsPerPage, currentPage]);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDonors.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedBloodGroup("");
    setSelectedStatus("");
    setAdvancedFilters({
      name: "",
      mobile: "",
      address: "",
      bloodGroup: "",
      status: "",
      lastDonationFrom: "",
      lastDonationTo: ""
    });
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return searchTerm || 
           selectedBloodGroup || 
           selectedStatus !== "" || 
           Object.values(advancedFilters).some(value => value !== "");
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // Delete Donor
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই রক্তদাতাকে মুছে ফেললে আবার ফিরিয়ে আনা যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/donors/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("মুছে ফেলা হয়েছে!", "রক্তদাতা সফলভাবে মুছে ফেলা হয়েছে।", "success");
          fetchDonors();
        } else {
          Swal.fire("ত্রুটি!", "রক্তদাতা মুছে ফেলা যায়নি। আবার চেষ্টা করুন।", "error");
        }
      } catch (error) {
        console.error("Error deleting donor:", error);
        Swal.fire("ত্রুটি!", "রক্তদাতা মুছে ফেলা যায়নি।", "error");
      }
    }
  };

  const handleEdit = (donor) => {
    console.log("Edit donor:", donor);
    // Edit Modal বা Routing এখানে যুক্ত করতে পারো
  };

  const handleView = (donor) => {
    const status = getDonationStatus(donor);
    Swal.fire({
      title: donor.name || "নাম নেই",
      html: `
        <div class="text-left space-y-2">
          <p><strong>নাম:</strong> <span class="text-gray-700">${donor.name || "নাম দেওয়া হয়নি"}</span></p>
          <p><strong>মোবাইল:</strong> <span class="text-gray-700">${donor.mobile || "মোবাইল নম্বর দেওয়া হয়নি"}</span></p>
          <p><strong>ঠিকানা:</strong> <span class="text-gray-700">${donor.address || "ঠিকানা দেওয়া হয়নি"}</span></p>
          <p><strong>রক্তের গ্রুপ:</strong> <span class="font-bold text-red-600">${donor.bloodGroup || "রক্তের গ্রুপ দেওয়া হয়নি"}</span></p>
          <p><strong>শেষ রক্তদান:</strong> <span class="text-gray-700">${donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString("bn-BD") : "কখনও দেননি"}</span></p>
          <p><strong>সময়ের তথ্য:</strong> <span class="${status.timeClass}">${status.timeInfo}</span></p>
          <p><strong>স্ট্যাটাস:</strong> <span class="${status.statusClass.replace('bg-', 'text-').replace('-100', '-600')}">${status.status}</span></p>
        </div>
      `,
      confirmButtonText: "ঠিক আছে",
      confirmButtonColor: "#3085d6"
    });
  };

  const exportToCSV = () => {
    const headers = ["নাম", "মোবাইল", "ঠিকানা", "রক্তের গ্রুপ", "শেষ রক্তদান", "সময়ের তথ্য", "স্ট্যাটাস"];
    const csvContent = [
      headers.join(","),
      ...filteredDonors.map(donor => {
        const status = getDonationStatus(donor);
        return [
          donor.name || "নাম নেই",
          donor.mobile || "মোবাইল নম্বর নেই",
          donor.address || "ঠিকানা দেওয়া হয়নি",
          donor.bloodGroup || "রক্তের গ্রুপ নেই",
          donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString("bn-BD") : "কখনও দেননি",
          status.timeInfo,
          status.status
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "blood_donors.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">রক্তদাতা ব্যবস্থাপনা</h1>
              <p className="text-gray-600">সকল রক্তদাতার তথ্য দেখুন এবং পরিচালনা করুন</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={exportToCSV}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <FaDownload className="mr-2" />
                CSV ডাউনলোড
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200">
                <FaPlus className="mr-2" />
                নতুন রক্তদাতা
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FaTint className="text-2xl text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">মোট রক্তদাতা</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaUserFriends className="text-2xl text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">উপলব্ধ</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaCalendarAlt className="text-2xl text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">অনুপলব্ধ</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.unavailable}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaTag className="text-2xl text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">রক্তের গ্রুপ</p>
                <p className="text-2xl font-bold text-blue-600">{Object.keys(stats.bloodGroups).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blood Group Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">রক্তের গ্রুপ অনুযায়ী বণ্টন</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {bloodGroups.map(group => (
              <div key={group} className="text-center">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-lg font-bold text-red-600">{group}</div>
                  <div className="text-sm text-gray-600">{stats.bloodGroups[group] || 0}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Basic Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="নাম, মোবাইল বা ঠিকানা দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Blood Group Filter */}
            <div>
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">সব রক্তের গ্রুপ</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Advanced Search Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <FaFilter className="mr-2" />
                {showAdvancedSearch ? "সরল ফিল্টার" : "উন্নত ফিল্টার"}
              </button>
              
              {hasActiveFilters() && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                  title="সব ফিল্টার মুছুন"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Advanced Search Panel */}
          {showAdvancedSearch && (
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">উন্নত অনুসন্ধান</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
                  <input
                    type="text"
                    placeholder="নাম দিয়ে খুঁজুন..."
                    value={advancedFilters.name}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল</label>
                  <input
                    type="text"
                    placeholder="মোবাইল নম্বর..."
                    value={advancedFilters.mobile}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, mobile: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
                  <input
                    type="text"
                    placeholder="ঠিকানা দিয়ে খুঁজুন..."
                    value={advancedFilters.address}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={advancedFilters.bloodGroup}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, bloodGroup: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">সব রক্তের গ্রুপ</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">স্ট্যাটাস</label>
                  <select
                    value={advancedFilters.status}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">শেষ রক্তদানের তারিখ</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={advancedFilters.lastDonationFrom}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, lastDonationFrom: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={advancedFilters.lastDonationTo}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, lastDonationTo: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count and Pagination Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              <span className="font-medium">{filteredDonors.length}</span> টি রক্তদাতা পাওয়া গেছে
              {hasActiveFilters() ? " (ফিল্টার অনুযায়ী)" : ""}
            </p>
            <p className="text-sm text-gray-500">
              পৃষ্ঠা {currentPage} থেকে {Math.min(currentPage * itemsPerPage, filteredDonors.length)} 
              (মোট {filteredDonors.length} টি রেকর্ড)
            </p>
            
            {/* Debug Info - Remove this in production */}
            {import.meta.env.DEV && filteredDonors.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                <strong>ডিবাগ:</strong> প্রথম রক্তদাতার ঠিকানা: {filteredDonors[0]?.address || "ঠিকানা নেই"}
              </div>
            )}
          </div>
          
          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">প্রতি পৃষ্ঠায়:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Donors Table */}
        {filteredDonors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaTint className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">কোন রক্তদাতা পাওয়া যায়নি</h3>
            <p className="text-gray-500">আপনার অনুসন্ধানের সাথে মিলে এমন রক্তদাতা নেই</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        রক্তদাতার তথ্য
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        যোগাযোগ
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        রক্তের গ্রুপ
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        শেষ রক্তদান
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        স্ট্যাটাস
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        অ্যাকশন
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCurrentPageData().map((donor) => (
                      <tr key={donor._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                <FaTint className="text-red-600 text-lg" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                              <div className="text-sm text-gray-500">ID: {donor._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <FaPhone className="mr-2 text-gray-400" />
                              {donor.mobile || "মোবাইল নম্বর নেই"}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <FaMapMarkerAlt className="mr-2 text-gray-400" />
                              {donor.address ? (
                                <span className="text-gray-700">{donor.address}</span>
                              ) : (
                                <span className="text-gray-400 italic">ঠিকানা দেওয়া হয়নি</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            {donor.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900">
                              {donor.lastDonationDate
                                ? new Date(donor.lastDonationDate).toLocaleDateString("bn-BD")
                                : "কখনও দেননি"}
                            </div>
                            <div className={`text-xs ${getDonationStatus(donor).timeClass}`}>
                              {getDonationStatus(donor).timeInfo}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDonationStatus(donor).statusClass}`}
                          >
                            {getDonationStatus(donor).status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleView(donor)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                              title="দেখুন"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleEdit(donor)}
                              className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                              title="সম্পাদনা করুন"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(donor._id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                              title="মুছে ফেলুন"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <span>পৃষ্ঠা {currentPage} থেকে {totalPages} (মোট {filteredDonors.length} টি রেকর্ড)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Previous Page */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft />
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {/* First Page */}
                      {currentPage > 3 && (
                        <button
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          1
                        </button>
                      )}
                      
                      {/* Ellipsis */}
                      {currentPage > 4 && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                      
                      {/* Page Numbers around current */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (page > 0 && page <= totalPages) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                                page === currentPage
                                  ? "bg-red-600 text-white border-red-600"
                                  : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                        return null;
                      })}
                      
                      {/* Ellipsis */}
                      {currentPage < totalPages - 3 && (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      )}
                      
                      {/* Last Page */}
                      {currentPage < totalPages - 2 && (
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          {totalPages}
                        </button>
                      )}
                    </div>
                    
                    {/* Next Page */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBloodDonorList;
