import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const {currentUser, logout, isAdmin} = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Debug admin status
    useEffect(() => {
        console.log("Current user in Header:", currentUser);
        console.log("Is admin function result:", isAdmin());
        console.log("User role:", currentUser?.role);
    }, [currentUser, isAdmin]);

    const handleLogout = async()=>{
        await logout();
        navigate('/login');
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    if(!currentUser){
        return null;
    }

    return(
        <div>
            <header className="bg-blue-600 text-white shadow-md">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="px-3 py-2 rounded hover:bg-blue-700 text-xl font-bold">
                            HRMS SYSTEM
                        </Link>
                        
                        
                        <div className="md:hidden">
                            <button 
                                onClick={toggleMenu}
                                className="text-white focus:outline-none"
                            >
                                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                                    {isMenuOpen ? (
                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                                    ) : (
                                        <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        
    
                        <nav className="hidden md:flex items-center">
                            <Link to='/employees' className="px-3 py-2 rounded hover:bg-blue-700">
                                Employees
                            </Link>
                            <Link to='/employees/search' className="px-3 py-2 rounded hover:bg-blue-700">
                                Search
                            </Link>
                            {isAdmin && isAdmin() && (
                                <>
                                <Link
                                to='/employees/new'
                                className="block px-3 py-2 rounded hover:bg-blue-700"
                                >
                                Add Employee
                                </Link>
                                <Link
                                to='/employees/export'
                                className="block px-3 py-2 rounded hover:bg-blue-700"
                                >
                                Export
                                </Link>
                                </>
                            )}
                            <div className="ml-4 flex items-center">
                                <span className="mr-2">{currentUser.name || currentUser.fullname || currentUser.email}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                >
                                    Logout
                                </button>
                            </div>
                        </nav>
                    </div>
                    
                    {/* Mobile navigation */}
                    {isMenuOpen && (
                        <nav className="md:hidden pt-4 pb-2 border-t border-blue-500 mt-2">
                            <Link to='/employees' className="block px-3 py-2 rounded hover:bg-blue-700">
                                Employees
                            </Link>
                            <Link to='/employees/search' className="block px-3 py-2 rounded hover:bg-blue-700">
                                Search
                            </Link>
                            {isAdmin && isAdmin() && (
                                <>
                                <Link
                                to='/employees/new'
                                className="block px-3 py-2 rounded hover:bg-blue-700"
                                >
                                Add Employee
                                </Link>
                                <Link
                                to='/employees/export'
                                className="block px-3 py-2 rounded hover:bg-blue-700"
                                >
                                Export
                                </Link>
                                </>
                            )}
                            <div className="px-3 py-2 flex justify-between items-center border-t border-blue-500 mt-2">
                                <span>{currentUser.name || currentUser.fullname || currentUser.email}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                >
                                    Logout
                                </button>
                            </div>
                        </nav>
                    )}
                </div>
            </header>
        </div>
    )
}

export default Header;