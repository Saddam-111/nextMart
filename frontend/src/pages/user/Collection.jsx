import React, { useContext, useEffect, useState, useMemo } from "react";
import Title from "../../components/user/Title";
import { ShopDataContext } from "../../context/user/ShopContext";
import Card from "../../components/user/Card";
import SkeletonCard from "../../components/user/SkeletonCard";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSelect from "../../components/user/ui/AnimatedSelect";
import { productGridStagger, staggerItem } from "../../lib/animations";

const Collection = () => {
  const { products, search, loading } = useContext(ShopDataContext);

   const [filterProduct, setFilterProduct] = useState([]);
   const [category, setCategory] = useState("");
   const [subCategory, setSubCategory] = useState("");
   const [sortType, setSortType] = useState("relevant");

   const categoryOptions = [
     { value: "", label: "All Categories" },
     { value: "Electronics", label: "Electronics" },
     { value: "Clothing", label: "Clothing" },
     { value: "Books", label: "Books" },
     { value: "Home & Kitchen", label: "Home & Kitchen" },
     { value: "Sports", label: "Sports" },
     { value: "Beauty", label: "Beauty" },
     { value: "Toys", label: "Toys" },
     { value: "Other", label: "Other" },
   ];

   const subCategoryOptions = useMemo(() => {
     const uniqueSubCategories = [...new Set(products.map(p => p.subCategory).filter(Boolean))];
     return [
       { value: "", label: "All Sub-Categories" },
       ...uniqueSubCategories.map(sub => ({ value: sub, label: sub }))
     ];
   }, [products]);

   const sortOptions = [
     { value: "relevant", label: "Sort By: Relevant" },
     { value: "low-high", label: "Price (Low â†’ High)" },
     { value: "high-low", label: "Price (High â†’ Low)" },
   ];

   
   useEffect(() => {
     let productCopy = [...products];

     
     if (search) {
       productCopy = productCopy.filter((item) =>
         item.name.toLowerCase().includes(search.toLowerCase())
       );
     }

     
     if (category) {
       productCopy = productCopy.filter((item) => item.category === category);
     }

     
     if (subCategory) {
       productCopy = productCopy.filter((item) => item.subCategory === subCategory);
     }

     
     if (sortType === "low-high") {
       productCopy.sort((a, b) => a.price - b.price);
     } else if (sortType === "high-low") {
       productCopy.sort((a, b) => b.price - a.price);
     }

     setFilterProduct(productCopy);
   }, [products, search, category, subCategory, sortType]);

  return (
    <>
      <Navbar />

      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto mt-16">
        {}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#e4a4bd]/30">
            <Title text1="OUR" text2="COLLECTION" />
            
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full md:w-auto">
              {}
              <div className="w-full sm:w-48">
                <p className="text-xs font-medium text-[#7a6b54] mb-1.5 ml-1">Category</p>
                <AnimatedSelect
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={categoryOptions}
                />
              </div>

              {}
              <div className="w-full sm:w-48">
                <p className="text-xs font-medium text-[#7a6b54] mb-1.5 ml-1">Sub-Category</p>
                <AnimatedSelect
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  options={subCategoryOptions}
                />
              </div>

              {}
              <div className="w-full sm:w-48">
                <p className="text-xs font-medium text-[#7a6b54] mb-1.5 ml-1">Sort By</p>
                <AnimatedSelect
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  options={sortOptions}
                />
              </div>
            </div>
          </div>
        </div>

        {}
        <motion.div
          variants={productGridStagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {loading ? (
            Array(10).fill(0).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : filterProduct.length > 0 ? (
            filterProduct.map((item, index) => (
              <motion.div key={item._id} variants={staggerItem}>
                <Card
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image1}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-dashed border-[#e4a4bd]/50">
              <p className="text-[#7a6b54] font-body text-lg">
                No products found matching your filters.
              </p>
              <button 
                onClick={() => {setCategory(""); setSubCategory("");}}
                className="mt-4 text-[#e4a4bd] hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default Collection;
