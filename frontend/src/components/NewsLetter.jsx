import React from "react";
import Title from "./Title";

const NewsLetter = () => {
  return (
    <div className="bg-blue-50 py-12 px-6 md:px-16 text-center">
      <Title text1={"Subscribe to"} text2={"Our Newsletter"} />
      <p className="text-gray-600 mb-6 text-sm md:text-base">
        Get the latest updates about new arrivals, special deals, and exclusive offers.
      </p>
      <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full sm:flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-amber-500 text-white px-9 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
