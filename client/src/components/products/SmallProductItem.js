import React, { useEffect, useState } from "react";
import { FaCartPlus, FaHeart, FaRegHeart } from "react-icons/fa6";
import { useAuth } from "../../hooks/AuthProvider";
import { useCart } from "../../hooks/CartProvider";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axios from "axios";

const SmallProductItem = (props) => {
    const { product } = props;
    let { wishlisted, setWishlisted } = props.wishlisted;
    const [isWishlisted, setIsWishlisted] = useState(props.isWishlisted);
    const { user } = useAuth();
    const { addToCart } = useCart();

    useEffect(() => {
        setIsWishlisted(wishlisted.includes(product.id));
    }, [wishlisted]);

    const handleAddToWishlist = async (productId) => {
        if (!user) {
            Swal.fire({
                icon: "info",
                title: "Oops...",
                text: "You need to login first!"
            });
            return;
        } else {
            if (isWishlisted) {
                // Call API to remove from wishlist
                try {
                    const response = await axios.post(`http://localhost:1111/api/wishlist/remove-from-wishlist`, { productId }, { withCredentials: true });
                    setWishlisted(wishlisted.filter((id) => id !== productId));
                    setIsWishlisted(false);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: response.data.message
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error.response.data.message
                    });
                }
            } else {
                // Call API to add to wishlist
                try {
                    const response = await axios.post(`http://localhost:1111/api/wishlist/add-to-wishlist`, { productId }, { withCredentials: true });
                    setWishlisted([...wishlisted, productId]);
                    setIsWishlisted(true);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: response.data.message
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error.response.data.message
                    });
                }
            }
        }
    }

    return (
        <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative h-36 w-full">
                <Link to={`/products/${product.id}`}>
                    <img src={product.profile_img.url} alt="product" className="object-cover shadow-md h-36 w-full bg-white/70 rounded-md hover:opacity-70" />
                </Link>
                <button
                    className="bg-gradient-to-t from-blue1/80 to-btn-blue2/80 p-2 rounded-md text-center bottom-2 right-2 absolute hover:scale-110 transition transform duration-200"
                    onClick={() => handleAddToWishlist(product.id)}
                >
                    {isWishlisted ? <FaHeart size={20} color="white" /> : <FaRegHeart size={20} color="white" />}
                </button>
                {product.price_sale !== product.price && <p className="absolute rounded-l-md bg-red-500/90 w-fit p-1.5 text-sm font-semibold top-4 right-0 shadow-md"> - {100 - Math.round((100 * product.price_sale) / product.price)}%</p>}
            </div>

            <div className="flex self-stretch justify-between py-3 px-4 bg-[#6666f0]/100 rounded-md shadow-md">
                <div className="flex flex-col">
                    <Link to={`/products/${product.id}`} className="font-bold text-lg mb-2">{product.name}</Link>
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
                <button
                    onClick={() => addToCart(product.id)}
                    className="bg-white/30 text-white hover:bg-white/60 rounded-md p-2 h-fit self-center border-2 border-white ml-2 hover:scale-105">
                    <FaCartPlus size={20} />
                </button>

            </div>
        </div>
    );
}

export default SmallProductItem;