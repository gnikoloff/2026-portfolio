// src/store/filterStore.ts
import { FilterState, Tag } from "@/types";
import { create } from "zustand";

export interface FilterStore {
	filters: FilterState;
	setFilters: (filters: FilterState) => void;
	setYearRange: (range: [number | null, number | null]) => void;
	setLanguages: (languages: Tag[]) => void;
	setTechnologies: (technologies: Tag[]) => void;
	clearFilters: () => void;
}

const getInitialFilters = (): FilterState => ({
	yearRange: [null, null],
	languages: [],
	technologies: [],
});

export const useArticlesFilterStore = create<FilterStore>((set) => ({
	filters: getInitialFilters(),

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

	clearFilters: () => set({ filters: getInitialFilters() }),
}));

export const useHomeFilterStore = create<FilterStore>((set) => ({
	filters: getInitialFilters(),

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

	clearFilters: () => set({ filters: getInitialFilters() }),
}));
