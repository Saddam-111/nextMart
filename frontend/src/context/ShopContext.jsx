// src/context/ShopContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { userDataContext } from "./UserContext";
import axios from "axios";

export const ShopDataContext = createContext();

const ShopContext = ({ children }) => {
  const [products, setProducts] = useState([]);
  const { baseUrl } = useContext(userDataContext);
  const currency = "₹";
  const delivery_fee = 40;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const { userData } = useContext(userDataContext);

  const getProduct = async () => {
    try {
      const result = await axios.get(baseUrl + "/api/v1/product/list", {
        withCredentials: true,
      });
      // console.log("products:", result.data);
      setProducts(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      console.warn("Select Product size");
      return;
    }

    // clone current cart
    let cartData = structuredClone(cartItem || {});
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItem(cartData);
    // console.log("local cart:", cartData);

    if (userData) {
      try {
        await axios.post(
          baseUrl + `/api/v1/cart/add`,
          { itemId, size },
          { withCredentials: true }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getUserCart = async () => {
    try {
      const result = await axios.post(
        baseUrl + `/api/v1/cart/get`,
        {},
        { withCredentials: true }
      );
      // result.data should be cart object: { productId: { size: qty, ... }, ... }
      setCartItem(result.data || {});
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    // local update
    let cartData = structuredClone(cartItem || {});
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;
    // if quantity <= 0 you might want to delete that size/key, but keep it for now
    setCartItem(cartData);

    try {
      await axios.post(
        baseUrl + "/api/v1/cart/update",
        { itemId, size, quantity },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (Number(cartItem[items][item]) > 0) {
            totalCount += Number(cartItem[items][item]);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  // IMPORTANT: synchronous function that returns subtotal number
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      // compare ids as strings to avoid type mismatches
      const productInfo = products.find(
        (product) => String(product._id) === String(items)
      );
      if (!productInfo) {
        // product not loaded yet or id mismatch; skip
        continue;
      }
      for (const item in cartItem[items]) {
        try {
          const qty = Number(cartItem[items][item]) || 0;
          if (qty > 0) {
            totalAmount += Number(productInfo.price) * qty;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    getProduct();
  }, [baseUrl]);

  useEffect(() => {
    if (userData) getUserCart();
    // if you want to load local cart for guest -> keep current cartItem
  }, [userData]);

  const value = {
    products,
    currency,
    delivery_fee,
    getProduct,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    addToCart,
    getCartCount,
    setCartItem,
    updateQuantity,
    getCartAmount,
  };

  return (
    <ShopDataContext.Provider value={value}>
      {children}
    </ShopDataContext.Provider>
  );
};

export default ShopContext;
