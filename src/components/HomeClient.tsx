// src/app/HomeClient.tsx
"use client";

import AppNavigation from "@/components/AppNavigation/AppNavigation";
import YearWorkContainer from "@/components/YearWorkContainer";
import { useFilterStore } from "@/store/filterStore";
import { FilterState } from "@/types";
import {
	filterWorks,
	getSortedYears,
	groupWorksByYear,
} from "@/utils/filterWorks";
import { PrismicRichText } from "@prismicio/react";
import { useEffect, useRef } from "react";
import { HomeDocument, WorkDocument } from "../../prismicio-types";

interface HomeClientProps {
	initialWorks: WorkDocument[];
	homePage: HomeDocument;
	initialFilters: FilterState;
}

export default function HomeClient({
	initialWorks,
	homePage,
	initialFilters,
}: HomeClientProps) {
	const { filters, setFilters } = useFilterStore();
	const isInitialized = useRef(false);

	// Initialize store from server-provided filters ONCE
	useEffect(() => {
		if (!isInitialized.current) {
			setFilters(initialFilters);
			isInitialized.current = true;
		}
	}, []);

	// Use initialFilters for first render, then switch to store
	const activeFilters = isInitialized.current ? filters : initialFilters;

	// Apply filters
	const filteredWorks = filterWorks(initialWorks, activeFilters);
	const worksPerYears = groupWorksByYear(filteredWorks);
	const sortedYears = getSortedYears(worksPerYears, "desc");

	useEffect(() => {
		const savedScroll = sessionStorage.getItem("homeScrollY");
		sessionStorage.removeItem("homeScrollY");
		if (savedScroll !== null) {
			window.scrollTo(0, parseInt(savedScroll, 10));
		}
	}, []);

	return (
		<div>
			<AppNavigation works={filteredWorks} />

			<div className="container">
				<PrismicRichText field={homePage.data.intro_text} />
			</div>

			<div className="container">
				{filteredWorks.length === 0 ? (
					<p>No projects match your filters.</p>
				) : (
					<>
						{sortedYears.map((year) => (
							<YearWorkContainer
								key={year}
								year={Number(year)}
								works={worksPerYears[year]}
							/>
						))}
					</>
				)}
			</div>
		</div>
	);
}
