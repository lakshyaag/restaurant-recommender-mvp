'use client';

import RestaurantCard from './RestaurantCard';

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

interface RestaurantGridProps {
  restaurants: Restaurant[];
  isLoading: boolean;
}

export default function RestaurantGrid({ restaurants, isLoading }: RestaurantGridProps) {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-600 dark:text-gray-300">No restaurants found. Try a different location.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
} 