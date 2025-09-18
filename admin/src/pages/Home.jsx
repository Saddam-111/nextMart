import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";

const Home = () => {
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const { baseUrl } = useContext(AuthDataContext);

  const fetchCount = async () => {
    try {
      const products = await axios.get(baseUrl + '/api/v1/product/list', { withCredentials: true });
      setTotalProduct(products.data.length);

      const orders = await axios.get(baseUrl + '/api/v1/order/orderList', { withCredentials: true });
      setTotalOrder(orders.data.length);
    } catch (error) {
      console.error('Failed to fetch count', error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-64 text-center">
        <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
        <p className="mt-4 text-3xl font-bold text-blue-600">{totalProduct}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-64 text-center">
        <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
        <p className="mt-4 text-3xl font-bold text-blue-600">{totalOrder}</p>
      </div>
    </div>
  );
};

export default Home;
