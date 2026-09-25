import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { PlansContextProvider } from './context/PlansContext';
import { ItineraryContextProvider } from './context/ItineraryContext';
import { CommentContextProvider } from './context/CommentContext';
import 'leaflet/dist/leaflet.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* da mozemo da se navodimo po stranicama */}
    <BrowserRouter>
    {/* auth provider */}
    <AuthProvider>
      {/* plans provider */}
      <PlansContextProvider>
        {/* itinerary provider */}
        <ItineraryContextProvider>
          {/* comment provider */}
          <CommentContextProvider>
            <App />
          </CommentContextProvider>
      
      </ItineraryContextProvider>
      </PlansContextProvider>
      </AuthProvider>
</BrowserRouter>
  </React.StrictMode>
  
);


