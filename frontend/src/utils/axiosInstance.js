import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error
            const message = error.response.data?.message || "An error occurred";

            // Handle specific status codes
            if (error.response.status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
                toast.error("Session expired. Please login again.");
            } else if (error.response.status === 403) {
                toast.error("You don't have permission to perform this action");
            } else if (error.response.status === 404) {
                toast.error("Resource not found");
            } else if (error.response.status >= 500) {
                toast.error("Server error. Please try again later.");
            } else {
                toast.error(message);
            }
        } else if (error.request) {
            // Request made but no response
            toast.error("Network error. Please check your connection.");
        } else {
            // Something else happened
            toast.error("An unexpected error occurred");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
