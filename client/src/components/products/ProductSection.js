import React from "react";
import SmallProductItem from "./SmallProductItem";

const ProductSlider = (props) => {
    const { title, description, products, wishlisted } = props;

    return (
        <div className="text-white bg-gradient-to-br from-[#a26bdbbd] to-[#3247d4b3] py-5 px-7 rounded-md flex-1">
            <div className="mb-10">
                <h2 className="text-4xl font-bold">{title}</h2>
                <p className="text-lg">{description}</p>
            </div>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6">
                {products.map((game) => (
                    <SmallProductItem key={game.id} product={game} wishlisted={wishlisted} />
                ))}
            </div>
        </div>
    );
}

export default ProductSlider;