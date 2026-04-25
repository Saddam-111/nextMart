import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiTag,
  FiRotateCcw,
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiLogOut,
  FiChevronDown,
  FiMenu,
  FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin", exact: true, icon: FiHome, label: "Dashboard" },
    { path: "/admin/products", icon: FiPackage, label: "Products" },
    { path: "/admin/orders", icon: FiShoppingCart, label: "Orders" },
    { path: "/admin/coupons", icon: FiTag, label: "Coupons" },
    { path: "/admin/returns", icon: FiRotateCcw, label: "Returns" },
    { path: "/admin/users", icon: FiUsers, label: "Users" },
    { path: "/admin/reports", icon: FiFileText, label: "Reports" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#e4a4bd]/20 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#e4a4bd]/20">
          <h1 className="text-xl font-display font-bold text-[#262626]">
            nextMart<span className="text-[#e4a4bd]">Admin</span>
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-[#7a6b54] hover:text-[#262626]"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all-slow ${
                  isActive
                    ? "bg-[#e4a4bd] text-white"
                    : "text-[#5e5240] hover:bg-[#f5f0eb] hover:text-[#e4a4bd]"
                }`
              }
            >
              <item.icon className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all-slow w-full text-left text-[#965639] hover:bg-[#fdf8f3] hover:text-[#7a3f2a]"
          >
            <FiLogOut className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>

        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#e4a4bd]/20">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#e4a4bd] flex items-center justify-center text-white font-bold">
              {admin?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-[#7a6b54] truncate">Admin</p>
              <p className="text-sm font-medium truncate text-[#262626]">
                {admin?.email || "Admin"}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const AdminHeader = ({ title, onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-[#e4a4bd]/20 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[#f5f0eb] transition-all-slow"
        >
          <FiMenu className="text-[#262626]" size={20} />
        </button>
        <h1 className="text-xl font-display font-bold text-[#262626]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-[#7a6b54]">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </header>
  );
};

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="lg:ml-64">
        <AdminHeader
          title={title}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
