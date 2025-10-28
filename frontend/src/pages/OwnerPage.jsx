import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import FoodCard from '../components/FoodCard';
import LoginModal from '../components/LoginModal';

const OwnerPage = ({ isOwner, setIsOwner }) => {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', image: '', _id: null,
  });

  // Function to fetch the food list
  const fetchFoods = async () => {
    setIsLoading(true);
    try {
      // The token is automatically added via the API interceptor, but we still need 
      // the initial token check to decide whether to fetch data.
      const response = await api.get('/food');
      setFoods(response.data);
    } catch (error) {
      console.error("Error fetching foods in owner panel:", error);
      // If unauthorized, ensure we handle it gracefully (e.g., redirect to login)
      if (error.response && error.response.status === 401) {
         setIsOwner(false); // Force logout locally if token is expired/invalid
         localStorage.removeItem('ownerToken');
      }
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    if (token) {
        // If token exists, assume logged in and fetch data
        setIsOwner(true);
        fetchFoods();
    } else {
        // No token, must log in
        setIsOwner(false);
        setIsLoading(false);
        setIsLoginModalOpen(true);
    }
  }, []); // Run once on component mount

  // --- Login Handler ---
  const handleLogin = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      // Save the token and update state
      const token = response.data.token; 
      localStorage.setItem('token', token);
      
      setIsOwner(true);
      setIsLoginModalOpen(false);
      
      // Re-fetch data now that we are authenticated
      fetchFoods(); 

    } catch (error) {
      console.error("Login error:", error);
      throw error; // Let the login component handle the error
    }
  };
  
  // --- Form Handlers ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = { 
        ...formData, 
        price: Number(formData.price),
        // Ensure image is not null or undefined for the API
        image: formData.image || 'https://placehold.co/400x250/cccccc/333333?text=No+Image' 
      };

      if (formData._id) {
        // Edit existing item (PUT)
        await api.put(`/food/${formData._id}`, payload);
      } else {
        // Add new item (POST)
        await api.post('/food', payload);
      }
      
      setIsModalOpen(false);
      fetchFoods(); // Refresh list
      
    } catch (error) {
      console.error("Error saving food item:", error);
      alert("Error saving item. Check console for details.");
    }
  };

  const handleEdit = (item) => {
    // Convert price to string for input field
    setFormData({ ...item, price: item.price.toString() }); 
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    // NOTE: For better UX, use a custom modal instead of window.confirm
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/food/${id}`);
        fetchFoods(); // Refresh list
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Error deleting item. Check console for details.");
      }
    }
  };

  const handleAddNew = () => {
    setFormData({ name: '', description: '', price: '', image: '', _id: null });
    setIsModalOpen(true);
  };

  // --- Rendering ---
  
  // Only render LoginModal if needed
  if (!isOwner && isLoginModalOpen) {
      return <LoginModal onLogin={handleLogin} onClose={() => {
        // If owner cancels login, redirect them to the customer page
        setIsLoginModalOpen(false);
        window.location.href = '/'; 
      }} />;
  }

  // Handle Loading State
  if (isLoading || !isOwner) return <div className="text-center p-8 text-xl font-semibold">Loading Owner Panel...</div>;

  return (
    <div className="owner-container">
      <div className="owner-header">
        <h1 className="owner-title">Owner Management Panel</h1>
        <button 
          onClick={handleAddNew}
          className="btn btn-primary"
        >
          + Add New Food Item
        </button>
      </div>

      <div className="food-list">
        <div className="food-list-header">
          <span>Image</span>
          <span>Name</span>
          <span>Price</span>
          <span>Actions</span>
        </div>
        {foods.length > 0 ? (
          foods.map((food) => (
            <div key={food._id} className="food-list-item">
              <img 
                src={food.image || 'https://via.placeholder.com/60'} 
                alt={food.name}
                className="food-list-image"
              />
              <div className="food-list-name">
                <div>{food.name}</div>
                <div className="text-sm text-gray-500">{food.description}</div>
              </div>
              <div className="food-list-price">${food.price.toFixed(2)}</div>
              <div className="food-list-actions">
                <button onClick={() => handleEdit(food)} className="btn btn-secondary">Edit</button>
                <button onClick={() => handleDelete(food._id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No items in the menu. Add your first item!
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity">
          <div className="add-food-form">
            <h2 className="form-title">
              {formData._id ? 'Edit Food Item' : 'Add New Food Item'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Name</label>
                  <input 
                    id="name"
                    type="text" 
                    name="name" 
                    placeholder="Food item name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="price">Price</label>
                  <input 
                    id="price"
                    type="number" 
                    name="price" 
                    placeholder="12.99" 
                    value={formData.price} 
                    onChange={handleChange} 
                    step="0.01" 
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea 
                  id="description"
                  name="description" 
                  placeholder="Describe the food item" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="image">Image URL</label>
                <input 
                  id="image"
                  type="text" 
                  name="image" 
                  placeholder="https://example.com/image.jpg" 
                  value={formData.image} 
                  onChange={handleChange} 
                  className="form-input"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="image-preview"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/200'}
                  />
                )}
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {formData._id ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerPage;
