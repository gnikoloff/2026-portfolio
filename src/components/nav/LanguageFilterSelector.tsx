import { FilterState, TechTag } from "@/types";
import { ChangeEvent } from "react";

import styles from "./FilterSelector.module.css";

function LanguageFilterSelector({
	languages,
	filters,
	onChange,
}: {
	languages: TechTag[];
	filters: FilterState;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
	const val = filters.languages[0] || "";
	const isActive = val !== "";
	return (
		<div className={`${styles.root} btn-simple`}>
			<select
				id="language-select"
				className={`${styles.input} ${isActive ? styles.inputFocus : ""} ${isActive ? "active" : ""}`}
				value={val}
				onChange={onChange}
			>
				<option value="">All Languages</option>
				{languages.map((lang) => (
					<option key={lang.name} value={lang.name}>
						{lang.name}
					</option>
				))}
			</select>
		</div>
	);
}

LanguageFilterSelector.displayName = "LanguageFilterSelector";

export default LanguageFilterSelector;
