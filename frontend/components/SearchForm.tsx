"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Filter, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import useRestaurantStore from "@/store/useRestaurantStore";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
	getRestaurantCategories,
	categoriesToString,
	stringToCategories,
} from "@/lib/categories-utils";
import type { Option } from "@/components/ui/multi-select";

// Create Zod validation schema based on API parameters
const searchFormSchema = z
	.object({
		location: z.string().optional(),
		latitude: z.number().min(-90).max(90).optional(),
		longitude: z.number().min(-180).max(180).optional(),
		term: z.string().default("restaurant"),
		radius: z.number().min(0).max(40000).default(10000),
		categories: z.string().optional(),
		locale: z.string().optional(),
		price: z.string().optional(),
		open_now: z.boolean().optional(),
		open_at: z.number().optional(),
		attributes: z.string().optional(),
		sort_by: z
			.enum(["best_match", "rating", "review_count", "distance"])
			.default("best_match"),
		limit: z.number().min(1).max(50).default(20),
		offset: z.number().min(0).default(0),
		reservation_date: z.string().optional(),
		reservation_time: z.string().optional(),
		reservation_covers: z.number().min(1).max(10).optional(),
		view_type: z.enum(["list", "map"]).default("list"),
	})
	.refine(
		(data) => {
			// Ensure either location OR (latitude AND longitude) is provided
			return (
				!!data.location ||
				(data.latitude !== undefined && data.longitude !== undefined)
			);
		},
		{
			message:
				"Either location or both latitude and longitude must be provided",
			path: ["location"],
		},
	);

type SearchFormValues = z.infer<typeof searchFormSchema>;

const SearchForm = () => {
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [showReservation, setShowReservation] = useState(false);
	const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	// Get store values and actions
	const { searchRestaurants, isLoading, error, searchParams } =
		useRestaurantStore();

	// Load category options
	useEffect(() => {
		setCategoryOptions(getRestaurantCategories());

		// If there are initial categories in searchParams, set them
		if (searchParams.categories) {
			setSelectedCategories(stringToCategories(searchParams.categories));
		}
	}, [searchParams.categories]);

	// Initialize react-hook-form
	const form = useForm<SearchFormValues>({
		resolver: zodResolver(searchFormSchema),
		defaultValues: searchParams,
	});

	// Function to handle price toggle
	const togglePrice = (price: string) => {
		const currentPrice = form.getValues("price") || "";
		const prices = currentPrice ? currentPrice.split(",") : [];

		const newPrices = prices.includes(price)
			? prices.filter((p) => p !== price)
			: [...prices, price];

		form.setValue("price", newPrices.join(","), { shouldValidate: true });
	};

	// Handle category selection changes
	const handleCategoryChange = (selected: string[]) => {
		setSelectedCategories(selected);
		form.setValue("categories", categoriesToString(selected), {
			shouldValidate: true,
		});
	};

	// Handle form submission
	const onSubmit = async (data: SearchFormValues) => {
		try {
			await searchRestaurants(data);
			if (error) {
				toast.error(error);
			}
		} catch (err) {
			toast.error("Failed to search restaurants");
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 bg-white rounded-xl shadow-sm p-6 border border-border/50"
			>
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Location</FormLabel>
									<FormControl>
										<div className="relative">
											<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
											<Input
												{...field}
												placeholder="Toronto, ON"
												className="pl-10"
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="term"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Search for</FormLabel>
									<FormControl>
										<div className="relative">
											<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
											<Input
												{...field}
												placeholder="Italian, Sushi, Business lunch..."
												className="pl-10"
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="radius"
						render={({ field }) => (
							<FormItem className="space-y-2">
								<div className="flex justify-between">
									<FormLabel>
										Search Radius:{" "}
										{field.value < 1000
											? `${field.value} m`
											: `${(field.value / 1000).toFixed(1)} km`}
									</FormLabel>
								</div>
								<FormControl>
									<Controller
										control={form.control}
										name="radius"
										render={({ field: { value, onChange } }) => (
											<Slider
												value={[value]}
												min={100}
												max={10000}
												step={100}
												onValueChange={(vals) => onChange(vals[0])}
											/>
										)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="space-y-2">
						<FormLabel>Price Range</FormLabel>
						<div className="flex gap-2">
							{["1", "2", "3", "4"].map((price) => {
								const currentPrice = form.watch("price") || "";
								const isSelected = currentPrice.includes(price);

								return (
									<button
										key={price}
										type="button"
										onClick={() => togglePrice(price)}
										className={cn(
											"flex-1 py-2 rounded-md border border-border/50 transition-colors",
											isSelected
												? "bg-primary text-primary-foreground"
												: "bg-background hover:bg-secondary",
										)}
									>
										{"$".repeat(Number(price))}
									</button>
								);
							})}
						</div>

						<FormField
							control={form.control}
							name="categories"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Categories</FormLabel>
									<FormControl>
										<MultiSelect
											options={categoryOptions}
											selected={selectedCategories}
											onChange={handleCategoryChange}
											placeholder="Select restaurant categories"
											className="min-h-9"
										/>
									</FormControl>
									<FormDescription>
										Select one or more restaurant categories
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="open_now"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										id="open_now"
									/>
								</FormControl>
								<FormLabel className="text-sm font-medium cursor-pointer">
									Open Now
								</FormLabel>
							</FormItem>
						)}
					/>

					<button
						type="button"
						onClick={() => setShowAdvanced(!showAdvanced)}
						className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
					>
						<Filter className="h-3 w-3" />
						{showAdvanced ? "Hide" : "Show"} advanced filters
					</button>

					{showAdvanced && (
						<div className="space-y-4 pt-2 border-t border-border/30">
							<FormField
								control={form.control}
								name="sort_by"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Sort By</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select how to sort results" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="best_match">Best Match</SelectItem>
												<SelectItem value="rating">Rating</SelectItem>
												<SelectItem value="review_count">
													Review Count
												</SelectItem>
												<SelectItem value="distance">Distance</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="attributes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Attributes (comma-separated)</FormLabel>
										<FormControl>
											<Input {...field} placeholder="hot_and_new,reservation" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="limit"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Maximum Results</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												min={1}
												max={50}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}

					<button
						type="button"
						onClick={() => setShowReservation(!showReservation)}
						className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
					>
						<Calendar className="h-3 w-3" />
						{showReservation ? "Hide" : "Show"} reservation options
					</button>

					{showReservation && (
						<div className="space-y-4 pt-2 border-t border-border/30">
							<FormField
								control={form.control}
								name="reservation_date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Reservation Date</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="date"
												placeholder="YYYY-MM-DD"
												onChange={(e) => field.onChange(e.target.value)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="reservation_time"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Reservation Time</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="time"
												placeholder="HH:MM"
												onChange={(e) => field.onChange(e.target.value)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="reservation_covers"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Number of People</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												min={1}
												max={10}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}
				</div>

				<Button
					type="submit"
					disabled={isLoading}
					className="bg-red-600 hover:bg-red-700 transition-colors duration-300 w-full"
				>
					{isLoading ? "Searching..." : "Search Restaurants"}
				</Button>
			</form>
		</Form>
	);
};

export default SearchForm;
