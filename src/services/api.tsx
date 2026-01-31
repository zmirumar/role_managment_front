import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8002/api/';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const authStorage = localStorage.getItem("auth-storage");
        let token = null;

        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                token = parsed.state?.token;
            } catch (e) {
                console.error("Error parsing auth-storage", e);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);