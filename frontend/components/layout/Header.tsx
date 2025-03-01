"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";

const Header = () => {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
				scrolled ? "glass shadow-sm" : "bg-transparent",
			)}
		>
			<Container>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<h1
							className={cn(
								"text-lg font-medium tracking-tight transition-opacity duration-300",
								scrolled ? "opacity-100" : "opacity-90",
							)}
						>
							Restaurant<span className="font-semibold">Recommender</span>
						</h1>
					</div>
				</div>
			</Container>
		</header>
	);
};

export default Header;
