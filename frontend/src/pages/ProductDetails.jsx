import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopDataContext } from "../context/ShopContext";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from "../components/RelatedProduct";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

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
  const [selectedTab, setSelectedTab] = useState("description");

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

  const handleImageChange = (newImage) => {
    setImage(newImage);
  };

  if (!productData) {
    return (
      <div className="p-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-body text-[#7a6b54]"
        >
          Loading product details...
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 md:px-12 mt-6 lg:px-20 py-10 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="border border-[#d9cec0] rounded-3xl overflow-hidden mb-4 bg-[#f3efe8]"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={image}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={image}
                  alt="Main Product"
                  className="w-full h-[400px] object-contain"
                />
              </AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-4 gap-3">
              {[image1, image2, image3, image4].map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleImageChange(img)}
                  className={`border-2 rounded-xl cursor-pointer h-20 object-contain transition-all ${
                    image === img
                      ? "border-[#6b7d56]"
                      : "border-[#d9cec0] hover:border-[#9e866b]"
                  }`}
                >
                  <img src={img} alt={`thumb${index}`} className="w-full h-full object-contain" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl font-display font-semibold mb-4 text-[#3d352b]"
            >
              {productData.name.toUpperCase()}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex items-center gap-1 mb-3"
            >
              <FaStar className="text-[20px] fill-[#9e866b]" />
              <FaStar className="text-[20px] fill-[#9e866b]" />
              <FaStar className="text-[20px] fill-[#9e866b]" />
              <FaStar className="text-[20px] fill-[#9e866b]" />
              <FaStarHalfAlt className="text-[20px] fill-[#9e866b]" />
              <p className="ml-2 text-[#7a6b54] text-sm font-body">(124 reviews)</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl font-display font-semibold text-[#6b7d56] mb-4"
            >
              {currency} {productData.price}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex gap-2 mb-6"
            >
              {["description", "reviews"].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-5 py-2 rounded-xl font-medium transition-colors ${
                    selectedTab === tab
                      ? "bg-[#6b7d56] text-white"
                      : "bg-[#f3efe8] text-[#5e5240] hover:bg-[#e8e0d3]"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {selectedTab === "description" ? (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-[#5e5240] leading-relaxed mb-6 font-body">
                    {productData.description}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <p className="text-[#7a6b54]">Customer reviews coming soon...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-6"
            >
              <p className="font-display font-semibold mb-2 text-[#5e5240]">Select Size</p>
              <div className="flex gap-3 flex-wrap">
                {productData.sizes.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSize(item)}
                    className={`px-5 py-2 border-2 rounded-xl font-medium transition-colors ${
                      size === item
                        ? "bg-[#6b7d56] text-white border-[#6b7d56]"
                        : "bg-white text-[#5e5240] border-[#d9cec0] hover:border-[#6b7d56]"
                    }`}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => addToCart(productData._id, size)}
              disabled={!size}
              className={`px-8 py-3 rounded-xl font-semibold transition-colors ${
                size
                  ? "bg-[#6b7d56] text-white hover:bg-[#5d6446]"
                  : "bg-[#d9cec0] text-[#9e866b] cursor-not-allowed"
              }`}
            >
              Add to Cart
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <RelatedProduct
            category={productData.category}
            subCategory={productData.subCategory}
            currentProductId={productData._id}
          />
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
};

export default ProductDetails;