import React, { useState } from "react";
import { FaUser, FaCartShopping, FaHardDrive, FaLock, FaMessage, FaHeart } from "react-icons/fa6";

const Sidebar = () => {
  const [sidebarItems, setSidebarItems] = useState([
    { id: 1, image: <FaUser />, label: "Account", link: "#" },
    { id: 2, image: <FaCartShopping />, label: "Purchase history", link: "#" },
    { id: 3, image: <FaHardDrive />, label: "Game Collection", link: "#" },
    { id: 4, image: <FaLock />, label: "Security", link: "#" },
    { id: 5, image: <FaMessage />, label: "My reviews", link: "#" },
    { id: 6, image: <FaHeart />, label: "Wishlist", link: "#" },
  ]);

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border-solid bg-white p-4">
      {sidebarItems.map((item) => (
        <a
          href={item.link}
          key={item.id}
          className="flex items-center justify-start space-x-5 rounded-2xl border-solid bg-custom-dark2 px-4 py-2 text-white transition duration-300 hover:bg-gray-700"
        >
          <div className="h-8 w-8 flex items-center justify-center">
            <div className="text-xl">{item.image}</div>
          </div>
          <div>{item.label}</div>
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
