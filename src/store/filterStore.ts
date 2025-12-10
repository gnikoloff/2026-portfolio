// src/store/filterStore.ts
import { FilterState, Tag } from "@/types";
import { create } from "zustand";

interface FilterStore {
	filters: FilterState;
	setFilters: (filters: FilterState) => void;
	setYearRange: (range: [number | null, number | null]) => void;
	setLanguages: (languages: Tag[]) => void;
	setTechnologies: (technologies: Tag[]) => void;
	clearFilters: () => void;
	initialize: (filters: FilterState) => void; // New method
}

const initialFilters: FilterState = {
	yearRange: [null, null],
	languages: [],
	technologies: [],
};

export const useFilterStore = create<FilterStore>((set) => ({
	filters: initialFilters,

	setFilters: (filters) => set({ filters }),

	setYearRange: (range) =>
		set((state) => ({
			filters: { ...state.filters, yearRange: range },
		})),

	setLanguages: (languages) =>
		set((state) => ({
			filters: { ...state.filters, languages, technologies: [] },
		})),

	setTechnologies: (technologies) =>
		set((state) => ({
			filters: { ...state.filters, technologies },
		})),

	clearFilters: () => set({ filters: initialFilters }),

	// Initialize store (can be called before hydration)
	initialize: (filters) => set({ filters }),
}));
