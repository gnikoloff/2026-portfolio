import { getSortedYears, groupWritingWorksByYear } from "@/utils/filterWorks";
import { BlogDocument } from "../../prismicio-types";
import PageLayout from "./PageLayout";
import YearWritingContainer from "./YearWritingContainer";

export default function WritingClient({
	writingWorks,
}: {
	writingWorks: BlogDocument[];
}) {
	const worksPerYears = groupWritingWorksByYear(writingWorks);
	const sortedYears = getSortedYears(worksPerYears, "desc");

	return (
		<PageLayout hasMainPaddingBottom={true}>
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
		</PageLayout>
	);
}
