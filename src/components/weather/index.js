import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PacmanLoader from 'react-spinners/PacmanLoader';
import './index.css';

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/';
const WEATHER_API_KEY = '9418e8ba8d21575fecb6a832addbb3dd';

const Weather = () => {
  const location = useLocation();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return params.get('city_name');
  };

  const getBackgroundColor = (description) => {
    switch (description.toLowerCase()) {
      case 'clear sky':
        return '#87CEFA'; 
      case 'few clouds':
      case 'scattered clouds':
        return '#757578'; 
      case 'broken clouds':
        return '#708090'; 
      case 'overcast clouds':
        return '#9b9bd4'; 
      case 'light rain':
        return '#4682B4';
      case 'moderate rain':
        return '#4169E1';
      case 'heavy rain':
        return '#1E90FF';
      case 'drizzle':
        return '#00CED1';
      case 'showers':
        return '#20B2AA';
      case 'snow':
        return '#ADD8E6';
      case 'thunderstorm':
        return '#4B0082';
      case 'fog':
        return '#B0B0B0';
      case 'haze':
        return '#F5F5DC';
      case 'wind':
        return '#C0C0C0';
      default:
        return '#D3D3D3';
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      const cityName = getQueryParams() || '';

      try {
        if (cityName) {
          const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(`${WEATHER_API_URL}/weather?q=${cityName}&appid=${WEATHER_API_KEY}&units=metric`),
            fetch(`${WEATHER_API_URL}/forecast?q=${cityName}&appid=${WEATHER_API_KEY}&units=metric`),
          ]);

          if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error(`${cityName} city not found`);
          }

          const weatherData = await weatherResponse.json();
          const forecastData = await forecastResponse.json();
          setWeatherData(weatherData);
          setForecastData(forecastData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) return (
    <div className="spinner-container">
      <PacmanLoader color="#3498db" loading={loading} size={50} />
    </div>
  );
  if (error) return <p>Error: {error}</p>;
  if (!weatherData) return <p>No data available</p>;

  const todayDate = getTodayDate();
  const uniqueDays = new Set();
  const filteredForecastData = forecastData.list.filter(forecast => {
    const forecastDate = new Date(forecast.dt * 1000).toISOString().split('T')[0];
    if (forecastDate !== todayDate && !uniqueDays.has(forecastDate)) {
      uniqueDays.add(forecastDate);
      return true;
    }
    return false;
  }).slice(0, 5);

  return (
    <div className="weather-background">
      <div className="weather-container">
        <div className="weather-data">
          <h1>Current Weather</h1>
          <div className="weather-info" style={{ backgroundColor: getBackgroundColor(weatherData.weather[0]?.description || '') }}>
            <div className="info-list">
              <div className="info-item">
                <span className="heading">Name:</span>
                <span className="value">{weatherData.name || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="heading">Temperature:</span>
                <span className="value">{weatherData.main.temp ? `${weatherData.main.temp.toFixed(1)}°C` : 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="heading">Description:</span>
                <span className="value">{weatherData.weather[0]?.description || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="heading">Wind Speed:</span>
                <span className="value">{`${weatherData.wind?.speed} m/s` || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="heading">Humidity:</span>
                <span className="value">{`${weatherData.main?.humidity}%` || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="heading">Pressure:</span>
                <span className="value">{`${weatherData.main?.pressure} hPa` || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="forecast-container">
          <h1>Weather Forecast for the Next 5 Days</h1>
          <div className="forecast-data">
            {filteredForecastData.map(forecast => (
              <div
                key={forecast.dt}
                className="forecast-day"
                style={{ backgroundColor: getBackgroundColor(forecast.weather[0]?.description || '') }}
              >
                <div className="info-list">
                  <div className="info-item">
                    <span className="heading">Date:</span>
                    <span className="value">{new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  </div>
                  <div className="info-item">
                    <span className="heading">Description:</span>
                    <span className="value">{forecast.weather[0]?.description || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="heading">Temperature:</span>
                    <span className="value">{`${forecast.main.temp.toFixed(1)}°C` || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="heading">Precipitation Chances:</span>
                    <span className="value">{`${forecast.pop.toFixed(2) * 100}%` || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;

