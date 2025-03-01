'use client';

import { useState, FormEvent } from 'react';

interface SearchFormProps {
  onSearch: (location: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [location, setLocation] = useState<string>('Toronto');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city (e.g., Toronto)"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Find Restaurants'}
        </button>
      </form>
    </div>
  );
} 