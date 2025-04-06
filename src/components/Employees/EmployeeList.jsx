import React, {useState, useContext, useEffect} from "react";
import AuthContext from "../../context/AuthContext.jsx";
import {Link, useNavigate} from "react-router-dom";
import api from "../../services/api.js";

const EmployeeList = ()=>{
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    // Debug admin status
    useEffect(() => {
        console.log("Current user in EmployeeList:", currentUser);
        console.log("Is admin function result:", isAdmin());
        console.log("User role:", currentUser?.role);
    }, [currentUser, isAdmin]);

    useEffect(()=>{
        const fetchEmployees = async()=>{
            try {
                console.log("Fetching employees with direct axios call...");
                
                // With HTTP-only cookies, we don't need to manually add the token
                // The browser will automatically include cookies in the request
                const response = await api.get('/employees/');
                
                console.log("Employees fetched successfully:", response.data);
                setEmployees(response.data.data || []);
                setError(null);
            } catch (error) {
                console.error('Error fetching employees:', error.message);
                console.error('Full error object:', error);
                console.error('Response status:', error.response?.status);
                console.error('Response data:', error.response?.data);
                console.error('Response headers:', error.response?.headers);
                
                if (error.response?.status === 401) {
                    setError('Unauthorized: Please login again');
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    setError('Failed to fetch employees: ' + (error.response?.data?.message || error.message));
                }
            } finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, [navigate]);

    const handleDelete = async(id)=>{
        if(window.confirm('Are you sure you want to delete this employee?')){
            try {
                await api.delete(`/employees/${id}`);
                setEmployees(employees.filter(emp => emp._id !== id));
            } catch (error) {
                setError('Failed to delete employee');
                console.error('Error deleting employee', error);
            }
        }
    }
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-lg font-medium text-gray-700">Loading employees...</span>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-8 rounded shadow">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return(
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Employee Directory</h1>
                {isAdmin && isAdmin() && (
                    <Link
                    to="/employees/new"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out flex items-center"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Employee
                    </Link>
                )}
            </div>
            
            {employees.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-xl text-gray-600">No employees found.</p>
                </div>
            ):(
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map((employee) => (
                                    <tr key={employee._id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{employee.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {employee.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.position}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link
                                                to={`/employees/${employee._id}`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition duration-150"
                                                >
                                                    View
                                                </Link>
                                                {isAdmin && isAdmin() && (
                                                    <>
                                                    <Link
                                                    to={`/employees/${employee._id}/edit`}
                                                    className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-1 px-3 rounded-md transition duration-150"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                    onClick={()=> handleDelete(employee._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md transition duration-150"
                                                    >
                                                        Delete
                                                    </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EmployeeList;