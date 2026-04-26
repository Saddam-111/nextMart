import React from "react";
import { motion } from "framer-motion";

const ProductDetailsSkeleton = () => {
  return (
    <div className="px-6 md:px-12 mt-6 lg:px-20 py-10 max-w-7xl mx-auto animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Images */}
        <div className="space-y-4">
          <div className="w-full h-[400px] bg-[#eee7de] rounded-3xl"></div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-[#eee7de] rounded-xl"></div>
            ))}
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="space-y-6">
          <div className="h-10 bg-[#eee7de] rounded-lg w-3/4"></div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-5 h-5 bg-[#eee7de] rounded-full"></div>
            ))}
          </div>
          <div className="h-8 bg-[#eee7de] rounded-lg w-1/4"></div>
          
          <div className="flex gap-2">
            <div className="h-10 bg-[#eee7de] rounded-xl w-32"></div>
            <div className="h-10 bg-[#eee7de] rounded-xl w-32"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-[#eee7de] rounded w-full"></div>
            <div className="h-4 bg-[#eee7de] rounded w-full"></div>
            <div className="h-4 bg-[#eee7de] rounded w-3/4"></div>
          </div>

          <div className="space-y-2">
            <div className="h-5 bg-[#eee7de] rounded w-24"></div>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 bg-[#eee7de] rounded-xl"></div>
              ))}
            </div>
          </div>

          <div className="h-12 bg-[#eee7de] rounded-xl w-48"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
