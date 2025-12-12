import { create } from "zustand";

interface UIStore {
	navigationX: number;
	navigationY: number;
	initNavigationX: number;
	initNavigationY: number;
	initedNavigation: boolean;
	setNavigationX: (v: number) => void;
	setNavigationY: (v: number) => void;
	setInitNavigationX: (v: number) => void;
	setInitNavigationY: (v: number) => void;
	setNavigationInited: (v: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
	navigationX: 0,
	navigationY: 0,
	initNavigationX: 0,
	initNavigationY: 0,
	initedNavigation: false,

	setNavigationX: (v: number) =>
		set((state) => ({
			...state,
			navigationX: v,
		})),

	setNavigationY: (v: number) =>
		set((state) => ({
			...state,
			navigationY: v,
		})),

	setInitNavigationX: (v: number) =>
		set((state) => ({
			...state,
			initNavigationX: v,
		})),

	setInitNavigationY: (v: number) =>
		set((state) => ({
			...state,
			initNavigationY: v,
		})),

	setNavigationInited: (v: boolean) =>
		set((state) => ({
			...state,
			initedNavigation: v,
		})),
}));
