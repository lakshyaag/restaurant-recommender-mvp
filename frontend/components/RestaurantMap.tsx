import type { Region, Restaurant } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { GoogleMapsComponent } from "./GoogleMapsComponent";
import { useState } from "react";
import RestaurantDetailModal from "./RestaurantDetailModal";

interface RestaurantMapProps {
	restaurants: Restaurant[];
	region: Region;
}

const RestaurantMap = ({ restaurants, region }: RestaurantMapProps) => {
	const [selectedRestaurant, setSelectedRestaurant] =
		useState<Restaurant | null>(null);

	return (
		<Card
			className="w-full h-full flex flex-col overflow-hidden"
			style={{ height: "100vh" }}
		>
			<div className="relative flex-grow">
				<GoogleMapsComponent
					center={region.center}
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
