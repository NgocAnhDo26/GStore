import axios from "axios";
import React, { useEffect, useLayoutEffect } from "react";
import { useState } from "react";

const Filters = (props) => {
    const { categoriesFilter, setCategoriesFilter } = props.categories;
    const { priceRange, setPriceRange } = props.price;

    const [categories, setCategories] = useState([]);
    const [sliderValue, setSliderValue] = useState(priceRange.max);
    const [showMore, setShowMore] = useState(false);

    let format = Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const maxLimit = 3000000;

    useEffect(() => {
        axios.get('http://localhost:1111/api/product/category')
            .then((response) => {
                // Sort categories by count
                response.data.sort((a, b) => b.count - a.count);
                setCategories(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }, []);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    }

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        if (e.target.checked) {
            setCategoriesFilter([...categoriesFilter, category]);
        } else {
            setCategoriesFilter(categoriesFilter.filter((item) => item !== category));
        }
    }

    const handleSliderChange = (e) => {
        setPriceRange({ max: Number(e.target.value) });
    }

    const handleTempSliderChange = (e) => {
        setSliderValue(Number(e.target.value));
    }

    return (
        <div className="flex flex-col justify-center self-start p-5 bg-gradient-to-br from-[#a26bdbbd]/80 to-[#3247d4b3]/80 rounded-md m-2 gap-3 text-white w-1/4 shadow-md">
            <h1 className="font-bold text-2xl">Filters</h1>
            <div>
                <h2 className="text-xl my-2">Categories</h2>
                <div className="flex flex-col">
                    { categories !== undefined && categories.slice(0, 5).map((category) => (
                        <div key={category.name} className="flex items-center ml-3 gap-2">
                            <input type="checkbox" value={category.name} onChange={handleCategoryChange} checked={categoriesFilter.includes(category.name)} />
                            <label>{category.name}</label>
                            <p className="ml-auto">{category.count}</p>
                        </div>
                    ))}

                    {showMore && categories != undefined && categories.slice(5).map((category) => (
                        <div key={category.name} className="flex items-center ml-3 gap-2">
                            <input type="checkbox" value={category.name} onChange={handleCategoryChange} checked={categoriesFilter.includes(category.name)} />
                            <label>{category.name}</label>
                            <p className="ml-auto">{category.count}</p>
                        </div>
                    ))}

                    {categories.length > 6 &&
                        <button onClick={toggleShowMore} className="text-sm ml-3 opacity-75 w-fit mt-2">{(showMore ? "Show less" : "Show more")}</button>}

                </div>
            </div>

            <div>
                <h2 className="text-xl my-2">Price</h2>
                <p className="">Under { format.format(priceRange.max) }</p>
                <input
                    type="range"
                    min={0}
                    max={maxLimit}
                    value={sliderValue}
                    step={50000}
                    onChange={handleTempSliderChange}
                    onMouseUp={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                />
            </div>
        </div>
    );
}

export default Filters;