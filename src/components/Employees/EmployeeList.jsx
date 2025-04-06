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
        return <div className="text-center py-10">Loading employees...</div>;
    }
    
    if (error) {
        return <div className="text-center py-10 text-red-600">{error}</div>;
    }
    
    return(
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Employee Directory</h1>
                {isAdmin && isAdmin() && (
                    <Link
                    to="/employees/new"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                    Add Employee
                    </Link>
                )}
            </div>
            
            {employees.length === 0 ? (
                <p className="text-center py-10">No employees found.</p>
            ):(
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Department</th>
                                <th className="py-2 px-4 border-b">Position</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{employee.name}</td>
                                    <td className="py-2 px-4 border-b">{employee.email}</td>
                                    <td className="py-2 px-4 border-b">{employee.department}</td>
                                    <td className="py-2 px-4 border-b">{employee.position}</td>
                                    <td className="py-2 px-4 border-b flex space-x-4">
                                        <Link
                                        to={`/employees/${employee._id}`}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                        View
                                        </Link>
                                        {isAdmin && isAdmin() && (
                                            <>
                                            <Link
                                            to={`/employees/${employee._id}/edit`}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                                            >
                                            Edit
                                            </Link>
                                            <button
                                            onClick={()=> handleDelete(employee._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                            >
                                                Delete
                                            </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default EmployeeList;