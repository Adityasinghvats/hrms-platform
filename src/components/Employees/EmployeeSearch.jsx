import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const EmployeeSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setLoading(true);
    setSearched(true);
    
    try {
      const response = await api.get(`/employees/search?query=${encodeURIComponent(query)}`);
      setResults(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to search employees');
      console.error('Error searching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Search Employees</h1>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
              type="text"
              placeholder="Search by name, email, position, or department"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {error && (
            <div className="text-red-500 mt-2">{error}</div>
          )}
        </form>
        
        {searched && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            {results.length === 0 ? (
              <p className="text-center py-4">No employees found matching your search.</p>
            ) : (
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
                    {results.map((employee) => (
                      <tr key={employee._id}>
                        <td className="py-2 px-4 border-b">{employee.name}</td>
                        <td className="py-2 px-4 border-b">{employee.email}</td>
                        <td className="py-2 px-4 border-b">{employee.department}</td>
                        <td className="py-2 px-4 border-b">{employee.position}</td>
                        <td className="py-2 px-4 border-b">
                          <Link 
                            to={`/employees/${employee._id}`}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSearch;