import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import Login from "../pages/Login";

const PrivateRoute = () => {
    const { user } = useAuth();
    
    if (user === null) {
        return <Login />
    }

    return <Outlet />;
};

export default PrivateRoute;