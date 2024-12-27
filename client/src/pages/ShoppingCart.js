import React from "react";
import { useCart } from "../hooks/CartProvider";
import { useAuth } from "../hooks/AuthProvider";

const ShoppingCart = () => {
    const { user } = useAuth();
    const { cart, addToCart, removeFromCart, changeQuantity, products } = useCart();

    return (
        <div className="flex-1">
            <h1 className="text-3xl text-white font-bold text-center mt-10">MY CART</h1>
            <div className="flex p-10">
                {/* Item list */}
                <div className="bg-gradient-to-br from-[#a26bdbbd]/80 to-[#3247d4b3]/80 flex-1 rounded-md text-white p-5">
                    <table class="w-full">
                        <tr>
                            <th></th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                        {user && products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <img src={product.images[0]} alt={product.title} className="rounded-md object-cover h-20 w-20" />
                                </td>
                                <td>
                                    <h3 className="font-semibold">{product.title}</h3>
                                    <p className="text-sm">{product.brand}</p>
                                </td>
                                <td>
                                    <input type="number" value={cart[product.id]} onChange={(e) => changeQuantity(product.id, e.target.value)} className="w-10" />
                                </td>
                                <td>
                                    <p>${product.price * cart[product.id]}</p>
                                </td>
                                <td>
                                    <button onClick={() => removeFromCart(product.id)} className="bg-red-500 p-2 rounded-md text-white hover:scale-105 transition duration-200">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </table>
                    {products.length === 0 && <p className="text-center text-lg my-10">Your shopping cart is empty!</p>}

                </div>

                <div className="bg-gradient-to-br from-[#a26bdbbd]/80 to-[#3247d4b3]/80 rounded-md ml-3 text-white p-5 grid grid-cols-2 gap-5">
                    <p className="font-semibold">Total saved: </p>
                    <p className="place-self-end self-start">$20</p>
                    <p className="font-semibold">Subtotal: </p>
                    <p className="place-self-end self-start">$20</p>
                    <hr className="col-span-2"/>
                    <p className="font-semibold text-xl self-center">TOTAL: </p>
                    <p className="place-self-end self-center text-xl">$20</p>

                    <button className="bg-gradient-to-t from-btn-red2/70 to-btn-red1/70 p-2 rounded-md text-white hover:scale-105 transition duration-200 col-span-2">
                        Checkout
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ShoppingCart;