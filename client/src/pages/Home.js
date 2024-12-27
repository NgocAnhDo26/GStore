import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import axios from "axios";
import ProductSlider from "../components/products/ProductSection";
import { useAuth } from "../hooks/AuthProvider";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const Home = () => {
    const { user } = useAuth();

    const [featuredGames, setFeaturedGames] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [wishlisted, setWishlisted] = useState([]);

    useEffect(() => {
        // Featured games
        axios.get("http://localhost:1111/api/product/feature-product").then((res) => {
            setFeaturedGames(res.data);
        }).catch((error) => {
            console.log(error);
        });

        // Best sellers
        axios.get("http://localhost:1111/api/product/bestseller").then((res) => {
            setBestSellers(res.data);
        }).catch((error) => {
            console.log(error);
        });

        // Fetch wishlist products id if user is logged in
        if (user) {
            axios.get("http://localhost:1111/api/wishlist/fetch-id-from-wishlist")
                .then((res) => {
                    setWishlisted(res.data);
                }).catch((error) => {
                    console.log(error);
                });
        } else {
            setWishlisted([]);
        }
    }, []);


    return (
        <div className="flex flex-col flex-1 p-10 gap-10">
            <div className="flex flex-row gap-2 items-start">
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    centeredSlidesBounds={true}
                    autoHeight={true}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper rounded-md w-2/3"
                >
                    <SwiperSlide>
                        <img src="img/banner-1.png" alt="product" className="object-cover object-center w-full h-full" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="img/banner-2.png" alt="product" className="object-cover object-center w-full h-full" />
                    </SwiperSlide>
                </Swiper>
                <div className="flex flex-col gap-2 w-1/3">
                    <img src="img/banner-1.png" alt="product" className="object-cover rounded-md h-fit" />
                    <img src="img/banner-2.png" alt="product" className="object-cover rounded-md h-fit" />
                </div>
            </div>

            {/* Featured games */}
            <ProductSlider title="Featured Games" description="Best options to get this christmas!" products={featuredGames} />

            {/* Best sellers */}
            <ProductSlider title="Best Sellers" description="Discover the best sellings from our shop!" products={bestSellers} />
        </div>
    );
}

export default Home;