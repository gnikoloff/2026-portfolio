"use client";

import YearSpeakingContainer from "@/components/YearSpeakingContainer";
import { useSpeakingFilterStore } from "@/store/speakingFilterStore";
import { FilterState } from "@/types";
import {
	filterSpeakingWorks,
	getSortedYears,
	groupSpeakingWorksByYear,
} from "@/utils/filterWorks";
import { useEffect, useRef } from "react";
import { SpeakingDocument } from "../../prismicio-types";
import AppHeaderBorder from "./AppHeaderBorder";
import NoResults from "./NoResults";
import PageLayout from "./PageLayout";

export default function SpeakingClient({
	speakingWorks,
	initialFilters,
}: {
	speakingWorks: SpeakingDocument[];
	initialFilters: FilterState;
}) {
	const { filters, setFilters } = useSpeakingFilterStore();
	const isInitialized = useRef(false);
	const activeFilters = isInitialized.current ? filters : initialFilters;
	const filteredWorks = filterSpeakingWorks(speakingWorks, activeFilters);
	const worksPerYears = groupSpeakingWorksByYear(filteredWorks);
	const sortedYears = getSortedYears(worksPerYears, "desc");

	useEffect(() => {
		if (!isInitialized.current) {
			setFilters(initialFilters);
			isInitialized.current = true;
		}
	}, []);

	return (
		<PageLayout hasMainPaddingBottom={true}>
			<AppHeaderBorder />
			{filteredWorks.length === 0 ? (
				<NoResults workType="projects" />
			) : (
				<div className="container">
					{sortedYears.map((year, i) => (
						<YearSpeakingContainer
							key={year}
							year={Number(year)}
							works={worksPerYears[year]}
							hasMarginTop={i > 0}
						/>
					))}
				</div>
			)}
		</PageLayout>
	);
}
