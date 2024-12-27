import React, { useState } from "react";
import ProductItem from "./ProductItem";

const ProductListHorizontal = (props) => {
    const { products, page, setPage, totalPage, wishlisted } = props;
    
    return (
        <div className="flex flex-col gap-5 bg-gradient-to-br from-[#a26bdbbd]/80 to-[#3247d4b3]/80 p-5 self-stretch m-2 rounded-md">
            {products !== undefined ? products.map((product) => (
                <ProductItem key={product.id} data={product} isWishlisted={wishlisted.includes(product.id)} />
            )) : <p className="text-white text-center">No products found</p>}

            {/* Pagination */}
            {(totalPage > 1) &&
                <div className="flex flex-row justify-center gap-3">
                    {(page > 1) && <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="bg-white text-black px-3 py-1 rounded-md"
                    >
                        Prev
                    </button>}
                    {(page < totalPage) && <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPage}
                        className="bg-white text-black px-3 py-1 rounded-md"
                    >
                        Next
                    </button>}
                </div>}
        </div>
    );
}

export default ProductListHorizontal;