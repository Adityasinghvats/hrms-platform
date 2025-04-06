import axios from 'axios';

// Use environment variables to switch between dev and prod URLs
const API_URL = import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
        ? "https://hrms-579n.onrender.com"
        : "http://localhost:3000");

const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers:{
        'Content-Type': 'application/json',
    },
    withCredentials: true, // This tells axios to include cookies with every request
});

// Add a request logger
api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
        console.log("Request headers:", config.headers);
        console.log("Request data:", config.data);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response logger
api.interceptors.response.use(
    (response) => {
        // Don't try to log blob responses in detail
        if (response.config.responseType === 'blob') {
            console.log(`Blob response from ${response.config.url}:`, response.status);
            console.log("Response headers:", response.headers);
        } else {
            console.log(`Response from ${response.config.url}:`, response.status);
            console.log("Response headers:", response.headers);
        }
        return response;
    },
    (error) => {
        // Check if this is a CORS error
        if (error.message === 'Network Error' && !error.response) {
            console.error("Connection Error: Unable to connect to the API server.");
            
            // For production, show a user-friendly message
            const isProd = typeof window !== 'undefined' && window.process && window.process.env.NODE_ENV === 'production';
            if (isProd) {
                // You could trigger a UI notification here instead of console logs
                console.error("The server is currently unreachable. Please try again later or contact support.");
            } else {
                // More detailed error for development
                console.error("CORS Error: The request was blocked by the browser's same-origin policy.");
                console.error("Please ensure your backend has proper CORS headers configured.");
            }
        } else {
            console.error("API Error:", error.message);
            console.error("Status:", error.response?.status);
            console.error("Response data:", error.response?.data);
        }
        
        // If we get a 401 Unauthorized error, redirect to login
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized access - redirecting to login");
            
            // Don't redirect if we're already on the login page
            if (window.location.pathname === '/login') {
                console.log("Already on login page, not redirecting");
                return Promise.reject(error);
            }
            
            // Clear auth data
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            
            // Use setTimeout with longer delay to avoid immediate redirect during render
            // Increasing timeout to 3 seconds to give more time for debugging
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        }
        
        return Promise.reject(error);
    }
);

// interceptor for auth token include
api.interceptors.request.use(
    (config) => {
        //get token saved in browser
        console.log("Checking for access token in localStorage...");
        const token = localStorage.getItem('accessToken');
        console.log("Token retrieved from localStorage:", token ? "Found (length: " + token.length + ")" : "Not found");
        
        if(token){
            // Your backend expects "Bearer " with a space after it
            // But your verification logic removes "Bearer" without the space
            // Let's fix the format to match what your backend expects
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log("Adding token to request:", `Bearer ${token.substring(0, 20)}...`);
        } else {
            console.log("No token found for request to:", config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

//for handling unauthorized errors
api.interceptors.response.use(
    (response) => response,

    async(error) => {
        console.log("API Error:", error.message);
        console.log("Status:", error.response?.status);
        console.log("Response data:", error.response?.data);
        
        // If we get a 401 Unauthorized error, redirect to login
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized access - redirecting to login");
            
            // Don't redirect if we're already on the login page
            if (window.location.pathname === '/login') {
                console.log("Already on login page, not redirecting");
                return Promise.reject(error);
            }
            
            // Clear auth data
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            
            // Use setTimeout with longer delay to avoid immediate redirect during render
            // Increasing timeout to 3 seconds to give more time for debugging
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        }
        
        return Promise.reject(error);
    }
)

export default api;