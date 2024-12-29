import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../hooks/AuthProvider";
import { useCart } from "../hooks/CartProvider";

import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import Swal from "sweetalert2";


import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

const ProductInfo = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { addToCart } = useCart();

    const [productInfo, setProductInfo] = useState({ record: { root: [] } });
    const [productReviews, setProductReviews] = useState([]);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchProductInfo = async () => {
            // Fetch product info
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:1111/api/product/${id}`);
                setProductInfo(response.data);
                setProductReviews(response.data.product_review);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        // Fetch wishlist products id if user is logged in
        // Fetch wishlist products id if user is logged in
        if (user !== null) {
            axios.get("http://localhost:1111/api/wishlist/fetch-id-from-wishlist", { withCredentials: true })
                .then((res) => {
                    setIsWishlisted(res.data.wishlist.includes(id));
                    console.log(res.data.wishlist);
                }).catch((error) => {
                    console.log(error);
                });
        }

        fetchProductInfo();
    }, []);

    const formatCurrency = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }

    const handleAddToWishlist = (productId) => {
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
                axios.post(`http://localhost:1111/api/wishlist/remove-from-wishlist`, { productId }, { withCredentials: true }).then((res) => {
                    setIsWishlisted(false);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: res.data.message
                    });
                }
                ).catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error.response.data.message
                    });
                });
            } else {
                // Call API to add to wishlist
                axios.post(`http://localhost:1111/api/wishlist/add-to-wishlist`, { productId }, { withCredentials: true })
                    .then((res) => {
                        setIsWishlisted(true);
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: res.data.message
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: error.response.data.message
                        });
                    });
            }
        }
    }

    const handleAddReview = async () => {
        const rating = document.querySelector("select").value;
        const content = document.querySelector("textarea").value;

        if (!user) {
            Swal.fire({
                icon: "info",
                title: "Oops...",
                text: "You need to login first!"
            });
            return;
        }

        if (!content) {
            Swal.fire({
                icon: "info",
                title: "Oops...",
                text: "Content must not be empty!"
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:1111/api/review', { productId: id, rating, content }, { withCredentials: true });
            setProductReviews([...productReviews, response.data.review]);
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

    if (loading) {
        return <div className="flex-1"></div>
    }

    return (
        <>
            <div className="flex flex-col bg-gradient-to-br from-[#a26bdbbd]/80 to-[#3247d4b3]/80 flex-1 mx-14 my-7 p-7 rounded-md text-white">
                <h1 className="text-3xl font-bold mb-8">{productInfo.name}</h1>

                <div className="flex flex-1">
                    <div className="flex flex-col flex-1 gap-4 w-3/5 mr-5">
                        <Swiper
                            style={{
                                '--swiper-navigation-color': '#fff',
                                '--swiper-pagination-color': '#fff',
                            }}
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper2 w-full"
                        >
                            {productInfo?.other_img.map((image) => (
                                <SwiperSlide key={image.public_id}
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={image.url} className="object-cover" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper w-full"
                        >
                            {productInfo?.other_img.map((image) => (
                                <SwiperSlide key={image.public_id}
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={image.url} className="object-cover" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="flex flex-col flex-1">
                        <img src={productInfo.profile_img.url} className="rounded-sm" />
                        <p className="mt-4">{productInfo.description}</p>
                        <div className="grid grid-cols-2 gap-2 my-4">
                            <p className="font-semibold">Average Rating:</p>
                            <p className="text-yellow-400 font-semibold">{productInfo.averageRating ? productInfo.averageRating : 0} / 5 ★</p>

                            <p className="font-semibold">Publisher: </p>
                            <p>{productInfo.publisher}</p>
                        </div>

                        <div className="flex flex-wrap gap-2" >
                            <p className="font-semibold">Categories: </p>
                            {productInfo.categories?.map((category) => (
                                <p key={category} className="px-2 py-1 bg-[#6666f0]/100 rounded-md text-sm">{category}</p>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 mt-5">
                            <p className="text-2xl font-bold">{formatCurrency(productInfo.price_sale)}</p>
                            {productInfo.price_sale !== productInfo.price && <> <p className="line-through">{formatCurrency(productInfo.price)}</p>
                                <div className=" text-sm font-bold rounded-md bg-red-500 px-2 py-1 shadow-md hover:scale-105 transition duration-200">
                                    - {100 - Math.round((100 * productInfo.price_sale) / productInfo.price)}%
                                </div></>}
                        </div>

                        <div className="flex gap-4 mt-5">
                            <button
                                onClick={() => addToCart(productInfo.id)}
                                className="bg-white text-blue1 rounded-md p-2 flex items-center gap-3 shadow-md hover:scale-105 transition duration-200 font-medium">
                                <FiShoppingCart />
                                Add to cart
                            </button>
                            <button
                                onClick={() => handleAddToWishlist(productInfo.id)}
                                className="bg-gradient-to-t from-btn-red2/70 to-btn-red1/70 p-2 rounded-md text-center hover:scale-110 transition duration-200">
                                {isWishlisted ? <FaHeart size={22} color="white" /> : <FaRegHeart size={22} color="white" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-gradient-to-br from-[#a26bdbbd]/80 to-[#3247d4b3]/80 flex-1 mx-14 mb-7 p-7 rounded-md text-white">
                <p className="text-xl font-bold mb-5">User Reviews</p>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 bg-[#6666f0]/90 p-5 rounded-md">
                        <p className="font-semibold text-lg">Leave a review <span className="text-sm font-normal">(You may leave your review once per game)</span></p>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold">Rating:</p>
                            <select className="rounded-md text-yellow-500 px-1">
                                <option value="1">1 ★</option>
                                <option value="2">2 ★</option>
                                <option value="3">3 ★</option>
                                <option value="4">4 ★</option>
                                <option value="5">5 ★</option>
                            </select>
                        </div>
                        <textarea className="rounded-md p-2 text-black" placeholder="Your review here..." />
                        <button
                            onClick={handleAddReview}
                            className="bg-white text-blue1 rounded-md p-2 flex items-center gap-3 shadow-md hover:scale-105 transition duration-200 font-medium w-fit mt-2">Submit Review</button>
                    </div>

                    {productReviews.length > 0 ? productReviews.map((review) => (
                        <div key={review.username} className="flex flex-col bg-[#6666f0]/90 rounded-md p-4">
                            <p className="font-semibold text-lg mb-1">{review.username} - <span className="text-sm text-gray-300 mt-2 font-normal"> {new Date(review.create_time).toLocaleDateString()} </span></p>
                            <p className="mb-2">Rating: <span className="font-semibold text-yellow-400">{review.rating} / 5 ★</span></p>
                            <p>{review.content}</p>
                        </div>
                    )) : <p className="text-center text-lg">No reviews yet!</p>}
                </div>
            </div>
        </>
    );
}

export default ProductInfo;
