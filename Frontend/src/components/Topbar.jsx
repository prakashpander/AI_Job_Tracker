import { Link } from 'react-router-dom';

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b border-card-border bg-[#0d0d18] px-4 md:hidden">
      <div className="flex items-center gap-2">
        <Link to="/dashboard">
          <span className="font-sans text-sm font-extrabold tracking-wider text-white">
            JOB<span className="text-[#a78bfa]">TRACKER</span>
          </span>
        </Link>
      </div>

      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-card-border bg-white/5 text-[#e8e8f0] transition-colors hover:bg-white/10 active:bg-white/20"
        aria-label="Toggle Sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
};

export default Topbar;
