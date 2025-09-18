import React from "react";
import { NavLink } from "react-router-dom";
import { FiPackage, FiList, FiShoppingCart } from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: <FiPackage size={20} />, label: "Dashboard", path: "/" },
    { icon: <FiPackage size={20} />, label: "Add Items", path: "/add" },
    { icon: <FiList size={20} />, label: "List Items", path: "/lists" },
    { icon: <FiShoppingCart size={20} />, label: "View Orders", path: "/orders" },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 bg-white shadow-md 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
        md:static md:translate-x-0 md:w-60
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {/* Close button (only on mobile) */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-900"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
      </div>

      {/* Menu Items */}
      <div className="p-4 flex flex-col gap-2">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            onClick={() => setIsOpen(false)} // close on mobile
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
              ${
                isActive
                  ? "bg-blue-100 text-blue-900 font-semibold shadow-sm"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-900"
              }`
            }
          >
            {item.icon}
            <p>{item.label}</p>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
