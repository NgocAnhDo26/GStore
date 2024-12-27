import React, { useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";

import { IconContext } from "react-icons";
import { FaRegUser, FaRegHeart, FaMagnifyingGlass } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const openCategoryDropDown = () => {
    setIsCategoryOpen(true);
  }

  const closeCategoryDropDown = () => {
    setIsCategoryOpen(false);
  }

  const openProfileDropdown = () => {
    setIsProfileDropdownOpen(true);
  }

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?keyword=${keyword}`);
  }

  const categoryItems = [
    { title: "Action", link: '/products?category=action' },
    { title: "RPG", link: '/products?category=rpg' },
    { title: "Simulation", link: '/products?category=simulation' },
    { title: "Casual", link: '/products?category=casual' },
    { title: "FPS", link: '/products?category=fps' },
  ]

  const Categories = () => {
    return (
      <div className="absolute flex flex-col bg-blue1 bg-opacity-90 backdrop-blur-sm py-3 rounded-md mt-[15.5rem]">
        {categoryItems.map((item) => (
          <Link key={item.title} to={item.link}>
            <p className="hover:bg-btn-blue2 px-5 py-2">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    )
  }

  const ProfileDropDown = () => {
    return (
      <div className="absolute flex flex-col bg-blue1 bg-opacity-90 backdrop-blur-sm py-3 rounded-md mt-36 ml-5 text-white">
        <Link to="/profile" className="hover:bg-btn-blue2 px-5 py-2">
          Your Profile
        </Link>
        <button className="hover:bg-btn-blue2 px-5 py-2 text-left" onClick={closeProfileDropdown && auth.handleLogout}>
          Logout
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Util bar */}
      <div className="from-blue1 to-blue2 flex flex-row items-center bg-gradient-to-t py-4 px-10 gap-5">
        <Link to="/" className="font-bold text-white text-4xl ml-5 mr-10">GStore</Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} onChange={e => setKeyword(e.target.value)} className="flex px-4 py-3 rounded-md border-2 border-white border-opacity-70 hover:border-opacity-100 focus:border-opacity-100 overflow-hidden max-w-lg mx-auto font-[sans-serif] flex-1 transition duration-200">
          <input type="" placeholder="Search for games..."
            className="w-full outline-none bg-transparent text-white text-sm" />
          <IconContext.Provider value={{ color: "white" }}>
            <button type="submit">
              <FaMagnifyingGlass />
            </button>
          </IconContext.Provider>
        </form>

        {/* Wishlist Button */}
        <Link to={auth.user ? "/profile/wishlist" : "/login"} className="flex flex-row items-center from-btn-blue2/70 to-btn-blue1/70 rounded-md bg-gradient-to-r shadow-md px-3.5 py-2 max-h-fit h-fit bg-opacity-70 ml-auto hover:scale-105 transition duration-200">
          <IconContext.Provider value={{ color: "white" }}>
            <div className="mr-2">
              <FaRegHeart />
            </div>
          </IconContext.Provider>
          <p className="text-white">Wishlist</p>
        </Link>

        {/* Cart button */}
        <Link to="/cart" className="flex flex-row items-center from-btn-red1/60 to-btn-red2/60 rounded-md bg-gradient-to-r shadow-md px-3.5 py-2 max-h-fit h-fit hover:scale-105 transition duration-200">
          <IconContext.Provider value={{ color: "white" }}>
            <FiShoppingCart />
          </IconContext.Provider>
          <p className="text-white ml-3">Cart (1)</p>
        </Link>

        {/* Login/Account button */}
        <div onMouseEnter={openProfileDropdown} onMouseLeave={closeProfileDropdown} className="flex flex-row items-center gap-5">
          <Link to={auth.user ? "/profile" : "/login"} className="border-2 py-1.5 px-3 flex flex-row items-center rounded-md max-h-fit h-fit ml-5 hover:scale-105 hover:bg-white hover:bg-opacity-20 transition duration-300">
            <IconContext.Provider value={{ color: "white" }}>
              <FaRegUser />
            </IconContext.Provider>
            <p className="text-white ml-3">{auth.user ? auth.user.username : "Login"}</p>
          </Link>

          {auth.user && isProfileDropdownOpen && <ProfileDropDown />}
        </div>
      </div>


      {/* Nav bar */}
      <nav className="flex flex-row justify-evenly bg-dark-blue text-white p-3.5">
        <NavLink to="/" className={({ isActive }) =>
          isActive ? "font-bold" : ""
        }>
          Home
        </NavLink>

        <NavLink to="/products" className={({ isActive }) =>
          isActive ? "font-bold" : ""
        }>
          Games Collection
        </NavLink>

        <div onMouseEnter={openCategoryDropDown} onMouseLeave={closeCategoryDropDown} className="flex items-center">
          <a className="flex flex-row items-center gap-2">
            Categories
            <IconContext.Provider value={{ color: "white" }}>
              <IoIosArrowDown />
            </IconContext.Provider>

          </a>
          {isCategoryOpen && <Categories />}
        </div>

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
