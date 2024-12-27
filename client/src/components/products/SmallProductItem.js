import React, { useState } from "react";
import { FaCartPlus, FaHeart, FaRegHeart } from "react-icons/fa6";
import { useAuth } from "../../hooks/AuthProvider";
import Swal from "sweetalert2";

const SmallProductItem = (props) => {
    const { product } = props;
    const { user } = useAuth();

    const handleAddToWishlist = (productId) => {
        if (!user) {
            Swal.fire({
                icon: "info",
                title: "Oops...",
                text: "You need to login first!"
            });
            return;
        } else {

        }
    }

    return (
        <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative h-36 w-full">
                <img src={product.profile_img} alt="product" className="object-cover shadow-md h-36 w-full bg-white/70 rounded-md" />
                <button
                    className="bg-gradient-to-t from-blue1/80 to-btn-blue2/80 p-2 rounded-md text-center bottom-2 right-2 absolute hover:scale-105"
                    onClick={() => handleAddToWishlist(product.id)}
                >
                    <FaRegHeart size={20} color="white" />
                </button>
                {product.price_sale !== product.price && <p className="absolute rounded-l-md bg-red-500/90 w-fit p-1.5 text-sm font-semibold top-4 right-0 shadow-md"> - {100 - Math.round((100 * product.price_sale) / product.price)}%</p>}
            </div>

            <div className="flex self-stretch justify-between py-3 px-4 bg-[#6666f0]/100 rounded-md shadow-md">
                <div className="flex flex-col">
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <div className="flex flex-row items-center gap-2">
                        <p className="font-semibold text-md">{(product.price_sale).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}</p>
                        <p className="line-through text-sm text-opacity-80">{(product.price).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}</p>
                    </div>
                </div>
                <button className="bg-white/30 text-white hover:bg-white/60 rounded-md p-2 h-fit self-center border-2 border-white ml-2 hover:scale-105">
                    <FaCartPlus size={20} />
                </button>

            </div>
        </div>
    );
}

export default SmallProductItem;