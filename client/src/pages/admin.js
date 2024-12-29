import React, { useState } from "react";
import AdminSidebar from "../components/admin/admin-sidebar";
import Dashboard from "../components/admin/dashboard";
import Users from "../components/admin/users";
import Products from "../components/admin/products";
import KeyGames from "../components/admin/keygames";
import Feedbacks from "../components/admin/feedbacks";

const Admin = () => {
    const [activeSection, setActiveSection] = useState("dashboard");

    const renderSection = () => {
        switch (activeSection) {
            case "dashboard":
                return <Dashboard />;
            // case "users":
            //     return <Users />;
            case "products":
                return <Products />;
            case "keygames":
                return <KeyGames />;
            case "feedbacks":
                return <Feedbacks />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <>
            <AdminSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection} />

            <div class="p-4 sm:ml-64">
                {renderSection()}
            </div>
        </>
    );
};

export default Admin;