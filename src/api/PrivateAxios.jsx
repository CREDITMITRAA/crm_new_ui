import axios from "axios";
import { BASE_URL } from "../utilities/AppConstants";

const PrivateAxios = axios.create({
    baseURL:BASE_URL,
    headers: {
        "Content-Type": "application/json",
      },
})

PrivateAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

PrivateAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Token expired or unauthorized! Redirecting to login...');
            
            // Clear localStorage and redirect to login page
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default PrivateAxios