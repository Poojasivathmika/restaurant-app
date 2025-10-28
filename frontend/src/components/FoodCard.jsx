const FoodCard = ({ food, item, isOwner = false, onEdit, onDelete, onAddToCart }) => {
  // Accept either `food` (preferred) or legacy `item` prop
  const f = food || item;
  if (!f) return null;

  return (
    <div className="food-card">
      <img
        className="food-image"
        src={f.image || 'https://via.placeholder.com/400x200?text=No+Image'}
        alt={f.name}
      />
      <div className="food-content">
        <h3 className="food-title">{f.name}</h3>
        <p className="food-description">{f.description}</p>
        <div className="food-footer">
          <span className="food-price">${Number(f.price).toFixed(2)}</span>

          {isOwner ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onEdit && onEdit(f)}
                className="btn btn-secondary"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete && onDelete(f._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart && onAddToCart(f)}
              className="btn btn-primary"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;