import React, {useState, useContext} from "react";
import  AuthContext  from "../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, error, loading} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            console.log("Attempting login with:", email);
            const result = await login(email, password);
            console.log("Login successful:", result);
            navigate('/employees');
        } catch (error) {
            console.error("Login error:", error);
            console.error("Error details:", error.response?.data);
        }
    }
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    HRMS Login
                </h2>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                        className="block text-gray-700 text-sm font-bold mb-2" 
                        htmlFor="email"
                        >
                            Email
                        </label>
                        <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                        className="block text-gray-700 text-sm font-bold mb-2" 
                        htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" 
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        required 
                        />
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="submit"
                        disabled={loading}
                      >
                       {loading ? 'Logging in...' : 'Sign In'}
                      </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;
