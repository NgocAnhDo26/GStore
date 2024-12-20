import React, { useState } from "react";
import Header from "../components/partials/header";
import Footer from "../components/partials/footer";

import { IconContext } from "react-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Register = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const [isPasswordVisible, setisPasswordVisible] = useState(false);

    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
            //dispatch action from hooks
        }

        alert("Please provide a valid input");
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePassword = () => {
        setisPasswordVisible(!isPasswordVisible);
    }

    return (
        <div class="flex flex-col rounded-md items-center mx-10 my-16 py-10 px-12 bg-gradient-to-t from-blue1 to-form-pink w-[26rem] self-center flex-1 text-white">
            <h1 class=" text-4xl font-bold">GStore</h1>
            <h1 class=" text-2xl">Create your new account!</h1>
            <form onSubmit={handleSubmitEvent} class="pt-8 w-full">
                <div className="form_control">
                    <p class="py-2">Email</p>
                    <input
                        type="email"
                        id="user-email"
                        name="email"
                        class="w-full rounded-md p-2 focus:outline-none bg-transparent border-white border-2 border-opacity-70 hover:border-opacity-100 transition duration-300 focus:border-opacity-100"
                        placeholder="example@yahoo.com"
                        aria-describedby="user-email"
                        aria-invalid="false"
                        onChange={handleInput}
                    />
                </div>
                <div className="form_control">
                    <p class="pt-5 pb-2">Password</p>
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Enter your password..."
                        class="w-full rounded-md p-2 focus:outline-none bg-transparent border-white border-2 border-opacity-70 hover:border-opacity-100 transition duration-300 focus:border-opacity-100"
                        aria-describedby="user-password"
                        aria-invalid="false"
                        onChange={handleInput}
                    />
                </div>
                <div className="form_control">
                    <p class="pt-5 pb-2">Confirm Password</p>
                    <input
                        type="password"
                        name="password-confirm"
                        placeholder="Enter your password..."
                        class="w-full rounded-md p-2 focus:outline-none bg-transparent border-white border-2 border-opacity-70 hover:border-opacity-100 transition duration-300 focus:border-opacity-100"
                        aria-describedby="user-password"
                        aria-invalid="false"
                        onChange={handleInput}
                    />
                </div>

                <button type="submit" className="btn-submit w-full bg-white mb-5 mt-10 rounded-md py-2 font-bold text-blue-950 hover:scale-105 transition duration-300 shadow-md">Register</button>
            </form>

            <p class="mb-5">Already got an account? <span><Link to="/login" class="font-bold hover:opacity-70">Login</Link></span></p>
        </div>
    )
}

export default Register;
