import Container from "./layout/Container";

export const HeroSection = () => {
	return (
		<Container className="relative z-10">
			<div className="max-w-3xl mx-auto">
				<div
					className="mb-4 animate-fade-up"
					style={{ animationDelay: "0.1s" }}
				>
					<span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
						Bain Restaurant Recommender
					</span>
				</div>
				<h1
					className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 animate-fade-up"
					style={{ animationDelay: "0.2s" }}
				>
					Find the Perfect Restaurant for Your Business Meeting
				</h1>
				<p
					className="text-lg text-muted-foreground mb-8 animate-fade-up"
					style={{ animationDelay: "0.3s" }}
				>
					Discover top-rated restaurants in Toronto that are ideal for client
					meetings, team dinners, and business engagements.
				</p>
			</div>
		</Container>
	);
};
