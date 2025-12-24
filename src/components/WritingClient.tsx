"use client";

import { useBlogFilterStore } from "@/store/blogFilterStore";
import { FilterState } from "@/types";
import {
	filterArticles,
	getSortedYears,
	groupWritingWorksByYear,
} from "@/utils/filterWorks";
import { useEffect, useRef } from "react";
import { BlogDocument } from "../../prismicio-types";
import NoResults from "./NoResults";
import PageLayout from "./PageLayout";
import YearWritingContainer from "./YearWritingContainer";

export default function WritingClient({
	writingWorks,
	initialFilters,
}: {
	writingWorks: BlogDocument[];
	initialFilters: FilterState;
}) {
	const { filters, setFilters } = useBlogFilterStore();

	const isInitialized = useRef(false);

	const activeFilters = isInitialized.current ? filters : initialFilters;

	const filteredWorks = filterArticles(writingWorks, activeFilters);
	const worksPerYears = groupWritingWorksByYear(filteredWorks);
	const sortedYears = getSortedYears(worksPerYears, "desc");

	useEffect(() => {
		if (!isInitialized.current) {
			setFilters(initialFilters);
			isInitialized.current = true;
		}
	}, []);

	return (
		<PageLayout hasMainPaddingBottom={true}>
			{filteredWorks.length === 0 ? (
				<NoResults workType="articles" />
			) : (
				<div className="tight-container">
					<div className="container">
						{sortedYears.map((year, i) => (
							<YearWritingContainer
								key={year}
								year={Number(year)}
								works={worksPerYears[year]}
								hasMarginTop={i > 0}
							/>
						))}
					</div>
				</div>
			)}
		</PageLayout>
	);
}
