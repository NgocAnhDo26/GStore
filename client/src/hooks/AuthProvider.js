import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const navigate = useNavigate();

    const handleLogin = async (data) => {
        axios.post("http://localhost:1111/auth/login", data, { withCredentials: true })
            .then((response) => {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setUser(response.data.user);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Login successful!"
                }).then(() => {
                    navigate("/");
                });
            }).catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response.data.message
                });
            });
    }

    const handleLogout = async () => {
        axios.post("http://localhost:1111/auth/logout", {}, { withCredentials: true })
            .then(() => {
                localStorage.removeItem("user");
                setUser(null);
                navigate("/");
            }).catch((error) => {
                console.log(error);
            });
    }

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
