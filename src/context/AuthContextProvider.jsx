import React, {useState, useEffect} from "react";
import api from "../services/api.js";
import AuthContext from "./AuthContext.jsx";
const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        console.log(userStr)
        if (userStr){
            try {
                // This line is problematic - you're assigning setCurrentUser's return value to user
                const user = JSON.parse(userStr);
                setCurrentUser(user);
                console.log("User loaded from localStorage:", user);
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
                // localStorage.removeItem('user');
            }
            
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            console.log("AuthProvider: Attempting login with:", email);
            
            const response = await api.post('/users/login', { email, password });
            console.log("AuthProvider: Full login response:", response);
            
            // Check if we have a valid response
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            
            // Extract user data based on your API response structure
            let userData;
            if (response.data.data && response.data.data.user) {
                userData = response.data.data.user;
                // Store roleName if it exists in the response
                if (response.data.data.roleName) {
                    userData.roleName = response.data.data.roleName;
                }
            } else if (response.data.user) {
                userData = response.data.user;
            } else if (response.data.data) {
                userData = response.data.data;
            }
            
            console.log("Extracted user data:", userData);
            
            if (!userData) {
                throw new Error('No user data found in response');
            }
            
            // Add an isAdmin flag based on the roleName or email pattern
            if ((userData.roleName && userData.roleName.toLowerCase() === 'admin') || 
                (email.includes('admin'))) {
                userData.isAdmin = true;
                console.log("Setting isAdmin flag based on roleName or email pattern");
            }
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            // If the API returns tokens in the response body, save them
            if (response.data.data && response.data.data.accessToken) {
                localStorage.setItem('accessToken', response.data.data.accessToken);
            }
            
            // Update state
            setCurrentUser(userData);
            
            return response.data.data || response.data;
        } catch (err) {
            console.error("AuthProvider: Login error", err);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async() => {
        try {
            setLoading(true);
            await api.post('/users/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }finally{
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setCurrentUser(null);
            setLoading(false);
        }
    }
    const isAdmin = () => {
        console.log("Checking admin status for user:", currentUser);
        if (!currentUser) return false;
        
        // First check for the isAdmin flag we set during login
        if (currentUser.isAdmin === true) {
            console.log("Admin detected by isAdmin flag");
            return true;
        }
        
        // Check for roleName property from the response
        if (currentUser.roleName && currentUser.roleName.toLowerCase() === 'admin') {
            console.log("Admin detected by roleName property");
            return true;
        }
    
        
        // More flexible role checking
        let hasAdminRole = false;
        
        if (typeof currentUser.role === 'string') {
            // If role is a string, it could be either the role name or role ID
            hasAdminRole = currentUser.role.toLowerCase() === 'admin';
        } else if (typeof currentUser.role === 'object' && currentUser.role !== null) {
            // If role is an object, check if it has a name property
            hasAdminRole = currentUser?.role?.name?.toLowerCase() === 'admin';
        }
        
        console.log("User has admin role:", hasAdminRole);
        return hasAdminRole;
    }
    const value = {
        currentUser,
        loading,
        error,
        login,
        logout,
        isAdmin
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;