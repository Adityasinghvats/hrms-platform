import React, { useState } from 'react';
import EmployeeService from '../../services/employee.service.js';

const ExportEmployees = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await EmployeeService.exportEmployees();
      setSuccess(true);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export employee data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Export Employee Data</h1>
      
      <div className="bg-white shadow-md rounded p-6">
        <p className="mb-4">
          Click the button below to export all employee data. This will download a file containing all employee records.
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Export successful! The file should begin downloading shortly.
          </div>
        )}
        
        <button
          onClick={handleExport}
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Exporting...' : 'Export Employee Data'}
        </button>
      </div>
    </div>
  );
};

export default ExportEmployees;