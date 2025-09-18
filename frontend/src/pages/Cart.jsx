import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { ShopDataContext } from "../context/ShopContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import CartTotal from "../components/CartTotal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const { products, cartItem, updateQuantity } = useContext(ShopDataContext);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItem[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItem]);

  return (
    <>
      <Navbar />
      <div className="px-6 pt-[100px] md:px-12 lg:px-20 py-10">
        <Title text1="YOUR" text2="CART" />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartData.length > 0 ? (
              cartData.map((item, index) => {
                const productData = products.find(
                  (product) => String(product._id) === String(item._id)
                );

                if (!productData) return null;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-6 border-b pb-4"
                  >
                    {/* Product Image */}
                    <img
                      src={productData.image1.url}
                      alt={productData.name}
                      className="w-24 h-24 object-contain rounded-md"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {productData.name}
                      </h3>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="font-medium text-indigo-700">
                        ₹{productData.price}
                      </p>
                    </div>

                    {/* Quantity Input */}
                    <input
                      type="number"
                      min={1}
                      defaultValue={item.quantity}
                      className="w-16 border rounded-md px-2 py-1"
                      onChange={(e) =>
                        e.target.value === "" || e.target.value === "0"
                          ? null
                          : updateQuantity(
                              item._id,
                              item.size,
                              Number(e.target.value)
                            )
                      }
                    />

                    {/* Delete Icon */}
                    <RiDeleteBin6Line
                      size={24}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                    />
                  </div>
                );
              })
            ) : (
              <div className="h-40 w-[80%] mx-auto flex justify-center items-center">
                <p className="text-gray-500 ">Your cart is empty.</p>
              </div>
            )}
          </div>

          {/* ✅ Right Side - Only show CartTotal if cart has items */}
          {cartData.length > 0 && (
            <div className="lg:col-span-1">
              <CartTotal />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
