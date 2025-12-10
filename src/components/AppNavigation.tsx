// src/components/AppNavigation.tsx
"use client";

import { useFilterStore } from "@/store/filterStore";
import { getAvailableTechnologiesGrouped } from "@/utils/filterWorks";
import { useQueryState } from "nuqs";
import { getLanguages, getYearRange, Tag } from "../types";
import styles from "./AppNavigation.module.css";

export default function AppNavigation() {
	const { filters, setYearRange, setLanguages, setTechnologies, clearFilters } =
		useFilterStore();

	const languages = getLanguages();
	const years = getYearRange();
	const technologiesGrouped = getAvailableTechnologiesGrouped(filters);

	const [yearParam, setYearParam] = useQueryState("year");
	const [languageParam, setLanguageParam] = useQueryState("language");
	const [technologyParam, setTechnologyParam] = useQueryState("technology");

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
		<section id="app-nav" className={styles.root}>
			<div className={styles.filters}>
				{/* Year Filter */}
				<div className={styles.filterGroup}>
					<label htmlFor="year-select">Year</label>
					<select
						id="year-select"
						value={filters.yearRange[0] || ""}
						onChange={handleYearChange}
						className={styles.select}
					>
						<option value="">All Years</option>
						{years.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
				</div>

				{/* Language Filter */}
				<div className={styles.filterGroup}>
					<label htmlFor="language-select">Language</label>
					<select
						id="language-select"
						value={filters.languages[0] || ""}
						onChange={handleLanguageChange}
						className={styles.select}
					>
						<option value="">All Languages</option>
						{languages.map((lang) => (
							<option key={lang.name} value={lang.name}>
								{lang.name}
							</option>
						))}
					</select>
				</div>

				{/* Technology Filter */}
				<div className={styles.filterGroup}>
					<label htmlFor="tech-select">Technology</label>
					<select
						id="tech-select"
						value={filters.technologies[0] || ""}
						onChange={handleTechnologyChange}
						className={styles.select}
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

				{/* Clear Filters Button */}
				{hasActiveFilters && (
					<button onClick={handleClearFilters} className={styles.clearButton}>
						Clear Filters
					</button>
				)}
			</div>
		</section>
	);
}
