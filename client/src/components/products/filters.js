import React from "react";

const Filters = (categories, setCategories) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    }

    return (
        <div class="flex flex-col items-center justify-center">
            <h1>Filters</h1>
            <div>
                <h2>Categories</h2>
                <div class="flex flex-col">
                    {categories.slice(0,5).map((category) => (
                        <div class="flex items-center">
                            <input type="checkbox" id={category} name={category} value={category} />
                            <label for={category}>{category}</label>
                            <p class="ml-auto">{category.quantity}</p>
                        </div>
                    ))}

                    {showMore && categories.slice(5).map((category) => (
                        <div class="flex items-center">
                            <input type="checkbox" id={category} name={category} value={category} />
                            <label for={category}>{category}</label>
                            <p class="ml-auto">{category.quantity}</p>
                        </div>
                    ))}

                    {categories.length > 6 &&
                        <a onClick={toggleShowMore}>{(showMore ? "Show less" : "Show more")}</a>} 
                        
                </div>
            </div>
        </div>
    );
}

export default Filters;