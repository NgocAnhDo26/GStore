import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:1111/api/checkout", { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                setCartItems(res.data.cartItems || []);
                setTotalAmount(res.data.totalAmount || 0);
            })
            .catch((error) => {
                console.log("Error: ", error.response?.data || error.message);
            });
    }, []);

    const handlePayLater = () => {
        navigate("/");
    };
    
    const handleCheckout = () => {
        console.log("Checkout initiated with paymentMethodId:", selectedPaymentMethod);
        axios
            .post(
                "http://localhost:1111/api/checkout",
                { paymentMethodId: selectedPaymentMethod },
                { withCredentials: true }
            )
            .then((res) => {
                console.log(res.data);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: res.data.message || "Checkout completed successfully!",
                });
                setCartItems([]);
    
                setTimeout(() => {
                    navigate("/");
                }, 3000);
            })
            .catch((error) => {
                console.log("Error: ", error.response?.data || error.message);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response?.data?.message || "Failed to process the checkout. Please try again.",
                });
            });
    };
    
    
    return (
        <div className="lg:flex lg:items-center lg:justify-center lg:h-screen max-lg:py-4">
            <div className="bg-blue1 p-8 w-full max-w-5xl max-lg:max-w-xl mx-auto rounded-md">
                <h2 className="text-3xl font-extrabold text-white text-center">Checkout</h2>

                <div className="grid lg:grid-cols-3 gap-6 max-lg:gap-8 mt-16">
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold text-white">Choose your payment method</h3>

                        <div className="grid gap-4 sm:grid-cols-3 mt-4 bg-white rounded-md pl-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    className="w-5 h-5 cursor-pointer"
                                    id="1"
                                    name="paymentMethod"
                                    value={1}
                                    checked={selectedPaymentMethod === 1}
                                    onChange={() => setSelectedPaymentMethod(1)}
                                />
                                <label htmlFor="1" className="ml-4 flex gap-2 cursor-pointer">
                                    <img src="https://readymadeui.com/images/visa.webp" className="w-12" alt="card" />
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    className="w-5 h-5 cursor-pointer"
                                    id="2"
                                    name="paymentMethod"
                                    value={2}
                                    checked={selectedPaymentMethod === 2}
                                    onChange={() => setSelectedPaymentMethod(2)}
                                />
                                <label htmlFor="2" className="ml-4 flex gap-2 cursor-pointer">
                                    <img src="img/momo_icon_square_pinkbg@4x.png" className="w-12" alt="e-wallet" />
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    className="w-5 h-5 cursor-pointer"
                                    id="3"
                                    name="paymentMethod"
                                    value={3}
                                    checked={selectedPaymentMethod === 3}
                                    onChange={() => setSelectedPaymentMethod(3)}
                                />
                                <label htmlFor="3" className="ml-4 flex gap-2 cursor-pointer">
                                    <img src="img/Icon-OCB.webp" className="w-12" alt="e-bank" />
                                </label>
                            </div>
                        </div>

                        <div className="mt-4 bg-white rounded-md p-4">
                            {cartItems.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <li
                                            key={item.product_id}
                                            className="flex justify-between items-center py-4"
                                        >
                                            <div>
                                                <h4 className="font-bold text-gray-800">
                                                    {item.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800">
                                                    {item.price.toLocaleString()}đ
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">Your cart is empty.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-md">
                        <h3 className="text-lg font-bold text-gray-800">Summary</h3>
                        <ul className="text-gray-800 mt-6 space-y-3">
                            <li className="flex justify-between text-sm">
                                Total Items <span>{cartItems.length}</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                Total Amount <span className="font-bold">{totalAmount.toLocaleString()}đ</span>
                            </li>
                        </ul>
                        <div className="flex flex-col gap-4 mt-6">
                            <button
                                className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700"
                                onClick={handlePayLater}
                            >
                                Pay Later
                            </button>
                            <button
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                                onClick={handleCheckout}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
