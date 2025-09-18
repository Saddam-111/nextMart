import React, { useContext, useEffect, useState } from "react";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";

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
        fetchList(); // refresh after delete
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
    <div className="p-6 mb-10">
      {list?.length > 0 ? (
        <div className="overflow-x-auto ">
          <table className="min-w-full border border-gray-300 bg-white shadow-md">
            <thead className="bg-gray-100 ">
              <tr>
                <th className="border px-4 py-2 text-left ">S.No</th>
                <th className="border px-4 py-2 text-left">Image</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Category</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-left ">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    <img
                      src={item.image1.url}
                      alt={item.name}
                      className="h-14 w-14 object-cover rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2 font-medium">{item.name}</td>
                  <td className="border px-4 py-2">{item.category}</td>
                  <td className="border px-4 py-2 text-blue-600 font-semibold">
                    ₹{item.price}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => removeList(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-600">No Products available</div>
      )}
    </div>
  );
};

export default Lists;
