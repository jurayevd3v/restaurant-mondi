import React from "react";
import logo from "../img/logo.png";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const Category = location.pathname === "/admin/category";
  const Menu = location.pathname === "/admin/menu";
  const Bg = location.pathname === "/admin/bg";
  const Employee = location.pathname === "/admin/employee";
  const Comment = location.pathname === "/admin/comments";

  return (
    <div className="relative flex h-screen border-r-[2px] border-[#0093b5] w-full max-w-[20rem] flex-col bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
      <div className="p-4 mb-2">
        <img src={logo} alt="logo" />
      </div>
      <div className="w-full bg-white h-[1px]"></div>
      <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-black text-[22px]">
        <NavLink to="/admin/menu">
          <div
            role="button"
            className={`flex items-center w-full p-3 rounded-lg transition-all hover:bg-blue-50 ${
              Menu ? "bg-blue-100" : ""
            }`}
          >
            <div className="grid mr-4 place-items-center">
              🍽️
            </div>
            Menu
          </div>
        </NavLink>

        <NavLink to="/admin/category">
          <div
            role="button"
            className={`flex items-center w-full p-3 rounded-lg transition-all hover:bg-blue-50 ${
              Category ? "bg-blue-100" : ""
            }`}
          >
            <div className="grid mr-4 place-items-center">📦</div>
            Turkum
          </div>
        </NavLink>

        <NavLink to="/admin/bg">
          <div
            role="button"
            className={`flex items-center w-full p-3 rounded-lg transition-all hover:bg-blue-50 ${
              Bg ? "bg-blue-100" : ""
            }`}
          >
            <div className="grid mr-4 place-items-center">🖼️</div>
            Fon
          </div>
        </NavLink>

        <NavLink to="/admin/employee">
          <div
            role="button"
            className={`flex items-center w-full p-3 rounded-lg transition-all hover:bg-blue-50 ${
              Employee ? "bg-blue-100" : ""
            }`}
          >
            <div className="grid mr-4 place-items-center">👤</div>
            Xodimlar
          </div>
        </NavLink>

        <NavLink to="/admin/comments">
          <div
            role="button"
            className={`flex items-center w-full p-3 rounded-lg transition-all hover:bg-blue-50 ${
              Comment ? "bg-blue-100" : ""
            }`}
          >
            <div className="grid mr-4 place-items-center">💬</div>
            Izohlar
          </div>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
