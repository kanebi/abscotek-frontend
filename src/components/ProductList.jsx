import React from "react";
import ProductCard from "./widgets/ProductCard";

// Props: { products, title }
export default function ProductList({ products = [], title }) {
  return (
    <section className="w-[85%] max-w-[1272px] mx-auto flex overflow-hidden  flex-col gap-10 my-16">
      {title && (
        <h2 className="text-white text-3xl font-semibold leading-10 mb-2 font-sans">{title}</h2>
      )}
      <div className="w-full flex flex-wrap gap-4 ">
        {products.map((product, idx) => (
          <ProductCard key={product._id || idx} {...product} />
        ))}
      </div>
    </section>
  );
}
