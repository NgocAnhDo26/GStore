import React from "react";
import { Link } from "react-router-dom";

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="text-white">
            <div className="justify-evenly from-blue1 to-blue2 flex flex-row bg-gradient-to-t py-7">
                {/* GStore */}
                <div className="flex flex-col gap-1">
                    <h1 className="font-bold text-lg mb-3">GStore</h1>

                    <Link to="">About Us</Link>
                    <Link to="">Privacy Policy</Link>
                    <Link to="">Terms of Service</Link>
                </div>

                {/* My account */}
                <div className="flex flex-col gap-1">
                    <h1 className="font-bold text-lg mb-3">My Account</h1>

                    <Link to="">My Account</Link>
                    <Link to="">Orders</Link>
                    <Link to="">Wishlist</Link>
                </div>


                {/* Customer Service */}
                <div className="flex flex-col gap-1">
                    <h1 className="font-bold text-lg mb-3">Customer Service</h1>
        
                    <Link to="">Request Support</Link>
                    <Link to="">FAQ</Link>
                </div>

                {/* Follow us */}
                <div className="flex flex-col gap-1">
                    <h1 className="font-bold text-lg mb-3">Follow Us</h1>

                    <div className="flex items-center gap-3">
                        <FaFacebook />
                        <Link to="">GStore</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <FaInstagram />
                        <Link to="">GStore</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <FaYoutube />
                        <Link to="">GStore</Link>
                    </div>
                </div>

                {/* Payment */}
                <div className="flex flex-col gap-1">
                    <h1 className="font-bold text-lg mb-3">We Accept</h1>

                    <div className="flex gap-2">
                        <img src="img/momo_icon_square_pinkbg_RGB.png" className="w-10 rounded-md"></img>
                        <img src="img/vnpay-logo.jpg" className="w-10 rounded-md"></img>
                        <img src="img/zalopay-logo.png" className="w-10 rounded-sm"></img>
                    </div>

                </div>
            </div>

            <div className="bg-dark-blue text-white p-3.5 text-center">
                © 2024 GStore. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer;