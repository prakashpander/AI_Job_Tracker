import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      name: 'Applications',
      path: '/applications',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      name: 'AI Assistant',
      path: '/ai-assistant',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col justify-between border-r border-card-border bg-[#0d0d18] px-3 py-6 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo / Title */}
          <div className="flex items-center justify-center gap-2 px-2">
            <Link to="/dashboard">
              <span className="font-sans text-[17px] font-extrabold tracking-wider text-white">
                JOB<span className="text-[#a78bfa]">TRACKER</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 font-sans text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-[rgba(124,58,237,0.15)] to-transparent text-[#a78bfa] border-l-2 border-[#7c3aed] shadow-[inset_1px_0_0_rgba(124,58,237,0.2)]'
                    : 'text-[#9ca3af] hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="flex flex-col gap-4">
          {user && (
            <div className="flex flex-col gap-1 rounded-xl border border-[rgba(124,58,237,0.15)] bg-gradient-to-b from-[rgba(124,58,237,0.05)] to-transparent p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#a78bfa] font-mono text-xs font-bold text-white uppercase">
                  {user.username?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-xs font-semibold text-[#e8e8f0]">
                    {user.username}
                  </p>
                  <p className="truncate font-mono text-[10px] text-[#9ca3af]">
                    {user.experience || 'Developer'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-sans text-sm font-medium text-red-400/80 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
