import React, { useState } from "react";
import Sidebar from "../components/user-profile/sidebar";
import Account from "../components/user-profile/account";
import PurchaseHistory from "../components/user-profile/purchase-history";
import GameCollection from "../components/user-profile/game-collection";
import MyReviews from "../components/user-profile/my-reviews";
import Wishlist from "../components/user-profile/wishlist";
import Security from "../components/user-profile/security";

const UserProfile = () => {
  const [activeSection, setActiveSection] = useState("account");

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return <Account />;
      case "purchaseHistory":
        return <PurchaseHistory />;
      case "gameCollection":
        return <GameCollection />;
      case "myReviews":
        return <MyReviews />;
      case "wishlist":
        return <Wishlist />;
      case "security":
        return <Security />;
      default:
        return <Account />;
    }
  };

  return (
    <section className="flex justify-start gap-8 bg-custom-dark1 p-8 px-16">
      <div className="hidden h-full md:block">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      <div className="flex-grow">{renderSection()}</div>
    </section>
  );
};

export default UserProfile;
