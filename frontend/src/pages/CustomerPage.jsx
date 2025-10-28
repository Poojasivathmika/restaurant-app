import { useState, useEffect } from "react";
import api from "../api";
import FoodCard from "../components/FoodCard";

const CustomerPage = ({ onAddToCart }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Correct: Capital 'L'
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await api.get('/food');
        setFoods(response.data);
        setLoading(false); // <-- Correct: Capital 'L'
      } catch (err) {
        console.error("Error fetching foods:", err);
        setError("Failed to load menu items.");
        setLoading(false); // <-- Correct: Capital 'L'
      }
    };
    fetchFoods();
  }, []); // <-- Empty array: Runs only once on mount

  if (loading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="menu-container">
      <h2 className="menu-title">Our Menu</h2>
      <div className="menu-grid">
        {foods.length > 0 ? (
          foods.map(food => (
            <FoodCard key={food._id} food={food} onAddToCart={onAddToCart} isOwner={false} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No items available yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;