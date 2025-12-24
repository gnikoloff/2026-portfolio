// src/app/HomeClient.tsx
"use client";

import YearWorkContainer from "@/components/YearWorkContainer";
import { useAppData } from "@/contexts/DataContext";
import { useHomeFilterStore } from "@/store/homeFilterStore";
import { FilterState } from "@/types";
import {
	filterWorks,
	getSortedYears,
	groupWorksByYear,
} from "@/utils/filterWorks";
import { useEffect, useRef } from "react";
import NoResults from "./NoResults";
import PageLayout from "./PageLayout";

interface HomeClientProps {
	initialFilters: FilterState;
}

export default function HomeClient({ initialFilters }: HomeClientProps) {
	const { filters, setFilters } = useHomeFilterStore();

	const isInitialized = useRef(false);

	// Initialize store from server-provided filters ONCE
	useEffect(() => {
		if (!isInitialized.current) {
			setFilters(initialFilters);
			isInitialized.current = true;
		}
	}, []);

	const { works } = useAppData();

	// Use initialFilters for first render, then switch to store
	const activeFilters = isInitialized.current ? filters : initialFilters;

	// Apply filters
	const filteredWorks = filterWorks(works, activeFilters);
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
		<PageLayout hasMainPaddingBottom={true}>
			{filteredWorks.length === 0 ? (
				<NoResults />
			) : (
				<>
					{sortedYears.map((year, i) => (
						<YearWorkContainer
							key={year}
							year={Number(year)}
							works={worksPerYears[year]}
							hasMarginTop={i > 0}
						/>
					))}
				</>
			)}
		</PageLayout>
	);
}
