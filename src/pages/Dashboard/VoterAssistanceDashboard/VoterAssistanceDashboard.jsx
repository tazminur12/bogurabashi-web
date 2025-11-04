import React from 'react';
import { Link } from 'react-router-dom';

function DashboardCard({ to, title, description, icon, colorFrom = 'from-blue-600', colorTo = 'to-indigo-600' }) {
  return (
    <Link to={to} className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${colorFrom} ${colorTo} text-white flex items-center justify-center text-xl mb-3`}>{icon}</div>
      <div className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{description}</div>
      <div className="mt-4 inline-flex items-center text-blue-600 text-sm font-medium">যান →</div>
    </Link>
  );
}

export default function VoterAssistanceDashboard() {
  return (
    <div className="p-4">
      <div className="mb-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-5 shadow-lg">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 20%, white 2px, transparent 2px)', backgroundSize:'16px 16px'}} />
          <div className="relative z-10">
            <h1 className="text-white text-2xl font-bold">Voter Assistance Dashboard</h1>
            <p className="text-blue-100 text-sm mt-1">Manage information, centers and announcements</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardCard
          to="/dashboard/assistance-info-list"
          title="Assistance Info"
          description="Create and manage voter assistance information"
          icon="📘"
          colorFrom="from-sky-600"
          colorTo="to-blue-600"
        />
        <DashboardCard
          to="/dashboard/voting-center-list"
          title="Voting Centers"
          description="Manage polling/voting centers"
          icon="📍"
          colorFrom="from-emerald-600"
          colorTo="to-teal-600"
        />
        <DashboardCard
          to="/dashboard/announcements-list"
          title="Announcements"
          description="Publish important voter announcements"
          icon="📣"
          colorFrom="from-amber-600"
          colorTo="to-orange-600"
        />
      </div>
    </div>
  );
}


