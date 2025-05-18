import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading trips data
    const loadTrips = async () => {
      try {
        // In a real app, this would fetch from an API
        setTimeout(() => {
          setTrips([
            {
              id: 'trip-1',
              destination: 'Paris, France',
              startDate: '2025-06-15',
              endDate: '2025-06-22',
              image: 'https://example.com/paris.jpg',
              status: 'upcoming'
            },
            {
              id: 'trip-2',
              destination: 'Tokyo, Japan',
              startDate: '2025-08-10',
              endDate: '2025-08-20',
              image: 'https://example.com/tokyo.jpg',
              status: 'upcoming'
            },
            {
              id: 'trip-3',
              destination: 'Rome, Italy',
              startDate: '2024-11-05',
              endDate: '2024-11-12',
              image: 'https://example.com/rome.jpg',
              status: 'past'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoading(false);
      }
    };
    
    loadTrips();
  }, []);
  
  const groupedTrips = {
    upcoming: trips.filter(trip => trip.status === 'upcoming'),
    past: trips.filter(trip => trip.status === 'past')
  };
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your trips...</p>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1>My Trips</h1>
          <p className="lead">View and manage all your travel plans.</p>
        </div>
        <div className="col-auto">
          <Link to="/plan" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>Plan New Trip
          </Link>
        </div>
      </div>
      
      <div className="card mb-5">
        <div className="card-body">
          <h2 className="mb-4">Upcoming Trips</h2>
          
          {groupedTrips.upcoming.length > 0 ? (
            <div className="row">
              {groupedTrips.upcoming.map(trip => (
                <div className="col-md-4 mb-4" key={trip.id}>
                  <div className="card h-100">
                    <div className="card-img-top bg-light text-center py-4">
                      <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{trip.destination}</h5>
                      <p className="card-text">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                      <div className="d-flex gap-2">
                        <Link to={`/trip/${trip.id}`} className="btn btn-outline-primary btn-sm">
                          View Details
                        </Link>
                        <button className="btn btn-outline-secondary btn-sm">
                          <i className="bi bi-pencil"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="mb-3">You have no upcoming trips.</p>
              <Link to="/plan" className="btn btn-primary">Plan Your First Trip</Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="card">
        <div className="card-body">
          <h2 className="mb-4">Past Trips</h2>
          
          {groupedTrips.past.length > 0 ? (
            <div className="row">
              {groupedTrips.past.map(trip => (
                <div className="col-md-4 mb-4" key={trip.id}>
                  <div className="card h-100">
                    <div className="card-img-top bg-light text-center py-4">
                      <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{trip.destination}</h5>
                      <p className="card-text">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                      <div className="d-flex gap-2">
                        <Link to={`/trip/${trip.id}`} className="btn btn-outline-primary btn-sm">
                          View Details
                        </Link>
                        <button className="btn btn-outline-secondary btn-sm">
                          <i className="bi bi-star"></i> Rate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p>You have no past trips.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTripsPage;