import type { Restaurant } from "@/store/useRestaurantStore";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface RestaurantDetailModalProps {
	restaurant: Restaurant;
	isOpen: boolean;
	onClose: () => void;
}

const RestaurantDetailModal = ({
	restaurant,
	isOpen,
	onClose,
}: RestaurantDetailModalProps) => {
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
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex justify-between items-start">
						<DialogTitle className="text-2xl font-bold">
							{restaurant.name}
						</DialogTitle>
						{restaurant.price && (
							<Badge variant="outline" className="mx-4">
								{restaurant.price}
							</Badge>
						)}
					</div>
					<DialogDescription className="flex items-center mt-1">
						{renderStars(restaurant.rating)}
						<span className="ml-2 text-sm text-muted-foreground">
							({restaurant.review_count} reviews)
						</span>
					</DialogDescription>
				</DialogHeader>

				{/* Restaurant Image */}
				<div className="relative w-full h-[250px] rounded-md overflow-hidden mb-4">
					<Image
						src={restaurant.image_url || "/images/placeholder-restaurant.jpg"}
						alt={restaurant.name}
						className="object-cover"
						fill
					/>
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

				{/* Categories */}
				<div className="flex flex-wrap gap-2 mb-6">
					{restaurant.categories.map((category) => (
						<Badge key={category.alias} variant="secondary">
							{category.title}
						</Badge>
					))}
				</div>

				{/* Details */}
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

				<DialogFooter className="mt-6">
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
					<Button asChild>
						<Link href={restaurant.url} target="_blank">
							View on Yelp
						</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default RestaurantDetailModal;
