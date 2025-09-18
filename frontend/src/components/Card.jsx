import React, { useContext } from "react";
import { ShopDataContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Card = ({ name, image, id, price }) => {
  const navigate = useNavigate()
  const { currency } = useContext(ShopDataContext);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 cursor-pointer flex flex-col" onClick={() => navigate(`/product-details/${id}`)}>
      {/* Product Image */}
      <div className="w-full h-56 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50">
        <img
          src={image.url}
          alt={name}
          className="object-contain max-h-full hover:scale-105 transition duration-300"
        />
      </div>

      {/* Product Details */}
      <div className="mt-4 flex flex-col flex-1">
        <h3 className="text-gray-800 font-semibold text-lg truncate">{name}</h3>
        <p className="text-indigo-900 font-bold mt-2">
          {currency}
          {price}
        </p>
      </div>

      {/* Add to Cart Button */}
      <button className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition">
        View Details
      </button>
    </div>
  );
};

export default Card;
