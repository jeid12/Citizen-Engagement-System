import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps {
    children: React.ReactElement;
    adminOnly?: boolean;
    agencyOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly, agencyOnly }) => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    if (agencyOnly && user?.role !== 'agency_staff') {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute; 