import { SPEAKING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { FilterState, WorkTag } from "@/types";
import SpeakingClient from "../../components/SpeakingClient";

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
