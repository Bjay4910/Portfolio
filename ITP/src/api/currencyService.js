export const getExchangeRate = async (baseCurrency, targetCurrency) => {
    try {
      // In a real implementation, this would call a currency exchange API
      console.log(`Getting exchange rate from ${baseCurrency} to ${targetCurrency}`);
      
      // Simulate API response
      const rates = {
        'USD-EUR': 0.92,
        'USD-GBP': 0.79,
        'USD-JPY': 110.45,
        'USD-CAD': 1.35,
        'EUR-USD': 1.09,
        'EUR-GBP': 0.86,
        'EUR-JPY': 120.12,
        'EUR-CAD': 1.47,
        'GBP-USD': 1.26,
        'GBP-EUR': 1.16,
        'GBP-JPY': 140.02,
        'GBP-CAD': 1.71,
      };
      
      const key = `${baseCurrency}-${targetCurrency}`;
      
      return await new Promise((resolve, reject) => 
        setTimeout(() => {
          if (rates[key]) {
            resolve({
              success: true,
              data: {
                rate: rates[key],
                lastUpdated: new Date().toISOString()
              }
            });
          } else {
            reject({ success: false, error: 'Exchange rate not available' });
          }
        }, 700)
      );
    } catch (error) {
      console.error('Currency API error:', error);
      return { success: false, error: 'Failed to fetch exchange rate' };
    }
  };