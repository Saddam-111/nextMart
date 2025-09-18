import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 tracking-wide">
      {text1} <span className="text-amber-500">{text2}</span>
    </h2>
  );
};

export default Title;
