// src/utils/filterWorks.ts

import {
	BlogDocument,
	SpeakingDocument,
	WorkDocument,
} from "../../prismicio-types";
import { FilterState, TECH_TAGS, TechTag } from "../types";

/**
 * Get available technologies based on selected languages
 */
export function getAvailableTechnologies(filters: FilterState): TechTag[] {
	const technologies = TECH_TAGS.filter((tag) => tag.category !== "language");

	// If no languages selected, show all technologies
	if (filters.languages.length === 0) {
		return technologies;
	}

	// Filter to only technologies compatible with selected languages
	return technologies.filter((tech) => {
		if (!tech.compatibleLanguages) return false;

		// Tech must be compatible with at least one selected language
		return tech.compatibleLanguages.some((lang) =>
			filters.languages.includes(lang),
		);
	});
}

/**
 * Get technologies grouped by category
 */
export function getAvailableTechnologiesGrouped(
	filters: FilterState,
): Record<string, TechTag[]> {
	const availableTechs = getAvailableTechnologies(filters);

	const grouped: Record<string, TechTag[]> = {
		Frontend: [],
		Backend: [],
		"2D Graphics": [],
		"3D Graphics": [],
		"AR/VR": [],
	};

	availableTechs.forEach((tech) => {
		switch (tech.category) {
			case "frontend":
				grouped["Frontend"].push(tech);
				break;
			case "backend":
				grouped["Backend"].push(tech);
				break;
			case "graphics-2d":
				grouped["2D Graphics"].push(tech);
				break;
			case "graphics-3d":
				grouped["3D Graphics"].push(tech);
				break;
			case "graphics-ar-vr":
				grouped["AR/VR"].push(tech);
				break;
		}
	});

	// Remove empty categories
	Object.keys(grouped).forEach((key) => {
		if (grouped[key].length === 0) {
			delete grouped[key];
		}
	});

	return grouped;
}

/**
 * Filter works based on selected filters
 */
export function filterWorks(
	works: WorkDocument[],
	filters: FilterState,
): WorkDocument[] {
	return works.filter((work) => {
		// Get all technologies from the work
		const workTechs =
			work.data.project_technologies_list
				?.map((t) => t.project_tech)
				.filter((tech) => tech !== null && tech !== undefined) || [];

		if (workTechs.length === 0) return false;

		// Filter by year range
		if (filters.yearRange[0] !== null || filters.yearRange[1] !== null) {
			const workYear = Number(work.data.project_year);

			if (filters.yearRange[0] !== null && workYear < filters.yearRange[0]) {
				return false;
			}
			if (filters.yearRange[1] !== null && workYear > filters.yearRange[1]) {
				return false;
			}
		}

		// Filter by language
		if (filters.languages.length > 0) {
			const hasMatchingLanguage = filters.languages.some((lang) =>
				workTechs.includes(lang),
			);
			if (!hasMatchingLanguage) return false;
		}

		// Filter by technology
		if (filters.technologies.length > 0) {
			const hasMatchingTech = filters.technologies.some((tech) =>
				workTechs.includes(tech),
			);
			if (!hasMatchingTech) return false;
		}

		return true;
	});
}

/**
 * Group works by year
 */
export function groupWorksByYear(
	works: WorkDocument[],
): Record<string, WorkDocument[]> {
	return works.reduce(
		(acc, work) => {
			const year = work.data.project_year?.toString() ?? "Unknown";
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(work);
			return acc;
		},
		{} as Record<string, WorkDocument[]>,
	);
}

export function groupSpeakingWorksByYear(
	works: SpeakingDocument[],
): Record<string, SpeakingDocument[]> {
	return works.reduce(
		(acc, work) => {
			const year = work.data.project_year?.toString() ?? "Unknown";
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(work);
			return acc;
		},
		{} as Record<string, SpeakingDocument[]>,
	);
}

export function groupWritingWorksByYear(
	works: BlogDocument[],
): Record<string, BlogDocument[]> {
	return works.reduce(
		(acc, work) => {
			const year = work.data.year?.toString() ?? "Unknown";
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(work);
			return acc;
		},
		{} as Record<string, BlogDocument[]>,
	);
}
/**
 * Get sorted years from grouped works
 */
export function getSortedYears<T>(
	groupedWorks: Record<string, T[]>,
	order: "asc" | "desc" = "desc",
): string[] {
	const years = Object.keys(groupedWorks);

	return years.sort((a, b) => {
		if (a === "Unknown") return 1;
		if (b === "Unknown") return -1;

		const yearA = Number(a);
		const yearB = Number(b);

		return order === "desc" ? yearB - yearA : yearA - yearB;
	});
}
