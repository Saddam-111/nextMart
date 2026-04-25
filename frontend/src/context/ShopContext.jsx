import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { userDataContext } from "./UserContext";
import axios from "axios";

export const ShopDataContext = createContext();

const ShopContext = ({ children }) => {
  const [products, setProducts] = useState([]);
  const { baseUrl } = useContext(userDataContext);
  const currency = "â‚¹";
  const delivery_fee = 40;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(userDataContext);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const getCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const items in cartItem) {
      const productInfo = products.find(
        (product) => String(product._id) === String(items)
      );
      if (!productInfo) continue;
      for (const item in cartItem[items]) {
        try {
          const qty = Number(cartItem[items][item]) || 0;
          if (qty > 0) {
            totalAmount += Number(productInfo.price) * qty;
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalAmount;
  }, [cartItem, products]);

  const applyCoupon = async (code) => {
    try {
      const items = [];
      for (const productId in cartItem) {
        for (const size in cartItem[productId]) {
          if (cartItem[productId][size] > 0) {
            const product = products.find((p) => String(p._id) === String(productId));
            if (product) {
              items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                size,
                quantity: cartItem[productId][size],
              });
            }
          }
        }
      }

      const response = await axios.post(
        `${baseUrl}/api/v1/coupon/validate`,
        {
          code: code.toUpperCase(),
          cartTotal: getCartAmount(),
          items,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        const coupon = response.data.coupon;
        setAppliedCoupon(coupon);
        setDiscount(coupon.discount);
        return { success: true, coupon };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Invalid coupon" 
      };
    }
    return { success: false, message: "Invalid coupon" };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const getProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await axios.get(baseUrl + "/api/v1/product/list", {
        withCredentials: true,
      });
      let productsData = result.data?.products || [];
      
      if (!Array.isArray(productsData)) productsData = [];
      
      productsData = productsData.map(product => ({
        ...product,
        image1: product.images && product.images[0] ? product.images[0] : { url: '', publicId: '' },
        image2: product.images && product.images[1] ? product.images[1] : { url: '', publicId: '' },
        image3: product.images && product.images[2] ? product.images[2] : { url: '', publicId: '' },
        image4: product.images && product.images[3] ? product.images[3] : { url: '', publicId: '' },
      }));
      
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const addToCart = async (itemId, size) => {
    if (!size) {
      console.warn("Select Product size");
      return;
    }

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
    localStorage.setItem("nextMart_cart", JSON.stringify(cartData));

    if (userData) {
      try {
        await axios.post(
          baseUrl + `/api/v1/cart/add`,
          { itemId, size },
          { withCredentials: true }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getUserCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const result = await axios.post(
        baseUrl + `/api/v1/cart/get`,
        {},
        { withCredentials: true }
      );
      if (result.data && result.data.cartData) {
        setCartItem(result.data.cartData);
        localStorage.setItem("nextMart_cart", JSON.stringify(result.data.cartData));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setCartLoading(false);
    }
  }, [baseUrl]);

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem || {});
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;
    setCartItem(cartData);
    localStorage.setItem("nextMart_cart", JSON.stringify(cartData));

    if (userData) {
      try {
        await axios.post(
          baseUrl + "/api/v1/cart/update",
          { itemId, size, quantity },
          { withCredentials: true }
        );
      } catch (error) {
        console.error(error);
      }
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
          console.error(error);
        }
      }
    }
    return totalCount;
  };

  useEffect(() => {
    getProduct();
    const localCart = localStorage.getItem("nextMart_cart");
    if (localCart) {
      try {
        setCartItem(JSON.parse(localCart));
      } catch (e) {
        console.error("Error parsing local cart:", e);
      }
    }
  }, [getProduct]);

  useEffect(() => {
    if (userData) {
      getUserCart();
    } else {
      setCartLoading(false);
    }
  }, [userData, getUserCart]);

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
    loading,
    cartLoading,
    error,
    appliedCoupon,
    discount,
    applyCoupon,
    removeCoupon
  };

  return (
    <ShopDataContext.Provider value={value}>
      {children}
    </ShopDataContext.Provider>
  );
};

export default ShopContext;

