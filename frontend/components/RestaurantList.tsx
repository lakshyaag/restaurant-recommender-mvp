import type { Restaurant } from "@/store/useRestaurantStore";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Star, MapPin, Phone, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface RestaurantListProps {
	restaurants: Restaurant[];
}

const RestaurantList = ({ restaurants }: RestaurantListProps) => {
	if (!restaurants || restaurants.length === 0) {
		return <div className="text-center py-10">No restaurants found</div>;
	}

	// Helper to format distance
	const formatDistance = (distance?: number): string => {
		if (!distance) return "Unknown distance";
		const kilometers = distance / 1000;
		return `${kilometers.toFixed(1)} km away`;
	};

	// Helper to render star rating
	const renderStars = (rating: number): React.ReactNode => {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;

		return (
			<div className="flex items-center">
				{[...Array(5)].map((_, i) => (
					<Star
						key={`${i}-${rating}`}
						className={`h-4 w-4 ${
							i < fullStars
								? "text-yellow-400 fill-yellow-400"
								: i === fullStars && hasHalfStar
									? "text-yellow-400 fill-yellow-400 opacity-50"
									: "text-gray-300"
						}`}
					/>
				))}
				<span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
			</div>
		);
	};

	return (
		<div className="grid grid-cols-1 gap-6 mt-6">
			{restaurants.map((restaurant) => (
				<Card
					key={restaurant.id}
					className="overflow-hidden hover:shadow-md transition-shadow"
				>
					<div className="flex flex-col md:flex-row">
						{/* Restaurant Image */}
						<div className="w-full md:w-1/3 relative min-h-[200px]">
							<div className="absolute inset-0">
								<Image
									src={
										restaurant.image_url || "/images/placeholder-restaurant.jpg"
									}
									alt={restaurant.name}
									className="object-cover"
									fill
								/>
							</div>
							{restaurant.is_closed === false && (
								<Badge variant="success" className="absolute top-2 right-2">
									Open
								</Badge>
							)}
							{restaurant.is_closed === true && (
								<Badge variant="destructive" className="absolute top-2 right-2">
									Closed
								</Badge>
							)}
						</div>

						{/* Restaurant Details */}
						<div className="w-full md:w-2/3 flex flex-col">
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle className="text-xl font-bold">
											<Link
												href={`/restaurants/${restaurant.id}`}
												className="hover:text-primary transition-colors"
											>
												{restaurant.name}
											</Link>
										</CardTitle>
										<CardDescription className="flex items-center mt-1">
											{renderStars(restaurant.rating)}
											<span className="ml-2 text-sm text-muted-foreground">
												({restaurant.review_count} reviews)
											</span>
										</CardDescription>
									</div>
									{restaurant.price && (
										<Badge variant="outline" className="ml-2">
											{restaurant.price}
										</Badge>
									)}
								</div>
							</CardHeader>

							<CardContent className="py-2">
								<div className="flex flex-wrap gap-2 mb-3">
									{restaurant.categories.map((category) => (
										<Badge key={category.alias} variant="secondary">
											{category.title}
										</Badge>
									))}
								</div>

								<div className="space-y-2 text-sm">
									<div className="flex items-start">
										<MapPin className="h-4 w-4 mr-2 text-muted-foreground shrink-0 mt-0.5" />
										<span>
											{restaurant.location.display_address.join(", ")}
										</span>
									</div>

									{restaurant.display_phone && (
										<div className="flex items-center">
											<Phone className="h-4 w-4 mr-2 text-muted-foreground" />
											<span>{restaurant.display_phone}</span>
										</div>
									)}

									{restaurant.attributes?.menu_url && (
										<div className="flex items-center">
											<ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
											<Link
												href={restaurant.attributes.menu_url}
												target="_blank"
												className="text-primary hover:underline"
											>
												View Menu
											</Link>
										</div>
									)}

									{restaurant.attributes?.waitlist_reservation && (
										<div className="flex items-center">
											<Clock className="h-4 w-4 mr-2 text-muted-foreground" />
											<span className="text-green-600">
												Reservations available
											</span>
										</div>
									)}
								</div>
							</CardContent>

							<CardFooter className="flex justify-between mt-auto pt-4">
								{restaurant.distance && (
									<span className="text-sm text-muted-foreground">
										{formatDistance(restaurant.distance)}
									</span>
								)}

								<Link
									href={restaurant.url}
									target="_blank"
									className="text-sm font-medium text-primary hover:underline"
								>
									View on Yelp
								</Link>
							</CardFooter>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
};

export default RestaurantList;
