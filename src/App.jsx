import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/authcontextprovider.jsx';

//components
import Login from './components/Auth/Login';
import EmployeeList from './components/Employees/EmployeeList';
import EmployeeDetails from './components/Employees/EmployeeDetails';
import EmployeeForm from './components/Employees/EmployeeForm';
import EmployeeSearch from './components/Employees/EmployeeSearch';
import Header from './components/Layout/header.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Footer from './components/Layout/Footer.jsx';
import ExportEmployees from './components/Employees/ExportEmployees.jsx';

function App() {
  return (
   <AuthProvider>
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header/>
        <main className="container mx-auto py-4">
          <Routes>
            <Route path='/login' element={<Login/>}/>

            <Route
            path='/employees'
            element={
              <ProtectedRoute>
                <EmployeeList/>
              </ProtectedRoute>
            }
            />

            <Route
            path='/employees/search'
            element={
              <ProtectedRoute>
                <EmployeeSearch/>
              </ProtectedRoute>
            }
            />

            <Route
            path='/employees/new'
            element={
              <ProtectedRoute adminOnly={true}>
                <EmployeeForm/>
              </ProtectedRoute>
            }
            />

            <Route
            path="/employees/:id" 
            element={
              <ProtectedRoute>
                <EmployeeDetails />
              </ProtectedRoute>
            }
            />

            <Route
            path="/employees/:id/edit" 
            element={
              <ProtectedRoute adminOnly={true}>
                <EmployeeForm />
              </ProtectedRoute>
            } 
            />
            <Route
            path="/employees/export" 
            element={
              <ProtectedRoute adminOnly={true}>
                <ExportEmployees />
              </ProtectedRoute>
            }/>
            <Route 
            path="*" 
            element={<Navigate to="/employees" replace />} 
            />
          </Routes>
        </main>
       <Footer/>
      </div>
    </Router>
   </AuthProvider>
  )
}

export default App
