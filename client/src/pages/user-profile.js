import React from "react";
import Sidebar from "../components/user-profile/sidebar";
import Account from "../components/user-profile/account";

const UserProfile = () => {
  return (
    <section className="flex justify-start gap-8 bg-custom-dark1 p-8 px-16">
      <div className="hidden h-full md:block">
        <Sidebar />
      </div>

      <div className="flex-grow">
        <Account />
      </div>
    </section>
  );
};

export default UserProfile;
