import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopDataContext } from "../context/ShopContext";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from "../components/RelatedProduct";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
  let { productId } = useParams();
  let { products, currency, addToCart } = useContext(ShopDataContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = () => {
    if (products.length) {
      const selectedProduct = products.find((item) => item._id === productId);
      if (selectedProduct) {
        setProductData(selectedProduct);
        setImage1(selectedProduct.image1.url);
        setImage2(selectedProduct.image2.url);
        setImage3(selectedProduct.image3.url);
        setImage4(selectedProduct.image4.url);
        setImage(selectedProduct.image1.url);
      }
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  if (!productData) {
    return (
      <div className="p-10 text-center">
        <h3 className="text-lg font-medium">Loading product details...</h3>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="px-6 md:px-12 mt-6 lg:px-20 py-10">
      {/* Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side - Images */}
        <div>
          {/* Main Image */}
          <div className="border rounded-xl overflow-hidden mb-4">
            <img
              src={image}
              alt="Main Product"
              className="w-full h-[400px] object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            <img
              src={image1}
              alt="thumb1"
              className={`border rounded-lg cursor-pointer h-20 object-contain ${
                image === image1 && "border-indigo-600"
              }`}
              onClick={() => setImage(image1)}
            />
            <img
              src={image2}
              alt="thumb2"
              className={`border rounded-lg cursor-pointer h-20 object-contain ${
                image === image2 && "border-indigo-600"
              }`}
              onClick={() => setImage(image2)}
            />
            <img
              src={image3}
              alt="thumb3"
              className={`border rounded-lg cursor-pointer h-20 object-contain ${
                image === image3 && "border-indigo-600"
              }`}
              onClick={() => setImage(image3)}
            />
            <img
              src={image4}
              alt="thumb4"
              className={`border rounded-lg cursor-pointer h-20 object-contain ${
                image === image4 && "border-indigo-600"
              }`}
              onClick={() => setImage(image4)}
            />
          </div>
        </div>

        {/* Right Side - Details */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            {productData.name.toUpperCase()}
          </h1>

          {/* Ratings */}
          <div className="flex items-center gap-1 mb-3">
            <FaStar className="text-[20px] fill-amber-400" />
            <FaStar className="text-[20px] fill-amber-400" />
            <FaStar className="text-[20px] fill-amber-400" />
            <FaStar className="text-[20px] fill-amber-400" />
            <FaStarHalfAlt className="text-[20px] fill-amber-400" />
            <p className="ml-2 text-gray-600 text-sm">(124 reviews)</p>
          </div>

          {/* Price */}
          <p className="text-2xl font-semibold text-indigo-700 mb-4">
            {currency} {productData.price}
          </p>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {productData.description}
          </p>

          {/* Size Selector */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Select Size</p>
            <div className="flex gap-3 flex-wrap">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`px-4 py-2 border rounded-lg ${
                    size === item
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700"
                  } hover:bg-indigo-100 transition`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition" onClick={() => addToCart(productData._id, size)}>
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <RelatedProduct
          category={productData.category}
          subCategory={productData.subCategory}
          currentProductId={productData._id}
        />
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ProductDetails;
