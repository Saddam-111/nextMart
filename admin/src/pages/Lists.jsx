import React, { useContext, useEffect, useState } from "react";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Lists = () => {
  const [list, setList] = useState([]);
  const { baseUrl } = useContext(AuthDataContext);

  const fetchList = async () => {
    try {
      const result = await axios.get(baseUrl + "/api/v1/product/list", {
        withCredentials: true,
      });
      setList(result.data);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const removeList = async (id) => {
    try {
      const result = await axios.post(
        `${baseUrl}/api/v1/product/remove/${id}`,
        {},
        { withCredentials: true }
      );
      if (result.data) {
        fetchList();
      } else {
        console.warn("Failed to remove Product");
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, [baseUrl]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 mb-10"
    >
      {list?.length > 0 ? (
        <div className="overflow-x-auto">
          <motion.table
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-full border border-[#d9cec0] bg-[#fdfbf7] rounded-2xl overflow-hidden"
          >
            <thead className="bg-[#f3efe8]">
              <tr>
                <th className="border border-[#d9cec0] px-4 py-3 text-left font-display text-[#5e5240]">S.No</th>
                <th className="border border-[#d9cec0] px-4 py-3 text-left font-display text-[#5e5240]">Image</th>
                <th className="border border-[#d9cec0] px-4 py-3 text-left font-display text-[#5e5240]">Name</th>
                <th className="border border-[#d9cec0] px-4 py-3 text-left font-display text-[#5e5240]">Category</th>
                <th className="border border-[#d9cec0] px-4 py-3 text-left font-display text-[#5e5240]">Price</th>
                <th className="border border-[#d9cec0] px-4 py-3 text-left font-display text-[#5e5240]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {list.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-[#f3efe8]"
                  >
                    <td className="border border-[#d9cec0] px-4 py-3">{index + 1}</td>
                    <td className="border border-[#d9cec0] px-4 py-3">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={item.image1.url}
                        alt={item.name}
                        className="h-14 w-14 object-cover rounded-xl"
                      />
                    </td>
                    <td className="border border-[#d9cec0] px-4 py-3 font-medium text-[#5e5240]">
                      {item.name}
                    </td>
                    <td className="border border-[#d9cec0] px-4 py-3 text-[#7a6b54]">
                      {item.category}
                    </td>
                    <td className="border border-[#d9cec0] px-4 py-3 text-[#6b7d56] font-semibold">
                      ₹{item.price}
                    </td>
                    <td className="border border-[#d9cec0] px-4 py-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeList(item._id)}
                        className="bg-[#965639] text-white px-3 py-1.5 rounded-xl hover:bg-[#7a4b2e] transition-colors"
                      >
                        Remove
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#7a6b54] text-center py-12"
        >
          No Products available
        </motion.div>
      )}
    </motion.div>
  );
};

export default Lists;