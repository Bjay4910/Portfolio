import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <section className="hero bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4">Plan Your Perfect Trip</h1>
              <p className="lead">Our AI-powered travel planner optimizes your itinerary based on weather, flight prices, local attractions, and your budget.</p>
              <Link to="/signup" className="btn btn-light btn-lg mt-3">Get Started</Link>
            </div>
            <div className="col-md-6">
              <img src={process.env.PUBLIC_URL + "/images/travel-illustration.svg"} alt="Travel Planning" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="features py-5">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose Our Travel Planner?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-cloud-sun fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Weather-Optimized Itineraries</h5>
                  <p className="card-text">Plan activities based on accurate weather forecasts for your travel dates.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-wallet2 fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Budget-Friendly Options</h5>
                  <p className="card-text">Find the best deals on flights, accommodations, and activities.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-map fs-1 text-primary mb-3"></i>
                  <h5 className="card-title">Personalized Recommendations</h5>
                  <p className="card-text">Get suggestions tailored to your interests and preferences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="how-it-works py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row">
            <div className="col-md-3 text-center mb-4">
              <div className="step-circle">1</div>
              <h5 className="mt-3">Enter Destination</h5>
              <p>Tell us where you want to go and when.</p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="step-circle">2</div>
              <h5 className="mt-3">Set Preferences</h5>
              <p>Share your budget, interests, and activity level.</p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="step-circle">3</div>
              <h5 className="mt-3">Generate Itinerary</h5>
              <p>Our AI creates an optimized travel plan.</p>
            </div>
            <div className="col-md-3 text-center mb-4">
              <div className="step-circle">4</div>
              <h5 className="mt-3">Enjoy Your Trip</h5>
              <p>Access your itinerary anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>
      
      
      <section className="cta py-5 bg-primary text-white text-center">
        <div className="container">
          <h2 className="mb-4">Ready to Plan Your Dream Vacation?</h2>
          <p className="lead mb-4">Sign up today and start creating personalized travel itineraries in minutes!</p>
          <Link to="/signup" className="btn btn-light btn-lg">Get Started for Free</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;