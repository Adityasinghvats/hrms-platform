import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import AuthContext from '../../context/AuthContext.jsx';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  // Debug admin status
  useEffect(() => {
    console.log("Current user in EmployeeDetails:", currentUser);
    console.log("Is admin function result:", isAdmin());
    console.log("User role:", currentUser?.role);
  }, [currentUser, isAdmin]);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/employees/${id}`);
        setEmployee(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch employee details');
        console.error('Error fetching employee:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        navigate('/employees');
      } catch (err) {
        setError('Failed to delete employee');
        console.error('Error deleting employee:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading employee details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!employee) {
    return <div className="text-center py-10">Employee not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Employee Details</h1>
          <div className="space-x-2">
            <Link 
              to="/employees" 
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Back
            </Link>
            {isAdmin && isAdmin() && (
              <>
                <Link 
                  to={`/employees/${id}/edit`} 
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </Link>
                <button 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-b pb-2">
            <p className="text-gray-600">Name</p>
            <p className="font-semibold">{employee.name}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{employee.email}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">Phone Number</p>
            <p className="font-semibold">{employee.phoneNo}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">Department</p>
            <p className="font-semibold">{employee.department}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">Position</p>
            <p className="font-semibold">{employee.position}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-gray-600">Joining Date</p>
            <p className="font-semibold">{new Date(employee.joiningDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;