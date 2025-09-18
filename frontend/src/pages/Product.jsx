import React from "react";
import BestSeller from "../components/BestSeller";
import LatestCollection from "../components/LatestCollection";

const Product = () => {
  return (
    <div className="px-4 md:px-12 lg:px-20 py-10 space-y-16">
      {/* Latest Collection */}
      <section>
        <LatestCollection />
      </section>

      {/* Best Seller */}
      <section>
        <BestSeller />
      </section>
    </div>
  );
};

export default Product;
