import { useState, useContext, useEffect, createContext } from "react";
import { useAuth } from "./AuthProvider";
import axios from "axios";

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]); // Used for guest cart
    const { user } = useAuth();

    // Load cart from localStorage or backend on mount
    useEffect(() => {
        if (user) {
            // Fetch user's cart from backend

        } else {
            // Load guest cart product ids from localStorage
            const guestCart = JSON.parse(localStorage.getItem("cart")) || [];

            // Fetch product details for guest cart from backend
            axios.post("http://localhost:1111/products", {
                productIds: guestCart.map((item) => item.id)
            }).then((response) => {
                setProducts(response.data.products);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, []);

    const addToCart = (product, quantity = 1) => {
        if (user) {
            // Add product to user's cart in backend

        } else {
            // Add product to guest cart
            setCart((prevCart) => {
                const existingProduct = prevCart.find((item) => item.id === product.id);
                if (existingProduct) {
                    return prevCart.map((item) => {
                        if (item.id === product.id) {
                            return {
                                ...item,
                                quantity: item.quantity + quantity,
                            };
                        }
                        return item;
                    });
                }

                return [...prevCart, { ...product, quantity }];
            });

            // If product is not in guest cart, fetch product details from backend
            if (!products.some((item) => item.id === product.id)) {
                axios.get(`http://localhost:1111/products/${product.id}`).then((response) => {
                    setProducts((prevProducts) => [...prevProducts, response.data.product]);
                }).catch((error) => {
                    console.log(error);
                });
            }

            // Save guest cart to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    };

    const removeFromCart = (productId) => {
        if (user) {
            // Remove product from user's cart in backend

        } else {
            // Remove product from guest cart
            setCart((prevCart) => {
                return prevCart.filter((item) => item.id !== productId);
            });

            // Remove product from products
            setProducts((prevProducts) => {
                return prevProducts.filter((item) => item.id !== productId);
            });

            // Save guest cart to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    };

    const changeQuantity = (productId, quantity) => {
        if (user) {
            // Change product quantity in user's cart in backend

            return;
        }

        setCart((prevCart) => {
            return prevCart.map((item) => {
                if (item.id === productId) {
                    return {
                        ...item,
                        quantity
                    };
                }
                return item;
            });
        })
    }

    // Called when user logs in, merge guest cart with user's cart in backend
    const mergeCarts = () => {
        // Call backend API to merge guest cart with user's cart
        axios.post("http://localhost:1111/cart/merge", {
            guestCart: cart
        }).then((response) => {
            // Clear guest cart and from localStorage
            localStorage.removeItem("cart");

            // Read user's cart from backend
            setCart(response.data.cart);
            setProducts(null);
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQuantity, products }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;

export const useCart = () => {
    return useContext(CartContext);
};
