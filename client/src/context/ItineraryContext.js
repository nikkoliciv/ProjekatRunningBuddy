import { createContext, useReducer } from "react";

export const ItineraryContext = createContext();

const sortItineraryByTime = (itinerary) => {
  return itinerary.slice().sort((a, b) => new Date(b.time) - new Date(a.time));
};

export const itineraryReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ITINERARY':
      return {
        itinerary: sortItineraryByTime(action.payload)
      };
    case 'ADD_PLAN_TO_ITINERARY':
      const newItineraryWithAddedPlan = [action.payload, ...state.itinerary];
      return {
        itinerary: sortItineraryByTime(newItineraryWithAddedPlan)
      };
    case 'REMOVE_PLAN_FROM_ITINERARY':
      const newItineraryWithRemovedPlan = state.itinerary.filter(plan => plan.id !== action.payload.id);
      return {
        itinerary: sortItineraryByTime(newItineraryWithRemovedPlan)
      };
    default:
      return state;
  }
};

export const ItineraryContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(itineraryReducer, {
    itinerary: []
  });

  return (
    <ItineraryContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ItineraryContext.Provider>
  );
};
