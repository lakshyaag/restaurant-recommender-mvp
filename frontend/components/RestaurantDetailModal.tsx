import type { Restaurant } from "@/lib/types";
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
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RestaurantReviews from "./RestaurantReviews";
import { RestaurantDetailView } from "./RestaurantDetailView";

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
				<Tabs defaultValue="details" className="w-full">
					<TabsList className="mb-4 w-full">
						<TabsTrigger value="details" className="w-full">
							Details
						</TabsTrigger>
						<TabsTrigger value="reviews" className="w-full">
							Reviews
						</TabsTrigger>
						<TabsTrigger value="map" className="w-full">
							Map
						</TabsTrigger>
					</TabsList>
					<TabsContent value="details">
						<RestaurantDetailView restaurant={restaurant} />
					</TabsContent>

					<TabsContent value="reviews">
						<RestaurantReviews restaurant={restaurant} />
					</TabsContent>

					<TabsContent value="map">
						<div className="aspect-video rounded-md bg-muted flex items-center justify-center">
							<iframe
								width="100%"
								height="100%"
								style={{ border: 0 }}
								loading="lazy"
								allowFullScreen
								title="Google Maps"
								src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
									`${restaurant.name} ${restaurant.location.display_address.join(", ")}`,
								)}`}
							/>
						</div>
					</TabsContent>
				</Tabs>

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
