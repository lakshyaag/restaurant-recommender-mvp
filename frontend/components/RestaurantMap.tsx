import type { MapViewResponse, Restaurant } from "@/store/useRestaurantStore";
import { Card } from "@/components/ui/card";
import { GoogleMapsComponent } from "./GoogleMapsComponent";
import { useState } from "react";
import RestaurantDetailModal from "./RestaurantDetailModal";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestaurantMapProps {
	restaurants: Restaurant[];
	map: MapViewResponse;
}

const RestaurantMap = ({ restaurants, map }: RestaurantMapProps) => {
	const [selectedRestaurant, setSelectedRestaurant] =
		useState<Restaurant | null>(null);

	return (
		<Card
			className="w-full h-full flex flex-col overflow-hidden"
			style={{ height: "100vh" }}
		>
			<div className="relative flex-grow">
				<GoogleMapsComponent
					center={map.region.center}
					restaurants={restaurants}
					onSelectRestaurant={(restaurant) => setSelectedRestaurant(restaurant)}
				/>
			</div>

			{/* Restaurant detail modal */}
			{selectedRestaurant && (
				<RestaurantDetailModal
					restaurant={selectedRestaurant}
					isOpen={!!selectedRestaurant}
					onClose={() => setSelectedRestaurant(null)}
				/>
			)}
		</Card>
	);
};

export default RestaurantMap;
