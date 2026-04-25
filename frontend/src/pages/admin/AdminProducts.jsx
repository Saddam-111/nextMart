import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";

import AnimatedSelect from "../../components/ui/AnimatedSelect";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subCategory: "",
    sizes: "",
    stock: "",
    bestSeller: false,
    featured: false,
    tags: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    existingImages: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Sports",
    "Beauty",
    "Toys",
    "Other",
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/product/list`, {
        withCredentials: true,
      });
      let productsData = response.data.products || [];
      
      // Transform images array to individual image1, image2, image3, image4 fields for consistent UI usage
      productsData = productsData.map(product => ({
        ...product,
        image1: product.images && product.images[0] ? product.images[0] : null,
        image2: product.images && product.images[1] ? product.images[1] : null,
        image3: product.images && product.images[2] ? product.images[2] : null,
        image4: product.images && product.images[3] ? product.images[3] : null,
      }));

      setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        sizes: JSON.stringify(product.sizes || []),
        stock: product.stock || "",
        bestSeller: product.bestSeller || false,
        featured: product.featured || false,
        tags: JSON.stringify(product.tags || []),
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        existingImages: product.images || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        subCategory: "",
        sizes: "",
        stock: "",
        bestSeller: false,
        featured: false,
        tags: "",
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        existingImages: [],
      });
    }
    setShowModal(true);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, imageNum) => {
    setFormData((prev) => ({
      ...prev,
      [`image${imageNum}`]: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("originalPrice", formData.originalPrice);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);
      data.append("sizes", formData.sizes);
      data.append("stock", formData.stock);
      data.append("bestSeller", formData.bestSeller);
      data.append("featured", formData.featured);
      data.append("tags", formData.tags);

      // Append new images if any
      if (formData.image1) data.append("image1", formData.image1);
      if (formData.image2) data.append("image2", formData.image2);
      if (formData.image3) data.append("image3", formData.image3);
      if (formData.image4) data.append("image4", formData.image4);

      let response;
      if (editingProduct) {
        response = await axios.put(
          `${baseUrl}/api/v1/product/${editingProduct._id}`,
          data,
          { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          `${baseUrl}/api/v1/product/addProduct`,
          data,
          { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      setSuccess(
        editingProduct
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      setTimeout(() => {
        setShowModal(false);
        fetchProducts();
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(
        `${baseUrl}/api/v1/product/remove/${deleteConfirm}`,
        {},
        { withCredentials: true }
      );
      setSuccess("Product deleted successfully!");
      setDeleteConfirm(null);
      setTimeout(() => fetchProducts(), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete product");
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout title="Products Management">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6b54]" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="organic-input pl-10 w-full sm:w-64"
            />
          </div>
          <div className="w-full sm:w-40">
            <AnimatedSelect
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categoryOptions}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] flex items-center gap-2"
        >
          <FiPlus /> Add Product
        </motion.button>
      </div>

      {/* Success/Error messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4"
          >
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="bg-white rounded-2xl overflow-hidden organic-card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-[#7a6b54]">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f5f0eb]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#262626]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-[#262626]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4a4bd]/10">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-[#fdf8f3] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#f5f0eb] overflow-hidden">
                          {product.image1 && (
                            <img
                              src={product.image1.url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#262626] truncate max-w-xs">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#7a6b54]">ID: {product._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-[#262626]">{product.category}</p>
                        <p className="text-xs text-[#7a6b54]">{product.subCategory}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-[#6b7d56]">
                          ₹{product.price}
                        </p>
                        {product.originalPrice && (
                          <p className="text-xs text-[#7a6b54] line-through">
                            ₹{product.originalPrice}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          product.stock <= 5
                            ? "text-red-600"
                            : product.stock <= 20
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-[#7a6b54] hover:text-[#e4a4bd] transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="p-2 text-[#7a6b54] hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-[#e4a4bd]/20 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-[#262626]">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#7a6b54] hover:text-[#262626]"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="organic-input w-full"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="organic-input w-full"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="organic-input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Original Price (MRP)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Category
                    </label>
                    <AnimatedSelect
                      value={formData.category}
                      onChange={(e) => handleChange({ target: { name: 'category', value: e.target.value } })}
                      options={categoryOptions}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Sub Category
                    </label>
                    <input
                      type="text"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="organic-input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Sizes (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleChange}
                      placeholder="S, M, L, XL"
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="new, sale, trending"
                      className="organic-input w-full"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="bestSeller"
                        checked={formData.bestSeller}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#e4a4bd]"
                      />
                      <span className="text-sm text-[#262626]">Best Seller</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#e4a4bd]"
                      />
                      <span className="text-sm text-[#262626]">Featured</span>
                    </label>
                  </div>

                  {/* Image Uploads */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#262626] mb-2">
                      Product Images
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((num) => (
                        <div key={num}>
                          <label className="block text-xs text-[#7a6b54] mb-1">
                            Image {num}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, num)}
                            className="organic-input w-full text-sm"
                          />
                          {formData.existingImages[num - 1] && !formData[`image${num}`] && (
                            <div className="mt-1 w-full h-16 rounded-lg overflow-hidden bg-[#f5f0eb]">
                              <img
                                src={formData.existingImages[num - 1].url}
                                alt={`Current ${num}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#e4a4bd]/20">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-sm text-[#7a6b54] hover:text-[#262626] transition-all-slow"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad]"
                  >
                    {editingProduct ? "Update Product" : "Create Product"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <FiAlertTriangle className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-[#262626]">
                    Delete Product?
                  </h3>
                  <p className="text-sm text-[#7a6b54]">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm text-[#7a6b54] hover:text-[#262626] organic-btn"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  className="organic-btn bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminProducts;
