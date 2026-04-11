import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const Home = () => {
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const { baseUrl } = useContext(AuthDataContext);

  const fetchCount = async () => {
    try {
      const products = await axios.get(baseUrl + "/api/v1/product/list", { withCredentials: true });
      setTotalProduct(products.data.length);

      const orders = await axios.get(baseUrl + "/api/v1/order/orderList", { withCredentials: true });
      setTotalOrder(orders.data.length);
    } catch (error) {
      console.error("Failed to fetch count", error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const stats = [
    { title: "Total Products", value: totalProduct, color: "text-[#6b7d56]" },
    { title: "Total Orders", value: totalOrder, color: "text-[#965639]" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap justify-center gap-6 p-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -6 }}
          className="bg-[#fdfbf7] p-6 rounded-3xl shadow-lg w-64 text-center organic-card"
        >
          <h3 className="text-lg font-display font-semibold text-[#5e5240]">{stat.title}</h3>
          <p className={`mt-4 text-3xl font-display font-bold ${stat.color}`}>
            {stat.value}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Home;