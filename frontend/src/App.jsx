import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import CustomerPage from './pages/CustomerPage';
import OwnerPage from './pages/OwnerPage';
import OwnerLogin from './pages/OwnerLogin';
import CartPage from './pages/CartPage';
import Footer from './components/Footer';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // State for owner status

  // Check for owner token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsOwner(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsOwner(false);
    // Navigate to home page
    window.location.href = '/'; 
  };

  const addToCart = (food) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === food._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...food, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item._id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item._id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleCheckoutSuccess = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header 
          isOwner={isOwner} 
          onLogout={handleLogout} 
          onCartClick={() => setIsCartOpen(true)} 
          cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        />
        <main className="flex-grow p-4 bg-gray-50">
          <Routes>
            <Route path="/" element={<CustomerPage onAddToCart={addToCart} />} />
            <Route 
              path="/cart" 
              element={
                <CartPage 
                  cart={cart}
                  onUpdateQuantity={updateCartQuantity}
                  onRemoveFromCart={(id) => updateCartQuantity(id, 0)}
                  onCheckout={handleCheckoutSuccess}
                />
              }
            />
            <Route 
              path="/owner/login" 
              element={
                isOwner ? 
                <Navigate to="/owner" replace /> : 
                <OwnerLogin onLogin={() => setIsOwner(true)} />
              }
            />
            <Route 
              path="/owner" 
              element={
                isOwner ? 
                <OwnerPage isOwner={isOwner} setIsOwner={setIsOwner} /> : 
                <Navigate to="/owner/login" replace />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
