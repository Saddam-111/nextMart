import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopDataContext } from "../context/ShopContext";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Collection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const { products, search, showSearch } = useContext(ShopDataContext);

  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Dropdown states
  const [openCategory, setOpenCategory] = useState(true);
  const [openSubCategory, setOpenSubCategory] = useState(true);

  // ✅ Toggle category filter
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // ✅ Toggle subCategory filter
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  // ✅ Apply filters
  const applyFilter = () => {
    let productCopy = [...products];

    if (showSearch && search) {
      productCopy = productCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productCopy = productCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProduct(productCopy);
  };

  // ✅ Sort products
  const sortProducts = () => {
    let sortedProducts = [...filterProduct];

    switch (sortType) {
      case "low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;

      case "high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;

      default:
        applyFilter();
        return;
    }

    setFilterProduct(sortedProducts);
  };

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  useEffect(() => {
    setFilterProduct(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col mt-[40px] md:flex-row gap-6 px-4 md:px-8 py-6">
        {/* Left Filters */}
        <div className="w-full md:w-1/4 lg:w-1/5">
          {/* Toggle button only visible on mobile/tablet */}
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="md:hidden mb-4 px-4 py-2 bg-indigo-700 text-white rounded-lg"
          >
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Filters section */}
          <div
            className={`
              ${showFilter ? "block" : "hidden"} 
              md:block 
              lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:overflow-y-auto 
              space-y-6 bg-white lg:pr-2
            `}
          >
            {/* Category Dropdown */}
            <div className="border rounded-lg shadow-sm">
              <button
                onClick={() => setOpenCategory((prev) => !prev)}
                className="w-full text-left px-4 py-2 font-semibold bg-gray-100 rounded-t-lg"
              >
                Categories
              </button>
              {openCategory && (
                <div className="px-4 py-2 space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" value="Men" onChange={toggleCategory} />
                    Men
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" value="Women" onChange={toggleCategory} />
                    Women
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" value="Kids" onChange={toggleCategory} />
                    Kids
                  </label>
                </div>
              )}
            </div>

            {/* SubCategory Dropdown */}
            <div className="border rounded-lg shadow-sm">
              <button
                onClick={() => setOpenSubCategory((prev) => !prev)}
                className="w-full text-left px-4 py-2 font-semibold bg-gray-100 rounded-t-lg"
              >
                Sub-Categories
              </button>
              {openSubCategory && (
                <div className="px-4 py-2 space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="TopWear"
                      onChange={toggleSubCategory}
                    />
                    Top Wear
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="BottomWear"
                      onChange={toggleSubCategory}
                    />
                    Bottom Wear
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value="WinterWear"
                      onChange={toggleSubCategory}
                    />
                    Winter Wear
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Products */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <Title text1="ALL" text2="COLLECTIONS" />
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md shadow-sm"
            >
              <option value="relevant">Sort By: Relevant</option>
              <option value="low-high">Sort By: Price (Low → High)</option>
              <option value="high-low">Sort By: Price (High → Low)</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterProduct.length > 0 ? (
              filterProduct.map((item, index) => (
                <Card
                  key={index}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image1}
                />
              ))
            ) : (
              <p className="text-gray-500">No products found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Collection;
