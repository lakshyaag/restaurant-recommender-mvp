"use client";

import { HeroSection } from "@/components/HeroSection";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import SearchForm from "@/components/SearchForm";
import useRestaurantStore from "@/store/useRestaurantStore";
import RestaurantList from "@/components/RestaurantList";
import RestaurantMap from "@/components/RestaurantMap";
import { Card, CardDescription } from "@/components/ui/card";
import { Loader2, List, MapIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
	// Get restaurant state from Zustand store
	const {
		restaurants,
		totalResults,
		isLoading,
		error,
		searchParams,
		hasSearched,
		setSearchParams,
		region,
	} = useRestaurantStore();

	// Determine view type (list or map)
	const viewType = searchParams.view_type || "list";

	// Toggle view type between list and map
	const toggleViewType = () => {
		if (viewType === "list") {
			toast.error(
				"Map view is implemented using client-side rendering since Google Maps API is paid. Please note that zoom and pan functionality is not supported.",
			);
		}

		setSearchParams({
			...searchParams,
			view_type: viewType === "list" ? "map" : "list",
		});
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<section className="relative pt-28 pb-20 overflow-hidden">
				<HeroSection />

				<Container className="relative z-10">
					<div className="max-w-6xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: "easeOut" }}
							className="animate-fade-up"
						>
							<SearchForm />
						</motion.div>

						{/* Initial state message */}
						<AnimatePresence>
							{!hasSearched && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.5, delay: 0.3 }}
									className="mt-16 text-center"
								>
									<Card className="p-8 shadow-lg bg-gradient-to-br from-white to-slate-50">
										<motion.div
											initial={{ scale: 0.9 }}
											animate={{ scale: 1 }}
											transition={{ duration: 0.5, delay: 0.5 }}
										>
											<h3 className="text-2xl font-bold mb-3">
												Find Your Perfect Dining Spot
											</h3>
											<CardDescription className="text-base mb-4">
												Enter your location and preferences in the search form
												above to discover amazing restaurants nearby!
											</CardDescription>
										</motion.div>
									</Card>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Results Section */}
						<AnimatePresence>
							{hasSearched && (
								<motion.div
									key="results"
									initial={{ opacity: 0, y: 40 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -40 }}
									transition={{ duration: 0.5 }}
									className="mt-10"
								>
									{isLoading ? (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="flex justify-center items-center py-20"
										>
											<Loader2 className="h-10 w-10 animate-spin text-primary" />
											<span className="ml-4 text-lg">
												Searching restaurants...
											</span>
										</motion.div>
									) : error ? (
										<motion.div
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ type: "spring", damping: 20 }}
										>
											<Card className="p-6 text-center">
												<h3 className="text-lg font-medium text-red-600">
													Error
												</h3>
												<CardDescription>{error}</CardDescription>
											</Card>
										</motion.div>
									) : restaurants.length === 0 ? (
										<motion.div
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ type: "spring", damping: 20 }}
										>
											<Card className="p-6 text-center">
												<h3 className="text-lg font-medium">
													No results found
												</h3>
												<CardDescription>
													Try adjusting your search criteria to find more
													restaurants.
												</CardDescription>
											</Card>
										</motion.div>
									) : (
										<>
											<div className="mb-4 flex justify-between items-center flex-wrap gap-4">
												<motion.h2
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													className="text-2xl font-bold"
												>
													{totalResults > 0
														? `Found ${restaurants.length} restaurants`
														: "Search Results"}
												</motion.h2>

												<motion.div
													initial={{ opacity: 0, x: 20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: 0.2 }}
												>
													<Button
														variant="outline"
														onClick={toggleViewType}
														className="flex items-center gap-2"
													>
														{viewType === "list" ? (
															<>
																<MapIcon className="h-4 w-4" /> Switch to Map
															</>
														) : (
															<>
																<List className="h-4 w-4" /> Switch to List
															</>
														)}
													</Button>
												</motion.div>
											</div>

											<AnimatePresence mode="wait">
												<motion.div
													key={viewType}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													transition={{ duration: 0.3 }}
												>
													{viewType === "map" ? (
														<RestaurantMap
															restaurants={restaurants}
															region={region}
														/>
													) : (
														<RestaurantList restaurants={restaurants} />
													)}
												</motion.div>
											</AnimatePresence>
										</>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</Container>
			</section>
		</div>
	);
}
