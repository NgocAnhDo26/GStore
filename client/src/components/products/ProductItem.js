import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";


const ProductItem = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("https://dummyjson.com/products").then((response) => {
       
            // Extract only 10 products
            const data = response.data.products.slice(0, 10);
            setProducts(data);
        });
    }, []);

    return (
        <>
            {
                products.map((product) => (
                    <div class="flex flex-col bg-white rounded-md shadow-md">
                        <img src={product.image} alt={product.title} class="rounded-t-md" />
                        <div class="p-4">
                            <h1 class="text-xl font-bold">{product.title}</h1>
                            <p class="font-bold"> Rating: <span class="font-normal text-yellow-500">{product.rating} / 5 ★</span></p>
                            <p class="text-gray-500">{product.description}</p>
                            <p class="text-lg font-bold mt-2">${product.price}</p>
                        </div>
                        <div>

                        </div>
                    </div>
                ))
            }
        </>
    );
}

export default ProductItem;