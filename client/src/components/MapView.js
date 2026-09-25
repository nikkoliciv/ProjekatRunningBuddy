import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

const MapView = ({ plans }) => {
  //pocetna koordinata
  const position = useMemo(() => [44.8176, 20.4633], []);
  const [coordinates, setCoordinates] = useState({});
  const [loading, setLoading] = useState(true);

  //strani api
  const fetchCoordinates = useCallback(async (place) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: place,
          format: 'json',
          addressdetails: 1,
          limit: 1
        }
      });

      if (response.data.length > 0) {
        const location = response.data[0];
        return { lat: parseFloat(location.lat), lon: parseFloat(location.lon) };
      } else {
        return { lat: position[0], lon: position[1] }; 
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return { lat: position[0], lon: position[1] }; 
    }
  }, [position]);

  useEffect(() => {
    const updateCoordinates = async () => {
      const coords = {};
      for (const plan of plans) {
        const { lat, lon } = await fetchCoordinates(plan.place);
        coords[plan.id] = { lat, lon };
      }
      setCoordinates(coords);
      setLoading(false); 
    };

    updateCoordinates();
  }, [plans, fetchCoordinates]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {plans.map(plan => {
        const coord = coordinates[plan.id] || { lat: position[0], lon: position[1] };

        return (
          <Marker
            key={plan.id}
            position={[coord.lat, coord.lon]} 
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              {plan.place}<br />
              {new Date(plan.time).toLocaleString()}<br />
              {plan.length} km<br />
              {plan.creator.name}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
