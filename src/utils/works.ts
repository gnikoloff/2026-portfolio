import { WorkDocument } from "../../prismicio-types";

export function getPrevNextWorks(
	works: WorkDocument[],
	currUid: string,
): [WorkDocument, WorkDocument] {
	const sortedWorks = [...works].sort(
		(
			{ data: { project_year: projectYearA } },
			{ data: { project_year: projectYearB } },
		) => Number(projectYearB) - Number(projectYearA),
	);
	const currWorkIdx = sortedWorks.findIndex(
		({ uid: pageUid }) => pageUid == currUid,
	);
	const prevWorkIdx = currWorkIdx === 0 ? works.length - 1 : currWorkIdx - 1;
	const nextWorkIdx = currWorkIdx === works.length - 1 ? 0 : currWorkIdx + 1;
	const prevWork = sortedWorks[prevWorkIdx];
	const nextWork = sortedWorks[nextWorkIdx];
	return [prevWork, nextWork];
}

export function getPrevNextWorkLinks(
	works: WorkDocument[],
	currUid: string,
): [string, string] {
	const [prevWork, nextWork] = getPrevNextWorks(works, currUid);
	const prevWorkLink = `/work/${prevWork.uid}`;
	const nextWorkLink = `/work/${nextWork.uid}`;
	return [prevWorkLink, nextWorkLink];
}
