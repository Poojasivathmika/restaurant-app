import { useState } from 'react';
import { Link } from 'react-router-dom';

const CartPage = ({ cart = [], onUpdateQuantity, onRemoveFromCart, onCheckout }) => {
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            await onCheckout();
        } catch (error) {
            console.error('Checkout failed:', error);
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <h1 className="cart-title">Your Cart</h1>
                <div className="cart-empty">
                    <p>Your cart is empty</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1 className="cart-title">Your Cart</h1>
            
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item._id} className="cart-item">
                        <img 
                            src={item.image || 'https://via.placeholder.com/80'} 
                            alt={item.name}
                            className="cart-item-image"
                        />
                        <div className="cart-item-details">
                            <h3 className="cart-item-name">{item.name}</h3>
                            <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                            <div className="cart-item-quantity">
                                <button
                                    className="quantity-btn decrease"
                                    onClick={() => item.quantity > 1 && onUpdateQuantity(item._id, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    className="quantity-btn increase"
                                    onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                                >
                                    +
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{ marginLeft: 'auto' }}
                                    onClick={() => onRemoveFromCart(item._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="cart-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <button
                    className="btn btn-primary checkout-btn"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                >
                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                </button>
            </div>
        </div>
    );
};

export default CartPage;
