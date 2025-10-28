import { useState } from 'react';
import api from '../api';

const CartModal = ({ isOpen, onClose, cart = [], updateQuantity, onCheckoutSuccess }) => {
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [loading, setLoading] = useState(false);

	const total = cart.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);

	const handleCheckout = async (e) => {
		e.preventDefault();
		if (!name || !address || cart.length === 0) {
			alert('Please provide name, address, and at least one item.');
			return;
		}

		try {
			setLoading(true);

			const items = cart.map((it) => ({
				foodId: it._id,
				name: it.name,
				price: it.price,
				quantity: it.quantity,
			}));

			const payload = { customerName: name, customerAddress: address, items };
			const res = await api.post('/order', payload);
			setLoading(false);

			alert('Order placed successfully!');
			if (onCheckoutSuccess) onCheckoutSuccess();
			onClose();
		} catch (err) {
			console.error('Checkout error', err);
			setLoading(false);
			alert('Could not place order. Try again.');
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-60 flex items-center justify-center">
			<div className="bg-white rounded-lg w-full max-w-2xl p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Your Cart</h2>
					<button onClick={onClose} className="text-gray-600">Close</button>
				</div>

				{cart.length === 0 ? (
					<p className="text-center py-8">Your cart is empty.</p>
				) : (
					<div>
						<ul className="space-y-3 max-h-64 overflow-auto mb-4">
							{cart.map((it) => (
								<li key={it._id} className="flex items-center justify-between">
									<div>
										<div className="font-semibold">{it.name}</div>
										<div className="text-sm text-gray-600">${Number(it.price).toFixed(2)}</div>
									</div>
									<div className="flex items-center gap-2">
										<input type="number" min="0" value={it.quantity} onChange={(e) => updateQuantity(it._id, Number(e.target.value))} className="w-16 p-1 border rounded" />
										<div className="font-semibold">${(Number(it.price) * it.quantity).toFixed(2)}</div>
									</div>
								</li>
							))}
						</ul>

						<div className="mb-4 text-right">
							<div className="text-lg font-bold">Total: ${total.toFixed(2)}</div>
						</div>

						<form onSubmit={handleCheckout} className="space-y-3">
							<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="w-full p-2 border rounded" />
							<input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" required className="w-full p-2 border rounded" />

							<div className="flex justify-end gap-2">
								<button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
								<button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Placing...' : 'Place Order'}</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
};

export default CartModal;
