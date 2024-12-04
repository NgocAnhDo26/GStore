import React, { useState } from "react";

const Sidebar = () => {
  const [sidebarItems, setSidebarItems] = useState([
    { id: 1, image: "/img/gura-icon.jpg", label: "Account" },
    { id: 2, image: "/img/gura-icon.jpg", label: "Purchase history" },
    { id: 3, image: "/img/gura-icon.jpg", label: "Game Collection" },
    { id: 4, image: "/img/gura-icon.jpg", label: "Security" },
    { id: 5, image: "/img/gura-icon.jpg", label: "My reviews" },
    { id: 6, image: "/img/gura-icon.jpg", label: "Wishlist" },
  ]);

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border-solid bg-white p-4">
      {sidebarItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-start space-x-5 rounded-2xl border-solid bg-custom-dark2 px-4 py-2 text-white transition duration-300 hover:bg-gray-700"
        >
          <div className="h-8 w-8">
            <img
              src={item.image}
              alt="Icon"
              className="h-full w-full object-cover"
            />
          </div>
          <div>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
