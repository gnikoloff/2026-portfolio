import {
	QUERY_PARAM_LANGUAGE,
	QUERY_PARAM_TECHNOLOGY,
	QUERY_PARAM_YEAR,
} from "@/constants";
import { useAppData } from "@/contexts/DataContext";
import { useHomeFilterStore } from "@/store/homeFilterStore";
import { getAvailableTechnologiesGrouped } from "@/utils/filterWorks";
import { useQueryState } from "nuqs";
import { getLanguages, getWorksYearRange, WorkTag } from "../../types";
import styles from "./FilterSelector.module.css";
import LanguageFilterSelector from "./LanguageFilterSelector";
import TechnologyGroupFilterSelector from "./TechnologyGroupFilterSelector";
import YearFilterSelector from "./YearFilterSelector";

export default function HomeNavigation() {
	const { filters, setYearRange, setLanguages, setTechnologies, clearFilters } =
		useHomeFilterStore();
	const { works } = useAppData();
	const languages = getLanguages();
	const years = getWorksYearRange(works);
	const technologiesGrouped = getAvailableTechnologiesGrouped(filters);
	const [, setYearParam] = useQueryState(QUERY_PARAM_YEAR);
	const [, setLanguageParam] = useQueryState(QUERY_PARAM_LANGUAGE);
	const [, setTechnologyParam] = useQueryState(QUERY_PARAM_TECHNOLOGY);

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		const year = value ? Number(value) : null;
		setYearRange([year, year]);
		setYearParam(value || null);
	};

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value as WorkTag | "";
		const newLanguages = value ? [value] : [];
		setLanguages(newLanguages);
		setLanguageParam(value || null);
		setTechnologyParam(null);
	};

	const handleTechnologyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value as WorkTag | "";
		const newTechnologies = value ? [value] : [];
		setTechnologies(newTechnologies);
		setTechnologyParam(value || null);
	};

	const handleClearFilters = () => {
		clearFilters();
		setYearParam(null);
		setLanguageParam(null);
		setTechnologyParam(null);
	};

	const hasActiveFilters =
		filters.yearRange[0] !== null ||
		filters.yearRange[1] !== null ||
		filters.languages.length > 0 ||
		filters.technologies.length > 0;

	return (
		<div className={`${styles.wrapper} sub-nav-container`}>
			<div className={styles.filterGroupsWrapper}>
				<div className={`${styles.filterGroup} ${styles.yearFilterGroup}`}>
					<YearFilterSelector
						years={years}
						filters={filters}
						handleYearChange={handleYearChange}
					/>
				</div>

				<div className={`${styles.filterGroup} ${styles.langFilterGroup}`}>
					<LanguageFilterSelector
						languages={languages}
						filters={filters}
						onChange={handleLanguageChange}
					/>
				</div>

				<div className={`${styles.filterGroup} ${styles.techFilterGroup}`}>
					<TechnologyGroupFilterSelector
						technologiesGrouped={technologiesGrouped}
						filters={filters}
						onChange={handleTechnologyChange}
					/>
				</div>
			</div>

			<button
				onClick={handleClearFilters}
				className={`${styles.clearButton} ${hasActiveFilters ? styles.clearActive : ""}`}
			>
				Clear Filters
			</button>
		</div>
	);
}
