import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopDataContext } from "../context/ShopContext";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedAccordion from "../components/ui/AnimatedAccordion";
import { productGridStagger, staggerItem } from "../lib/animations";

const Collection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const { products, search } = useContext(ShopDataContext);

  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const [openCategory, setOpenCategory] = useState(true);
  const [openSubCategory, setOpenSubCategory] = useState(true);

  const [isSortOpen, setIsSortOpen] = useState(false);

  const categories = [
    { value: "Men", label: "Men" },
    { value: "Women", label: "Women" },
    { value: "Kids", label: "Kids" },
  ];

  const subCategories = [
    { value: "TopWear", label: "Top Wear" },
    { value: "BottomWear", label: "Bottom Wear" },
    { value: "WinterWear", label: "Winter Wear" },
  ];

  const sortOptions = [
    { value: "relevant", label: "Sort By: Relevant" },
    { value: "low-high", label: "Price (Low → High)" },
    { value: "high-low", label: "Price (High → Low)" },
  ];

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const applyFilter = () => {
    let productCopy = [...products];

    if (search) {
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

  const sortProducts = () => {
    let sorted = [...filterProduct];

    if (sortType === "low-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      applyFilter();
      return;
    }

    setFilterProduct(sorted);
  };

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  useEffect(() => {
    setFilterProduct(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search]);

  return (
    <>
  <Navbar />

  <div className="flex gap-6 px-4 md:px-8 py-6 max-w-7xl mx-auto">
    
    {/* LEFT SIDEBAR (FIXED) */}
    <div className="hidden md:block w-1/4 lg:w-1/5">
      <div className="sticky top-24 space-y-4">
        <AnimatedAccordion
          isOpen={openCategory}
          onToggle={() => setOpenCategory(!openCategory)}
          title="Categories"
        >
          {categories.map((cat) => (
            <label key={cat.value} className="flex gap-2">
              <input
                type="checkbox"
                value={cat.value}
                onChange={toggleCategory}
              />
              {cat.label}
            </label>
          ))}
        </AnimatedAccordion>

        <AnimatedAccordion
          isOpen={openSubCategory}
          onToggle={() => setOpenSubCategory(!openSubCategory)}
          title="Sub-Categories"
        >
          {subCategories.map((sub) => (
            <label key={sub.value} className="flex gap-2">
              <input
                type="checkbox"
                value={sub.value}
                onChange={toggleSubCategory}
              />
              {sub.label}
            </label>
          ))}
        </AnimatedAccordion>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex-1">
      
      {/* FIXED HEADER */}
      <div className="sticky top-16 z-40 bg-white pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          
          <Title text1="ALL" text2="COLLECTIONS" />

          {/* SORT DROPDOWN */}
          <div className="relative w-[220px]">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="w-full flex justify-between items-center border px-4 py-2.5 rounded-xl bg-white"
            >
              {sortOptions.find((opt) => opt.value === sortType)?.label}

              <motion.span animate={{ rotate: isSortOpen ? 180 : 0 }}>
                ▼
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 mt-2 w-full bg-white border rounded-xl shadow-lg z-50"
                >
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setSortType(option.value);
                        setIsSortOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {option.label}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* SCROLLABLE PRODUCTS */}
      <motion.div
        variants={productGridStagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
      >
        {filterProduct.length > 0 ? (
          filterProduct.map((item, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image1}
              />
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center py-12">
            No products found.
          </p>
        )}
      </motion.div>
    </div>
  </div>

  <Footer />
</>
  );
};

export default Collection;