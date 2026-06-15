import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../components/AxiosInspector';

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!name || !email || !password) {
      setFormError('Please enter all fields.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Direct Axios Post call to backend url, mapping name to username
      const res = await axiosInstance.post(`/user/create`, {
        username: name,
        email,
        password
      }, config);

      if (res.data.success) {
        // Save token to localStorage
        localStorage.setItem('token', res.data.token);
        // Set state
        setUser(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Registration Error details:", err.response?.data || err);
      if (err.response?.status === 500) {
        setFormError('Something went wrong. Please try again later.');
      } else {
        setFormError(err.response?.data?.message || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-slide-up space-y-8">
        {/* Brand logo */}
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#a78bfa] font-mono text-2xl font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            J
          </div>
          <h2 className="mt-6 font-sans text-3xl font-extrabold tracking-tight text-white">
            Create Account
          </h2>
          <p className="mt-2 font-sans text-sm text-[#9ca3af]">
            Get started tracking your software jobs today
          </p>
        </div>

        {/* Card wrapper */}
        <div className="rounded-2xl border border-card-border bg-card-bg p-8 shadow-xl backdrop-blur-md">
          <form className="space-y-6" onSubmit={onSubmit}>
            {formError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400 font-sans">
                {formError}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="name" className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={onChange}
                className="w-full rounded-xl border border-card-border bg-black/30 px-4 py-3 font-sans text-sm text-white placeholder-gray-500 transition-colors focus:border-[#7c3aed] focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={onChange}
                className="w-full rounded-xl border border-card-border bg-black/30 px-4 py-3 font-sans text-sm text-white placeholder-gray-500 transition-colors focus:border-[#7c3aed] focus:outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={onChange}
                className="w-full rounded-xl border border-card-border bg-black/30 px-4 py-3 font-sans text-sm text-white placeholder-gray-500 transition-colors focus:border-[#7c3aed] focus:outline-none"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-glow flex w-full justify-center rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] py-3.5 font-sans text-sm font-bold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="font-sans text-xs text-[#9ca3af]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#a78bfa] hover:text-[#7c3aed] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
