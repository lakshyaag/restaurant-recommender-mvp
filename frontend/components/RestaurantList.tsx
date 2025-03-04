import type { Restaurant } from "@/lib/types";
import RestaurantCard from "@/components/RestaurantCard";
import { motion } from "framer-motion";

interface RestaurantListProps {
	restaurants: Restaurant[];
}

const RestaurantList = ({ restaurants }: RestaurantListProps) => {
	if (!restaurants || restaurants.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
				className="text-center py-10"
			>
				No restaurants found
			</motion.div>
		);
	}

	// Container and staggered children animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.08, // Slightly faster stagger for smoother appearance
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				damping: 12,
				stiffness: 100,
			},
		},
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-6"
		>
			{restaurants.map((restaurant) => (
				<motion.div
					key={restaurant.id}
					variants={itemVariants}
					className="h-full"
				>
					<RestaurantCard restaurant={restaurant} />
				</motion.div>
			))}
		</motion.div>
	);
};

export default RestaurantList;
