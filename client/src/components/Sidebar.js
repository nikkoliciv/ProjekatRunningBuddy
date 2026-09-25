import { useAuth } from '../context/AuthContext'; 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Sidebar = () => {
  const { logout } = useAuth(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    console.log('Token on load:', token); 

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; 

        
        const fetchUserDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/api/user/${userId}`, {
              headers: { authorization: token }
            });
            console.log('Fetched user details:', response.data);
            setUser(response.data); 
          } catch (error) {
            console.error('Failed to fetch user details:', error);
          }
        };

        fetchUserDetails();
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  return (
    <div className="bg-green-600 p-4 shadow-md min-h-screen flex flex-col space-y-4">
      <h5 className="text-white text-lg font-bold"><Link to='/dashboard' className="hover:text-gray-300">Dashboard</Link></h5>
      <h5 className="text-white text-lg font-bold"><Link to='/profile' className="hover:text-gray-300">Profile</Link></h5>
      {user && user.isAdmin && (
        <h5 className="text-white text-lg font-bold"><Link to='/admin' className="hover:text-gray-300">Admin Page</Link></h5> 
      )}
      <button 
        onClick={logout} 
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
