import React, { useContext, useEffect, useState } from "react";
import { ShopDataContext } from "../context/ShopContext";
import Title from "./Title";
import Card from "./Card";

const RelatedProduct = ({ category, subCategory, currentProductId }) => {
  let { products } = useContext(ShopDataContext);
  let [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productCopy = products.slice();
      productCopy = productCopy.filter((item) => category === item.category);
      productCopy = productCopy.filter((item) => subCategory === item.subCategory);
      productCopy = productCopy.filter((item) => currentProductId !== item._id);
      setRelated(productCopy.slice(0, 4));
    }
  }, [products, category, subCategory, currentProductId]);

  return (
    <div>
      <div className="text-center mb-10">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {related.map((item, index) => (
          <Card
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image1}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
