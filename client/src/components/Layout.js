import React from "react";
import { useLocation } from "react-router-dom";

import Header from "./partials/header";
import Footer from "./partials/footer";

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div class="flex flex-col bg-custom-dark1 min-h-screen">
            {location.pathname !== '/special-page' && <Header />}
            {children}
            {location.pathname !== '/special-page' && <Footer />}
        </div>
    );
}

export default Layout;