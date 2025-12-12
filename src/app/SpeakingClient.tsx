"use client";

import YearSpeakingContainer from "@/components/YearSpeakingContainer";
import { getSortedYears, groupSpeakingWorksByYear } from "@/utils/filterWorks";
import { SpeakingDocument } from "../../prismicio-types";

export default function SpeakingClient({
	speakingWorks,
}: {
	speakingWorks: SpeakingDocument[];
}) {
	const worksPerYears = groupSpeakingWorksByYear(speakingWorks);
	const sortedYears = getSortedYears(worksPerYears, "desc");

	return (
		<div>
			<div className="container">
				{sortedYears.map((year) => (
					<YearSpeakingContainer
						key={year}
						year={year}
						works={worksPerYears[year]}
					/>
				))}
			</div>
		</div>
	);
}
