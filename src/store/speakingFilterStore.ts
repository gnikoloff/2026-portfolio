import { FilterState, FilterStore } from "@/types";
import { create } from "zustand";

const getInitialFilters = (): FilterState => ({
	yearRange: [null, null],
	languages: [],
	technologies: [],
});

export const useSpeakingFilterStore = create<FilterStore>((set) => ({
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
