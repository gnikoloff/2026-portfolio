import { useAppData } from "@/contexts/DataContext";
import { useHomeFilterStore } from "@/store/filterStore";
import { getAvailableTechnologiesGrouped } from "@/utils/filterWorks";
import { useQueryState } from "nuqs";
import { getLanguages, getYearRange, Tag } from "../../types";
import styles from "./HomeNavigation.module.css";
import LanguageFilterSelector from "./LanguageFilterSelector";
import TechnologyFilterSelector from "./TechnologyFilterSelector";
import YearFilterSelector from "./YearFilterSelector";

export default function HomeNavigation() {
	const { filters, setYearRange, setLanguages, setTechnologies, clearFilters } =
		useHomeFilterStore();
	const { works } = useAppData();
	const languages = getLanguages();
	const years = getYearRange(works);
	const technologiesGrouped = getAvailableTechnologiesGrouped(filters);
	const [, setYearParam] = useQueryState("year");
	const [, setLanguageParam] = useQueryState("language");
	const [, setTechnologyParam] = useQueryState("technology");

	const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		const year = value ? Number(value) : null;
		setYearRange([year, year]);
		setYearParam(value || null);
	};

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value as Tag | "";
		const newLanguages = value ? [value] : [];
		setLanguages(newLanguages);
		setLanguageParam(value || null);
		setTechnologyParam(null);
	};

	const handleTechnologyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value as Tag | "";
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
		<div className={`${styles.root} sub-nav-container`}>
			<div className={styles.filterGroup}>
				<YearFilterSelector
					years={years}
					filters={filters}
					handleYearChange={handleYearChange}
				/>
			</div>

			<div className={styles.filterGroup}>
				<LanguageFilterSelector
					languages={languages}
					filters={filters}
					onChange={handleLanguageChange}
				/>
			</div>

			<div className={styles.filterGroup}>
				<TechnologyFilterSelector
					technologiesGrouped={technologiesGrouped}
					filters={filters}
					onChange={handleTechnologyChange}
				/>
			</div>

			{/* {hasActiveFilters && (
				
			)} */}
			<button
				onClick={handleClearFilters}
				className={`${styles.clearButton} ${hasActiveFilters ? styles.clearActive : ""}`}
			>
				Clear Filters
			</button>
		</div>
	);
}
