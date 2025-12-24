import { FilterState, WorkTechTag } from "@/types";
import { ChangeEvent } from "react";

import styles from "./FilterSelector.module.css";

function TechnologyGroupFilterSelector({
	technologiesGrouped,
	filters,
	onChange,
}: {
	technologiesGrouped: Record<string, WorkTechTag[]>;
	filters: FilterState;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
	const val = filters.technologies[0] || "";
	const isActive = val !== "";

	return (
		<div className={`${styles.root} btn-simple`}>
			<select
				id="tech-group-select"
				className={`${styles.input} ${isActive ? styles.inputFocus : ""} ${isActive ? "active" : ""}`}
				value={val}
				onChange={onChange}
			>
				<option value="">All Technologies</option>
				{Object.entries(technologiesGrouped).map(([category, techs]) => (
					<optgroup key={category} label={category}>
						{techs.map((tech) => (
							<option key={tech.name} value={tech.name}>
								{tech.name}
							</option>
						))}
					</optgroup>
				))}
			</select>
		</div>
	);
}

TechnologyGroupFilterSelector.displayName = "TechnologyFilterSelector";

export default TechnologyGroupFilterSelector;
