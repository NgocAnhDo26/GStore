import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import Swal from "sweetalert2";

import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";


const ProductItem = (props) => {
    const { data, isWishlisted } = props;
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
        <div className="flex flex-row bg-[#6666f0]/100 rounded-md shadow-lg overflow-hidden text-white px-5 self-stretch">
            <img src={data.images[0]} alt={data.title} className="rounded-md object-cover h-40 w-40 shadow-md self-center my-3 bg-white" />
            <div className="flex flex-col p-4 gap-2">
                <h1 className="text-xl font-bold">{data.title}</h1>
                <p className="text-sm"> Rating: <span className="text-yellow-400 font-semibold">{data.rating} / 5 ★</span></p>
                <div className="flex flex-row gap-2 text-sm items-center">
                    {data.tags.slice(0, 3).map((tag) => (
                        <div key={data.id + "-" + tag} className="border-2 rounded-md px-2 py-0.5 text-xs hover:scale-105 transition duration-200">{tag}</div>
                    ))}
                </div>
                <div className="flex flex-row gap-3 items-center mt-5">
                    <p className="text-lg font-bold">${data.price}</p>
                    <p className="text-sm text-gray-300 line-through">${data.price + 20}</p>
                    <div className=" text-sm font-bold rounded-md bg-red-500 px-2 py-1 shadow-md hover:scale-105 transition duration-200">
                        - {data.discountPercentage}%
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end justify-between flex-1 py-5">
                <button
                    onClick={() => handleAddToWishlist(data.id)}
                    className="bg-gradient-to-t from-btn-red2/70 to-btn-red1/70 p-2 rounded-md text-center hover:scale-110 transition duration-200">
                    {isWishlisted ? <FaHeart size={22} color="white" /> : <FaRegHeart size={22} color="white" /> }
                </button>
                <button className="bg-white text-blue1 rounded-md p-2 flex items-center gap-3 shadow-md hover:scale-105 transition duration-200 font-medium">
                    <FiShoppingCart />
                    Add to cart</button>
            </div>
            <div>

            </div>
        </div>
    );
}

export default ProductItem;