import React from "react";
import {
  FaUser,
  FaCartShopping,
  FaHardDrive,
  FaLock,
  FaMessage,
  FaHeart,
} from "react-icons/fa6";

const Sidebar = ({ activeSection, onSectionChange }) => {
  const sidebarItems = [
    { id: 1, image: <FaUser />, label: "Account", section: "account" },
    {
      id: 2,
      image: <FaCartShopping />,
      label: "Purchase history",
      section: "purchaseHistory",
    },
    {
      id: 3,
      image: <FaHardDrive />,
      label: "Game Collection",
      section: "gameCollection",
    },
    { id: 4, image: <FaLock />, label: "Security", section: "security" },
    { id: 5, image: <FaMessage />, label: "My reviews", section: "myReviews" },
    { id: 6, image: <FaHeart />, label: "Wishlist", section: "wishlist" },
  ];

  return (
    <div className="flex h-full w-60 flex-col gap-4 rounded-xl border-solid bg-white p-4">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSectionChange(item.section)}
          className={`flex items-center justify-start space-x-2 rounded-2xl border-solid px-4 py-2 text-white transition duration-300 ${
            activeSection === item.section ? "bg-gray-700" : "bg-custom-dark2"
          }`}
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <div className="text-xl">{item.image}</div>
          </div>
          <div>{item.label}</div>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
