import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "./partials/header";
import Footer from "./partials/footer";

const Layout = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col bg-[url('../public/img/tile_bg_winter_2024_b.webp')] min-h-screen">
            {location.pathname !== '/special-page' && <Header />}
            <Outlet />
            {location.pathname !== '/special-page' && <Footer />}
        </div>
    );
}

export default Layout;