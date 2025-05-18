export const getAttractions = async (location) => {
    try {
      // In a real implementation, this would call the TripAdvisor API
      console.log(`Getting attractions in ${location}`);
      
      // Simulate API response
      return await new Promise(resolve => 
        setTimeout(() => resolve({
          success: true,
          data: [
            { 
              id: 'attr-1', 
              name: 'Central Park', 
              category: 'Park', 
              rating: 4.8, 
              reviewCount: 32450,
              image: 'https://example.com/central-park.jpg',
              description: 'A beautiful urban park in the heart of the city.',
              priceLevel: '$',
              address: 'Central Park, New York, NY'
            },
            { 
              id: 'attr-2', 
              name: 'Metropolitan Museum of Art', 
              category: 'Museum', 
              rating: 4.9, 
              reviewCount: 28670,
              image: 'https://example.com/met-museum.jpg',
              description: 'One of the world\'s largest and finest art museums.',
              priceLevel: '$$$',
              address: '1000 5th Ave, New York, NY'
            },
            { 
              id: 'attr-3', 
              name: 'Empire State Building', 
              category: 'Landmark', 
              rating: 4.7, 
              reviewCount: 45980,
              image: 'https://example.com/empire-state.jpg',
              description: 'Iconic skyscraper offering panoramic views of the city.',
              priceLevel: '$$$$',
              address: '20 W 34th St, New York, NY'
            },
          ]
        }), 1200)
      );
    } catch (error) {
      console.error('TripAdvisor API error:', error);
      return { success: false, error: 'Failed to fetch attractions' };
    }
  };
  
  export const getRestaurants = async (location, cuisine = null) => {
    try {
      // In a real implementation, this would call the TripAdvisor API
      console.log(`Getting restaurants in ${location}${cuisine ? ` for ${cuisine} cuisine` : ''}`);
      
      // Simulate API response
      return await new Promise(resolve => 
        setTimeout(() => resolve({
          success: true,
          data: [
            { 
              id: 'rest-1', 
              name: 'Gourmet Delight', 
              cuisine: 'Italian', 
              rating: 4.6, 
              reviewCount: 1250,
              image: 'https://example.com/gourmet-delight.jpg',
              priceLevel: '$$$',
              address: '123 Restaurant Row, New York, NY'
            },
            { 
              id: 'rest-2', 
              name: 'Sushi Express', 
              cuisine: 'Japanese', 
              rating: 4.7, 
              reviewCount: 980,
              image: 'https://example.com/sushi-express.jpg',
              priceLevel: '$$',
              address: '456 Food Ave, New York, NY'
            },
            { 
              id: 'rest-3', 
              name: 'Taco Palace', 
              cuisine: 'Mexican', 
              rating: 4.5, 
              reviewCount: 1480,
              image: 'https://example.com/taco-palace.jpg',
              priceLevel: '$$',
              address: '789 Cuisine Blvd, New York, NY'
            },
          ]
        }), 1100)
      );
    } catch (error) {
      console.error('TripAdvisor API error:', error);
      return { success: false, error: 'Failed to fetch restaurants' };
    }
  };