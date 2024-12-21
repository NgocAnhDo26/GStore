import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./partials/header";
import Footer from "./partials/footer";

const Layout = () => {
    const location = useLocation();

    return (
        <div class="flex flex-col bg-custom-dark1 min-h-screen">
            {location.pathname !== '/special-page' && <Header />}
            <Outlet />
            {location.pathname !== '/special-page' && <Footer />}
        </div>
    );
}

export default Layout;