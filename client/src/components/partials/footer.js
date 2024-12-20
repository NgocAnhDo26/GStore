import React, { useState } from "react";

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer class="text-white">
            <div class="justify-evenly from-blue1 to-blue2 flex flex-row bg-gradient-to-t py-7">
                {/* GStore */}
                <div class="flex flex-col gap-1">
                    <h1 class="font-bold text-lg mb-3">GStore</h1>

                    <a href="">About Us</a>
                    <a href="">Privacy Policy</a>
                    <a href="">Terms of Service</a>
                </div>

                {/* My account */}
                <div class="flex flex-col gap-1">
                    <h1 class="font-bold text-lg mb-3">My Account</h1>

                    <a href="">My Account</a>
                    <a href="">Orders</a>
                    <a href="">Wishlist</a>
                </div>


                {/* Customer Service */}
                <div class="flex flex-col gap-1">
                    <h1 class="font-bold text-lg mb-3">GStore</h1>

                    <a href="">Request Support</a>
                    <a href="">FAQ</a>
                </div>

                {/* Follow us */}
                <div class="flex flex-col gap-1">
                    <h1 class="font-bold text-lg mb-3">Follow Us</h1>

                    <div class="flex items-center gap-3">
                        <FaFacebook />
                        <a href="">GStore</a>
                    </div>

                    <div class="flex items-center gap-3">
                        <FaInstagram />
                        <a href="">GStore</a>
                    </div>

                    <div class="flex items-center gap-3">
                        <FaYoutube />
                        <a href="">GStore</a>
                    </div>
                </div>

                {/* Payment */}
                <div class="flex flex-col gap-1">
                    <h1 class="font-bold text-lg mb-3">We Accept</h1>

                    <div class="flex gap-2">
                        <img src="img/momo_icon_square_pinkbg_RGB.png" class="w-10 rounded-md"></img>
                        <img src="img/vnpay-logo.jpg" class="w-10 rounded-md"></img>
                        <img src="img/zalopay-logo.png" class="w-10 rounded-sm"></img>
                    </div>

                </div>
            </div>

            <div class="bg-dark-blue text-white p-3.5 text-center">
                © 2024 GStore. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer;