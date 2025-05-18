import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getWeatherForecast } from '../api/weatherService';

const DashboardPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate loading data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data - in a real app, this would be fetched from an API
        setUpcomingTrips([
          {
            id: 'trip-1',
            destination: 'Paris, France',
            startDate: '2025-06-15',
            endDate: '2025-06-22',
            image: 'https://example.com/paris.jpg'
          },
          {
            id: 'trip-2',
            destination: 'Tokyo, Japan',
            startDate: '2025-08-10',
            endDate: '2025-08-20',
            image: 'https://example.com/tokyo.jpg'
          }
        ]);
        
        setSavedDestinations([
          {
            id: 'dest-1',
            name: 'Barcelona, Spain',
            image: 'https://example.com/barcelona.jpg'
          },
          {
            id: 'dest-2',
            name: 'New York City, USA',
            image: 'https://example.com/newyork.jpg'
          },
          {
            id: 'dest-3',
            name: 'Bali, Indonesia',
            image: 'https://example.com/bali.jpg'
          }
        ]);
        
        // Get weather for next upcoming trip
        const weather = await getWeatherForecast('Paris, France');
        setWeatherData(weather.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1>Welcome, {currentUser.name}!</h1>
          <p className="lead">Your travel dashboard shows upcoming trips and saved destinations.</p>
        </div>
      </div>
      
      <div className="row mb-5">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Upcoming Trips</h2>
                <Link to="/plan" className="btn btn-primary">Plan New Trip</Link>
              </div>
              
              {upcomingTrips.length > 0 ? (
                <div className="row">
                  {upcomingTrips.map(trip => (
                    <div className="col-md-6 mb-4" key={trip.id}>
                      <div className="card h-100">
                        <div className="card-img-top bg-light text-center py-4">
                          <i className="bi bi-image text-muted" style={{ fontSize: '5rem' }}></i>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">{trip.destination}</h5>
                          <p className="card-text">
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </p>
                          <Link to={`/trip/${trip.id}`} className="btn btn-outline-primary btn-sm">View Itinerary</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-3">You have no upcoming trips planned.</p>
                  <Link to="/plan" className="btn btn-primary">Plan Your First Trip</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">Quick Actions</h3>
              <div className="list-group">
                <Link to="/plan" className="list-group-item list-group-item-action">
                  <i className="bi bi-plus-circle me-2"></i> Plan New Trip
                </Link>
                <Link to="/my-trips" className="list-group-item list-group-item-action">
                  <i className="bi bi-briefcase me-2"></i> View All Trips
                </Link>
                <Link to="/saved" className="list-group-item list-group-item-action">
                  <i className="bi bi-bookmark me-2"></i> Saved Destinations
                </Link>
                <Link to="/profile" className="list-group-item list-group-item-action">
                  <i className="bi bi-person me-2"></i> Edit Profile
                </Link>
              </div>
            </div>
          </div>
          
          {weatherData && (
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Weather Forecast</h3>
                <h6 className="card-subtitle mb-3 text-muted">{weatherData.location}</h6>
                <div className="row">
                  {weatherData.forecast.slice(0, 3).map((day, index) => (
                    <div className="col-4 text-center" key={index}>
                      <div className="mb-2">
                        {day.condition === 'Sunny' && <i className="bi bi-sun text-warning fs-4"></i>}
                        {day.condition === 'Partly Cloudy' && <i className="bi bi-cloud-sun fs-4"></i>}
                        {day.condition === 'Cloudy' && <i className="bi bi-cloud fs-4"></i>}
                        {day.condition === 'Rain' && <i className="bi bi-cloud-rain fs-4"></i>}
                      </div>
                      <div className="small">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      <div className="fw-bold">{day.temp}°F</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Saved Destinations</h2>
                <Link to="/saved" className="btn btn-outline-primary">View All</Link>
              </div>
              
              <div className="row">
                {savedDestinations.map(destination => (
                  <div className="col-md-4 mb-4" key={destination.id}>
                    <div className="card h-100">
                      <div className="card-img-top bg-light text-center py-4">
                        <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{destination.name}</h5>
                        <div className="mt-auto">
                          <Link to={`/plan?destination=${encodeURIComponent(destination.name)}`} className="btn btn-primary btn-sm">
                            Plan Trip
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;