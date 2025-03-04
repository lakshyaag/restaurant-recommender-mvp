import type { Restaurant } from "@/lib/types";
import {
	defaultBusinessContext,
	businessHighlights,
	getReviews,
} from "@/lib/constants/mock-reviews";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Star,
	ThumbsUp,
	Volume2,
	Users,
	Coffee,
	BadgeCheck,
	MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface RestaurantReviewsProps {
	restaurant: Restaurant;
}

const RestaurantReviews = ({ restaurant }: RestaurantReviewsProps) => {
	// Use generic reviews for all restaurants
	const reviews = useMemo(() => getReviews(restaurant.id), [restaurant.id]);

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

	// Helper to format date
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Helper to render score label
	const getScoreLabel = (score: number): string => {
		switch (score) {
			case 1:
				return "Very Low";
			case 2:
				return "Low";
			case 3:
				return "Medium";
			case 4:
				return "High";
			case 5:
				return "Very High";
			default:
				return "Unknown";
		}
	};

	// Animation variants for accordion content
	const accordionAnimationVariants = {
		hidden: { opacity: 0, height: 0 },
		visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
	};

	return (
		<div className="space-y-4">
			{/* Business Meeting Suitability Score Card */}
			<Accordion
				type="single"
				collapsible
				className="border rounded-lg overflow-hidden"
			>
				<AccordionItem
					value="business-meeting-suitability"
					className="border-0"
				>
					<AccordionTrigger className="px-4 py-3 hover:bg-slate-50 transition-colors">
						<div className="flex items-center">
							<BadgeCheck className="h-5 w-5 mr-2 text-green-600" />
							<span>Business Meeting Suitability</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="overflow-hidden">
						<motion.div
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={accordionAnimationVariants}
							className="px-4 py-3 bg-slate-50"
						>
							<div className="space-y-4 pt-2">
								{/* Noise Level */}
								<div className="space-y-1">
									<div className="flex justify-between">
										<div className="flex items-center gap-2">
											<Volume2 className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm font-medium">Noise Level</span>
										</div>
										<span className="text-sm">
											{getScoreLabel(defaultBusinessContext.noiseLevel)}
										</span>
									</div>
									<Progress
										value={defaultBusinessContext.noiseLevel * 20}
										className="h-2"
									/>
								</div>

								{/* Privacy Level */}
								<div className="space-y-1">
									<div className="flex justify-between">
										<div className="flex items-center gap-2">
											<Users className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm font-medium">Privacy Level</span>
										</div>
										<span className="text-sm">
											{getScoreLabel(defaultBusinessContext.privacyLevel)}
										</span>
									</div>
									<Progress
										value={defaultBusinessContext.privacyLevel * 20}
										className="h-2"
									/>
								</div>

								{/* Formality Level */}
								<div className="space-y-1">
									<div className="flex justify-between">
										<div className="flex items-center gap-2">
											<Coffee className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm font-medium">
												Formality Level
											</span>
										</div>
										<span className="text-sm">
											{getScoreLabel(defaultBusinessContext.formalityLevel)}
										</span>
									</div>
									<Progress
										value={defaultBusinessContext.formalityLevel * 20}
										className="h-2"
									/>
								</div>
							</div>

							{/* Meeting Types */}
							<div className="my-4">
								<h4 className="text-sm font-medium mb-2">Suitable for:</h4>
								<div className="flex flex-wrap gap-2">
									{defaultBusinessContext.meetingTypes.map((type) => (
										<Badge key={type} variant="outline" className="bg-green-50">
											{type}
										</Badge>
									))}
								</div>
							</div>

							{/* Highlights */}
							<div className="pb-2">
								<h4 className="text-sm font-medium mb-2">
									Business Highlights:
								</h4>
								<ul className="text-sm space-y-1">
									{businessHighlights.map((highlight) => (
										<li key={highlight} className="flex items-start">
											<span className="text-green-600 mr-2">•</span>
											{highlight}
										</li>
									))}
								</ul>
							</div>
						</motion.div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{/* Reviews Accordion */}
			<Accordion
				type="single"
				collapsible
				defaultValue="customer-reviews"
				className="border rounded-lg overflow-hidden"
			>
				<AccordionItem value="customer-reviews" className="border-0">
					<AccordionTrigger className="px-4 py-3 hover:bg-slate-50 transition-colors">
						<div className="flex items-center">
							<MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
							<span>Customer Reviews ({reviews.length})</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="overflow-hidden">
						<motion.div
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={accordionAnimationVariants}
						>
							<ScrollArea className="h-[400px] px-4">
								<div className="space-y-6 py-3">
									{reviews.map((review) => (
										<motion.div
											key={review.id}
											className="space-y-3"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
										>
											<div className="flex items-start justify-between">
												<div className="flex items-start space-x-3">
													<Avatar>
														<AvatarImage
															src={review.userAvatar}
															alt={review.userName}
														/>
														<AvatarFallback>
															{review.userName.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<div>
														<h4 className="font-medium">{review.userName}</h4>
														<div className="flex items-center space-x-2">
															{renderStars(review.rating)}
															<span className="text-sm text-muted-foreground">
																{formatDate(review.date)}
															</span>
														</div>
													</div>
												</div>
												<div className="flex items-center text-muted-foreground">
													<ThumbsUp className="h-4 w-4 mr-1" />
													<span className="text-xs">{review.helpfulCount}</span>
												</div>
											</div>
											<p className="text-sm">{review.text}</p>
											{review.photos && review.photos.length > 0 && (
												<div className="flex gap-2 mt-2 overflow-x-auto">
													{review.photos.map((photo, index) => (
														<div
															key={`${review.id}-photo-${index}`}
															className="relative h-24 w-32 rounded overflow-hidden shrink-0"
														>
															<Image
																src={photo}
																alt={`Review photo by ${review.userName}`}
																fill
																className="object-cover"
															/>
														</div>
													))}
												</div>
											)}
											<Separator className="mt-3" />
										</motion.div>
									))}
								</div>
							</ScrollArea>
						</motion.div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default RestaurantReviews;
