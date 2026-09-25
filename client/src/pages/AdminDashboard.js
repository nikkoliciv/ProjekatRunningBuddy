import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AllPlans from '../components/AllPlans';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');

        // Fetch users
        const usersResponse = await axios.get('http://localhost:4000/api/user', {
          headers: { authorization: token },
        });
        setUsers(usersResponse.data);

        // Fetch plans
        const plansResponse = await axios.get('http://localhost:4000/api/plan', {
          headers: { authorization: token },
        });
        setPlans(plansResponse.data);

      } catch (err) {
        setError('Failed to fetch data.');
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = sessionStorage.getItem('token');

      // Delete user
      await axios.delete(`http://localhost:4000/api/user/${userId}`, {
        headers: { authorization: token },
      });

      // Update users list
      setUsers(users.filter(user => user.id !== userId));

      // Re-fetch plans
      const plansResponse = await axios.get('http://localhost:4000/api/plan', {
        headers: { authorization: token },
      });
      setPlans(plansResponse.data);

    } catch (err) {
      setError('Failed to delete user.');
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-green-50 p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-6">Admin Dashboard</h1>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <h2 className="text-2xl font-semibold text-green-600 mb-4">Users</h2>
          <ul className="space-y-4">
            {users.length > 0 ? (
              users.map(user => (
                <li key={user.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <span>{user.email} (Admin: {user.isAdmin ? 'Yes' : 'No'})</span>
                  <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No users found.</p>
            )}
          </ul>
        </div>
        <div className="container mx-auto">
          <AllPlans plans={plans} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
