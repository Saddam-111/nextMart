import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-full overflow-y-hidden flex flex-col bg-gray-100">
      {/* Navbar at the very top (full width) */}
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main content below navbar */}
      <div className="flex flex-1 h-full">
        {/* Sidebar (left) */}
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          className="fixed h-full" // sidebar fixed
        />

        {/* Page Content (right) */}
        <main
          className={`flex-1 p-4 ml-0 md:ml-${isSidebarOpen ? "64" : "0"} h-full overflow-y-scroll scrollbar-hide transition-all duration-300 bg-white`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
