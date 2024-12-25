import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isUsernameCorrect, setIsUsernameCorrect] = useState(true);
    const [isUsernameExist, setIsUserNameExist] = useState(false);
    const [isEmailExist, setIsEmailExist] = useState(false);
    const [isEmailCorrect, setIsEmailCorrect] = useState(true);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
    const [isPasswordMatched, setIsPasswordMatched] = useState(true);

    const fetchUsername = () => {
        axios.get(`http://localhost:1111/auth/check-exist-username?username=${username}`)
            .then((response) => {
                setIsUserNameExist(Boolean(response.data));
            }).catch((error) => {
                console.log(error);
            });
    }

    const fetchEmail = () => {
        axios.get(`http://localhost:1111/auth/check-exist-email?email=${email}`)
            .then((response) => {
                setIsEmailExist(Boolean(response.data));
            }).catch((error) => {
                console.log(error);
            });
    }

    const validateUsername = () => {
        // Username can only contain alphanumeric and underscores
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        setIsUsernameCorrect(usernameRegex.test(username));

        // Check if username already exists
        fetchUsername();
    }

    const validateEmail = () => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        setIsEmailCorrect(emailRegex.test(email));

        // Check if email already exists
        fetchEmail();
    }

    const validatePassword = () => {
        // Check if password is at least 8 characters long
        setIsPasswordCorrect(password.length >= 8);
    }

    const validateConfirmPassword = () => {
        // Check if password and confirm password match
        setIsPasswordMatched(password === confirmPassword);
    }

    const handleSubmitEvent = (e) => {
        e.preventDefault();

        if (!isEmailCorrect || !isPasswordCorrect ||
            !isPasswordMatched || !isUsernameCorrect ||
            isUsernameExist || isEmailExist) {
            return;
        }

        axios.post("http://localhost:1111/auth/register", {
            username,
            email,
            password
        }).then(() => {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Account created successfully!"
            }).then(() => {
                // Navigate to login page
                navigate("/login");
            })
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data.message
            });
        });
    };

    return (

        <div className="flex flex-col rounded-md items-center mx-10 my-16 py-10 px-12 bg-gradient-to-t from-blue1/80 to-form-pink/80 w-[26rem] self-center flex-1 text-white shadow-md">
            <h1 className=" text-4xl font-bold">GStore</h1>
            <h1 className=" text-2xl">Create your new account!</h1>
            <form onSubmit={handleSubmitEvent} className="pt-8 w-full">
                <div className="form_control">
                    <p className="pt-3 pb-2">Username</p>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="w-full rounded-md p-2 focus:outline-none bg-transparent border-white border-2 border-opacity-70 hover:border-opacity-100 transition duration-300 focus:border-opacity-100"
                        placeholder="Enter your username..."
                        onChange={e => { setUsername(e.target.value) }}
                        onBlur={validateUsername}
                    />
                    {!isUsernameCorrect ? <p className="text-red-500 mt-1 text-sm"> Username only contains alphanumeric & underscores</p> : isUsernameExist && <p className="text-red-500 mt-1 text-sm">This username is already used!</p>}
                </div>
                <div className="form_control">
                    <p className="pt-3 pb-2">Email</p>
                    <input
                        type="text"
                        id="user-email"
                        name="email"
                        className="w-full rounded-md p-2 focus:outline-none bg-transparent border-white border-2 border-opacity-70 hover:border-opacity-100 transition duration-300 focus:border-opacity-100"
                        placeholder="example@yahoo.com"
                        onChange={e => { setEmail(e.target.value) }}
                        onBlur={validateEmail}
                    />
                    {!isEmailCorrect ? <p className="text-red-500 mt-1 text-sm">Your email is invalid!</p> : isEmailExist && <p className="text-red-500 mt-1 text-sm">This email is already used!</p>}
                </div>
                <div className="form_control">
                    <p className="pt-3 pb-2">Password</p>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password..."
                        className="w-full rounded-md p-2 focus:outline-none bg-transparent border-white border-2 border-opacity-70 hover:border-opacity-100 transition duration-300 focus:border-opacity-100"
                        aria-describedby="user-password"
                        aria-invalid="false"
                        onChange={e => { setPassword(e.target.value) }}
                        onBlur={validatePassword}
                    />
                    {!isPasswordCorrect && <p className="text-red-500 mt-1 text-sm">Password must be at least 8 characters long!</p>}
                </div>
                <div className="form_control">
                    <p className="pt-3 pb-2">Confirm Password</p>
                    <input
                        type="password"
                        name="password-confirm"
                        placeholder="Enter your password..."
                        className="w-full rounded-md p-2 focus:outline-none bg-transparent border-white border-2 border-opacity-70 hover:border-opacity-100 transition duration-300 focus:border-opacity-100"
                        aria-describedby="user-password"
                        aria-invalid="false"
                        onChange={e => { setConfirmPassword(e.target.value) }}
                        onBlur={validateConfirmPassword}
                    />
                    {!isPasswordMatched && <p className="text-red-500 mt-1 text-sm">Passwords do not match!</p>}
                </div>

                <button type="submit" className="btn-submit w-full bg-white mb-5 mt-10 rounded-md py-2 font-bold text-blue-950 hover:scale-105 transition duration-300 shadow-md">Register</button>
            </form>

            <p className="mb-5">Already got an account? <span><Link to="/login" className="font-bold hover:opacity-70">Login</Link></span></p>
        </div>
    );
}

export default Register;
