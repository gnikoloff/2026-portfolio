import { FilterState, TechTag } from "@/types";
import { ChangeEvent } from "react";

function TechnologyFilterSelector({
	technologiesGrouped,
	filters,
	onChange,
}: {
	technologiesGrouped: Record<string, TechTag[]>;
	filters: FilterState;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
	return (
		<select
			id="tech-select"
			value={filters.technologies[0] || ""}
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
	);
}

TechnologyFilterSelector.displayName = "TechnologyFilterSelector";

export default TechnologyFilterSelector;
