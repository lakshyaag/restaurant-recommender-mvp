import type { Restaurant } from "@/store/useRestaurantStore";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface RestaurantMapProps {
	restaurants: Restaurant[];
}

const RestaurantMap = ({ restaurants }: RestaurantMapProps) => {
	return (
		<Card className="p-6 text-center">
			<div className="flex flex-col items-center justify-center py-10">
				<MapPin className="h-16 w-16 text-muted-foreground mb-4" />
				<h3 className="text-xl font-medium mb-2">Map View</h3>
				<p className="text-muted-foreground mb-6 max-w-md">
					This is a placeholder for the map view. In a real application, you
					would integrate with a mapping library like Google Maps, Mapbox, or
					Leaflet to display restaurant locations.
				</p>
				<div className="text-sm text-left w-full max-w-md">
					<p className="font-medium mb-2">
						Would show {restaurants.length} restaurants:
					</p>
					<ul className="list-disc pl-5 space-y-1">
						{restaurants.slice(0, 5).map((restaurant) => (
							<li key={restaurant.id}>
								{restaurant.name} - {restaurant.location.address1}
								{restaurant.coordinates && (
									<span className="text-xs text-muted-foreground ml-2">
										({restaurant.coordinates.latitude.toFixed(4)}, {restaurant.coordinates.longitude.toFixed(4)})
									</span>
								)}
							</li>
						))}
						{restaurants.length > 5 && (
							<li>... and {restaurants.length - 5} more</li>
						)}
					</ul>
				</div>
			</div>
		</Card>
	);
};

export default RestaurantMap;
