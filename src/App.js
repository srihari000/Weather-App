import { useEffect, useState } from 'react';
import './App.css';
import City from './components/cities'; // Assume this component is set up to handle a list of cities
import Weather from './components/weather';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [cities, setCities] = useState([]);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        if (offset < 9900) {
          const response = await fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&offset=${offset}`);
          const data = await response.json();
          setCities(prevCities => [...prevCities, ...data.results]); // Adjust based on actual response structure
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, [offset]);

  const handleOffsetChange = (newOffset) => {
    setOffset(newOffset);
    // Here you can also fetch the new data based on the updated offset
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<City cities={cities} handleOffsetChange={handleOffsetChange} />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="*" element={<h1 style={{color: 'red'}}>Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>

  );

}

export default App;
