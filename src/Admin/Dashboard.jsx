import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle, FaHome, FaInfoCircle, FaTools, FaNewspaper, FaBell, FaPhoneAlt, FaSignOutAlt, FaBars, FaDesktop, FaBlog, FaAd, FaImages, FaHospital, FaUserMd, FaAmbulance, FaChartBar, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import logo from "/vite.svg";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData?.isAuthenticated) {
      setUser(authData.user);
      setActivePath(window.location.pathname);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { to: "/dashboard", label: "হোম", icon: <FaHome className="text-lg" /> },
    { to: "/dashboard/backService", label: "সার্ভিসসমূহ", icon: <FaTools className="text-lg" /> },
    { to: "/dashboard/slider-admin", label: "স্লাইডার", icon: <FaImages className="text-lg" /> },
    { to: "/dashboard/news-admin", label: "খবর", icon: <FaNewspaper className="text-lg" /> },
    { to: "/dashboard/notice", label: "নোটিশ", icon: <FaBell className="text-lg" /> },
    { to: "/dashboard/blogs-admin", label: "ব্লগ", icon: <FaBlog className="text-lg" /> },
    { to: "/dashboard/ads-admin", label: "বিজ্ঞাপন", icon: <FaAd className="text-lg" /> },
    { to: "/dashboard/eservice-admin", label: "ই-সেবা", icon: <FaDesktop className="text-lg" /> },
    { to: "/dashboard/bogura-intro", label: "বগুড়ার পরিচিতি", icon: <FaInfoCircle className="text-lg" /> },
    { to: "/dashboard/contact", label: "যোগাযোগ", icon: <FaPhoneAlt className="text-lg" /> },
    { to: "/dashboard/content-creator-admin", label: "কন্টেন্ট ক্রিয়েটর", icon: <FaUserCircle className="text-lg" /> },
    { to: "/dashboard/disaster-admin", label: "দুর্নীতি রিপোর্ট", icon: <FaExclamationTriangle className="text-lg" /> },
  ];

  // Show loading if user data not loaded yet
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-30 w-64 h-full bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full p-4 border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-between p-2 mb-6">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-8" />
              <a href="/" className="text-xl font-bold text-blue-700 hover:underline focus:outline-none">বগুড়াবাসী</a>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUserCircle size={24} className="text-gray-600" />
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setActivePath(item.to)}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive || activePath === item.to
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              লগ আউট
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                <FaBars />
              </button>
              <h1 className="ml-2 text-lg font-semibold text-gray-800">
                {menuItems.find((item) => item.to === activePath)?.label || "ড্যাশবোর্ড"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications or other header items can go here */}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {activePath === "/dashboard" ? (
              <div className="">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">স্বাগতম, {user?.name || "Admin"}!</h2>
                    <p className="text-lg text-blue-100 mb-2">আপনি <span className="font-semibold">{user?.role}</span> হিসেবে ড্যাশবোর্ডে প্রবেশ করেছেন।</p>
                    <p className="text-blue-200">এখান থেকে আপনি সকল অ্যাডমিন কার্যক্রম পরিচালনা করতে পারবেন।</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg mb-2">
                      <FaUserCircle className="text-blue-600 text-6xl" />
                    </div>
                    <span className="text-white font-semibold text-lg">{user?.name}</span>
                    <span className="text-blue-200 text-sm">{user?.email}</span>
                  </div>
                </div>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <FaUsers className="text-3xl text-blue-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-800">120</span>
                    <span className="text-gray-500">ইউজার</span>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <FaHospital className="text-3xl text-green-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-800">15</span>
                    <span className="text-gray-500">হাসপাতাল</span>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <FaUserMd className="text-3xl text-indigo-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-800">32</span>
                    <span className="text-gray-500">ডাক্তার</span>
                  </div>
                  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <FaChartBar className="text-3xl text-purple-500 mb-2" />
                    <span className="text-2xl font-bold text-gray-800">8</span>
                    <span className="text-gray-500">রিপোর্ট</span>
                  </div>
                </div>
                {/* Main Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  <DashboardCard icon={<FaHospital className="text-3xl text-blue-600" />} label="হাসপাতাল" link="/dashboard/addHospital" />
                  <DashboardCard icon={<FaUserMd className="text-3xl text-green-600" />} label="ডাক্তার" link="/dashboard/doctorlist" />
                  <DashboardCard icon={<FaAmbulance className="text-3xl text-red-500" />} label="অ্যাম্বুলেন্স" link="/dashboard/adminAmbulance" />
                  <DashboardCard icon={<FaBlog className="text-3xl text-violet-600" />} label="ব্লগ" link="/dashboard/blogs-admin" />
                  <DashboardCard icon={<FaAd className="text-3xl text-orange-500" />} label="বিজ্ঞাপন" link="/dashboard/ads-admin" />
                  <DashboardCard icon={<FaImages className="text-3xl text-pink-500" />} label="স্লাইডার" link="/dashboard/slider-admin" />
                  <DashboardCard icon={<FaTools className="text-3xl text-gray-700" />} label="সার্ভিস" link="/dashboard/backService" />
                  <DashboardCard icon={<FaNewspaper className="text-3xl text-blue-400" />} label="খবর" link="/dashboard/news-admin" />
                  <DashboardCard icon={<FaBell className="text-3xl text-yellow-500" />} label="নোটিশ" link="/dashboard/notice" />
                  <DashboardCard icon={<FaDesktop className="text-3xl text-indigo-500" />} label="ই-সেবা" link="/dashboard/eservice-admin" />
                  <DashboardCard icon={<FaInfoCircle className="text-3xl text-cyan-600" />} label="বগুড়ার পরিচিতি" link="/dashboard/bogura-intro" />
                  <DashboardCard icon={<FaPhoneAlt className="text-3xl text-green-500" />} label="যোগাযোগ" link="/dashboard/contact" />
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// DashboardCard Component
const DashboardCard = ({ icon, label, link }) => (
  <a
    href={link}
    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 p-6 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 text-center"
  >
    <div className="mb-3">{icon}</div>
    <div className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 mb-1">{label}</div>
    <span className="text-xs text-gray-500 group-hover:text-blue-400">বিস্তারিত দেখুন</span>
  </a>
);

export default DashboardLayout;