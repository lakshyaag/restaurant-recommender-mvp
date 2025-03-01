import Image from 'next/image';
import { FaStar, FaMapMarkerAlt, FaPhone, FaExternalLinkAlt } from 'react-icons/fa';

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

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const {
    name,
    image_url,
    url,
    review_count,
    rating,
    price,
    categories,
    address,
    phone
  } = restaurant;

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    if (halfStar) {
      stars.push(<FaStar key="half-star" className="text-yellow-400" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
      <div className="relative h-48 w-full">
        {image_url ? (
          <img
            src={image_url}
            alt={`${name} restaurant`}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No image available</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
        
        <div className="flex items-center mb-2">
          <div className="flex mr-2">
            {renderStars(rating)}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">({review_count} reviews)</span>
        </div>

        {price && (
          <div className="mb-2">
            <span className="text-green-600 dark:text-green-400 font-medium">{price}</span>
          </div>
        )}

        <div className="mb-2">
          <p className="text-gray-600 dark:text-gray-300">{categories.join(', ')}</p>
        </div>

        <div className="flex items-start mb-2">
          <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 mt-1 mr-2 flex-shrink-0" />
          <p className="text-gray-600 dark:text-gray-300">{address}</p>
        </div>

        {phone && (
          <div className="flex items-center mb-2">
            <FaPhone className="text-gray-500 dark:text-gray-400 mr-2" />
            <p className="text-gray-600 dark:text-gray-300">{phone}</p>
          </div>
        )}

        <div className="mt-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span className="mr-1">View on Yelp</span>
            <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
} 