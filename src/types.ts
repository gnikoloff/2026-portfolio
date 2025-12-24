// src/types/filters.ts

import { NumberField } from "@prismicio/client";
import {
	BlogDocument,
	SpeakingDocument,
	WorkDocument,
} from "../prismicio-types";

export interface TableContentsEntry {
	id: string;
	label: string;
	children?: TableContentsEntry[];
}

export interface CharData {
	positions: number[];
	normals: number[];
	uvs: number[];
	tangents: number[];
	indices: number[];
}

export type NavType =
	| "home"
	| "speaking"
	| "speaking-single"
	| "blog"
	| "blog-single"
	| "work"
	| "about"
	| "contact"
	| "html-sitemap"
	| "privacy-policy"
	| "imprint";

export type WorkTag =
	| ""
	| "Javascript"
	| "Swift"
	| "C"
	| "C++"
	| "WebAssembly"
	| "WebGL"
	| "WebGPU"
	| "Metal"
	| "HTML"
	| "CSS"
	| "SVG"
	| "Wordpress"
	| "Drupal"
	| "SwiftUI"
	| "ARKit"
	| "Three.js"
	| "VR"
	| "React"
	| "Express.js"
	| "canvas2d";

export type TechCategory =
	| "language"
	| "frontend"
	| "backend"
	| "graphics-2d"
	| "graphics-3d"
	| "graphics-ar-vr";

export interface WorkTechTag {
	name: WorkTag;
	category: TechCategory;
	compatibleLanguages?: WorkTag[];
}

export interface FilterState {
	yearRange: [number | null, number | null];
	languages: WorkTag[];
	technologies: WorkTag[];
}

export interface FilterStore {
	filters: FilterState;
	setFilters: (filters: FilterState) => void;
	setYearRange: (range: [number | null, number | null]) => void;
	setLanguages: (languages: WorkTag[]) => void;
	setTechnologies: (technologies: WorkTag[]) => void;
	clearFilters: () => void;
}

export const TECH_TAGS: WorkTechTag[] = [
	// Languages
	{ name: "Javascript", category: "language" },
	{ name: "Swift", category: "language" },
	{ name: "C++", category: "language" },
	{ name: "C", category: "language" },
	{ name: "HTML", category: "language" },
	{ name: "CSS", category: "language" },

	// Frontend - Web
	{
		name: "React",
		category: "frontend",
		compatibleLanguages: ["Javascript", "HTML", "CSS"],
	},

	// Frontend - Native
	{
		name: "SwiftUI",
		category: "frontend",
		compatibleLanguages: ["Swift"],
	},

	// Backend - Web
	{
		name: "Express.js",
		category: "backend",
		compatibleLanguages: ["Javascript"],
	},
	{
		name: "Wordpress",
		category: "backend",
		compatibleLanguages: ["HTML", "CSS"],
	},
	{
		name: "Drupal",
		category: "backend",
		compatibleLanguages: ["HTML", "CSS"],
	},

	// 2D Graphics - Web
	{
		name: "canvas2d",
		category: "graphics-2d",
		compatibleLanguages: ["Javascript"], // Only Javascript
	},
	{
		name: "SVG",
		category: "graphics-2d",
		compatibleLanguages: ["Javascript", "HTML"], // Not CSS
	},

	// 3D Graphics - Web
	{
		name: "WebGL",
		category: "graphics-3d",
		compatibleLanguages: ["Javascript"],
	},
	{
		name: "WebGPU",
		category: "graphics-3d",
		compatibleLanguages: ["Javascript"],
	},
	{
		name: "Three.js",
		category: "graphics-3d",
		compatibleLanguages: ["Javascript"],
	},
	{
		name: "WebAssembly",
		category: "graphics-3d",
		compatibleLanguages: ["C", "C++"], // Only C and C++
	},

	// 3D Graphics - Native
	{
		name: "Metal",
		category: "graphics-3d",
		compatibleLanguages: ["Swift", "C++"], // Swift and C++ only
	},

	// AR/VR
	{
		name: "ARKit",
		category: "graphics-ar-vr",
		compatibleLanguages: ["Swift"],
	},
	{
		name: "VR",
		category: "graphics-ar-vr",
		compatibleLanguages: ["C++", "Javascript"],
	},
];

export const TECH_CATEGORY_LABELS: Record<TechCategory, string> = {
	language: "Languages",
	frontend: "Frontend",
	backend: "Backend",
	"graphics-2d": "2D Graphics",
	"graphics-3d": "3D Graphics",
	"graphics-ar-vr": "AR/VR",
};

// Helper functions
export function getLanguages(inputs: WorkTechTag[] = []): WorkTechTag[] {
	const out = TECH_TAGS.filter((tag) => tag.category === "language");
	if (inputs.length === 0) {
		return out;
	}
	return out.filter((tag) =>
		inputs.some((inputTag) => inputTag.name === tag.name),
	);
}

export function getTechnologies(): WorkTechTag[] {
	return TECH_TAGS.filter((tag) => tag.category !== "language");
}

export function getTechnologiesByCategory(): Record<
	TechCategory,
	WorkTechTag[]
> {
	const grouped: Record<TechCategory, WorkTechTag[]> = {
		language: [],
		frontend: [],
		backend: [],
		"graphics-2d": [],
		"graphics-3d": [],
		"graphics-ar-vr": [],
	};

	TECH_TAGS.forEach((tag) => {
		if (tag.category !== "language") {
			grouped[tag.category].push(tag);
		}
	});

	return grouped;
}

/**
 * Get array of years from 2014 to current year
 */
export function getWorksYearRange(works: WorkDocument[]): number[] {
	const min = works.reduce((acc, work) => {
		const year = work.data.project_year ?? new Date().getFullYear();
		if (year < acc) {
			acc = year;
		}
		return acc;
	}, Number.MAX_SAFE_INTEGER);
	const max = works.reduce((acc, work) => {
		const year = work.data.project_year ?? new Date().getFullYear();
		if (year > acc) {
			acc = year;
		}
		return acc;
	}, Number.MIN_SAFE_INTEGER);
	const years = [];
	for (let year = min; year <= max; year++) {
		years.push(year);
	}
	return years;
}

export function getBlogYearRange(articles: BlogDocument[]): NumberField[] {
	return articles.reduce((acc: NumberField[], article) => {
		if (acc.includes(article.data.year)) {
			return acc;
		}
		acc.push(article.data.year);
		return acc;
	}, []);
}

export function getSpeakingYearRange(
	articles: SpeakingDocument[],
): NumberField[] {
	return articles.reduce((acc: NumberField[], article) => {
		if (acc.includes(article.data.project_year)) {
			return acc;
		}
		acc.push(article.data.project_year);
		return acc;
	}, []);
}
