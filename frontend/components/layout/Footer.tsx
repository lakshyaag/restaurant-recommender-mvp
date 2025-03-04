"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";
import Link from "next/link";

const Footer = () => {
	return (
		<footer className="py-8 mt-auto bg-gray-50 dark:bg-gray-900">
			<Container>
				<div className="flex flex-col md:flex-row items-center justify-between">
					<div className="mb-4 md:mb-0">
						<h2 className="text-lg font-medium tracking-tight">
							Restaurant<span className="font-semibold">Recommender</span>
						</h2>
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
							Find your next favorite dining spot
						</p>
					</div>
					<div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
						<Link
							href="https://github.com/lakshyaag"
							className="text-sm hover:underline"
						>
							GitHub
						</Link>
					</div>
				</div>
				<div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
					<p className="text-sm text-center text-gray-500 dark:text-gray-400">
						© {new Date().getFullYear()} Lakshya Agarwal. All rights reserved.
					</p>
				</div>
			</Container>
		</footer>
	);
};

export default Footer;
