import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthContext from "./context/AuthContext.jsx";
import UserContext from "./context/UserContext.jsx";
import ShopContext from "./context/ShopContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";

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
