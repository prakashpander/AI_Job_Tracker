import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../components/AxiosInspector.jsx';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Local Component states instead of Context UseReducer
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applied: 0,
    interview: 0,
    shortlisted: 0,
    offer: 0,
    rejected: 0,
    pending: 0
  });

  // Direct Axios GET calls on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Get all applications to calculate counts locally
        const appsRes = await axiosInstance.get(`/application/getall`);
        if (appsRes.data.success) {
          const appsList = appsRes.data.applicationData || [];

          const computedStats = {
            applied: appsList.length,
            interview: appsList.filter(a => a.appliedStatus === 'Interview').length,
            shortlisted: appsList.filter(a => a.appliedStatus === 'Shortlisted').length,
            offer: appsList.filter(a => a.appliedStatus === 'Offer').length,
            rejected: appsList.filter(a => a.appliedStatus === 'Rejected').length,
            pending: appsList.filter(a => a.appliedStatus === 'Applied').length
          };
          setStats(computedStats);
        }

        // 2. Get recent applications
        const recentRes = await axiosInstance.get(`/application/recent`);
        if (recentRes.data.success) {
          setRecentApplications(recentRes.data.applications || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCardClick = (statusFilter) => {
    navigate('/applications', { state: { filter: statusFilter } });
  };

  const statCardsData = [
    {
      title: 'Total Applied',
      count: stats.applied,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-5.625-3.75" />
        </svg>
      ),
      borderColor: 'border-blue-500/20',
      bgColor: 'rgba(96,165,250,0.05)',
      filterKey: 'All'
    },
    {
      title: 'Pending',
      count: stats.pending,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      borderColor: 'border-sky-500/20',
      bgColor: 'rgba(56,189,248,0.05)',
      filterKey: 'Applied'
    },
    {
      title: 'Interviews',
      count: stats.interview,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      borderColor: 'border-amber-500/20',
      bgColor: 'rgba(251,191,36,0.05)',
      filterKey: 'Interview'
    },
    {
      title: 'Shortlisted',
      count: stats.shortlisted,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      borderColor: 'border-purple-500/20',
      bgColor: 'rgba(192,132,252,0.05)',
      filterKey: 'Shortlisted'
    },
    {
      title: 'Offers',
      count: stats.offer,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      borderColor: 'border-emerald-500/20',
      bgColor: 'rgba(52,211,153,0.05)',
      filterKey: 'Offer'
    },
    {
      title: 'Rejected',
      count: stats.rejected,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      borderColor: 'border-rose-500/20',
      bgColor: 'rgba(248,113,113,0.05)',
      filterKey: 'Rejected'
    }
  ];

  const total = stats.applied || 1; // avoid divide by zero

  const funnelItems = [
    { label: 'Pending', count: stats.pending, color: 'from-sky-500 to-sky-400', percentage: Math.round((stats.pending / total) * 100) },
    { label: 'Shortlisted', count: stats.shortlisted, color: 'from-purple-500 to-purple-400', percentage: Math.round((stats.shortlisted / total) * 100) },
    { label: 'Interview', count: stats.interview, color: 'from-amber-500 to-amber-400', percentage: Math.round((stats.interview / total) * 100) },
    { label: 'Offer', count: stats.offer, color: 'from-emerald-500 to-emerald-400', percentage: Math.round((stats.offer / total) * 100) },
    { label: 'Rejected', count: stats.rejected, color: 'from-rose-500 to-rose-400', percentage: Math.round((stats.rejected / total) * 100) }
  ];

  // Helper for status badge rendering
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-[rgba(96,165,250,0.15)] text-[#60a5fa] border-blue-500/10';
      case 'Interview':
        return 'bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border-amber-500/10';
      case 'Shortlisted':
        return 'bg-[rgba(192,132,252,0.15)] text-[#c084fc] border-purple-500/10';
      case 'Rejected':
        return 'bg-[rgba(248,113,113,0.15)] text-[#f87171] border-rose-500/10';
      case 'Offer':
        return 'bg-[rgba(52,211,153,0.15)] text-[#34d399] border-emerald-500/10';
      default:
        return 'bg-white/10 text-white border-white/10';
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header section */}
      <div>
        <h1 className="font-sans text-2xl font-extrabold text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="font-sans text-sm text-[#9ca3af]">
          Welcome back, {user?.username || 'Developer'}. Check your pipeline status below.
        </p>
      </div>

      {/* 6 Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {statCardsData.map((card, idx) => (
          <div
            key={idx}
            onClick={() => handleCardClick(card.filterKey)}
            style={{ backgroundColor: card.bgColor }}
            className={`stat-card-transition flex cursor-pointer flex-col justify-between rounded-2xl border ${card.borderColor} bg-card-bg p-5 max-[350px]:p-4 shadow-sm transition-all duration-300`}
          >
            <div className="flex max-[352px]:flex-wrap items-center justify-between ">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#9ca3af] sm:text-sm">
                {card.title}
              </span>
              <div className="rounded-lg bg-black/15 p-1.5">{card.icon}</div>
            </div>
            <div className="mt-4">
              <span className="font-mono text-3xl font-extrabold text-white sm:text-4xl">
                {card.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid for Funnel and Recent Applications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Application Funnel */}
        <div className="rounded-2xl border border-card-border bg-card-bg p-6 lg:col-span-2">
          <h2 className="font-sans text-lg font-bold text-white mb-6">
            Application Funnel
          </h2>
          <div className="space-y-5">
            {funnelItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="font-sans text-[#9ca3af]">{item.label}</span>
                  <span className="font-mono text-white">
                    {item.count} <span className="text-[#666]">/ {stats.applied || 0}</span> ({item.percentage || 0}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage || 0}%` }}
                    className={`progress-bar-fill h-full rounded-full bg-gradient-to-r ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications (last 4) */}
        <div className="rounded-2xl border border-card-border bg-card-bg p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-lg font-bold text-white">
              Recent Activity
            </h2>
            <button
              onClick={() => navigate('/applications')}
              className="font-sans text-xs font-semibold text-[#a78bfa] hover:text-[#7c3aed] hover:underline"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#7c3aed] border-t-transparent"></div>
            </div>
          ) : recentApplications && recentApplications.length > 0 ? (
            <div className="divide-y divide-card-border">
              {recentApplications.slice(0, 4).map((app, index) => (
                <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-white/5 to-white/10 font-sans text-sm font-bold text-white uppercase border border-card-border">
                      {app.companyName?.charAt(0) || 'J'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-sans text-sm font-bold text-white">
                        {app.jobRole}
                      </p>
                      <p className="truncate font-sans text-xs text-[#9ca3af]">
                        {app.companyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden font-mono text-xs text-[#666] md:block">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short'
                      }) : 'Recent'}
                    </span>
                    <span className={`rounded-full border px-2.5 py-1 font-sans text-[10px] font-semibold tracking-wide uppercase ${getStatusStyle(app.appliedStatus)}`}>
                      {app.appliedStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H9.414a1 1 0 01-.707-.293L6.293 15.293A1 1 0 005.586 15H3" />
              </svg>
              <p className="mt-3 font-sans text-sm text-[#9ca3af]">No recent applications found</p>
              <button
                onClick={() => navigate('/applications')}
                className="mt-4 rounded-xl border border-[rgba(124,58,237,0.3)] bg-gradient-to-r from-[#7c3aed]/10 to-transparent px-4 py-2 font-sans text-xs font-semibold text-[#a78bfa] hover:from-[#7c3aed]/20 hover:text-white"
              >
                Track a Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
