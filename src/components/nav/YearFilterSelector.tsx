import { FilterState } from "@/types";
import { ChangeEvent } from "react";

function YearFilterSelector({
	years,
	filters,
	handleYearChange,
}: {
	years: number[];
	filters: FilterState;
	handleYearChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
	return (
		<select
			id="year-select"
			value={filters.yearRange[0] || ""}
			onChange={handleYearChange}
		>
			<option value="">All Years</option>
			{[...years]
				.sort((a, b) => b - a)
				.map((year) => (
					<option key={year} value={year}>
						{year}
					</option>
				))}
		</select>
	);
}

YearFilterSelector.displayName = "YearFilterSelector";

export default YearFilterSelector;
