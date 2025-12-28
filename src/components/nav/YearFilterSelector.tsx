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
		<div
			className={`${styles.root} btn-simple ${isActive ? styles.inputFocus : ""} ${isActive ? "active" : ""}`}
		>
			<select
				id="year-select"
				className={`${styles.input}`}
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
		</div>
	);
}

YearFilterSelector.displayName = "YearFilterSelector";

export default YearFilterSelector;
