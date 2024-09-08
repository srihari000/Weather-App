import { useEffect, useState } from 'react';
import './App.css';
import City from './components/cities'; // Assume this component is set up to handle a list of cities
import Weather from './components/weather';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<City cities={cities} />} />
          <Route path="/weather" element={<Weather />} />
          <Route element={<h1>Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>

  );

}

export default App;
