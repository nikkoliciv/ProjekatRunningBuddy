import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  //registracija
  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      if (email === "admin@gmail.com") {
        const response = await axios.post('http://localhost:4000/auth/registerAdmin', { name, email, password });
        setMessage(response.data.message);
        if (response.status === 201) {
          navigate('/login'); 
        }
      } else {
        const response = await axios.post('http://localhost:4000/auth/register', { name, email, password });
        setMessage(response.data.message);
        if (response.status === 201) {
          navigate('/login'); 
        }
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-green-600">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-green-300 rounded"
            />
          </div>
          <div>
            <label className="block text-green-600">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-green-300 rounded"
            />
          </div>
          <div>
            <label className="block text-green-600">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-green-300 rounded"
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Register</button>
        </form>
        {message && <p className="mt-4 text-green-700">{message}</p>}
      </div>
      <div className="mt-4 flex justify-center">
        <div className="text-center">
          <p className="text-green-600 mb-2">If you already have an account:</p>
          <Link to='/login' className="hover:text-green-800">
            <h5 className="text-green-600 text-lg font-bold bg-white rounded-[20px] px-4 py-2 shadow-md inline-block">
              Login
            </h5>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
