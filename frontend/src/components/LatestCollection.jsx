import React, { useContext, useState, useEffect } from "react";
import Title from "./Title";
import { ShopDataContext } from "../context/ShopContext";
import Card from "./Card";
import { motion } from "framer-motion";

const LatestCollection = () => {
  let { products } = useContext(ShopDataContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 8));
  }, [products]);

  return (
    <div className="text-center">
      <div>
        <Title text1="LATEST" text2="COLLECTIONS" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#7a6b54] max-w-2xl mx-auto mt-3 font-body"
        >
          Stay ahead of the trends with our freshly curated picks. 
          These are the newest arrivals designed to match your style, comfort, 
          and budget — because fashion waits for no one.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10"
      >
        {latestProducts.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              name={item.name}
              image={item.image1}
              id={item._id}
              price={item.price}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LatestCollection;