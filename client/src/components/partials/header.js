import React, { useState } from "react";

import { IconContext } from "react-icons";
import { FaRegUser, FaRegHeart, FaMagnifyingGlass } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const Header = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const toggleDropDown = () => {
    setIsCategoryOpen(!isCategoryOpen);
  }

  const categoryItems = [
    { title: "Action", href: "/" },
    { title: "RPG", href: "/" },
    { title: "Simulation", href: "/" },
    { title: "Casual", href: "/" },
    { title: "FPS", href: "/" },
  ]

  const Categories = () => {
    return (
      <div class="absolute flex flex-col bg-blue1 py-3 mt-2 rounded-md">
        {categoryItems.map((item) => (
          <a href={item.href} class="hover:bg-btn-blue2 px-5 py-2">{item.title}</a>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Util bar */}
      <div class="from-blue1 to-blue2 flex flex-row items-center bg-gradient-to-t py-4 px-10 gap-5">
        <a href="/" class="font-bold text-white text-4xl ml-5 mr-10">GStore</a>

        {/* Search bar */}
        <form class="flex px-4 py-3 rounded-md border-2 border-white border-opacity-70 hover:border-opacity-100 focus:border-opacity-100 overflow-hidden max-w-lg mx-auto font-[sans-serif] flex-1 transition duration-300">
          <input type="" placeholder="Search for games..."
            class="w-full outline-none bg-transparent text-white text-sm" />
          <IconContext.Provider value={{ color: "white" }}>
            <button type="submit">
              <FaMagnifyingGlass />
            </button>
          </IconContext.Provider>
        </form>

        {/* Wishlist Button */}
        <a href="" class="flex flex-row items-center from-btn-blue2/70 to-btn-blue1/70 rounded-md bg-gradient-to-r shadow-md px-3.5 py-2 max-h-fit h-fit bg-opacity-70 ml-auto hover:scale-105 transition duration-300">
          <IconContext.Provider value={{ color: "white" }}>
            <div class="mr-2">
              <FaRegHeart />
            </div>
          </IconContext.Provider>
          <p class="text-white">Wishlist</p>
        </a>

        {/* Cart button */}
        <a href="" class="flex flex-row items-center from-btn-red1/60 to-btn-red2/60 rounded-md bg-gradient-to-r shadow-md px-3.5 py-2 max-h-fit h-fit hover:scale-105 transition duration-300">
          <IconContext.Provider value={{ color: "white" }}>
            <FiShoppingCart />
          </IconContext.Provider>
          <p class="text-white ml-3">Cart (1)</p>
        </a>

        {/* Login/Account button */}
        <a href="" class="border-2 py-1.5 px-3 flex flex-row items-center rounded-md max-h-fit h-fit ml-5 hover:scale-105 hover:bg-white hover:bg-opacity-20 transition duration-300">
          <IconContext.Provider value={{ color: "white" }}>
            <FaRegUser />
          </IconContext.Provider>
          <p class="text-white ml-3">Login</p>
        </a>
      </div>


      {/* Nav bar */}
      <nav class="flex flex-row justify-evenly bg-dark-blue text-white p-3.5">
        <a href="/html/">Home</a>
        <a href="/html/">Games Collection</a>
        <div>
          <button class="flex flex-row items-center gap-2" onClick={toggleDropDown}>
            Categories
            <IconContext.Provider value={{ color: "white" }}>
              {isCategoryOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </IconContext.Provider>

          </button>
          {isCategoryOpen && <Categories />}
        </div>
        <a href="/html/">Hot Games</a>
        <a href="/html/">Customer Service</a>
      </nav>
    </div>
  );
};

export default Header;
