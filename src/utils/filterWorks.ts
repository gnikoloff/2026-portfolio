// src/utils/filterWorks.ts

import {
	BlogDocument,
	SpeakingDocument,
	WorkDocument,
} from "../../prismicio-types";
import { FilterState, TECH_TAGS, WorkTechTag } from "../types";

/**
 * Get available technologies based on selected languages
 */
export function getAvailableTechnologies(filters: FilterState): WorkTechTag[] {
	const technologies = TECH_TAGS.filter((tag) => tag.category !== "language");

	if (filters.languages.length === 0) {
		return technologies;
	}

	return technologies.filter((tech) => {
		if (!tech.compatibleLanguages) return false;

		return tech.compatibleLanguages.some((lang) =>
			filters.languages.includes(lang),
		);
	});
}

export function getAllArticleTechnologies(
	articles: BlogDocument[],
): WorkTechTag[] {
	const techSet = new Set<string>();
	const technologies: WorkTechTag[] = [];

	articles.forEach((article) => {
		article.data.article_technologies.forEach((tech) => {
			if (tech.article_tech && !techSet.has(tech.article_tech)) {
				techSet.add(tech.article_tech);

				// Find the full tag definition from TECH_TAGS
				const fullTag = TECH_TAGS.find((tag) => tag.name === tech.article_tech);

				if (fullTag) {
					technologies.push(fullTag);
				} else {
					// Fallback if not in TECH_TAGS
					technologies.push({
						name: tech.article_tech,
						category: "frontend",
					});
				}
			}
		});
	});

	return technologies;
}

export function getAllSpeakingTechnologies(
	articles: SpeakingDocument[],
): WorkTechTag[] {
	const techSet = new Set<string>();
	const technologies: WorkTechTag[] = [];

	articles.forEach((article) => {
		article.data.project_technologies.forEach((tech) => {
			if (tech.technology && !techSet.has(tech.technology)) {
				techSet.add(tech.technology);

				// Find the full tag definition from TECH_TAGS
				const fullTag = TECH_TAGS.find((tag) => tag.name === tech.technology);

				if (fullTag) {
					technologies.push(fullTag);
				} else {
					// Fallback if not in TECH_TAGS
					technologies.push({
						name: tech.technology,
						category: "frontend",
					});
				}
			}
		});
	});

	return technologies;
}

/**
 * Get technologies grouped by category
 */
export function getAvailableTechnologiesGrouped(
	filters: FilterState,
): Record<string, WorkTechTag[]> {
	const availableTechs = getAvailableTechnologies(filters);

	const grouped: Record<string, WorkTechTag[]> = {
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

export function filterArticles(
	works: BlogDocument[],
	filters: FilterState,
): BlogDocument[] {
	return works.filter((work) => {
		// Get all technologies from the work
		const workTechs =
			work.data.article_technologies
				?.map((t) => t.article_tech)
				.filter((tech) => tech !== null && tech !== undefined) || [];

		if (workTechs.length === 0) return false;

		// Filter by year range
		if (filters.yearRange[0] !== null || filters.yearRange[1] !== null) {
			const workYear = Number(work.data.year);

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
				workTechs.some((workTech) => workTech === lang),
			);
			if (!hasMatchingLanguage) {
				return false;
			}
		}

		// Filter by technology
		if (filters.technologies.length > 0) {
			const hasMatchingTech = filters.technologies.some((tech) =>
				workTechs.some((workTech) => workTech === tech),
			);
			if (!hasMatchingTech) return false;
		}

		return true;
	});
}

export function filterSpeakingWorks(
	works: SpeakingDocument[],
	filters: FilterState,
): SpeakingDocument[] {
	return works.filter((work) => {
		// Get all technologies from the work
		const workTechs =
			work.data.project_technologies
				?.map((t) => t.technology)
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
				workTechs.some((workTech) => workTech === lang),
			);
			if (!hasMatchingLanguage) {
				return false;
			}
		}

		// Filter by technology
		if (filters.technologies.length > 0) {
			const hasMatchingTech = filters.technologies.some((tech) =>
				workTechs.some((workTech) => workTech === tech),
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
