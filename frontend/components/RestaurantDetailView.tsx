import { formatDistance } from "@/lib/utils";
import type { Restaurant } from "@/lib/types";
import { Clock } from "lucide-react";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export const RestaurantDetailView = ({
	restaurant,
}: { restaurant: Restaurant }) => {
	return (
		<div className="space-y-4">
			<div className="flex items-start">
				<MapPin className="h-5 w-5 mr-3 text-muted-foreground shrink-0 mt-0.5" />
				<div>
					<h4 className="font-medium">Location</h4>
					<p>{restaurant.location.display_address.join(", ")}</p>
					{restaurant.distance && (
						<p className="text-sm text-muted-foreground mt-1">
							{formatDistance(restaurant.distance)}
						</p>
					)}
				</div>
			</div>

			{restaurant.display_phone && (
				<div className="flex items-start">
					<Phone className="h-5 w-5 mr-3 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<h4 className="font-medium">Contact</h4>
						<p>{restaurant.display_phone}</p>
					</div>
				</div>
			)}

			{restaurant.attributes?.menu_url && (
				<div className="flex items-start">
					<ExternalLink className="h-5 w-5 mr-3 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<h4 className="font-medium">Menu</h4>
						<Link
							href={restaurant.attributes.menu_url}
							target="_blank"
							className="text-primary hover:underline"
						>
							View Menu
						</Link>
					</div>
				</div>
			)}

			{restaurant.attributes?.waitlist_reservation && (
				<div className="flex items-start">
					<Clock className="h-5 w-5 mr-3 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<h4 className="font-medium">Reservations</h4>
						<p className="text-green-600">Reservations available</p>
					</div>
				</div>
			)}
		</div>
	);
};
