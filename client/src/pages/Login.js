import React, { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/AuthProvider";
import { useCart } from "../hooks/CartProvider";

import { IconContext } from "react-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Login = () => {
    const auth = useAuth();
    const { mergeCart } = useCart();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isEmailCorrect, setIsEmailCorrect] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validateEmail = () => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        setIsEmailCorrect(emailRegex.test(email));
    };

    const togglePassword = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    async function onLoginEvent(e) {
        e.preventDefault();

        if (!isEmailCorrect) {
            return;
        }

        if (password === "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password cannot be empty!"
            });
            return;
        }

        auth.handleLogin({ email, password });    
    }

    return (
        <div className="flex flex-col first-letter:rounded-md items-center mx-10 my-16 py-10 px-12 bg-gradient-to-t from-blue1/80 to-form-pink/80 w-[26rem] self-center flex-1 text-white rounded-md shadow-md">
            <h1 className=" text-4xl font-bold">GStore</h1>
            <h1 className=" text-2xl">Start shopping now!</h1>
            <form onSubmit={onLoginEvent} className="pt-8 w-full" noValidate>
                <div className="form_control">
                    <p className=" py-2">Email</p>
                    <input
                        type="text"
                        id="user-email"
                        name="email"
                        className="w-full rounded-md p-2 focus:outline-none bg-transparent border-white border-2 border-opacity-70 hover:border-opacity-100 transition duration-300 focus:border-opacity-100"
                        placeholder="example@yahoo.com"
                        onChange={e => { setEmail(e.target.value) }}
                        onBlur={validateEmail}
                    />
                    {!isEmailCorrect && <p className="text-red-500 mt-1 text-sm">Your email is not valid!</p>}
                </div>

                <div className="form_control">
                    <p className=" pt-5 pb-2">Password</p>
                    <div className="flex rounded-md border-white border-2 mb-10 border-opacity-70 hover:border-opacity-100 transition duration-300 focus:border-opacity-100">
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Enter your password..."
                            className="w-full p-2 bg-transparent focus:outline-none"
                            onChange={e => { setPassword(e.target.value) }}
                        />
                        <button className="mr-2" type="button" onClick={togglePassword}>
                            <IconContext.Provider value={{ color: "white" }}>
                                {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                            </IconContext.Provider>
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn-submit w-full bg-white mb-5 rounded-md py-2 font-bold text-blue-950 hover:scale-105 transition duration-300 shadow-md">Login</button>
            </form>

            <p className="mb-5">Don't have an account? <span><Link to="/register" className="font-bold hover:opacity-70">Register</Link></span></p>
        </div>
    );
}

export default Login;