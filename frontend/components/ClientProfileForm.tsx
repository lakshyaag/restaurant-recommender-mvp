"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";
import {
	categoriesToString,
	getRestaurantCategories,
} from "@/lib/categories-utils";
import type { Option } from "@/components/ui/multi-select";
import useRestaurantStore from "@/store/useRestaurantStore";
import {
	CLIENT_DESIGNATIONS,
	MEETING_PURPOSES,
	MEETING_DURATIONS,
	RELATIONSHIP_STATUSES,
} from "@/lib/constants/client-form-options";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Calendar, MapPin, Utensils } from "lucide-react";

// Define schema for form validation
const clientProfileSchema = z
	.object({
		clientDesignation: z.enum(
			[...CLIENT_DESIGNATIONS.map((item) => item.value)] as [
				string,
				...string[],
			],
			{
				required_error: "Please select the client's designation",
			},
		),
		meetingPurpose: z.enum(
			[...MEETING_PURPOSES.map((item) => item.value)] as [string, ...string[]],
			{
				required_error: "Please select the purpose of the meeting",
			},
		),
		otherPurpose: z
			.string()
			.optional()
			.refine(
				(value) => {
					// If meeting purpose is "Other" then otherPurpose should be filled
					return true;
				},
				{
					message: "Please specify the meeting purpose",
				},
			),
		relationshipStatus: z.enum(
			[...RELATIONSHIP_STATUSES.map((item) => item.value)] as [
				string,
				...string[],
			],
			{
				required_error: "Please select the relationship status",
			},
		),
		location: z
			.string({
				required_error: "Please enter a location",
			})
			.min(2, {
				message: "Location must be at least 2 characters long",
			}),
		meetingDuration: z.enum(
			[...MEETING_DURATIONS.map((item) => item.value)] as [string, ...string[]],
			{
				required_error: "Please select meeting duration",
			},
		),
		dietaryRestrictions: z.string().optional(),
		additionalNotes: z.string().optional(),
		cuisinePreferences: z.string().optional(),
	})
	.refine(
		(data) => {
			// If meeting purpose is "Other", otherPurpose must be provided
			return (
				data.meetingPurpose !== "Other" ||
				(data.otherPurpose && data.otherPurpose.trim().length > 0)
			);
		},
		{
			message: "Please specify the other meeting purpose",
			path: ["otherPurpose"],
		},
	);

// Type for form values
export type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;

/**
 * Client profile form component
 * Captures client information and sends it to the API for processing
 */
const ClientProfileForm = () => {
	// State for selected cuisines
	const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
	const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Access restaurant store to update with search results
	const { searchRestaurants, isLoading, setSearchParams } =
		useRestaurantStore();

	// Load cuisine options on mount
	useEffect(() => {
		setCategoryOptions(getRestaurantCategories());
	}, []);

	// Initialize form with react-hook-form
	const form = useForm<ClientProfileFormValues>({
		resolver: zodResolver(clientProfileSchema),
		defaultValues: {
			clientDesignation: undefined,
			meetingPurpose: undefined,
			otherPurpose: "",
			relationshipStatus: undefined,
			location: "",
			meetingDuration: undefined,
			dietaryRestrictions: "",
			additionalNotes: "",
			cuisinePreferences: "",
		},
	});

	// Watch meeting purpose to show/hide other purpose field
	const meetingPurpose = form.watch("meetingPurpose");

	// Handle cuisine selection changes
	const handleCuisineChange = (selected: string[]) => {
		setSelectedCuisines(selected);
		form.setValue("cuisinePreferences", categoriesToString(selected), {
			shouldValidate: true,
		});
	};

	// Handle form submission
	const onSubmit = async (data: ClientProfileFormValues) => {
		toast.promise(
			async () => {
				try {
					setIsSubmitting(true);

					// Send client profile to the new API endpoint
					const response = await fetch("/api/clients", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					});

					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(
							errorData.message || "Failed to process client profile",
						);
					}

					const generatedSearchParams = await response.json();

					setSearchParams(generatedSearchParams.searchParams);

					await searchRestaurants(generatedSearchParams.searchParams);
				} catch (error) {
					toast.error(
						error instanceof Error
							? error.message
							: "Failed to generate recommendations",
					);
					console.error(error);
				} finally {
					setIsSubmitting(false);
				}
			},
			{
				loading: "Building profile...",
				success: "Recommendations generated successfully",
				error: "Failed to generate recommendations",
			},
		);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 bg-white rounded-xl shadow-sm p-6 border border-border/50"
			>
				{/* Client Information Section */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<UserCircle className="h-5 w-5 text-primary" />
						<h3 className="text-lg font-medium">Client Information</h3>
					</div>
					<Separator className="my-2" />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Client Designation Field */}
						<FormField
							control={form.control}
							name="clientDesignation"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Client Designation</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select client's designation" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{CLIENT_DESIGNATIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Relationship Status Field */}
						<FormField
							control={form.control}
							name="relationshipStatus"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Relationship Status</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select relationship status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{RELATIONSHIP_STATUSES.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Meeting Details Section */}
				<div className="space-y-4 pt-4">
					<div className="flex items-center gap-2">
						<Calendar className="h-5 w-5 text-primary" />
						<h3 className="text-lg font-medium">Meeting Details</h3>
					</div>
					<Separator className="my-2" />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Meeting Purpose Field */}
						<FormField
							control={form.control}
							name="meetingPurpose"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Purpose of Meeting</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select meeting purpose" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{MEETING_PURPOSES.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Other Purpose Field - Shown conditionally */}
						{meetingPurpose === "Other" && (
							<FormField
								control={form.control}
								name="otherPurpose"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Specify Purpose</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter the specific meeting purpose"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{/* Meeting Duration Field */}
						<FormField
							control={form.control}
							name="meetingDuration"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Meeting Duration</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select expected duration" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{MEETING_DURATIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Location Field - Full Width */}
					<div className="pt-2">
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center gap-1">
										<MapPin className="h-4 w-4 text-muted-foreground" />
										<FormLabel>Location</FormLabel>
									</div>
									<FormControl>
										<Input
											placeholder="Enter restaurant location, e.g., Downtown Toronto"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Where would you like to meet the client?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Preferences & Additional Details Section */}
				<div className="space-y-4 pt-4">
					<div className="flex items-center gap-2">
						<Utensils className="h-5 w-5 text-primary" />
						<h3 className="text-lg font-medium">
							Preferences & Additional Details
						</h3>
					</div>
					<Separator className="my-2" />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Dietary Restrictions Field */}
						<FormField
							control={form.control}
							name="dietaryRestrictions"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Dietary Restrictions</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g., Vegetarian, Gluten-free, Halal"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Any known dietary restrictions or preferences
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Cuisine Preferences Field */}
						<FormField
							control={form.control}
							name="cuisinePreferences"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cuisine Preferences</FormLabel>
									<FormControl>
										<MultiSelect
											selected={selectedCuisines}
											options={categoryOptions}
											onChange={handleCuisineChange}
											placeholder="Select preferred cuisines"
										/>
									</FormControl>
									<FormDescription>
										Select cuisines the client may prefer
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Additional Notes Field - Full Width */}
					<div className="pt-2">
						<FormField
							control={form.control}
							name="additionalNotes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Additional Notes</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Any other information about the client or the meeting"
											className="resize-none min-h-[80px]"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Include any other details that may be helpful for the search
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="pt-4">
					<Button
						type="submit"
						disabled={isLoading || isSubmitting}
						className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-300"
					>
						{isLoading || isSubmitting
							? "Processing..."
							: "Find Restaurants for Client"}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ClientProfileForm;
