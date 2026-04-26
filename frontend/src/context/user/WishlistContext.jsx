/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/v1/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setWishlist(data.wishlist || []);
    } catch (err) {
      setError(err.message);
      console.error("Wishlist fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/v1/wishlist/${productId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to add to wishlist");
      await fetchWishlist(); // Refresh wishlist
    } catch (err) {
      setError(err.message);
      console.error("Add to wishlist error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/v1/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to remove from wishlist");
      await fetchWishlist(); // Refresh wishlist
    } catch (err) {
      setError(err.message);
      console.error("Remove from wishlist error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Move product from wishlist to cart
  const moveToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/v1/wishlist/${productId}/move-to-cart`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        }
      );
      if (!res.ok) throw new Error("Failed to move to cart");
      await fetchWishlist(); // Refresh wishlist
      // Note: Cart update should be handled by cart context or state
      // We might need to update cart context here or emit an event
    } catch (err) {
      setError(err.message);
      console.error("Move to cart error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize wishlist on mount if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchWishlist();
    }
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        fetchWishlist, // expose for manual refresh if needed
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
