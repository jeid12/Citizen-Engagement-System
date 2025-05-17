import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminComplaints from '../pages/AdminComplaints';
import AgencyDashboard from '../pages/AgencyDashboard';
import ManageUsers from '../pages/ManageUsers';
import ManageAgencies from '../pages/ManageAgencies';
import SubmitComplaint from '../pages/SubmitComplaint';
import TrackComplaints from '../pages/TrackComplaints';
import OTPVerification from '../pages/OTPVerification';
import Profile from '../pages/Profile';
import Categories from '../pages/Categories';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="verify-otp" element={<OTPVerification />} />
                
                <Route
                    path="profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="submit-complaint"
                    element={
                        <ProtectedRoute>
                            <SubmitComplaint />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="track-complaints"
                    element={
                        <ProtectedRoute>
                            <TrackComplaints />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="admin/complaints"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminComplaints />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="admin/users"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <ManageUsers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="admin/agencies"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <ManageAgencies />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="agency-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['agency_staff']}>
                            <AgencyDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="categories"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'agency_staff']}>
                            <Categories />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
};

export default AppRoutes; 