import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import PlanCard from '../components/PlanCard'; 

const Profile = () => {
  //const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [itineraryPlans, setItineraryPlans] = useState([]);
  const [pastPlans, setPastPlans] = useState([]);
  const [totalLength, setTotalLength] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const fetchUserDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/api/user/${userId}`, {
              headers: { authorization: token }
            });
            //setUser(response.data);
            setName(response.data.name);
            setEmail(response.data.email);
            const sortedPlans = response.data.Itinerary.plans.sort((a, b) => new Date(b.time) - new Date(a.time));
            setItineraryPlans(sortedPlans);
            setItineraryPlans(response.data.Itinerary.plans); 
          } catch (error) {
            console.error('Failed to fetch user details or itinerary:', error);
          }
        };

        fetchUserDetails();
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const filteredPastPlans = itineraryPlans.filter(plan => new Date(plan.time) < now);

    // total length
    const total = filteredPastPlans.reduce((sum, plan) => sum + (plan.length || 0), 0);
    setPastPlans(filteredPastPlans);
    setTotalLength(total);
  }, [itineraryPlans]);

  // export CSV
  const generateCSV = () => {
    const headers = ['Time', 'Length', 'Place'];
    
    const csvRows = [
      headers.join(','),
      ...pastPlans.map(plan => [
        plan.time,
        plan.length,
        plan.place
      ].join(','))
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'past-plans.csv';
    a.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-green-50 p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-6">Profile</h1>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Profile Details</h2>
            <p className="text-lg"><strong>Name:</strong> {name}</p>
            <p className="text-lg"><strong>Email:</strong> {email}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Past Plans</h2>
            {pastPlans.length > 0 ? (
              <>
                <div className="space-y-4 mb-4">
                  {pastPlans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
                <p className="text-lg font-semibold mb-4"><strong>Total Length:</strong> {totalLength} km</p>
                <button 
                  onClick={generateCSV} 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Export as CSV
                </button>
              </>
            ) : (
              <p className="text-gray-600">No past plans available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
