import React, { useState } from "react";

const Checkout = () => {
    const summaryData = {
        subTotal: "$48.00",
        discount: { value: "$4.00", percentage: "20%" },
        tax: "$4.00",
        total: "$52.00",
      };

    const [formData, setFormData] = useState({
        cardHolderName: "",
        postalCode: "",
        cardNumber: "",
        expiration: "",
        cvv: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
    };

    return (
        <div className="font-[sans-serif] lg:flex lg:items-center lg:justify-center lg:h-screen max-lg:py-4">
            <div className="bg-blue-500 p-8 w-full max-w-5xl max-lg:max-w-xl mx-auto rounded-md">
                <h2 className="text-3xl font-extrabold text-white text-center">Checkout</h2>

                <div className="grid lg:grid-cols-3 gap-6 max-lg:gap-8 mt-16">
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold text-white">Choose your payment method</h3>

                        <div className="grid gap-4 sm:grid-cols-3 mt-4 bg-white rounded-md pl-4">
                            <div className="flex items-center">
                                <input type="radio" className="w-5 h-5 cursor-pointer" id="card" name="paymentMethod" defaultChecked />
                                <label htmlFor="card" className="ml-4 flex gap-2 cursor-pointer">
                                    <img src="https://readymadeui.com/images/visa.webp" className="w-12" alt="card" />
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input type="radio" className="w-5 h-5 cursor-pointer" id="e-wallet" name="paymentMethod" />
                                <label htmlFor="paypal" className="ml-4 flex gap-2 cursor-pointer">
                                    <img src="https://readymadeui.com/images/paypal.webp" className="w-20" alt="e-wallet" />
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input type="radio" className="w-5 h-5 cursor-pointer" id="e-bank" name="paymentMethod" />
                                <label htmlFor="paypal" className="ml-4 flex gap-2 cursor-pointer">
                                    <img src="https://ebanking.agribank.com.vn/retail/assets/image/logo.svg" className="w-20" alt="e-bank" />
                                </label>
                            </div>
                        </div>

                        <form className="mt-8" onSubmit={handleSubmit}>
                            <div className="grid sm:col-span-2 sm:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        name="cardHolderName"
                                        value={formData.cardHolderName}
                                        onChange={handleChange}
                                        placeholder="Name of card holder"
                                        className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        placeholder="Postal code"
                                        className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        placeholder="Card number"
                                        className="col-span-full px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="expiration"
                                        value={formData.expiration}
                                        onChange={handleChange}
                                        placeholder="EXP."
                                        className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        placeholder="CVV"
                                        className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border rounded-md focus:border-[#007bff] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-8">
                                <button
                                    type="button"
                                    className="px-7 py-3.5 text-sm tracking-wide bg-white hover:bg-gray-50 text-gray-800 rounded-md"
                                >
                                    Pay later
                                </button>
                                <button
                                    type="submit"
                                    className="px-7 py-3.5 text-sm tracking-wide bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-md max-lg:-order-1">
                        <h3 className="text-lg font-bold text-gray-800">Summary</h3>
                        <ul className="text-gray-800 mt-6 space-y-3">
                            <li className="flex flex-wrap gap-4 text-sm">
                                Sub total <span className="ml-auto font-bold">{summaryData.subTotal}</span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Discount ({summaryData.discount.percentage}){" "}<span className="ml-auto font-bold">$4.00</span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-sm">
                                Tax <span className="ml-auto font-bold">{summaryData.tax}</span>
                            </li>
                            <hr />
                            <li className="flex flex-wrap gap-4 text-base font-bold">
                                Total <span className="ml-auto">{summaryData.total}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
