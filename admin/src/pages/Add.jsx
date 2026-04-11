import React, { useContext, useState } from "react";
import { images } from "../assets/asset";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const Add = () => {
  const { baseUrl } = useContext(AuthDataContext);
  const [imagesState, setImagesState] = useState([false, false, false, false]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("TopWear");
  const [price, setPrice] = useState("");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (index, file) => {
    const newImages = [...imagesState];
    newImages[index] = file;
    setImagesState(newImages);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));
      imagesState.forEach((img, i) => formData.append(`image${i + 1}`, img));

      await axios.post(baseUrl + "/api/v1/product/addProduct", formData, {
        withCredentials: true,
      });

      setName("");
      setDescription("");
      setImagesState([false, false, false, false]);
      setPrice("");
      setBestSeller(false);
      setCategory("Men");
      setSubCategory("TopWear");
      setSizes([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl mx-auto p-6 overflow-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#fdfbf7] shadow-2xl rounded-3xl overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-[#6b7d56] to-[#5d6446] p-6"
        >
          <h2 className="text-3xl font-display font-bold text-white">Add New Product</h2>
          <p className="text-[#e8e0d3] mt-1">Fill all the details to add a product</p>
        </motion.div>

        <form onSubmit={handleAdd} className="p-6 space-y-6">
          <div>
            <p className="text-[#5e5240] font-display font-semibold mb-2">Upload Images</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagesState.map((img, i) => (
                <motion.label
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer relative border-2 border-dashed border-[#d9cec0] rounded-xl overflow-hidden hover:border-[#6b7d56] transition"
                >
                  <img
                    src={!img ? images.upload : URL.createObjectURL(img)}
                    alt={`image${i + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleImageChange(i, e.target.files[0])}
                  />
                  {!img && (
                    <span className="absolute inset-0 flex items-center justify-center text-[#9e866b] font-semibold">
                      Click to upload
                    </span>
                  )}
                </motion.label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[#5e5240] font-display font-semibold mb-1">Product Name</p>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              className="w-full border border-[#d9cec0] p-3 rounded-xl focus:outline-none focus:border-[#6b7d56] focus:ring-2 focus:ring-[#6b7d56]/20 transition font-body"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <p className="text-[#5e5240] font-display font-semibold mb-1">Product Description</p>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              className="w-full border border-[#d9cec0] p-3 rounded-xl focus:outline-none focus:border-[#6b7d56] focus:ring-2 focus:ring-[#6b7d56]/20 transition font-body"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Enter product description"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-[#5e5240] font-display font-semibold mb-1">Category</p>
              <motion.select
                whileFocus={{ scale: 1.01 }}
                className="w-full border border-[#d9cec0] p-3 rounded-xl focus:outline-none focus:border-[#6b7d56] transition font-body"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </motion.select>
            </div>
            <div className="flex-1">
              <p className="text-[#5e5240] font-display font-semibold mb-1">Sub Category</p>
              <motion.select
                whileFocus={{ scale: 1.01 }}
                className="w-full border border-[#d9cec0] p-3 rounded-xl focus:outline-none focus:border-[#6b7d56] transition font-body"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="TopWear">TopWear</option>
                <option value="BottomWear">BottomWear</option>
                <option value="WinterWear">WinterWear</option>
              </motion.select>
            </div>
          </div>

          <div>
            <p className="text-[#5e5240] font-display font-semibold mb-1">Product Price</p>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="number"
              className="w-full border border-[#d9cec0] p-3 rounded-xl focus:outline-none focus:border-[#6b7d56] focus:ring-2 focus:ring-[#6b7d56]/20 transition font-body"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="₹ 200"
            />
          </div>

          <div>
            <p className="text-[#5e5240] font-display font-semibold mb-2">Product Sizes</p>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <motion.button
                  key={size}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setSizes((prev) =>
                      prev.includes(size)
                        ? prev.filter((s) => s !== size)
                        : [...prev, size]
                    )
                  }
                  className={`px-4 py-2 border rounded-xl cursor-pointer font-medium text-sm transition ${
                    sizes.includes(size)
                      ? "bg-[#6b7d56] text-white border-[#6b7d56]"
                      : "border-[#d9cec0] text-[#5e5240] hover:border-[#6b7d56] hover:text-[#6b7d56]"
                  }`}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.input
              whileTap={{ scale: 1.1 }}
              type="checkbox"
              checked={bestSeller}
              onChange={() => setBestSeller((prev) => !prev)}
              className="w-5 h-5 accent-[#6b7d56]"
            />
            <label className="text-[#5e5240] font-medium">Add to Best Seller</label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-[#d9cec0] text-[#9e866b] cursor-not-allowed"
                : "bg-[#6b7d56] text-white hover:bg-[#5d6446]"
            }`}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Add;