import { getSortedYears, groupWritingWorksByYear } from "@/utils/filterWorks";
import { BlogDocument } from "../../prismicio-types";
import YearWritingContainer from "./YearWritingContainer";

export default function WritingClient({
	writingWorks,
}: {
	writingWorks: BlogDocument[];
}) {
	const worksPerYears = groupWritingWorksByYear(writingWorks);
	const sortedYears = getSortedYears(worksPerYears, "desc");

	return (
		<div className="tight-container">
			<div className="container">
				{sortedYears.map((year) => (
					<YearWritingContainer
						key={year}
						year={Number(year)}
						works={worksPerYears[year]}
					/>
				))}
			</div>
		</div>
	);
}
