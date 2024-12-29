import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const GuestGuard = ({ children }) => {
    const { user } = useAuth();

    if (user !== null) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default GuestGuard;