import type { Restaurant } from "@/lib/types";
import { useState } from "react";
import { MapPin, Star } from "lucide-react";

export const GoogleMapsComponent = ({
	center,
	restaurants,
	onSelectRestaurant,
}: {
	center: { latitude: number; longitude: number };
	restaurants: Restaurant[];
	onSelectRestaurant: (restaurant: Restaurant) => void;
}) => {
	const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

	// This is a client-side only component that loads the Google Maps script
	return (
		<div className="w-full h-full">
			{/* We're using an iframe for the map to avoid API key requirements */}
			<iframe
				title="Google Map"
				width="100%"
				height="100%"
				style={{
					border: 0,
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				}}
				loading="lazy"
				allowFullScreen
				src={`https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${center.latitude},${center.longitude}&zoom=13`}
			/>

			{/* Overlay markers on top of the map */}
			<div className="absolute inset-0 pointer-events-none">
				{restaurants.map((restaurant) => (
					<div
						key={restaurant.id}
						className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
						style={{
							left: `${50 + ((restaurant.coordinates?.longitude ?? 0) - center.longitude) * 1000}%`,
							top: `${50 - ((restaurant.coordinates?.latitude ?? 0) - center.latitude) * 1000}%`,
						}}
					>
						<button
							className={`
                p-2 rounded-full bg-primary text-white cursor-pointer
                hover:scale-125 transition-transform
                ${hoveredMarker === restaurant.id ? "ring-4 ring-primary-foreground ring-offset-2 scale-125" : ""}
                shadow-md
              `}
							onClick={() => {
								onSelectRestaurant(restaurant);
							}}
							onMouseEnter={() => setHoveredMarker(restaurant.id)}
							onMouseLeave={() => setHoveredMarker(null)}
							onFocus={() => setHoveredMarker(restaurant.id)}
							onBlur={() => setHoveredMarker(null)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									onSelectRestaurant(restaurant);
								}
							}}
							tabIndex={0}
							type="button"
							aria-label={`View details for ${restaurant.name}`}
						>
							<MapPin className="h-6 w-6" />
						</button>

						{hoveredMarker === restaurant.id && (
							<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white rounded-md shadow-lg p-3 z-10">
								<div className="text-base font-medium truncate">
									{restaurant.name}
								</div>
								<div className="flex items-center text-sm mt-1">
									<Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
									<span>{restaurant.rating}</span>
									<span className="text-muted-foreground ml-1">
										({restaurant.review_count})
									</span>
								</div>
								{restaurant.price && (
									<div className="text-sm mt-1">
										<span className="font-medium">{restaurant.price}</span>
									</div>
								)}
								{restaurant.categories && restaurant.categories.length > 0 && (
									<div className="text-xs text-muted-foreground mt-1 truncate">
										{restaurant.categories.map((c) => c.title).join(", ")}
									</div>
								)}
								<div className="mt-2 text-xs text-primary font-medium">
									Click for full details
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default GoogleMapsComponent;
