import { useState, useContext, useEffect, createContext } from "react";
import { useAuth } from "./AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]); // Used for guest cart
    const [totalSaved, setTotalSaved] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const { user } = useAuth();

    const calculateTotalUser = (cart) => {
        let total = 0;
        let saved = 0;
        cart.forEach((item) => {
            total += (item.price_sale * item.quantity);
            saved += (item.total_save * item.quantity);
        });
        setTotalPrice(total);
        setTotalSaved(saved);
    };

    const calculateTotalGuest = (cart) => {
        let total = 0;
        let saved = 0;

        if (cart.length === 0) {
            setTotalPrice(0);
            setTotalSaved(0);
            return;
        }

        cart.forEach((item) => {
            const product = products.find((product) => product.id === item.id);
            if (product === undefined) {
                return;
            }
            total += (product.price_sale * item.quantity);
            saved += (product.total_save * item.quantity);
        });
        setTotalPrice(total);
        setTotalSaved(saved);
    };

    const fetchCart = async () => {
        try {
            const response = await axios.get("http://localhost:1111/api/cart", { withCredentials: true });
            setCart(response.data);
            calculateTotalUser(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user === null) {
            calculateTotalGuest(cart);
        }
    }, [products]);

    // Load cart from localStorage or backend on mount
    useEffect(() => {
        if (user !== null) {
            // Merge guest cart with user's cart
            mergeCart();

        } else {
            //Load guest cart product ids from localStorage
            const guestCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(guestCart);
            if (guestCart.length === 0) {
                // If guest cart is empty, initialize it in localStorage
                localStorage.setItem("cart", JSON.stringify([]));
                setProducts([]);
                return;
            }

            // Fetch product details for guest cart from backend
            axios.post("http://localhost:1111/api/product/list-productID/", {
                listProductID: guestCart.map((item) => item.id)
            }).then((response) => {
                if (response.data) {
                    setProducts(response.data)
                    //calculateTotalGuest(guestCart);
                } else {
                    setProducts([]);
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        if (user) {
            // If product is already in user's cart, increase quantity
            const existingProduct = cart.find((item) => item.id === productId);
            if (existingProduct) {
                quantity += existingProduct.quantity;
                // Update quantity in backend
                try {
                    await axios.put("http://localhost:1111/api/cart", { productID: productId, quantity }, { withCredentials: true });
                    // Fetch updated cart from backend
                    await fetchCart();
                    await Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Game added to cart!"
                    });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error.response.data.message
                    });
                }
                return;
            }

            // Add product to user's cart in backend
            try {
                await axios.post("http://localhost:1111/api/cart", { products: [{ id: productId, quantity }] }, { withCredentials: true });
                // Fetch updated cart from backend
                await fetchCart();
                await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Game added to cart!"
                });
            }
            catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response.data.message
                });
            }
        } else {
            // Add product to guest cart
            let prevCart = cart;
            let newCart = prevCart;
            const existingProduct = prevCart.find((item) => item.id === productId);
            if (existingProduct) {
                newCart = prevCart.map((item) => {
                    if (item.id === productId) {
                        return {
                            ...item,
                            quantity: item.quantity + quantity
                        };
                    }
                    return item;
                });
            } else {
                newCart = [...prevCart, { id: productId, quantity }];
            }

            // If product is not in guest cart, fetch product details from backend
            if (products === undefined || products === null || !products.some((item) => item.id === productId)) {
                try {
                    const result = await axios.get(`http://localhost:1111/api/product/${productId}`);
                    const newProducts = [...products, result.data];
                    setProducts(newProducts);
                } catch (error) {
                    console.log(error);
                }
            }

            setCart(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));

            calculateTotalGuest(newCart);

            await Swal.fire({
                icon: "success",
                title: "Success",
                text: "Game added to cart!"
            });
        }
    };

    const removeFromCart = (productId) => {
        if (user) {
            // Remove product from user's cart in backend
            axios.delete(`http://localhost:1111/api/cart/${productId}`, { withCredentials: true })
                .then(() => {
                    fetchCart();
                }).catch((error) => {
                    console.log(error);
                });

        } else {
            // Remove product from guest cart
            let newCart = cart.filter((item) => item.id !== productId);
            setCart(newCart);

            // Remove product from products
            let newProducts = products.filter((item) => item.id !== productId);
            setProducts(newProducts)
            //calculateTotalGuest(newCart);

            // Save guest cart to localStorage
            localStorage.setItem("cart", JSON.stringify(newCart));
        }
    };

    const changeQuantity = (productId, quantity) => {
        const quantityNum = parseInt(quantity);
        if (user) {
            // Change product quantity in user's cart in backend
            axios.put("http://localhost:1111/api/cart", { productID: productId, quantity: quantityNum }, { withCredentials: true })
                .then(() => {
                    fetchCart();
                }).catch((error) => {
                    console.log(error);
                });
        } else {
            const newCart = cart.map((item) => {
                if (item.id === productId) {
                    return {
                        id: item.id,
                        quantity: quantityNum
                    };
                }
                return item;
            });

            setCart(newCart);

            // Save guest cart to localStorage
            localStorage.setItem("cart", JSON.stringify(newCart));

            calculateTotalGuest(newCart);
        }
    }

    // Called when user logs in, merge guest cart with user's cart in backend
    const mergeCart = () => {
        if (cart === undefined || cart === null || cart.length === 0) {
            fetchCart();
            setProducts([]);
        } else {
            // Call backend API to merge guest cart with user's cart
            axios.post("http://localhost:1111/api/cart", { products: cart }, { withCredentials: true })
                .then((response) => {
                    // Clear guest cart and from localStorage
                    localStorage.setItem("cart", JSON.stringify([]));

                    // Fetch user's new cart from api
                    fetchCart();
                }).catch((error) => {
                    console.log(error);
                });
        }
    };

    const clearCart = () => {
        // Clear guest cart
        setCart([]);
        setProducts([]);
        localStorage.setItem("cart", JSON.stringify([]));
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQuantity, products, clearCart, mergeCart, totalSaved, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;

export const useCart = () => {
    return useContext(CartContext);
};
