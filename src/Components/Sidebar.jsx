import React from "react";
import { Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { NavLink, useLocation } from "react-router-dom";
import {
  PresentationChartBarIcon,
  CubeTransparentIcon,
  PhotoIcon,
  UserCircleIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import logo from "../img/logo.png";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/admin/category", label: "Turkum", icon: <CubeTransparentIcon className="h-5 w-5" /> },
    { to: "/admin/bg", label: "Fon", icon: <PhotoIcon className="h-5 w-5" /> },
    { to: "/admin/employee", label: "Xodimlar", icon: <UserCircleIcon className="h-5 w-5" /> },
    { to: "/admin/comments", label: "Izohlar", icon: <ChatBubbleBottomCenterTextIcon className="h-5 w-5" /> },
  ];

  return (
    <Card
      className="
     h-[97%] w-[300px] shadow-2xl bg-white fixed mt-[10px] ml-[10px] p-[10px] rounded-[10px]
      "
    >
      {/* Logo Section */}
      <div className="mb-6 flex justify-center border-b border-gray-300/30 pb-6 transition-all duration-300 hover:scale-105">
        <img src={logo} alt="Logo" className="w-36 mt-[20px] h-auto object-contain opacity-90" />
      </div>

      {/* Navigation Links */}
      <List>
        {links.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;

          return (
            <NavLink to={to} key={to} end>
              <ListItem
                className={`group flex items-center gap-3 rounded-lg px-4 py-3 mb-2 transition-all duration-200 
                  ${isActive
                    ? "bg-white/60 text-black shadow-md backdrop-blur-sm font-medium"
                    : "text-gray-800 hover:bg-white/50 hover:text-gray-900"}`}
              >
                <ListItemPrefix
                  className={`transition-transform duration-200 group-hover:scale-110 
                    ${isActive ? "text-black" : "text-gray-700"}`}
                >
                  {icon}
                </ListItemPrefix>
                <Typography
                  variant="small"
                  className={`font-semibold tracking-wide transition-colors duration-200 
                    ${isActive ? "text-black" : "text-gray-800"}`}
                >
                  {label}
                </Typography>
              </ListItem>
            </NavLink>
          );
        })}
      </List>
    </Card>
  );
}