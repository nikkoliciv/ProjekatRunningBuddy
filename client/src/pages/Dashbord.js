import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import PlanForm from '../components/PlanForm';
import Itinerary from '../components/Itinerary';
import Plans from '../components/Plans';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        console.log('Token on load:', token); 

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId; // setovanje userId u odnosu na token

                const fetchUserDetails = async () => {
                    try {
                        const response = await axios.get(`http://localhost:4000/api/user/${userId}`, {
                            headers: { authorization: token }
                        });
                        setUser(response.data); 
                        console.log(response.data);
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
        <div className="flex">
            <Sidebar />
            <main className="flex-1 bg-green-50 p-6">
                <div className="container mx-auto">
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        <div className="flex flex-col gap-6">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold text-green-600 mb-4">Itinerary</h2>
                                <Itinerary user={user} />
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h2 className="text-2xl font-bold text-green-600 mb-4">Add New Plan</h2>
                                <PlanForm />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-green-600 mb-4">All Plans</h2>
                            <Plans user={user} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
