import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Components:
import OwnerLogin from './pages/OwnerLogin'; // NOTE: Assuming this is the component that uses the form
import OwnerPage from './pages/OwnerPage';   // NOTE: Using the correct file name
import CustomerPage from './pages/CustomerPage'; 
import CartPage from './pages/CartPage'; // <--- IMPORTED CARTPAGE

function App() {
    // State to hold the authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State to track if we have finished checking localStorage
    const [isAuthLoading, setIsAuthLoading] = useState(true); 

    // --- 🔑 AUTHENTICATION PERSISTENCE CHECKER ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            // A token exists. Set the state to authenticated to maintain session.
            setIsAuthenticated(true);
            console.log("Token found in localStorage. Session restored. isAuthenticated: true");
        } else {
            console.log("No token found in localStorage. isAuthenticated: false");
        }
        
        // Always set loading to false once the check is done.
        setIsAuthLoading(false); 
    }, []); 

    // Function passed to the login component to update global state after successful login
    const handleLogin = (authData) => {
        // OwnerLogin component handles saving the token to localStorage
        setIsAuthenticated(true);
        console.log("Login successful, setting isAuthenticated: true");
    };

    // Function to handle logout (clears state and storage)
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token from storage
        setIsAuthenticated(false);
    };

    // Show a simple loading state while checking persistence
    if (isAuthLoading) {
        // You can replace this with a nice spinner later.
        return <div className="text-center p-8 text-xl">Loading application...</div>;
    }

    // --- Private Route Protection Component ---
    const PrivateRoute = ({ children }) => {
        console.log(`[PrivateRoute Check] isAuthenticated: ${isAuthenticated}`); // <-- NEW LOG
        // If not authenticated, redirect to the login page.
        return isAuthenticated ? children : <Navigate to="/owner-login" replace />;
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<CustomerPage />} />
                <Route path="/owner-login" element={<OwnerLogin onLogin={handleLogin} />} />
                <Route path="/cart" element={<CartPage />} /> {/* <--- NEW CART ROUTE */}

                {/* Private Route for the Owner Page */}
                <Route 
                    path="/owner" 
                    element={
                        <PrivateRoute>
                            {/* Pass handleLogout to your OwnerPage component */}
                            <OwnerPage onLogout={handleLogout} /> 
                        </PrivateRoute>
                    } 
                />
                
                {/* Add other routes here... */}
                
            </Routes>
        </Router>
    );
}

export default App;
