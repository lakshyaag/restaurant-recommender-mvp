"use client";

import { HeroSection } from "@/components/HeroSection";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import SearchForm from "@/components/SearchForm";
import useRestaurantStore from "@/store/useRestaurantStore";
import RestaurantList from "@/components/RestaurantList";
import RestaurantMap from "@/components/RestaurantMap";
import { Card, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
	// Get restaurant state from Zustand store
	const { restaurants, totalResults, isLoading, error, searchParams } =
		useRestaurantStore();

	// Determine if we've performed a search yet
	const hasSearched =
		restaurants.length > 0 ||
		(isLoading === false && error === null && totalResults === 0);

	// Determine view type (list or map)
	const viewType = searchParams.view_type || "list";

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<section className="relative pt-28 pb-20 overflow-hidden">
				<HeroSection />

				<Container className="relative z-10">
					<div className="max-w-3xl mx-auto">
						<div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
							<SearchForm />
						</div>

						{/* Results Section */}
						{hasSearched && (
							<div
								className="mt-10 animate-fade-up"
								style={{ animationDelay: "0.6s" }}
							>
								{isLoading ? (
									<div className="flex justify-center items-center py-20">
										<Loader2 className="h-10 w-10 animate-spin text-primary" />
										<span className="ml-4 text-lg">
											Searching restaurants...
										</span>
									</div>
								) : error ? (
									<Card className="p-6 text-center">
										<h3 className="text-lg font-medium text-red-600">Error</h3>
										<CardDescription>{error}</CardDescription>
									</Card>
								) : restaurants.length === 0 ? (
									<Card className="p-6 text-center">
										<h3 className="text-lg font-medium">No results found</h3>
										<CardDescription>
											Try adjusting your search criteria to find more
											restaurants.
										</CardDescription>
									</Card>
								) : (
									<>
										<div className="mb-4 flex justify-between items-center">
											<h2 className="text-2xl font-bold">
												{totalResults > 0
													? `Found ${totalResults} restaurants`
													: "Search Results"}
											</h2>
										</div>

										{viewType === "map" ? (
											<RestaurantMap restaurants={restaurants} />
										) : (
											<RestaurantList restaurants={restaurants} />
										)}
									</>
								)}
							</div>
						)}
					</div>
				</Container>
			</section>
		</div>
	);
}
