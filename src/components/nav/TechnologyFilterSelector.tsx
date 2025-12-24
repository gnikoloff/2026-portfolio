import { FilterState, WorkTechTag } from "@/types";
import { ChangeEvent } from "react";

import styles from "./FilterSelector.module.css";

function TechnologyFilterSelector({
	technologies,
	filters,
	onChange,
}: {
	technologies: WorkTechTag[];
	filters: FilterState;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
	const val = filters.technologies[0] || "";
	const isActive = val !== "";

	return (
		<div
			className={`${styles.root} ${technologies.length === 0 ? "" : "btn-simple"}`}
		>
			<select
				id="tech-group-select"
				className={`${styles.input} ${isActive ? styles.inputFocus : ""} ${isActive ? "active" : ""} ${technologies.length === 0 ? styles.nonInteractable : ""}`}
				value={val}
				disabled={technologies.length === 0}
				onChange={onChange}
			>
				<option value="">All Technologies</option>
				{technologies.map((tech) => (
					<option key={tech.name} value={tech.name as string}>
						{tech.name}
					</option>
				))}
			</select>
		</div>
	);
}

TechnologyFilterSelector.displayName = "TechnologyFilterSelector";

export default TechnologyFilterSelector;
