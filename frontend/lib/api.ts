import { useState } from 'react';

interface Restaurant {
  id: string;
  name: string;
  image_url: string;
  url: string;
  review_count: number;
  rating: number;
  price?: string;
  categories: string[];
  address: string;
  city: string;
  zip_code: string;
  phone: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

interface RestaurantResponse {
  restaurants: Restaurant[];
  total: number;
}

// API URL - local for now
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Searches for restaurants by location using the backend API
 */
export async function searchRestaurants(
  location: string,
  options: {
    term?: string;
    limit?: number;
    offset?: number;
    sort_by?: string;
    price?: string;
    categories?: string;
    open_now?: boolean;
  } = {}
): Promise<RestaurantResponse> {
  const queryParams = new URLSearchParams({
    location,
    ...options
  });

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants?${queryParams}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch restaurants');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
}

/**
 * A hook to handle restaurant search state
 */
export function useRestaurantSearch() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchByLocation = async (location: string, options = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await searchRestaurants(location, options);
      setRestaurants(data.restaurants);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setRestaurants([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    restaurants,
    total,
    isLoading,
    error,
    searchByLocation
  };
} 