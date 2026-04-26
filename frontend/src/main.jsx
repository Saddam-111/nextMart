import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthContext from "./context/user/AuthContext.jsx";
import UserContext from "./context/user/UserContext.jsx";
import ShopContext from "./context/user/ShopContext.jsx";
import { WishlistProvider } from "./context/user/WishlistContext.jsx";
import { AdminProvider } from "./context/admin/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
    <AdminProvider>
      <AuthContext>
        <UserContext>
          <ShopContext>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </ShopContext>
        </UserContext>
      </AuthContext>
    </AdminProvider>
);
