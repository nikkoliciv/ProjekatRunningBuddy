import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to manage error messages
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Reset error message before new login attempt

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message); // Set error message if login fails
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Login</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-green-600 mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-green-300 rounded"
            />
          </div>
          <div>
            <label className="block text-green-600 mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-green-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
      <div className="mt-4 text-center">
        <p className="text-green-600 mb-2">If you don't already have an account:</p>
        <Link to='/register' className="text-green-600 hover:text-green-800">
          <h5 className="text-lg font-bold bg-white rounded-[20px] px-4 py-2 shadow-md inline-block">
            Register
          </h5>
        </Link>
      </div>
    </div>
  );
};

export default Login;
