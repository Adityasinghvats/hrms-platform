import React, {useContext, useEffect} from "react";
import AuthContext from "../../context/AuthContext.jsx";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children, adminOnly = false})=>{
    const {currentUser, loading, isAdmin} = useContext(AuthContext);
    
    // Debug admin status
    useEffect(() => {
        console.log("Protected Route - Admin Only:", adminOnly);
        console.log("Current user in ProtectedRoute:", currentUser);
        console.log("Is admin function result:", isAdmin());
        console.log("User role:", currentUser?.role);
    }, [currentUser, isAdmin, adminOnly]);
    
    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }
    
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }
    
    if (adminOnly && !isAdmin()) {
        console.log("Access denied: Admin privileges required");
        return <Navigate to="/employees" replace />;
    }
    
    return children;
}

export default ProtectedRoute;