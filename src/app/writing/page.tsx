import WritingClient from "@/components/WritingClient";
import { WRITING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { FilterState } from "@/types";

export default async function Writing({
	searchParams,
}: {
	searchParams: { year?: string; language?: string; technology?: string };
}) {
	const params = await searchParams;
	const client = createClient();
	const writingWorks = await client.getAllByType(WRITING_CUSTOM_TYPE);

	const initialFilters: FilterState = {
		yearRange: params.year
			? [Number(params.year), Number(params.year)]
			: [null, null],
		languages: params.language ? [params.language as Tag] : [],
		technologies: params.technology ? [params.technology as Tag] : [],
	};

	return (
		<WritingClient
			writingWorks={writingWorks}
			initialFilters={initialFilters}
		/>
	);
}
