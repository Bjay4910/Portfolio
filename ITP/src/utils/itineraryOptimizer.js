import { getWeatherForecast } from '../api/weatherService';
import { getAttractions, getRestaurants } from '../api/tripAdvisorService';

export const optimizeItinerary = async (
  destination,
  startDate,
  endDate,
  preferences = { budget: 'medium', activityLevel: 'moderate', interests: [] }
) => {
  try {
    // Get weather data
    const weatherResponse = await getWeatherForecast(destination);
    if (!weatherResponse.success) throw new Error(weatherResponse.error);
    
    // Get attractions
    const attractionsResponse = await getAttractions(destination);
    if (!attractionsResponse.success) throw new Error(attractionsResponse.error);
    
    // Get restaurants
    const restaurantsResponse = await getRestaurants(destination);
    if (!restaurantsResponse.success) throw new Error(restaurantsResponse.error);
    
    // Calculate number of days for the trip
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    // Build daily itinerary based on weather and preferences
    const itinerary = [];
    
    for (let i = 0; i < daysDiff; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Match weather for this date
      const weatherDay = weatherResponse.data.forecast.find(day => day.date === dateString) || 
                         weatherResponse.data.forecast[i % weatherResponse.data.forecast.length];
      
      // Decide indoor/outdoor activities based on weather
      const isGoodWeather = ['Sunny', 'Partly Cloudy', 'Clear'].includes(weatherDay.condition);
      
      // Select attractions based on weather
      const dayAttractions = attractionsResponse.data
        .filter(attr => {
          if (isGoodWeather) return true; // Any attraction on good weather
          return ['Museum', 'Gallery', 'Shopping', 'Theater'].includes(attr.category); // Indoor on bad weather
        })
        .sort((a, b) => b.rating - a.rating) // Sort by rating
        .slice(0, 2); // Limit to 2 attractions per day
      
      // Select one restaurant for the day
      const dayRestaurant = restaurantsResponse.data
        .sort((a, b) => b.rating - a.rating)[i % restaurantsResponse.data.length];
      
      // Create day plan
      itinerary.push({
        date: dateString,
        weather: weatherDay,
        morningActivity: dayAttractions[0] || null,
        afternoonActivity: dayAttractions[1] || null,
        eveningActivity: dayRestaurant,
        notes: isGoodWeather 
          ? 'Great weather for outdoor activities!'
          : 'Indoor activities recommended due to weather conditions.'
      });
    }
    
    return {
      success: true,
      data: {
        destination,
        startDate,
        endDate,
        preferences,
        dailyPlans: itinerary
      }
    };
  } catch (error) {
    console.error('Itinerary optimization error:', error);
    return { success: false, error: 'Failed to optimize itinerary' };
  }
};