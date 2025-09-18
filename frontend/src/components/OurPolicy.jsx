import React from "react";
import { FaShippingFast, FaUndoAlt, FaHeadset, FaLock } from "react-icons/fa";
import Title from "./Title";

const OurPolicy = () => {
  const policies = [
    {
      icon: <FaShippingFast className="text-4xl text-blue-600" />,
      title: "Free Shipping",
      desc: "Enjoy free shipping on all orders above $50.",
    },
    {
      icon: <FaUndoAlt className="text-4xl text-pink-600" />,
      title: "Easy Returns",
      desc: "Hassle-free returns within 7 days of purchase.",
    },
    {
      icon: <FaHeadset className="text-4xl text-green-600" />,
      title: "24/7 Support",
      desc: "We are here to assist you round the clock.",
    },
    {
      icon: <FaLock className="text-4xl text-purple-600" />,
      title: "Secure Payments",
      desc: "Your transactions are protected with top security.",
    },
  ];

  return (
    <div className=" text-center px-16 mt-4">
      <Title text1={"OUR"} text2={"POLICY"} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {policies.map((policy, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-md mt-4 hover:shadow-lg transition duration-300"
          >
            <div className="mb-4">{policy.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{policy.title}</h3>
            <p className="text-gray-600 text-sm">{policy.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurPolicy;
