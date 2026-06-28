import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../components/AxiosInspector';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const activeToken = localStorage.getItem('token');

    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.get('/user/getprofile');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Sirf mount pe ek baar chalega — infinite loop nahi hoga
  useEffect(() => {
    loadUser();
  }, []);

  const logout = () => {
    axiosInstance.get(`/user/logout`).catch((err) => console.error(err));
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        loadUser,
        logout,
        isAuthenticated: !!user, // ProtectedRoute ke liye
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};