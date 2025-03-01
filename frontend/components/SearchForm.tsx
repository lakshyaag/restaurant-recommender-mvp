'use client';

import { useState, FormEvent } from 'react';
import { SearchParams, SortBy } from '@/lib/api';
import { FaSearch, FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [location, setLocation] = useState<string>('Toronto');
  const [term, setTerm] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  // Advanced options
  const [radius, setRadius] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortBy>('best_match');
  const [price, setPrice] = useState<string>('');
  const [categories, setCategories] = useState<string>('');
  const [openNow, setOpenNow] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (location.trim()) {
      const params: SearchParams = {
        location,
      };
      
      // Add optional parameters if they have values
      if (term) params.term = term;
      if (radius) params.radius = radius;
      if (sortBy) params.sort_by = sortBy;
      if (price) params.price = price;
      if (categories) params.categories = categories;
      if (openNow) params.open_now = openNow;
      
      onSearch(params);
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-1">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 md:border-r md:border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location (e.g., Toronto)"
                  className="block w-full pl-12 pr-4 py-4 border-0 focus:ring-0 text-gray-900"
                  required
                />
              </div>
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                id="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Cuisine or restaurant name (optional)"
                className="block w-full px-4 py-4 border-0 focus:ring-0 text-gray-900"
              />
            </div>
            
            <div className="flex-none">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
          
          <div className="px-4 pb-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              {showAdvanced ? <FaAngleUp className="mr-1" /> : <FaAngleDown className="mr-1" />}
              {showAdvanced ? 'Hide filters' : 'More filters'}
            </button>
          </div>
          
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-t border-gray-200">
              <div>
                <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <input
                  type="text"
                  id="categories"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="e.g., italian,sushi"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <select
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Price</option>
                  <option value="1">$</option>
                  <option value="2">$$</option>
                  <option value="3">$$$</option>
                  <option value="4">$$$$</option>
                  <option value="1,2">$ to $$</option>
                  <option value="3,4">$$$ to $$$$</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="open_now"
                  checked={openNow}
                  onChange={(e) => setOpenNow(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="open_now" className="ml-2 block text-sm text-gray-700">
                  Open Now
                </label>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
} 