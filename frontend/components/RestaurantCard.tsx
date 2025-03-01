import type { Restaurant } from "@/lib/api";
import Image from "next/image";
import {
	FaExternalLinkAlt,
	FaMapMarkerAlt,
	FaPhone,
	FaStar,
} from "react-icons/fa";

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
		city,
		zip_code,
		phone,
		distance,
		is_closed,
		hours,
	} = restaurant;

	// Function to render stars based on rating
	const renderStars = (rating: number) => {
		return (
			<div className="flex items-center">
				<div className="flex mr-1">
					{[...Array(5)].map((_, i) => (
						<FaStar
							key={`star-${i}`}
							className={`${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"} w-4 h-4`}
						/>
					))}
				</div>
				<span className="text-sm font-medium text-gray-700">
					{rating.toFixed(1)}
				</span>
				<span className="mx-1 text-gray-400">•</span>
				<span className="text-sm text-gray-500">{review_count} reviews</span>
			</div>
		);
	};

	// Format distance to show in km/miles
	const formatDistance = (meters?: number) => {
		if (!meters) return null;
		// Convert to kilometers and format with 1 decimal place
		const km = (meters / 1000).toFixed(1);
		return `${km} km`;
	};

	// Format full address
	const formatAddress = () => {
		const parts = [address];
		if (city) parts.push(city);
		if (zip_code) parts.push(zip_code);
		return parts.join(", ");
	};

	// Check if restaurant is open now
	const isOpenNow = () => {
		if (!hours || hours.length === 0) return null;
		return hours[0]?.is_open_now;
	};

	return (
		<div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
			{/* Image */}
			<div className="relative h-56 w-full">
				{image_url ? (
					<img
						src={image_url}
						alt={`${name} restaurant`}
						className="object-cover w-full h-full"
					/>
				) : (
					<div className="w-full h-full bg-gray-100 flex items-center justify-center">
						<span className="text-gray-400">No image available</span>
					</div>
				)}

				{/* Status Badge */}
				{isOpenNow() !== null && (
					<div className="absolute top-3 right-3">
						<span
							className={`text-xs font-medium px-2 py-1 rounded-full ${
								isOpenNow()
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800"
							}`}
						>
							{isOpenNow() ? "Open Now" : "Closed"}
						</span>
					</div>
				)}

				{/* Price Badge */}
				{price && (
					<div className="absolute top-3 left-3">
						<span className="bg-white/90 text-gray-900 text-sm font-medium px-2 py-1 rounded-full">
							{price}
						</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-5 flex-grow flex flex-col">
				<h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>

				{/* Rating */}
				<div className="mb-3">{renderStars(rating)}</div>

				{/* Categories */}
				<div className="mb-3">
					<p className="text-sm text-gray-600">
						{categories.join(" • ")}
						{formatDistance(distance) && (
							<>
								<span className="mx-1 text-gray-400">•</span>
								{formatDistance(distance)}
							</>
						)}
					</p>
				</div>

				{/* Address */}
				<div className="flex items-start mb-2 mt-auto">
					<FaMapMarkerAlt className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
					<p className="text-sm text-gray-600">{formatAddress()}</p>
				</div>

				{/* Phone */}
				{phone && (
					<div className="flex items-center mb-3">
						<FaPhone className="text-gray-400 mr-2" />
						<p className="text-sm text-gray-600">{phone}</p>
					</div>
				)}

				{/* View on Yelp Link */}
				<div className="mt-2">
					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
					>
						<span className="mr-1">View on Yelp</span>
						<FaExternalLinkAlt className="w-3 h-3" />
					</a>
				</div>
			</div>
		</div>
	);
}
