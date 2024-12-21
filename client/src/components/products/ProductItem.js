import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";

import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";


const ProductItem = () => {
    const [product, setProduct] = useState({
        title: "",
        rating: 0,
        tags: [],
        price: 0,
        discountPercentage: 0,
        images: [],
    });

    useEffect(() => {
        axios.get("https://dummyjson.com/products?limit=1").then((response) => {
            const product = response.data.products[0];
            console.log(product);
            setProduct(product);
        });
    }, []);

    return (
        <div class="flex flex-row bg-blue1 rounded-md shadow-md text-white px-5 w-1/2">
            <img src={product.images[0]} alt={product.title} class="rounded-t-md object-cover w-40" />
            <div class="flex flex-col p-4 gap-2">
                <h1 class="text-xl font-bold">{product.title}</h1>
                <p class="text-sm"> Rating: <span class="text-yellow-500">{product.rating} / 5 ★</span></p>
                <div class="flex flex-row gap-2 text-sm items-center">
                    {product.tags.slice(0, 3).map((tag) => (
                        <div class="border-2 rounded-md px-2 py-0.5 text-xs hover:scale-105 transition duration-200">{tag}</div>
                    ))}
                </div>
                <div class="flex flex-row gap-3 items-center mt-5">   
                    <p class="text-lg font-bold">${product.price}</p>
                    <p class="text-sm text-gray-300 line-through">${product.price + 20}</p>
                    <div class=" text-sm font-bold rounded-md bg-red-500 px-2 py-1 shadow-md hover:scale-105 transition duration-200">
                       - {product.discountPercentage}%
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-end justify-between flex-1 py-5">
                <button class="bg-gradient-to-t from-btn-red2/70 to-btn-red1/70 p-2.5 rounded-md text-center hover:">
                    <FaRegHeart class="text-2xl text-white" />
                </button>
                <button class="bg-blue-500 text-white rounded-md p-2">Add to cart</button>
            </div>
            <div>

            </div>
        </div>
    );
}

export default ProductItem;