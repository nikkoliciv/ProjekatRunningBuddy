import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import PlanCard from '../components/PlanCard';
import { useItineraryContext } from '../hooks/ItineraryHooks';
import { usePlansContext } from '../hooks/PlansHooks';
import MapView from '../components/MapView';

const Plans = ({ user }) => {
  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const [filteredPlans, setFilteredPlans] = useState([]);
  const { dispatch: itineraryDispatch } = useItineraryContext();
  const { plans: allPlans, dispatch: plansDispatch } = usePlansContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [plansPerPage] = useState(4);
  const [placeFilter, setPlaceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [distanceFilter, setDistanceFilter] = useState('');

  useEffect(() => {
    const fetchAllPlans = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/plan', {
          headers: { authorization: token },
        });

        const itineraryResponse = await axios.get(`http://localhost:4000/api/user/${userId}`, {
          headers: { authorization: token },
        });

        if (Array.isArray(response.data) && Array.isArray(itineraryResponse.data.Itinerary.plans)) {
          const itineraryPlanIds = itineraryResponse.data.Itinerary.plans.map(plan => plan.id);

          const plans = response.data.filter(plan => 
            plan.creatorId !== userId && 
            new Date() < new Date(plan.time) &&
            !itineraryPlanIds.includes(plan.id)
          );

          plansDispatch({ type: 'SET_PLAN', payload: plans });
          setFilteredPlans(plans);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      }
    };

    fetchAllPlans();
  }, [token, userId, plansDispatch]);

  useEffect(() => {
    let filtered = allPlans.filter(plan => 
      plan.place.toLowerCase().includes(placeFilter.toLowerCase())
    );

    if (distanceFilter === 'over24km') {
      filtered = filtered.filter(plan => plan.length > 24);
    } else if (distanceFilter === 'under24km') {
      filtered = filtered.filter(plan => plan.length <= 24);
    }

    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredPlans(filtered);
    setCurrentPage(1);
  }, [placeFilter, sortOrder, distanceFilter, allPlans]);

  const handleAddToItinerary = async (planId) => {
    try {
      const response = await fetch('http://localhost:4000/api/itinerary/add', {
        method: 'POST',
        body: JSON.stringify({ planId }),
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });

      const json = await response.json();
      const plan = json.plan;

      if (response.ok) {
        itineraryDispatch({ type: 'ADD_PLAN_TO_ITINERARY', payload: plan });
        plansDispatch({ type: 'DELETE_PLAN', payload: plan });
      }
    } catch (error) {
      console.error('Failed to add plan to itinerary:', error);
    }
  };

  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstPlan, indexOfLastPlan);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredPlans.length / plansPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <main className="bg-green-50 p-6 w-full max-w-4xl">
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search by place"
            value={placeFilter}
            onChange={(e) => setPlaceFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3"
          />

          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3"
          >
            <option value="">Sort by date</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <select
            onChange={(e) => setDistanceFilter(e.target.value)}
            value={distanceFilter}
            className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3"
          >
            <option value="">Filter by distance</option>
            <option value="over24km">Over 24km</option>
            <option value="under24km">Under 24km</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userId ? (
            <>
              {currentPlans.length > 0 ? (
                currentPlans.map((plan) => (
                  <div key={plan.id} className="bg-white p-4 rounded-lg shadow-md">
                    <PlanCard plan={plan} />
                    <button
                      onClick={() => handleAddToItinerary(plan.id)}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Add to Itinerary
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No plans available.</p>
              )}
            </>
          ) : (
            <p className="text-gray-600">User data is missing.</p>
          )}
        </div>

        <div className="flex justify-center mt-6 w-full max-w-4xl">
          <div className="flex gap-4 items-center w-4/5">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Previous
            </button>
            <span className="text-lg">Page {currentPage} of {Math.ceil(filteredPlans.length / plansPerPage)}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(filteredPlans.length / plansPerPage)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Next
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-4">Map View</h2>
        <MapView plans={filteredPlans} />
      </main>
    </div>
  );
};

export default Plans;
