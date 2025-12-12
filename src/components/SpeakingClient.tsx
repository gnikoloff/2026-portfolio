"use client";

import YearSpeakingContainer from "@/components/YearSpeakingContainer";
import { getSortedYears, groupSpeakingWorksByYear } from "@/utils/filterWorks";
import { SpeakingDocument } from "../../prismicio-types";
import PageLayout from "./PageLayout";

export default function SpeakingClient({
	speakingWorks,
}: {
	speakingWorks: SpeakingDocument[];
}) {
	const worksPerYears = groupSpeakingWorksByYear(speakingWorks);
	const sortedYears = getSortedYears(worksPerYears, "desc");

	return (
		<PageLayout>
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
		</PageLayout>
	);
}
