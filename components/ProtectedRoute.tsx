import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, Role } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children?: React.ReactNode;
    allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // You can return a loader/spinner here
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        // User not logged in, redirect to login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // User is logged in but doesn't have the required role, redirect to home
        return <Navigate to="/home" replace />;
    }

    // If children are provided, render them. Otherwise, render the nested routes.
    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
