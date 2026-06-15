import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../components/AxiosInspector';

const Profile = () => {
  const { user, loadUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    expectedSalary: '',
    experience: '',
    skills: ''
  });

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Load user data into form fields on mount or when user object changes
  useEffect(() => {
    if (user) {
      setFormData({
        phone: user.phone || '',
        location: user.location || '',
        expectedSalary: user.expectedSalary || '',
        experience: user.experience || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || '')
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    setIsSaving(true);

    // Basic Validation: Phone must be empty or exactly 10 digits
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setStatusMessage({
        type: 'error',
        text: 'Phone number must be exactly 10 digits!'
      });
      setIsSaving(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Split the skills comma-separated text into an array
      let formattedSkills = formData.skills;
      if (typeof formattedSkills === 'string') {
        formattedSkills = formattedSkills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s !== '');
      }

      const postData = {
        phone: formData.phone,
        location: formData.location,
        expectedSalary: formData.expectedSalary,
        experience: formData.experience,
        skills: formattedSkills
      };

      // Direct Axios PUT request to backend endpoint
      const res = await axiosInstance.put(`/user/update`, postData, config);

      if (res.data.success) {
        setStatusMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });
        // Reload user details in AuthContext
        await loadUser();
      }
    } catch (err) {
      console.error("Profile Update Error details:", err.response?.data || err);
      if (err.response?.status === 500) {
        setStatusMessage({
          type: 'error',
          text: 'Something went wrong. Please try again later.'
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: err.response?.data?.message || 'Failed to update profile.'
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="font-sans text-2xl font-extrabold text-white sm:text-3xl">
          User Profile
        </h1>
        <p className="font-sans text-sm text-[#9ca3af]">
          Manage your developer details and job hunting preferences
        </p>
      </div>

      {/* Main Container Card */}
      <div className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-xl backdrop-blur-md">
        {/* Avatar Display */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b border-white/[0.04]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#a78bfa] font-sans text-3xl font-extrabold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] uppercase">
            {user?.username?.charAt(0) || 'D'}
          </div>
          <div className="text-center">
            <h2 className="font-sans text-xl font-bold text-white">
              {user?.username || 'Developer'}
            </h2>
            <p className="font-sans text-sm text-[#a78bfa] mt-0.5">
              {formData.experience || 'Fresher Developer'}
            </p>
            <p className="font-mono text-xs text-[#666] mt-1">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {statusMessage.text && (
          <div
            className={`my-5 rounded-xl border p-3 text-center text-sm font-sans ${statusMessage.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400'
              }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Phone */}
            <div className="space-y-1">
              <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit number"
                className="w-full rounded-xl border border-card-border bg-black/20 px-3 py-2.5 font-sans text-sm text-white focus:border-[#7c3aed] focus:outline-none"
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Bangalore, Delhi NCR"
                className="w-full rounded-xl border border-card-border bg-black/20 px-3 py-2.5 font-sans text-sm text-white focus:border-[#7c3aed] focus:outline-none"
              />
            </div>

            {/* Expected Salary */}
            <div className="space-y-1">
              <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
                Expected Salary
              </label>
              <input
                type="text"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleInputChange}
                placeholder="e.g. 10 LPA"
                className="w-full rounded-xl border border-card-border bg-black/20 px-3 py-2.5 font-sans text-sm text-white focus:border-[#7c3aed] focus:outline-none"
              />
            </div>

            {/* Experience */}
            <div className="space-y-1">
              <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
                Experience Level
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g. Fresher, 1 Year SDE"
                className="w-full rounded-xl border border-card-border bg-black/20 px-3 py-2.5 font-sans text-sm text-white focus:border-[#7c3aed] focus:outline-none"
              />
            </div>
          </div>

          {/* Skills (Comma-separated) */}
          <div className="space-y-1">
            <label className="block font-sans text-xs font-semibold text-[#9ca3af]">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS"
              className="w-full rounded-xl border border-card-border bg-black/20 px-3 py-2.5 font-sans text-sm text-white focus:border-[#7c3aed] focus:outline-none"
            />
            <p className="font-sans text-[10px] text-[#666]">
              Aap skills ko comma (,) se separate kar ke likhein. Ye data background automatic sync karega.
            </p>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-glow rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] px-6 py-3 font-sans text-sm font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
