import React, { useContext, useState } from "react";
import { images } from "../assets/asset";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";

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
    setLoading(true); // start loading
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

      const result = await axios.post(
        baseUrl + "/api/v1/product/addProduct",
        formData,
        { withCredentials: true }
      );
      console.log(result.data);

      // Reset form
      setName("");
      setDescription("");
      setImagesState([false, false, false, false]);
      setPrice("");
      setBestSeller(false);
      setCategory("Men");
      setSubCategory("TopWear");
      setSizes([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 overflow-auto">
      {/* Card Container */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <h2 className="text-3xl font-bold text-white">Add New Product</h2>
          <p className="text-gray-200 mt-1">
            Fill all the details to add a product
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAdd} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <p className="text-gray-700 font-semibold mb-2">Upload Images</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagesState.map((img, i) => (
                <label
                  key={i}
                  className="cursor-pointer relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-blue-600 transition"
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
                    <span className="absolute inset-0 flex items-center justify-center text-gray-400 font-semibold">
                      Click to upload
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <p className="text-gray-700 font-semibold mb-1">Product Name</p>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-700 font-semibold mb-1">
              Product Description
            </p>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Enter product description"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-gray-700 font-semibold mb-1">Category</p>
              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 font-semibold mb-1">Sub Category</p>
              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="TopWear">TopWear</option>
                <option value="BottomWear">BottomWear</option>
                <option value="WinterWear">WinterWear</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-gray-700 font-semibold mb-1">Product Price</p>
            <input
              type="number"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="₹ 200"
            />
          </div>

          {/* Sizes */}
          <div>
            <p className="text-gray-700 font-semibold mb-2">Product Sizes</p>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <div
                  key={size}
                  onClick={() =>
                    setSizes((prev) =>
                      prev.includes(size)
                        ? prev.filter((s) => s !== size)
                        : [...prev, size]
                    )
                  }
                  className={`px-4 py-2 border rounded-xl cursor-pointer font-medium text-sm transition ${
                    sizes.includes(size)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          {/* Best Seller */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={() => setBestSeller((prev) => !prev)}
              className="w-5 h-5 accent-blue-600"
            />
            <label className="text-gray-700 font-medium">
              Add to Best Seller
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900"
            }`}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
