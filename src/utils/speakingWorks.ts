import { SPEAKING_URL_SEGMENT_NAME } from "@/constants";
import { SpeakingDocument } from "../../prismicio-types";

export function getPrevNextSpeakingWorks(
	works: SpeakingDocument[],
	currUid: string,
): [SpeakingDocument, SpeakingDocument] {
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

export function getPrevNextSpeakingWorkLinks(
	works: SpeakingDocument[],
	currUid: string,
): [string, string] {
	const [prevWork, nextWork] = getPrevNextSpeakingWorks(works, currUid);
	const prevWorkLink = `/${SPEAKING_URL_SEGMENT_NAME}/${prevWork.uid}`;
	const nextWorkLink = `/${SPEAKING_URL_SEGMENT_NAME}/${nextWork.uid}`;
	return [prevWorkLink, nextWorkLink];
}
