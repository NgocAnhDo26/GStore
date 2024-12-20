import React, { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";

import { IconContext } from "react-icons";
import { FaRegUser, FaRegHeart, FaMagnifyingGlass } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const auth = useAuth();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const toggleDropDown = () => {
    setIsCategoryOpen(!isCategoryOpen);
  }

  const categoryItems = [
    { title: "Action", link: "/" },
    { title: "RPG", link: "/" },
    { title: "Simulation", link: "/" },
    { title: "Casual", link: "/" },
    { title: "FPS", link: "/" },
  ]

  const Categories = () => {
    return (
      <div class="absolute flex flex-col bg-blue1 py-3 mt-2 rounded-md">
        {categoryItems.map((item) => (
          <Link to={item.href}>
            <p class="hover:bg-btn-blue2 px-5 py-2">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Util bar */}
      <div class="from-blue1 to-blue2 flex flex-row items-center bg-gradient-to-t py-4 px-10 gap-5">
        <Link to="/" class="font-bold text-white text-4xl ml-5 mr-10">GStore</Link>

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
        <Link to="/profile/wishlist" class="flex flex-row items-center from-btn-blue2/70 to-btn-blue1/70 rounded-md bg-gradient-to-r shadow-md px-3.5 py-2 max-h-fit h-fit bg-opacity-70 ml-auto hover:scale-105 transition duration-300">
          <IconContext.Provider value={{ color: "white" }}>
            <div class="mr-2">
              <FaRegHeart />
            </div>
          </IconContext.Provider>
          <p class="text-white">Wishlist</p>
        </Link>

        {/* Cart button */}
        <Link to="/cart" class="flex flex-row items-center from-btn-red1/60 to-btn-red2/60 rounded-md bg-gradient-to-r shadow-md px-3.5 py-2 max-h-fit h-fit hover:scale-105 transition duration-300">
          <IconContext.Provider value={{ color: "white" }}>
            <FiShoppingCart />
          </IconContext.Provider>
          <p class="text-white ml-3">Cart (1)</p>
        </Link>

        {/* Login/Account button */}
        <Link to={auth.user ? "/profile" : "/login"} class="border-2 py-1.5 px-3 flex flex-row items-center rounded-md max-h-fit h-fit ml-5 hover:scale-105 hover:bg-white hover:bg-opacity-20 transition duration-300">
          <IconContext.Provider value={{ color: "white" }}>
            <FaRegUser />
          </IconContext.Provider>
          <p class="text-white ml-3">{auth.user ? auth.user.username : "Login"}</p>
        </Link>
      </div>


      {/* Nav bar */}
      <nav class="flex flex-row justify-evenly bg-dark-blue text-white p-3.5">
        <NavLink to="/" className={({ isActive }) =>
          isActive ? "font-bold" : ""
        }>
          Home
        </NavLink>

        <NavLink to="/collection" className={({ isActive }) =>
          isActive ? "font-bold" : ""
        }>
          Games Collection
        </NavLink>

        <div>
          <button class="flex flex-row items-center gap-2" onClick={toggleDropDown}>
            Categories
            <IconContext.Provider value={{ color: "white" }}>
              {isCategoryOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </IconContext.Provider>

          </button>
          {isCategoryOpen && <Categories />}
        </div>

        <NavLink to="/hot-games" className={({ isActive }) =>
          isActive ? "font-bold" : ""
        }>
          Hot Games
        </NavLink>

        <NavLink to="/customer-service" className={({ isActive }) =>
          isActive ? "font-bold" : ""
        }>
          Customer Service
        </NavLink>
      </nav>
    </div>
  );
};

export default Header;
