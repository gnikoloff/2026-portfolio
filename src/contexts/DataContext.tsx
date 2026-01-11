"use client";

import { createContext, ReactNode, useContext } from "react";
import {
	AboutDocument,
	BlogDocument,
	HomeDocument,
	WorkDocument,
} from "../../prismicio-types";

type AppData = {
	works: WorkDocument[];
	articles: BlogDocument[];
	home: HomeDocument | null;
	about: AboutDocument | null;
};

const DataContext = createContext<AppData>({
	works: [],
	articles: [],
	home: null,
	about: null,
});

export function DataProvider({
	children,
	data,
}: {
	children: ReactNode;
	data: AppData;
}) {
	return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export const useAppData = () => useContext(DataContext);
