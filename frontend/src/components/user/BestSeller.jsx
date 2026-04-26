import React, { useContext, useState, useEffect } from "react";
import Title from "./Title";
import { ShopDataContext } from "../../context/user/ShopContext";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";
import { motion } from "framer-motion";

const BestSeller = () => {
  const { products, loading } = useContext(ShopDataContext);
  const [bestSeller, setBestSeller] = useState([]);

   useEffect(() => {
     const productsArray = Array.isArray(products) ? products : [];
     const filteredProduct = productsArray.filter((item) => item.bestSeller);
     setBestSeller(filteredProduct.slice(0, 4));
   }, [products]);

  return (
    <div className="text-center">
      <Title text1="BEST" text2="SELLERS" />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-[#7a6b54] max-w-2xl mx-auto mt-3 font-body"
      >
        Most loved by our customers. These products are selling fast, grab yours
        before they're gone!
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10"
      >
        {loading ? (
          Array(4).fill(0).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          bestSeller.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image1}
              />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default BestSeller;
