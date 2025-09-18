import React, { useContext, useState, useEffect } from "react";
import Title from "./Title";
import { ShopDataContext } from "../context/ShopContext";
import Card from "./Card";

const LatestCollection = () => {
  let { products } = useContext(ShopDataContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 8)); // show first 8 products
  }, [products]);

  return (
    <div className="text-center">
      {/* Section Title */}
      <div>
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="text-gray-600 max-w-2xl mx-auto mt-3">
          Stay ahead of the trends with our freshly curated picks. 
          These are the newest arrivals designed to match your style, comfort, 
          and budget — because fashion waits for no one.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {latestProducts.map((item, index) => (
          <Card
            key={index}
            name={item.name}
            image={item.image1}
            id={item._id}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
