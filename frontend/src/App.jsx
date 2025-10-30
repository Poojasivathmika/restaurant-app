import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Components:
import OwnerLogin from './pages/OwnerLogin';
import OwnerPage from './pages/OwnerPage';   // Your protected page
import CustomerPage from './pages/CustomerPage'; 
import CartPage from './pages/CartPage'; // Your Cart page

function App() {
    // State to hold the authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State to track if we have finished checking localStorage
    const [isAuthLoading, setIsAuthLoading] = useState(true); 

    // --- 🔑 AUTHENTICATION PERSISTENCE CHECKER ---
    useEffect(() => {
        // Check for the token when the app loads
        const token = localStorage.getItem('token');
        
        if (token) {
            // If token exists, assume authenticated to restore session
            setIsAuthenticated(true);
        }
        
        // This is necessary to stop the app from showing "Loading"
        setIsAuthLoading(false); 
    }, []); 

    const handleLogin = (authData) => {
        // The OwnerLogin component handles saving the token to localStorage
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        // Clear the token from storage and reset state
        localStorage.removeItem('token'); 
        setIsAuthenticated(false);
    };

    if (isAuthLoading) {
        return <div className="text-center p-8 text-xl">Loading application...</div>;
    }

    const PrivateRoute = ({ children }) => {
        // Redirects to login if not authenticated
        return isAuthenticated ? children : <Navigate to="/owner-login" replace />;
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<CustomerPage />} />
                <Route path="/owner-login" element={<OwnerLogin onLogin={handleLogin} />} />
                <Route path="/cart" element={<CartPage />} /> 

                {/* Private Route for the Owner Page */}
                <Route 
                    path="/owner" 
                    element={
                        <PrivateRoute>
                            <OwnerPage onLogout={handleLogout} /> 
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;
