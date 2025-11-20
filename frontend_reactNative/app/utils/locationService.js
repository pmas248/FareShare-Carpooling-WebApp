import axios from 'axios';
import { MAPBOX_API_KEY } from '@env'; // Ensure you have the correct environment variable set up

export const fetchPlaceSuggestions = async (query) => {
  if (!query) return [];
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
      {
        params: {
          access_token: MAPBOX_API_KEY,
          autocomplete: true,
          country:'NZ',
          limit: 5,
        },
      }
    );
    return response.data.features.map(item => ({
      name: item.place_name,
      coordinates: item.geometry.coordinates, // [lng, lat]
    }));
  } catch (error) {
    console.error('Mapbox fetch error:', error);
    return [];
  }
};

