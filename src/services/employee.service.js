import api from './api.js';

// Service for handling employee-related API calls
const EmployeeService = {
  // Get all employees
  getAllEmployees: async () => {
    const response = await api.get('/employees/');
    return response.data.data;
  },
  
  // Get employee by ID
  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  },
  
  // Create new employee - Admin only
  createEmployee: async (employeeData) => {
    // The backend will verify admin role through the token
    const response = await api.post('/employees/', employeeData);
    return response.data.data;
  },
  
  // Update employee - Admin only
  updateEmployee: async (id, employeeData) => {
    // The backend will verify admin role through the token
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data.data;
  },
  
  // Delete employee - Admin only
  deleteEmployee: async (id) => {
    // The backend will verify admin role through the token
    const response = await api.delete(`/employees/${id}`);
    return response.data.data;
  },
  
  // Search employees
  searchEmployees: async (query) => {
    const response = await api.get(`/employees/search?query=${encodeURIComponent(query)}`);
    return response.data.data;
  },
  
  // Export employee data as JSON - Admin only
  exportEmployees: async () => {
    try {
      console.log("Starting employee data export...");
      
      // First try to get the data without specifying responseType
      const response = await api.get('/employees/export');
      
      console.log("Export response received:", response.status);
      console.log("Content type:", response.headers['content-type']);
      
      // If we get here, we have a JSON response
      let employeeData;
      
      // Check if response.data is already the array or if it's wrapped
      if (Array.isArray(response.data)) {
        employeeData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        employeeData = response.data.data;
      } else {
        employeeData = response.data;
      }
      
      // Format the data nicely
      const formattedData = JSON.stringify(employeeData, null, 2);
      
      // Create a blob from the formatted data
      const blob = new Blob([formattedData], { type: 'application/json' });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees.json');
      document.body.appendChild(link);
      
      console.log("Triggering download...");
      link.click();
      
      // Clean up with a delay to ensure download starts
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
        console.log("Download cleanup completed");
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Error exporting employee data:', error);
      alert('Failed to export employees: ' + (error.message || 'Unknown error'));
      throw error;
    }
  }
};

export default EmployeeService;