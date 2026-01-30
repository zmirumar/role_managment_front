import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8002/api/';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

// FIX: Dynamic Authorization Header
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