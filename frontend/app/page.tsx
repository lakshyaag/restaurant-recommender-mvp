'use client';

import { useState } from 'react';
import Image from 'next/image';
import SearchForm from '@/components/SearchForm';
import RestaurantGrid from '@/components/RestaurantGrid';
import { useRestaurantSearch, SearchParams } from '@/lib/api';

export default function Home() {
  const { restaurants, isLoading, error, search } = useRestaurantSearch();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (params: SearchParams) => {
    search(params);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">TRR</div>
          <div className="flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">Recommendations</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Help</a>
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6">
            Toronto Restaurant Recommender
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto">
            Find the Perfect Restaurant for Your Business Meeting
          </h1>

          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover top-rated restaurants in Toronto that are ideal for client meetings, team dinners, and business engagements.
          </p>

          <div className="max-w-2xl mx-auto">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Results Section */}
      {error && (
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-100 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        </div>
      )}

      {hasSearched && (
        <div className="container mx-auto px-4 py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {isLoading 
                ? 'Searching restaurants...' 
                : restaurants.length > 0 
                  ? `Found ${restaurants.length} restaurants` 
                  : 'No restaurants found'}
            </h2>
            
            <RestaurantGrid restaurants={restaurants} isLoading={isLoading} />
          </div>
        </div>
      )}

      {!hasSearched && !isLoading && (
        <div className="container mx-auto px-4 py-16 bg-gray-50">
          <div className="text-center max-w-2xl mx-auto">
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
            <p className="text-lg text-gray-600">
              Enter a location above to find restaurant recommendations for your client meetings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
