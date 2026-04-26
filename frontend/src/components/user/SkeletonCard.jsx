import React from "react";
import { motion } from "framer-motion";

const SkeletonCard = () => {
  return (
    <div className="bg-[#fdf8f3] rounded-3xl p-4 flex flex-col organic-card relative animate-pulse">
      <div className="w-full h-56 rounded-2xl bg-[#eee7de]"></div>
      
      <div className="mt-4 flex flex-col flex-1 space-y-3">
        <div className="h-5 bg-[#eee7de] rounded-md w-3/4"></div>
        <div className="h-4 bg-[#eee7de] rounded-md w-1/4"></div>
      </div>

      <div className="mt-4 w-full h-10 bg-[#eee7de] rounded-xl"></div>
    </div>
  );
};

export default SkeletonCard;
