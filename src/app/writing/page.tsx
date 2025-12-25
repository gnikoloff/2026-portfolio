import WritingClient from "@/components/WritingClient";
import { PAGE_TITLE, WRITING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { FilterState, WorkTag } from "@/types";

export const metadata = {
	title: `Writing - ${PAGE_TITLE}`,
	description: "Get in touch with Georgi Nikolov",
};

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
		languages: params.language ? [params.language as WorkTag] : [],
		technologies: params.technology ? [params.technology as WorkTag] : [],
	};

	return (
		<WritingClient
			writingWorks={writingWorks}
			initialFilters={initialFilters}
		/>
	);
}
