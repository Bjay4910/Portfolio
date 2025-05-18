export const getWeatherForecast = async (location, days = 7) => {
    try {
      // In a real implementation, this would call the OpenWeather API
      console.log(`Getting weather forecast for ${location}`);
      
      // Simulate API response
      return await new Promise(resolve => 
        setTimeout(() => resolve({
          success: true,
          data: {
            location: location,
            forecast: [
              { date: '2025-05-19', temp: 72, condition: 'Sunny', humidity: 45, wind: 8 },
              { date: '2025-05-20', temp: 70, condition: 'Partly Cloudy', humidity: 50, wind: 10 },
              { date: '2025-05-21', temp: 68, condition: 'Cloudy', humidity: 55, wind: 12 },
              { date: '2025-05-22', temp: 65, condition: 'Rain', humidity: 65, wind: 15 },
              { date: '2025-05-23', temp: 69, condition: 'Partly Cloudy', humidity: 60, wind: 11 },
              { date: '2025-05-24', temp: 74, condition: 'Sunny', humidity: 45, wind: 8 },
              { date: '2025-05-25', temp: 76, condition: 'Sunny', humidity: 40, wind: 6 },
            ]
          }
        }), 900)
      );
    } catch (error) {
      console.error('Weather API error:', error);
      return { success: false, error: 'Failed to fetch weather forecast' };
    }
  };