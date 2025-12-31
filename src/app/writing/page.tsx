import WritingClient from "@/components/WritingClient";
import { HOME_CUSTOM_TYPE, PAGE_DESCRIPTION, PAGE_TITLE } from "@/constants";
import { createClient } from "@/prismicio";
import { FilterState, WorkTag } from "@/types";
import getBlogPosts from "@/utils/get-blog-posts";
import { getFormattedPageMeta } from "@/utils/get-formatted-page-meta";
import { asImageSrc } from "@prismicio/client";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const home = await client.getSingle(HOME_CUSTOM_TYPE);
	return getFormattedPageMeta({
		title: `Writing - ${PAGE_TITLE}`,
		description: PAGE_DESCRIPTION,
		imgUrl: asImageSrc(home.data.preview) ?? "",
	});
}

export default async function Writing({
	searchParams,
}: {
	searchParams: { year?: string; language?: string; technology?: string };
}) {
	const params = await searchParams;
	const writingWorks = await getBlogPosts();

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
