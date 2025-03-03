import categoriesData from './constants/categories.json';
import type { Option } from '@/components/ui/multi-select';

/**
 * Filters and formats restaurant categories for use in the MultiSelect component
 * @returns Array of formatted category options
 */
export function getRestaurantCategories(): Option[] {
  // Filter categories that are related to restaurants
  const restaurantCategories = categoriesData.categories.filter(category => 
    category.parent_aliases.includes('restaurants') || category.alias === 'restaurants'
  );

  // Sort categories alphabetically by title
  const sortedCategories = [...restaurantCategories].sort((a, b) => 
    a.title.localeCompare(b.title)
  );

  // Format categories for the MultiSelect component
  return sortedCategories.map(category => ({
    label: category.title,
    value: category.alias
  }));
}

/**
 * Converts an array of category values to a comma-separated string
 * @param categories Array of category values
 * @returns Comma-separated string of category values
 */
export function categoriesToString(categories: string[]): string {
  return categories.join(',');
}

/**
 * Converts a comma-separated string of category values to an array
 * @param categoriesString Comma-separated string of category values
 * @returns Array of category values
 */
export function stringToCategories(categoriesString: string): string[] {
  if (!categoriesString) return [];
  return categoriesString.split(',').filter(Boolean);
} 