import React from "react";
import ProductItem from "./ProductItem";

const ProductListHorizontal = ({ products }) => {
    return (
        <div className="flex flex-col gap-5 bg-[#1B1A55] p-5 self-stretch m-2 rounded-md">
            {products.map((product) => (
                <ProductItem key={product.id} data={product} />
            ))}
        </div>
    );
}

export default ProductListHorizontal;