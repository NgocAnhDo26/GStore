import React, { lazy, Suspense, useEffect, useState } from "react";
import axios from "axios";
import Filters from "../components/products/filters";
import Home from "./Home";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";


const ProductListHorizontal = lazy(() => import("../components/products/ProductListHorizontal"));

const Products = (props) => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [keyword, setKeyword] = useState();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [categoriesFilter, setCategoriesFilter] = useState([]);
    const [priceRange, setPriceRange] = useState({});
    const [sort, setSort] = useState("default");
    const [wishlisted, setWishlisted] = useState([]);

    // Set initial filters on page load based on the URL
    useEffect(() => {
        setKeyword(searchParams.get("keyword") || null);
        setPage(searchParams.get("page") || null);
        setCategoriesFilter(searchParams.get("category") ? searchParams.get("category").split(",") : []);
        setPriceRange({ min: searchParams.get("minPrice"), max: searchParams.get("maxPrice") });
        setSort(searchParams.get("order"));

        // Set sort by value for select element
        const sortSelect = document.getElementById("sort");
        if (sortSelect) {
            sortSelect.value = searchParams.get("order") || "default";
        }

        // // Fetch wishlist products id if user is logged in
        // if (user) {
        //     axios.get("http://localhost:1111/api/wishlist").then((res) => {
        //         setWishlisted(res.data.products);
        //     });
        // } else {
        //     setWishlisted([]);
        // }

    }, []);

    // Fetch products whenever search params change
    useEffect(() => {
        const query = searchParams.toString();
        axios.get(`https://dummyjson.com/products?limit=10&${query}`)
            .then((response) => {
                setProducts(response.data.products);
                setPage(response.data.currentPage);
                setTotalPage(response.data.totalPage);
            }).catch((error) => {
                console.log(error);
            });
    }, [searchParams]);

    // Update filters and sync with URL
    useEffect(() => {
        let query = generateQueryString(keyword, page, categoriesFilter, priceRange, sort);
        setSearchParams(query);
    }, [keyword, categoriesFilter, priceRange, sort, page]);

    const generateQueryString = (keyword, page, category, priceRange, sort) => {
        const params = new URLSearchParams();

        if (keyword) params.append('keyword', keyword);


        if (category.length > 0) {
            const categories = category.join(",");
            params.append('category', categories);
        }

        if (priceRange) {
            if (priceRange.min) params.append('minPrice', priceRange.min);
            if (priceRange.max) params.append('maxPrice', priceRange.max);
        }

        if (sort) params.append('order', sort);

        if (page) params.append('page', page);

        return params.toString();
    }

    return (
        <div className="flex flex-row justify-center p-10">
            <Filters categories={{ categoriesFilter, setCategoriesFilter }} price={{ priceRange, setPriceRange }} />
            <div className="flex flex-col items-start justify-start flex-1">
                <div className="bg-gradient-to-br from-[#a26bdbbd]/80 to-[#3247d4b3]/80 self-stretch flex items-center justify-end px-5 py-3 rounded-md m-2 gap-3 text-white">
                    <h3 className="font-semibold">Sort by: </h3>
                    <select className="bg-transparent text-white border-2 border-white rounded-md p-1" name="sort" id="sort" onChange={(e) => setSort(e.target.value)}>
                        <option value="default" className="text-black">Default</option>
                        <option value="name-asc" className="text-black">Name: A to Z</option>
                        <option value="name-desc" className="text-black">Name: Z to A</option>
                        <option value="price-asc" className="text-black">Price: Low to High</option>
                        <option value="price-desc" className="text-black">Price: High to Low</option>
                    </select>
                </div>
                <Suspense fallback={<Home />}>
                    <ProductListHorizontal products={products} page={page} setPage={setPage} totalPage={totalPage} wishlisted={wishlisted} />
                </Suspense>
            </div>
        </div>
    );
}

export default Products;