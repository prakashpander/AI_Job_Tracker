import { useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../components/AxiosInspector.jsx';

const Applications = () => {
  const location = useLocation();

  // Component states
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    salary: '',
    status: 'Applied',
    notes: ''
  });

  const [formError, setFormError] = useState('');

  // Handle dashboard redirect filter selection
  useEffect(() => {
    if (location.state && location.state.filter) {
      setActiveFilter(location.state.filter);
    }
  }, [location.state]);

  // Load applications directly via Axios GET call
  const fetchApplications = async () => {
    setLoading(true);
    try {
      let query = [];
      if (activeFilter !== 'All') {
        query.push(`status=${activeFilter}`);
      }
      if (searchTerm) {
        query.push(`search=${searchTerm}`);
      }
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';

      // Direct Axios GET call
      const res = await axiosInstance.get(`/application/getall${queryString}`);
      if (res.data.success) {
        setApplications(res.data.applicationData || []);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeFilter, searchTerm]);

  // Filter list locally to ensure fast search response
  const filteredJobs = applications.filter((job) => {
    const matchesSearch =
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobRole.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      activeFilter === 'All' || job.appliedStatus === activeFilter;

    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setFormData({
      company: '',
      role: '',
      location: '',
      salary: '',
      status: 'Applied',
      notes: ''
    });
    setFormError('');
    setIsEditing(false);
    setCurrentJobId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setFormData({
      company: job.companyName,
      role: job.jobRole,
      location: job.location || '',
      salary: job.expectedSalary || '',
      status: job.appliedStatus,
      notes: job.notes || ''
    });
    setFormError('');
    setIsEditing(true);
    setCurrentJobId(job._id);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler with direct Axios calls
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.company || !formData.role) {
      setFormError('Company Name and Job Role are required fields!');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const mappedData = {
        companyName: formData.company,
        jobRole: formData.role,
        location: formData.location || '',
        expectedSalary: formData.salary || '',
        appliedStatus: formData.status || 'Applied',
        notes: formData.notes || ''
      };

      let res;
      if (isEditing) {
        // Direct PUT request to edit the application
        res = await axiosInstance.put(`/application/update/${currentJobId}`, mappedData, config);
      } else {
        // Direct POST request to create a new application
        res = await axiosInstance.post(`/application/create`, mappedData, config);
      }

      if (res.data.success) {
        setIsModalOpen(false);
        fetchApplications();
      }
    } catch (err) {
      console.error("Application Form Submit Error:", err.response?.data || err);
      if (err.response?.status === 500) {
        setFormError('Something went wrong. Please try again later.');
      } else {
        setFormError(err.response?.data?.message || 'Something went wrong. Please check your data.');
      }
    }
  };

  // Delete handler with direct Axios call
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        // Direct Axios DELETE request
        const res = await axiosInstance.delete(`/application/delete/${id}`);
        if (res.data.success) {
          fetchApplications();
        }
      } catch (err) {
        console.error('Failed to delete job:', err);
      }
    }
  };

  const getStatusColors = (status) => {
    switch (status) {
      case 'Applied':
        return {
          badge: 'bg-[rgba(96,165,250,0.15)] text-[#60a5fa] border-blue-500/10',
          avatar: 'bg-[#60a5fa]/10 text-[#60a5fa] border-[#60a5fa]/30'
        };
      case 'Interview':
        return {
          badge: 'bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border-amber-500/10',
          avatar: 'bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/30'
        };
      case 'Shortlisted':
        return {
          badge: 'bg-[rgba(192,132,252,0.15)] text-[#c084fc] border-purple-500/10',
          avatar: 'bg-[#c084fc]/10 text-[#c084fc] border-[#c084fc]/30'
        };
      case 'Rejected':
        return {
          badge: 'bg-[rgba(248,113,113,0.15)] text-[#f87171] border-rose-500/10',
          avatar: 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30'
        };
      case 'Offer':
        return {
          badge: 'bg-[rgba(52,211,153,0.15)] text-[#34d399] border-emerald-500/10',
          avatar: 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30'
        };
      default:
        return {
          badge: 'bg-white/10 text-white border-white/10',
          avatar: 'bg-white/10 text-white border-white/20'
        };
    }
  };

  const filterOptions = ['All', 'Applied', 'Interview', 'Shortlisted', 'Offer', 'Rejected'];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-2xl font-extrabold text-white sm:text-3xl">
            Job Applications
          </h1>
          <p className="font-sans text-sm text-[#9ca3af]">
            Keep track of all your ongoing code and tech applications
          </p>
        </div>
        <div>
          <button
            onClick={openAddModal}
            className="btn-glow flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] px-5 py-3 font-sans text-sm font-bold text-white shadow-lg sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-card-bg p-4 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search company or job role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-card-border bg-black/20 py-2.5 pl-10 pr-4 font-sans text-sm text-white placeholder-gray-500 transition-colors focus:border-[#7c3aed] focus:outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveFilter(opt)}
              className={`rounded-xl border px-4 py-2 font-sans text-xs font-semibold tracking-wide transition-all duration-200 ${activeFilter === opt
                ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-[#a78bfa]'
                : 'border-card-border bg-black/10 text-[#9ca3af] hover:border-[#666] hover:text-white'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Cards Grid */}
      {loading && filteredJobs.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7c3aed] border-t-transparent"></div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const colors = getStatusColors(job.appliedStatus);
            return (
              <div
                key={job._id}
                className="group relative flex flex-col justify-between rounded-2xl border border-card-border bg-card-bg p-5 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.04]"
              >
                {/* Status Pill and Actions */}
                <div className="flex items-start justify-between">
                  <span className={`rounded-full border px-2.5 py-1 font-sans text-[10px] font-semibold tracking-wide uppercase ${colors.badge}`}>
                    {job.appliedStatus}
                  </span>

                  {/* Actions Dropdown/Pills */}
                  <div className="flex gap-1.5 opacity-60 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEditModal(job)}
                      className="rounded-lg bg-black/30 p-1.5 text-[#9ca3af] hover:bg-white/5 hover:text-[#a78bfa]"
                      title="Edit application"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="rounded-lg bg-black/30 p-1.5 text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400"
                      title="Delete application"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Company Name & Role */}
                <div className="mt-4 flex items-center gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border font-sans text-lg font-extrabold uppercase ${colors.avatar}`}>
                    {job.companyName?.charAt(0) || 'J'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-sans text-base font-bold text-white leading-tight">
                      {job.jobRole}
                    </h3>
                    <p className="truncate font-sans text-sm text-[#9ca3af] mt-0.5">
                      {job.companyName}
                    </p>
                  </div>
                </div>

                {/* Details (Location, Salary, Date) */}
                <div className="mt-5 space-y-2.5 border-t border-white/[0.04] pt-4 font-sans text-xs text-[#9ca3af]">
                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{job.location || 'Remote / Unspecified'}</span>
                  </div>

                  {/* Salary */}
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M3 12a9 9 0 1118 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-mono">{job.expectedSalary || 'Not specified'}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-mono">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })
                        : 'Unspecified'}
                    </span>
                  </div>
                </div>

                {/* Notes Block */}
                {job.notes && (
                  <div className="mt-4 rounded-xl bg-black/20 p-2.5 text-xs text-[#9ca3af]">
                    <p className="line-clamp-2 font-sans italic">"{job.notes}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-card-border bg-card-bg p-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 font-sans text-base font-bold text-white">No applications match your query</h3>
          <p className="mt-2 font-sans text-sm text-[#9ca3af] max-w-sm">
            Try adjusting your search criteria or filter tabs, or create a brand new application.
          </p>
          <button
            onClick={openAddModal}
            className="mt-6 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] px-5 py-2.5 font-sans text-sm font-bold text-white shadow"
          >
            Create Application
          </button>
        </div>
      )}

      {/* Modal - Add / Edit Application */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-md animate-slide-up rounded-2xl border border-card-border bg-[#0d0d18] p-6 shadow-2xl max-w-[95vw] md:max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sans text-lg font-bold text-white">
                {isEditing ? 'Edit Application' : 'Add New Application'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-[#9ca3af] hover:bg-white/5 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-center text-xs text-red-400 font-sans">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Company */}
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. Google, Stripe"
                  required
                  className="w-full rounded-xl border border-card-border bg-black/20 px-3 py-2 font-sans text-sm text-white focus:border-[#7c3aed] focus:outline-none"
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
                  Job Role / Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g. Frontend Engineer, SDE-1"
                  required
                  className="w-full rounded-xl border border-card-border bg-black/20 px-3 py-2 font-sans text-sm text-white focus:border-[#7c3aed] focus:outline-none"
                />
              </div>

              {/* Two columns for Location and Salary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Bangalore, Remote"
                    className="w-full rounded-xl border border-card-border bg-black/20 px-3 py-2 font-sans text-sm text-white focus:border-[#7c3aed] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
                    Salary / Package
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. 12 LPA"
                    className="w-full rounded-xl border border-card-border bg-black/20 px-3 py-2 font-sans text-sm text-white focus:border-[#7c3aed] focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Select */}
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-card-border bg-[#0d0d18] px-3 py-2 font-sans text-sm text-[#e8e8f0] focus:border-[#7c3aed] focus:outline-none"
                >
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any referral, interview stage, or details..."
                  className="w-full rounded-xl border border-card-border bg-black/20 px-3 py-2 font-sans text-sm text-white focus:border-[#7c3aed] focus:outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-card-border px-4 py-2 font-sans text-xs font-semibold text-[#9ca3af] hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] px-4 py-2 font-sans text-xs font-bold text-white shadow shadow-[#7c3aed]/40"
                >
                  {isEditing ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
