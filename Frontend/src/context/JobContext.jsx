import React, { createContext, useReducer } from 'react';
import axiosInstance from '../components/AxiosInspector';

const initialState = {
  applications: [],
  recentApplications: [],
  loading: false,
  stats: {
    applied: 0, // Total Applied (all applications)
    interview: 0,
    shortlisted: 0,
    offer: 0,
    rejected: 0,
    pending: 0 // Status: Applied
  },
  error: null
};

export const JobContext = createContext(initialState);

const jobReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_JOBS':
      // Calculate stats locally from the fetched jobs for accurate count dashboard
      const apps = action.payload;
      const computedStats = {
        applied: apps.length, // Total applications
        interview: apps.filter(a => a.appliedStatus === 'Interview').length,
        shortlisted: apps.filter(a => a.appliedStatus === 'Shortlisted').length,
        offer: apps.filter(a => a.appliedStatus === 'Offer').length,
        rejected: apps.filter(a => a.appliedStatus === 'Rejected').length,
        pending: apps.filter(a => a.appliedStatus === 'Applied').length
      };
      return {
        ...state,
        applications: apps,
        stats: computedStats,
        loading: false,
        error: null
      };
    case 'FETCH_RECENT':
      return {
        ...state,
        recentApplications: action.payload,
        loading: false
      };
    case 'ADD_JOB':
      const newAppsList = [action.payload, ...state.applications];
      const newStats = {
        applied: newAppsList.length,
        interview: newAppsList.filter(a => a.appliedStatus === 'Interview').length,
        shortlisted: newAppsList.filter(a => a.appliedStatus === 'Shortlisted').length,
        offer: newAppsList.filter(a => a.appliedStatus === 'Offer').length,
        rejected: newAppsList.filter(a => a.appliedStatus === 'Rejected').length,
        pending: newAppsList.filter(a => a.appliedStatus === 'Applied').length
      };
      return {
        ...state,
        applications: newAppsList,
        stats: newStats,
        loading: false
      };
    case 'UPDATE_JOB':
      const updatedList = state.applications.map(app =>
        app._id === action.payload._id ? action.payload : app
      );
      const updatedStats = {
        applied: updatedList.length,
        interview: updatedList.filter(a => a.appliedStatus === 'Interview').length,
        shortlisted: updatedList.filter(a => a.appliedStatus === 'Shortlisted').length,
        offer: updatedList.filter(a => a.appliedStatus === 'Offer').length,
        rejected: updatedList.filter(a => a.appliedStatus === 'Rejected').length,
        pending: updatedList.filter(a => a.appliedStatus === 'Applied').length
      };
      return {
        ...state,
        applications: updatedList,
        stats: updatedStats,
        loading: false
      };
    case 'DELETE_JOB':
      const filteredList = state.applications.filter(app => app._id !== action.payload);
      const postDeleteStats = {
        applied: filteredList.length,
        interview: filteredList.filter(a => a.appliedStatus === 'Interview').length,
        shortlisted: filteredList.filter(a => a.appliedStatus === 'Shortlisted').length,
        offer: filteredList.filter(a => a.appliedStatus === 'Offer').length,
        rejected: filteredList.filter(a => a.appliedStatus === 'Rejected').length,
        pending: filteredList.filter(a => a.appliedStatus === 'Applied').length
      };
      return {
        ...state,
        applications: filteredList,
        stats: postDeleteStats,
        loading: false
      };
    case 'JOB_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const JobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);

  // Get All Applications
  const getApplications = async (status = '', search = '') => {
    dispatch({ type: 'SET_LOADING' });
    try {
      let query = [];
      if (status) query.push(`status=${status}`);
      if (search) query.push(`search=${search}`);
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';

      const res = await axiosInstance.get(`/application/getall${queryString}`);

      if (res.data.success) {
        dispatch({
          type: 'FETCH_JOBS',
          payload: res.data.applicationData
        });
      }
    } catch (err) {
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response?.data?.message || 'Failed to fetch applications.'
      });
    }
  };

  // Get Recent Applications
  const getRecentApplications = async () => {
    try {
      const res = await axiosInstance.get(`/application/recent`);
      if (res.data.success) {
        dispatch({
          type: 'FETCH_RECENT',
          payload: res.data.applications
        });
      }
    } catch (err) {
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response?.data?.message || 'Failed to fetch recent applications.'
      });
    }
  };

  // Create Application (Maps frontend inputs to backend fields)
  // Frontend sends: { company, role, location, salary, status, notes }
  // Backend expects: { companyName, jobRole, location, expectedSalary, appliedStatus, notes }
  const createApplication = async (jobData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const mappedData = {
        companyName: jobData.company,
        jobRole: jobData.role,
        location: jobData.location || '',
        expectedSalary: jobData.salary || '',
        appliedStatus: jobData.status || 'Applied',
        notes: jobData.notes || ''
      };

      const res = await axiosInstance.post(`/application/create`, mappedData, config);

      if (res.data.success) {
        dispatch({
          type: 'ADD_JOB',
          payload: res.data.applicationData
        });
        return { success: true };
      }
    } catch (err) {
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response?.data?.message || 'Failed to create application.'
      });
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create application.'
      };
    }
  };

  // Update Application
  // Frontend sends: { company, role, location, salary, status, notes }
  const updateApplication = async (id, jobData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const mappedData = {
        companyName: jobData.company,
        jobRole: jobData.role,
        location: jobData.location || '',
        expectedSalary: jobData.salary || '',
        appliedStatus: jobData.status || 'Applied',
        notes: jobData.notes || ''
      };

      const res = await axiosInstance.put(`/application/update/${id}`, mappedData, config);

      if (res.data.success) {
        dispatch({
          type: 'UPDATE_JOB',
          payload: res.data.application
        });
        return { success: true };
      }
    } catch (err) {
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response?.data?.message || 'Failed to update application.'
      });
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update application.'
      };
    }
  };

  // Delete Application
  const deleteApplication = async (id) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await axiosInstance.delete(`/application/delete/${id}`);
      if (res.data.success) {
        dispatch({
          type: 'DELETE_JOB',
          payload: id
        });
        return { success: true };
      }
    } catch (err) {
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response?.data?.message || 'Failed to delete application.'
      });
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete application.'
      };
    }
  };

  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  return (
    <JobContext.Provider
      value={{
        applications: state.applications,
        recentApplications: state.recentApplications,
        loading: state.loading,
        stats: state.stats,
        error: state.error,
        getApplications,
        getRecentApplications,
        createApplication,
        updateApplication,
        deleteApplication,
        clearErrors
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
