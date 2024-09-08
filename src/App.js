import { useEffect, useState } from 'react';
import './App.css';
import City from './components/cities'; // Assume this component is set up to handle a list of cities
import Weather from './components/weather';

function App() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100');
        const data = await response.json();
        setCities(data.results); // Adjust based on actual response structure
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {cities.length > 0 ? (
        <City cities={cities} />
      ) : (
        <Weather />
      )}
    </div>
  );
}

export default App;
