"use client";

import { createContext, ReactNode, useContext } from "react";
import {
	AboutDocument,
	BlogDocument,
	HomeDocument,
	SpeakingDocument,
	WorkDocument,
} from "../../prismicio-types";

type AppData = {
	works: WorkDocument[];
	articles: BlogDocument[];
	speakingWorks: SpeakingDocument[];
	home: HomeDocument | null;
	about: AboutDocument | null;
};

const DataContext = createContext<AppData>({
	works: [],
	articles: [],
	speakingWorks: [],
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
