import { useAppData } from "@/contexts/DataContext";
import { useBlogFilterStore } from "@/store/blogFilterStore";
import { getBlogYearRange, WorkTag } from "@/types";
import {
	getAllArticleTechnologies,
	getAvailableTechnologies,
} from "@/utils/filterWorks";
import { useQueryState } from "nuqs";
import styles from "./FilterSelector.module.css";
import LanguageFilterSelector from "./LanguageFilterSelector";
import TechnologyFilterSelector from "./TechnologyFilterSelector";
import YearFilterSelector from "./YearFilterSelector";

function BlogNavigation() {
	const { filters, setYearRange, setLanguages, setTechnologies, clearFilters } =
		useBlogFilterStore();

	const [, setYearParam] = useQueryState("year");
	const [, setTechnologyParam] = useQueryState("technology");
	const [, setLanguageParam] = useQueryState("language");
	const { articles } = useAppData();

	const allTechnologies = getAllArticleTechnologies(articles);
	const languages = allTechnologies.filter(
		(tech) => tech.category === "language",
	);

	// Filter technologies based on selected languages (same as homepage)
	const availableTechnologies = getAvailableTechnologies(filters);
	const technologies = availableTechnologies.filter((tech) =>
		allTechnologies.some((t) => t.name === tech.name),
	);

	const years = getBlogYearRange(articles);

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
		// Clear technology when language changes
		setTechnologies([]);
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
			<div className={styles.filterGroup}>
				<YearFilterSelector
					years={years.map(Number)}
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
					technologies={technologies}
					filters={filters}
					onChange={handleTechnologyChange}
				/>
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

BlogNavigation.displayName = "BlogNavigation";

export default BlogNavigation;
