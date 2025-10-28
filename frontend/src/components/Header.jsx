import { Link } from 'react-router-dom';

const Header = ({ isOwner, onLogout, onCartClick, cartItemCount = 0 }) => {
	return (
		<header className="header">
			<div className="header-container">
				<Link to="/" className="brand" aria-label="Pooja Restaurant">
					<svg className="brand-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden>
						<path d="M12 2C10 2 8 3 7 5c-1 2 0 4 0 4s2 0 4-2 4-2 4-2 1.5-2 0-4c-1-1-3-1-3-1z" fill="currentColor" opacity="0.95"></path>
						<rect x="3" y="13" width="18" height="8" rx="2" fill="currentColor" opacity="0.9"></rect>
					</svg>
					<span>Pooja Restaurant</span>
				</Link>
				<nav className="nav-links">
					<Link to="/" className="nav-link">
						<svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
						<span>Menu</span>
					</Link>
					{isOwner && <Link to="/owner" className="nav-link">Owner Panel</Link>}

					{!isOwner && (
						<Link to="/cart" className="cart-button" aria-label="Open cart">
							<svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
								<path d="M6 6h15l-1.5 9h-13z"></path>
								<circle cx="9" cy="20" r="1"></circle>
								<circle cx="18" cy="20" r="1"></circle>
							</svg>
							<span style={{ marginLeft: 8 }}>Cart</span>
							{cartItemCount > 0 && (
								<span className="cart-count">{cartItemCount}</span>
							)}
						</Link>
					)}

					{isOwner ? (
						<>
							<button onClick={onLogout} className="btn logout-btn" title="Logout">
								<svg className="logout-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
									<polyline points="16 17 21 12 16 7"></polyline>
									<line x1="21" y1="12" x2="9" y2="12"></line>
								</svg>
								<span style={{ marginLeft: 8, color: 'var(--danger)', fontWeight: 600 }}>Logout</span>
							</button>
						</>
					) : (
						<Link to="/owner/login" className="btn btn-primary">Owner Login</Link>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
