import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const GuestGuard = ({ children }) => {
    const auth = useAuth();

    if (auth.user) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default GuestGuard;