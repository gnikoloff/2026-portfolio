import { create } from "zustand";

interface UIStore {
	isLoadingPage: boolean;

	setIsLoadingPage: (v: boolean) => void;
}

export const useLoadingStore = create<UIStore>((set) => ({
	isLoadingPage: false,
	setIsLoadingPage: (v: boolean) =>
		set((state) => ({
			...state,
			isLoadingPage: v,
		})),
}));
