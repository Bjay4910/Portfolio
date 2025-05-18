import React, { useState, useEffect } from 'react';
import { searchFlights } from '../api/flightService';
import { getWeatherForecast } from '../api/weatherService';
import { getAttractions, getRestaurants } from '../api/tripAdvisorService';
import { getExchangeRate } from '../api/currencyService';
import { optimizeItinerary } from '../utils/itineraryOptimizer';

const PlanTripPage = () => {
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('medium');
  const [interests, setInterests] = useState([]);
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [currency, setCurrency] = useState('USD');
  
  const [availableInterests] = useState([
    'Art & Culture', 'Food & Dining', 'History', 'Nature & Outdoors', 
    'Shopping', 'Beaches', 'Museums', 'Adventure', 'Nightlife'
  ]);
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [itinerary, setItinerary] = useState(null);
  const [flights, setFlights] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  
  // Toggle interests selection
  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  // Fetch initial data for the destination
  const fetchDestinationData = async () => {
    try {
      setLoading(true);
      
      // Get weather forecast
      const weatherResponse = await getWeatherForecast(destination);
      if (weatherResponse.success) {
        setWeather(weatherResponse.data);
      }
      
      // Get top attractions
      const attractionsResponse = await getAttractions(destination);
      if (attractionsResponse.success) {
        setAttractions(attractionsResponse.data);
      }
      
      // Get exchange rate if not USD
      if (currency !== 'USD') {
        const rateResponse = await getExchangeRate('USD', currency);
        if (rateResponse.success) {
          setExchangeRate(rateResponse.data);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching destination data:', error);
      setLoading(false);
    }
  };
  
  // Fetch flights
  const fetchFlights = async () => {
    try {
      setLoading(true);
      
      const flightsResponse = await searchFlights(origin, destination, startDate, endDate);
      if (flightsResponse.success) {
        setFlights(flightsResponse.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setLoading(false);
    }
  };
  
  // Generate the optimized itinerary
  const generateItinerary = async () => {
    try {
      setLoading(true);
      
      const result = await optimizeItinerary(
        destination,
        startDate,
        endDate,
        {
          budget,
          activityLevel,
          interests
        }
      );
      
      if (result.success) {
        setItinerary(result.data);
        setStep(3); // Move to itinerary view
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setLoading(false);
    }
  };
  
  // When destination changes, fetch relevant data
  useEffect(() => {
    if (destination) {
      fetchDestinationData();
    }
  }, [destination, currency]);
  
  // When travel dates and origin/destination are set, fetch flights
  useEffect(() => {
    if (origin && destination && startDate && endDate) {
      fetchFlights();
    }
  }, [origin, destination, startDate, endDate]);
  
  // Render the destination and dates form (Step 1)
  const renderStep1 = () => (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">Where do you want to go?</h2>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="origin" className="form-label">Departure City</label>
              <input
                type="text"
                className="form-control"
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="New York, London, etc."
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="destination" className="form-label">Destination</label>
              <input
                type="text"
                className="form-control"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Paris, Tokyo, etc."
                required
              />
            </div>
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">Departure Date</label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">Return Date</label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="currency" className="form-label">Preferred Currency</label>
          <select
            className="form-select"
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>
        
        <div className="d-flex justify-content-end">
          <button 
            className="btn btn-primary" 
            onClick={() => setStep(2)}
            disabled={!origin || !destination || !startDate || !endDate}
          >
            Next: Preferences
          </button>
        </div>
      </div>
    </div>
  );
  
  // Render the preferences form (Step 2)
  const renderStep2 = () => (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">Tell us your preferences</h2>
        
        <div className="mb-4">
          <label className="form-label">Budget</label>
          <div className="d-flex flex-wrap gap-2">
            <div 
              className={`budget-option p-3 border rounded text-center cursor-pointer ${budget === 'budget' ? 'border-primary bg-primary bg-opacity-10' : ''}`}
              onClick={() => setBudget('budget')}
              style={{ cursor: 'pointer', flex: '1 0 30%' }}
            >
              <i className="bi bi-piggy-bank fs-3 d-block mb-2"></i>
              <span>Budget</span>
            </div>
            <div 
              className={`budget-option p-3 border rounded text-center ${budget === 'medium' ? 'border-primary bg-primary bg-opacity-10' : ''}`}
              onClick={() => setBudget('medium')}
              style={{ cursor: 'pointer', flex: '1 0 30%' }}
            >
              <i className="bi bi-wallet2 fs-3 d-block mb-2"></i>
              <span>Medium</span>
            </div>
            <div 
              className={`budget-option p-3 border rounded text-center ${budget === 'luxury' ? 'border-primary bg-primary bg-opacity-10' : ''}`}
              onClick={() => setBudget('luxury')}
              style={{ cursor: 'pointer', flex: '1 0 30%' }}
            >
              <i className="bi bi-gem fs-3 d-block mb-2"></i>
              <span>Luxury</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label">Activity Level</label>
          <div className="range">
            <input 
              type="range" 
              className="form-range" 
              min="1" 
              max="3" 
              step="1" 
              value={activityLevel === 'relaxed' ? 1 : activityLevel === 'moderate' ? 2 : 3}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setActivityLevel(val === 1 ? 'relaxed' : val === 2 ? 'moderate' : 'active');
              }}
            />
            <div className="d-flex justify-content-between">
              <span>Relaxed</span>
              <span>Moderate</span>
              <span>Active</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label">Interests (select all that apply)</label>
          <div className="d-flex flex-wrap gap-2">
            {availableInterests.map(interest => (
              <div 
                key={interest}
                className={`interest-badge p-2 border rounded ${interests.includes(interest) ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                onClick={() => toggleInterest(interest)}
                style={{ cursor: 'pointer' }}
              >
                {interest}
              </div>
            ))}
          </div>
        </div>
        
        <div className="d-flex justify-content-between">
          <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>
            Back
          </button>
          <button 
            className="btn btn-primary" 
            onClick={generateItinerary}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generating...
              </>
            ) : 'Generate Itinerary'}
          </button>
        </div>
      </div>
    </div>
  );
  
  // Render the itinerary view (Step 3)
  const renderStep3 = () => {
    if (!itinerary) return null;
    
    return (
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Your Personalized Itinerary</h2>
          
          <div className="mb-4">
            <h3 className="mb-3">Trip Details</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <strong>Destination:</strong> {itinerary.destination}
                </div>
                <div className="mb-3">
                  <strong>Dates:</strong> {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <strong>Budget:</strong> {itinerary.preferences.budget.charAt(0).toUpperCase() + itinerary.preferences.budget.slice(1)}
                </div>
                <div className="mb-3">
                  <strong>Activity Level:</strong> {itinerary.preferences.activityLevel.charAt(0).toUpperCase() + itinerary.preferences.activityLevel.slice(1)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="mb-3">Daily Plans</h3>
            
            <ul className="nav nav-tabs mb-3" id="itineraryTabs" role="tablist">
              {itinerary.dailyPlans.map((day, index) => (
                <li className="nav-item" role="presentation" key={day.date}>
                  <button 
                    className={`nav-link ${index === 0 ? 'active' : ''}`} 
                    id={`day${index}-tab`} 
                    data-bs-toggle="tab" 
                    data-bs-target={`#day${index}`} 
                    type="button" 
                    role="tab"
                  >
                    Day {index + 1}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="tab-content" id="itineraryTabContent">
              {itinerary.dailyPlans.map((day, index) => (
                <div 
                  className={`tab-pane fade ${index === 0 ? 'show active' : ''}`} 
                  id={`day${index}`} 
                  role="tabpanel" 
                  key={day.date}
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                        <div className="weather-badge d-flex align-items-center">
                          {day.weather.condition === 'Sunny' && <i className="bi bi-sun text-warning fs-4 me-2"></i>}
                          {day.weather.condition === 'Partly Cloudy' && <i className="bi bi-cloud-sun fs-4 me-2"></i>}
                          {day.weather.condition === 'Cloudy' && <i className="bi bi-cloud fs-4 me-2"></i>}
                          {day.weather.condition === 'Rain' && <i className="bi bi-cloud-rain fs-4 me-2"></i>}
                          <span>
                            {day.weather.condition}, {day.weather.temp}°F
                          </span>
                        </div>
                      </div>
                      
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        {day.notes}
                      </div>
                      
                      <div className="timeline">
                        <div className="timeline-item">
                          <div className="timeline-badge bg-primary">
                            <i className="bi bi-sunrise"></i>
                          </div>
                          <div className="timeline-content">
                            <h5>Morning</h5>
                            {day.morningActivity ? (
                              <div className="card">
                                <div className="card-body">
                                  <h6>{day.morningActivity.name}</h6>
                                  <p className="mb-1">{day.morningActivity.category}</p>
                                  <p className="mb-1">
                                    <i className="bi bi-star-fill text-warning me-1"></i>
                                    {day.morningActivity.rating} ({day.morningActivity.reviewCount} reviews)
                                  </p>
                                  <p className="mb-0">{day.morningActivity.address}</p>
                                </div>
                              </div>
                            ) : (
                              <p>Free time - no specific activity planned</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="timeline-item">
                          <div className="timeline-badge bg-primary">
                            <i className="bi bi-sun"></i>
                          </div>
                          <div className="timeline-content">
                            <h5>Afternoon</h5>
                            {day.afternoonActivity ? (
                              <div className="card">
                                <div className="card-body">
                                  <h6>{day.afternoonActivity.name}</h6>
                                  <p className="mb-1">{day.afternoonActivity.category}</p>
                                  <p className="mb-1">
                                    <i className="bi bi-star-fill text-warning me-1"></i>
                                    {day.afternoonActivity.rating} ({day.afternoonActivity.reviewCount} reviews)
                                  </p>
                                  <p className="mb-0">{day.afternoonActivity.address}</p>
                                </div>
                              </div>
                            ) : (
                              <p>Free time - no specific activity planned</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="timeline-item">
                          <div className="timeline-badge bg-primary">
                            <i className="bi bi-moon"></i>
                          </div>
                          <div className="timeline-content">
                            <h5>Evening</h5>
                            <div className="card">
                              <div className="card-body">
                                <h6>{day.eveningActivity.name}</h6>
                                <p className="mb-1">{day.eveningActivity.cuisine} Cuisine</p>
                                <p className="mb-1">
                                  <i className="bi bi-star-fill text-warning me-1"></i>
                                  {day.eveningActivity.rating} ({day.eveningActivity.reviewCount} reviews)
                                </p>
                                <p className="mb-1">Price: {day.eveningActivity.priceLevel}</p>
                                <p className="mb-0">{day.eveningActivity.address}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              {flights.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-3">Flight Options</h3>
                  <div className="list-group">
                    {flights.slice(0, 3).map(flight => (
                      <div key={flight.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{flight.airline}</h6>
                            <p className="mb-1">Flight {flight.flightNumber}</p>
                            <small className="text-muted">
                              {flight.departureTime} - {flight.arrivalTime} ({flight.duration})
                            </small>
                          </div>
                          <div className="text-end">
                            <div className="fs-5 fw-bold">${flight.price}</div>
                            <div><small>{flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</small></div>
                            <button className="btn btn-sm btn-outline-primary mt-2">Select</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="col-md-6">
              {weather && (
                <div className="mb-4">
                  <h3 className="mb-3">Weather Forecast</h3>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Condition</th>
                          <th>Temp</th>
                          <th>Humidity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weather.forecast.map((day, index) => (
                          <tr key={index}>
                            <td>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                            <td>
                              {day.condition === 'Sunny' && <i className="bi bi-sun text-warning me-2"></i>}
                              {day.condition === 'Partly Cloudy' && <i className="bi bi-cloud-sun me-2"></i>}
                              {day.condition === 'Cloudy' && <i className="bi bi-cloud me-2"></i>}
                              {day.condition === 'Rain' && <i className="bi bi-cloud-rain me-2"></i>}
                              {day.condition}
                            </td>
                            <td>{day.temp}°F</td>
                            <td>{day.humidity}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={() => setStep(2)}>
              Edit Preferences
            </button>
            <div>
              <button className="btn btn-outline-primary me-2">
                <i className="bi bi-download me-1"></i> Download Itinerary
              </button>
              <button className="btn btn-primary">
                <i className="bi bi-bookmark me-1"></i> Save Trip
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1>Plan Your Trip</h1>
          <p className="lead">Let us help you create the perfect travel itinerary.</p>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col">
          <div className="progress">
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${(step / 3) * 100}%` }}
              aria-valuenow={step} 
              aria-valuemin="0" 
              aria-valuemax="3"
            ></div>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <span className={step >= 1 ? 'fw-bold' : ''}>Destination</span>
            <span className={step >= 2 ? 'fw-bold' : ''}>Preferences</span>
            <span className={step >= 3 ? 'fw-bold' : ''}>Itinerary</span>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

export default PlanTripPage;