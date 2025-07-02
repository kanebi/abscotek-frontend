import React from "react";
import ProductCard from "./widgets/ProductCard";

// Props: { products, title }
export default function ProductList({ products = [], title, width =null }) {
  return (
    <section className={`${width || 'w-[85%]'} max-w-[1272px] mx-auto flex overflow-hidden flex-col gap-10 md:my-16 my-9`}>
      {title && (
        <h2 className="text-white md:text-3xl text-2xl md:mb-2 -mb-3 font-semibold leading-10 font-sans">{title}</h2>
      )}
      {/* Responsive grid: 2 columns on mobile, flex wrap on md+ */}
      <div className="w-full grid grid-cols-2 gap-4 md:flex md:flex-wrap md:gap-4">
        {products.map((product, idx) => (
          <ProductCard key={product._id || idx} {...product} />
        ))}
      </div>
    </section>
  );
}
