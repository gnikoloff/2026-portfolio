import { FilterState, TechTag } from "@/types";
import { ChangeEvent } from "react";

function LanguageFilterSelector({
	languages,
	filters,
	onChange,
}: {
	languages: TechTag[];
	filters: FilterState;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
	return (
		<select
			id="language-select"
			value={filters.languages[0] || ""}
			onChange={onChange}
		>
			<option value="">All Languages</option>
			{languages.map((lang) => (
				<option key={lang.name} value={lang.name}>
					{lang.name}
				</option>
			))}
		</select>
	);
}

LanguageFilterSelector.displayName = "LanguageFilterSelector";

export default LanguageFilterSelector;
