import { FilterState } from "@/types";
import { ChangeEvent } from "react";

import styles from "./FilterSelector.module.css";

function YearFilterSelector({
	years,
	filters,
	handleYearChange,
}: {
	years: number[];
	filters: FilterState;
	handleYearChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
	const val = filters.yearRange[0] || "";
	const isActive = val !== "";

	return (
		<select
			id="year-select"
			className={`${styles.input} ${isActive ? styles.inputFocus : ""} btn ${isActive ? "active" : ""}`}
			value={val}
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
