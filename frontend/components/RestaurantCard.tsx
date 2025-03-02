import { useState } from "react";
import type { Restaurant } from "@/store/useRestaurantStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import RestaurantDetailModal from "./RestaurantDetailModal";

interface RestaurantCardProps {
	restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// Helper to render star rating
	const renderStars = (rating: number): React.ReactNode => {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;

		return (
			<div className="flex items-center">
				{[...Array(5)].map((_, i) => (
					<Star
						key={`${i}-${rating}`}
						className={`h-3 w-3 ${
							i < fullStars
								? "text-yellow-400 fill-yellow-400"
								: i === fullStars && hasHalfStar
									? "text-yellow-400 fill-yellow-400 opacity-50"
									: "text-gray-300"
						}`}
					/>
				))}
				<span className="ml-1 text-xs font-medium">{rating.toFixed(1)}</span>
			</div>
		);
	};

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<>
			<Card
				className="overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full"
				onClick={openModal}
			>
				<motion.div
					whileHover={{ scale: 1.03 }}
					transition={{ type: "spring", stiffness: 300, damping: 15 }}
				>
					{/* Restaurant Image */}
					<div className="relative w-full h-[180px]">
						<Image
							src={restaurant.image_url || "/images/placeholder-restaurant.jpg"}
							alt={restaurant.name}
							className="object-cover"
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
						{restaurant.price && (
							<Badge
								variant="outline"
								className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm"
							>
								{restaurant.price}
							</Badge>
						)}
					</div>

					<CardContent className="p-4">
						{/* Restaurant Name */}
						<h3 className="font-bold text-base mb-1 truncate">
							{restaurant.name}
						</h3>

						{/* Rating */}
						<div className="flex items-center mb-2">
							{renderStars(restaurant.rating)}
							<span className="ml-2 text-xs text-muted-foreground">
								({restaurant.review_count})
							</span>
						</div>

						{/* Categories */}
						<div className="flex flex-wrap gap-1 mt-2">
							{restaurant.categories.slice(0, 3).map((category) => (
								<Badge
									key={category.alias}
									variant="secondary"
									className="text-xs py-0 h-5"
								>
									{category.title}
								</Badge>
							))}
							{restaurant.categories.length > 3 && (
								<span className="text-xs text-muted-foreground">
									+{restaurant.categories.length - 3} more
								</span>
							)}
						</div>

						{/* Address */}
						<div className="flex items-start gap-2 mt-2">
							<MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
							<span className="text-sm">
								{restaurant.location.display_address?.join(", ") ||
									"Address not available"}
							</span>
						</div>

						{/* Phone */}
						{restaurant.display_phone && (
							<div className="mt-1 flex items-center gap-2">
								<Phone className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">{restaurant.display_phone}</span>
							</div>
						)}
					</CardContent>
				</motion.div>
			</Card>

			{/* Modal with restaurant details */}
			<RestaurantDetailModal
				restaurant={restaurant}
				isOpen={isModalOpen}
				onClose={closeModal}
			/>
		</>
	);
};

export default RestaurantCard;
