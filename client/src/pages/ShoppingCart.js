import React from "react";
import { useCart } from "../hooks/CartProvider";
import { useAuth } from "../hooks/AuthProvider";
import { Link } from "react-router-dom";

const ShoppingCart = () => {
    const { user } = useAuth();
    const { cart, removeFromCart, changeQuantity, products, totalSaved, totalPrice } = useCart();

    const getProductSubtotal = (product) => {
        // Find the product in the cart
        const cartItem = cart.find((item) => item.id === product.id);
        // Calculate the subtotal
        return cartItem.quantity * product.price_sale;
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }

    return (
        <div className="flex-1">
            <h1 className="text-3xl text-white font-bold text-center mt-10">MY CART</h1>
            <div className="flex p-10">
                {/* Item list */}
                <div className="bg-gradient-to-br from-[#a26bdbbd]/80 to-[#3247d4b3]/80 flex-1 rounded-md text-white p-5">
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <th></th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                            {!user ? products.map((product) => {
                                const cartItem = cart.find((item) => item.id === product.id);
                                return (
                                    <tr key={product.id}>
                                        <td className="text-center w-min">
                                            <img src={product.profile_img.url} alt={product.name} className="rounded-md object-cover h-24 w-fit" />
                                        </td>
                                        <td>
                                            <h3 className="font-semibold">{product.name}</h3>
                                            <p className="text-sm">{product.publisher}</p>
                                        </td>
                                        <td className="text-center">
                                            <input type="number" min={1} max={5} className="text-black w-12 pl-2" value={cartItem ? cartItem.quantity : 1} onChange={(e) => changeQuantity(product.id, e.target.value)} />
                                        </td>
                                        <td className="text-center">
                                            <p>{formatCurrency(getProductSubtotal(product))}</p>
                                        </td>
                                        <td className="text-center">
                                            <button onClick={() => removeFromCart(product.id)} className="bg-red-500 p-2 rounded-md text-white hover:scale-105 transition duration-200">Remove</button>
                                        </td>
                                    </tr>);
                            }) : cart.length > 0 && cart.map((item) => (
                                <tr key={item.id}>
                                    <td className="text-center w-min">
                                        <img src={item.profile_img.url} alt={item.name} className="rounded-md object-cover h-24" />
                                    </td>
                                    <td>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm">{item.publisher_name}</p>
                                    </td>
                                    <td className="text-center">
                                        <input type="number" min={1} max={5} className="text-black w-12 pl-2" value={item.quantity} onChange={(e) => changeQuantity(item.id, e.target.value)} />
                                    </td>
                                    <td className="text-center">
                                        {item.price !== item.price_sale && <p className="text-sm line-through text-gray-300">{formatCurrency(item.price)}</p>}
                                        <p>{formatCurrency(item.price_sale)}</p>
                                    </td>
                                    <td className="text-center">
                                        <button onClick={() => removeFromCart(item.id)} className="bg-red-500 p-2 rounded-md text-white hover:scale-105 transition duration-200">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {cart.length === 0 && <p className="text-center text-lg my-10">Your shopping cart is empty!</p>}

                </div>

                <div className="bg-gradient-to-br from-[#a26bdbbd]/80 to-[#3247d4b3]/80 rounded-md ml-3 text-white p-5 flex flex-col gap-5 w-1/5">
                    {user && <div className="flex"><p className="font-semibold">Total saved: </p>
                        <p className="place-self-end self-start ml-auto">{formatCurrency(totalSaved)}</p></div>}
                    <div className="flex flex-wrap">
                        <p className="font-semibold">Subtotal: </p>
                        <p className="place-self-end self-start ml-auto">{formatCurrency(totalPrice)}</p>
                    </div>
                    <hr className="col-span-2 flex-wrap" />
                    <div className="flex flex-wrap">
                        <p className="font-semibold text-xl self-center">TOTAL: </p>
                        <p className="place-self-end self-center text-xl ml-auto">{formatCurrency(totalPrice)}</p>
                    </div>

                    <Link to="/checkout" className="bg-gradient-to-t from-btn-red2/70 to-btn-red1/70 p-2 rounded-md text-white hover:scale-105 transition duration-200 mt-auto text-center">
                        Checkout
                    </Link>

                </div>

            </div>
        </div>
    );
}

export default ShoppingCart;