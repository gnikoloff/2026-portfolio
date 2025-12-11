// src/types/filters.ts

export type Tag =
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

export interface TechTag {
	name: Tag;
	category: TechCategory;
	compatibleLanguages?: Tag[];
}

export interface FilterState {
	yearRange: [number | null, number | null];
	languages: Tag[];
	technologies: Tag[];
}

export const TECH_TAGS: TechTag[] = [
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
export function getLanguages(): TechTag[] {
	return TECH_TAGS.filter((tag) => tag.category === "language");
}

export function getTechnologies(): TechTag[] {
	return TECH_TAGS.filter((tag) => tag.category !== "language");
}

export function getTechnologiesByCategory(): Record<TechCategory, TechTag[]> {
	const grouped: Record<TechCategory, TechTag[]> = {
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
export function getYearRange(): number[] {
	const currentYear = new Date().getFullYear();
	const years: number[] = [];
	for (let year = 2014; year <= currentYear; year++) {
		years.push(year);
	}
	return years;
}
