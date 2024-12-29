import React, {useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminGuard = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await axios.get("http://localhost:1111/auth/check-admin", { withCredentials: true });
                if (response.data?.success === true) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Unauthorized',
                        text: 'You are not authorized to access this page.',
                    }).then(() => {
                        navigate('/');
                    });
                }
            } catch (error) {
                setIsAuthorized(false);
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Unauthorized',
                    text: 'You are not authorized to access this page.',
                }).then(() => {
                    navigate('/');
                });
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthorization();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>; // Optional loading state
    }

    return isAuthorized ? children : null;
}

export default AdminGuard;