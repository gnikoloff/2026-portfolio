import {
	HOME_CUSTOM_TYPE,
	PAGE_DESCRIPTION,
	PAGE_TITLE,
	SPEAKING_CUSTOM_TYPE,
} from "@/constants";
import { createClient } from "@/prismicio";
import { FilterState, WorkTag } from "@/types";
import { getFormattedPageMeta } from "@/utils/get-formatted-page-meta";
import { Metadata } from "next";
import SpeakingClient from "../../components/SpeakingClient";

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const home = await client.getSingle(HOME_CUSTOM_TYPE);
	return getFormattedPageMeta({
		title: `Speaking - ${PAGE_TITLE}`,
		description: PAGE_DESCRIPTION,
		img: home.data.preview,
	});
}

export default async function About({
	searchParams,
}: {
	searchParams: { year?: string; language?: string; technology?: string };
}) {
	const params = await searchParams;
	const client = createClient();
	const speakingWorks = await client.getAllByType(SPEAKING_CUSTOM_TYPE);

	const initialFilters: FilterState = {
		yearRange: params.year
			? [Number(params.year), Number(params.year)]
			: [null, null],
		languages: params.language ? [params.language as WorkTag] : [],
		technologies: params.technology ? [params.technology as WorkTag] : [],
	};

	return (
		<SpeakingClient
			speakingWorks={speakingWorks}
			initialFilters={initialFilters}
		/>
	);
}
