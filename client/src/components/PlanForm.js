import { useState } from 'react';
import { useItineraryContext } from '../hooks/ItineraryHooks';

const PlanForm = () => {
  // const placeOptions = ['Vracar', 'Palilula', 'Zvezdara', 'Rakovica', 'Novi Beograd', 'Savski venac'];

  const [place, setPlace] = useState('');
  const [time, setTime] = useState('');
  const [length, setLength] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const { dispatch } = useItineraryContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lengthFloat = parseFloat(length);

    // provera da li je forma dobro popunjena
    if (!place || !time || isNaN(lengthFloat) || lengthFloat <= 0) {
      setError('Please fill in all fields correctly.');
      setEmptyFields(['place', 'time', 'length']);
      return;
    }

    const run = { time, place, length: lengthFloat };
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const response = await fetch('http://localhost:4000/api/plan', {
          method: 'POST',
          body: JSON.stringify(run),
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        });

        const json = await response.json();
        
        const plan = json.plan;
        console.log('ovo je plan kreiran', plan)

        if (!response.ok) {
          setError(json.error);
          setEmptyFields(json.emptyFields);
        } else {
          setEmptyFields([]);
          setError(null);
          console.log('New plan added:', json);
          setTime('');
          setPlace('');
          setLength('');
          dispatch({ type: 'ADD_PLAN_TO_ITINERARY', payload: plan });
        }
      } catch (error) {
        console.error('Failed to create plan:', error);
      }
    }
  };

  return (
    <form className="create-form p-4 bg-white shadow-md rounded-lg" onSubmit={handleSubmit}>
      
      <label className="block mb-2">
        Place:
        {/* <select
          onChange={(e) => setPlace(e.target.value)}
          value={place}
          className={`block w-full mt-1 p-2 border rounded ${emptyFields.includes('place') ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select a place</option>
          {placeOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select> */}
        <input
  type="text"
  onChange={(e) => setPlace(e.target.value)}
  value={place}
  className={`block w-full mt-1 p-2 border rounded ${emptyFields.includes('place') ? 'border-red-500' : 'border-gray-300'}`}
  placeholder="Enter a place"
/>
      </label>

      <label className="block mb-2">
        Date and Time:
        <input
          type="datetime-local"
          onChange={(e) => setTime(e.target.value)}
          value={time}
          className={`block w-full mt-1 p-2 border rounded ${emptyFields.includes('time') ? 'border-red-500' : 'border-gray-300'}`}
        />
      </label>

      <label className="block mb-4">
        Length [km]:
        <input
          type="number"
          onChange={(e) => setLength(e.target.value)}
          value={length}
          className={`block w-full mt-1 p-2 border rounded ${emptyFields.includes('length') ? 'border-red-500' : 'border-gray-300'}`}
        />
      </label>

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add New Plan
      </button>

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </form>
  );
};

export default PlanForm;
