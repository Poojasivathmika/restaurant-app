import { useState } from 'react';

const LoginModal = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('owner'); // Default to 'owner'
  const [password, setPassword] = useState('password123'); // Default to 'password123'

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Owner Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Log In
          </button>
        </form>
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
        >
          Cancel and Return to Menu
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
