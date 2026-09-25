import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import PlanCard from '../components/PlanCard'; 
import { usePlansContext } from '../hooks/PlansHooks';
import { useItineraryContext } from '../hooks/ItineraryHooks';

const Itinerary = ({ user }) => {
  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const { dispatch: plansDispatch } = usePlansContext();
  const { itinerary, dispatch: itineraryDispatch } = useItineraryContext();

  // itinerer korisnika koji je ulogovan
  useEffect(() => {
    if (token) {
      const fetchItinerary = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/user/${userId}`, {
            headers: { authorization: token }
          });
          itineraryDispatch({ type: 'SET_ITINERARY', payload: response.data.Itinerary.plans });
        } catch (error) {
          console.error('Failed to fetch itinerary:', error);
        }
      };

      fetchItinerary();
    }
  }, [token, userId, itineraryDispatch]);

  // brisanje plana
  const handleDelete = async (planId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/plan/${planId}`, {
        method: 'DELETE',
        headers: { authorization: token },
      });
      const json = await response.json();
      if (response.ok) {
        itineraryDispatch({ type: 'REMOVE_PLAN_FROM_ITINERARY', payload: json.plan });
      }
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  };

  // brisanje tudjeg plana iz itinerera
  const handleRemove = async (planId) => {
    try {
      const response = await fetch('http://localhost:4000/api/itinerary/delete', {
        method: 'DELETE',
        body: JSON.stringify({ planId }),
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      const json = await response.json();
      console.log(json)
      if (response.ok) {
        plansDispatch({ type: 'ADD_PLAN', payload: json.plan });

        itineraryDispatch({ type: 'REMOVE_PLAN_FROM_ITINERARY', payload: json.plan });
      }
    } catch (error) {
      console.error('Failed to remove plan:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row p-6 ">
        <div className="flex-1 md:mr-4">
          <div className="space-y-4">
            {user && itinerary.length > 0 ? (
              itinerary.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-green-50 p-4 rounded-lg flex items-center justify-between"
                >
                  <PlanCard plan={plan} />
                  <div className="flex items-center space-x-2">{
  new Date() < new Date(plan.time) && (
    plan.creatorId === userId ? (
      <button
        onClick={() => handleDelete(plan.id)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Delete
      </button>
    ) : (
      <button
        onClick={() => handleRemove(plan.id)}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        Remove
      </button>
    )
  )
}
                    
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No plans in your itinerary.</p>
            )}
          </div>
        </div>

        
      </div>
    </>
  );
};

export default Itinerary;
