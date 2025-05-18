import React from 'react';
import { Link } from 'react-router-dom';

const DocumentationPage = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Documentation</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2>Getting Started</h2>
          <p>Welcome to the Intelligent Travel Planner documentation. This guide will help you make the most of our platform's features.</p>
          
          <h3>Creating an Account</h3>
          <p>To use all features of the Intelligent Travel Planner, you'll need to create an account:</p>
          <ol>
            <li>Click on "Sign Up" in the navigation bar</li>
            <li>Fill in your name, email address, and create a password</li>
            <li>Click "Sign Up" to create your account</li>
          </ol>
          
          <h3>Logging In</h3>
          <p>If you already have an account, you can log in using your email and password.</p>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2>Planning a Trip</h2>
          
          <h3>Creating a New Trip</h3>
          <p>To create a new trip:</p>
          <ol>
            <li>Navigate to the "Plan Trip" page</li>
            <li>Enter your destination, travel dates, and preferences</li>
            <li>Click "Generate Itinerary" to create your personalized travel plan</li>
          </ol>
          
          <h3>Customizing Your Itinerary</h3>
          <p>After generating an itinerary, you can customize it by:</p>
          <ul>
            <li>Adding or removing attractions</li>
            <li>Adjusting activity times</li>
            <li>Changing restaurant selections</li>
            <li>Adding personal notes</li>
          </ul>
          
          <h3>Saving and Sharing</h3>
          <p>You can save your itinerary for later access or share it with travel companions.</p>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2>API Integrations</h2>
          <p>The Intelligent Travel Planner uses several external APIs to provide you with the best travel recommendations:</p>
          
          <h3>Google Maps</h3>
          <p>Used for location information, directions, and place details.</p>
          
          <h3>Flight Data</h3>
          <p>We integrate with Skyscanner/Amadeus to provide flight options and pricing.</p>
          
          <h3>Weather Forecast</h3>
          <p>OpenWeather API provides accurate weather predictions for your travel dates.</p>
          
          <h3>Attractions and Reviews</h3>
          <p>TripAdvisor API supplies information about attractions, restaurants, and user reviews.</p>
          
          <h3>Currency Exchange</h3>
          <p>Real-time currency conversion rates help you budget for international travel.</p>
        </div>
      </div>
      
      <div className="card">
        <div className="card-body">
          <h2>FAQ</h2>
          
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h3 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  Is the Intelligent Travel Planner free to use?
                </button>
              </h3>
              <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  We offer a free basic plan with limited features. Premium plans are available for more comprehensive planning options.
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h3 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  Can I book flights and hotels directly through the app?
                </button>
              </h3>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Currently, we provide booking links to our partner websites. Direct booking functionality will be available in a future update.
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h3 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  How accurate are the weather forecasts?
                </button>
              </h3>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  We use industry-leading weather data providers. Long-range forecasts (beyond 7 days) are estimates and may change as your travel dates approach.
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h3 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                  Can I use the planner for multiple destinations?
                </button>
              </h3>
              <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Yes! You can create multi-destination itineraries by planning each destination separately and then merging them into a master itinerary.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;