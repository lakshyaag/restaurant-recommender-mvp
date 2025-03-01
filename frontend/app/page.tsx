'use client';

import { useState } from 'react';
import Image from 'next/image';
import SearchForm from '@/components/SearchForm';
import RestaurantGrid from '@/components/RestaurantGrid';
import { useRestaurantSearch } from '@/lib/api';

export default function Home() {
  const { restaurants, isLoading, error, searchByLocation } = useRestaurantSearch();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (location: string) => {
    searchByLocation(location);
    setHasSearched(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Bain Restaurant Recommender
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Find the perfect restaurant for your client meetings in any location.
        </p>
      </header>

      <div className="max-w-4xl mx-auto mb-10">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {hasSearched && (
        <div className="max-w-6xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            {isLoading 
              ? 'Searching restaurants...' 
              : restaurants.length > 0 
                ? `Found ${restaurants.length} restaurants` 
                : 'No restaurants found'}
          </h2>
          <RestaurantGrid restaurants={restaurants} isLoading={isLoading} />
        </div>
      )}

      {!hasSearched && !isLoading && (
        <div className="text-center max-w-2xl mx-auto mt-16">
          <div className="mb-8">
            <Image
              src="/restaurant.svg"
              alt="Restaurant illustration"
              width={300}
              height={200}
              className="mx-auto"
              priority
            />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Enter a location above to find restaurant recommendations for your client meetings.
          </p>
        </div>
      )}
    </div>
  );
}
