import React, { useContext, useState, useEffect } from "react";
import Title from "./Title";
import { ShopDataContext } from "../context/ShopContext";
import Card from "./Card";

const BestSeller = () => {
  const { products } = useContext(ShopDataContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const filteredProduct = products.filter((item) => item.bestSeller);
    setBestSeller(filteredProduct.slice(0, 4)); // Show only top 4
  }, [products]);

  return (
    <div className="text-center">
      <Title text1="BEST" text2="SELLERS" />
      <p className="text-gray-600 max-w-2xl mx-auto mt-3">
        Most loved by our customers. These products are selling fast, grab yours
        before they’re gone!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {bestSeller.map((item, index) => (
          <Card
            key={index}
            name={item.name}
            id={item._id}
            price={item.price}
            image={item.image1}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
