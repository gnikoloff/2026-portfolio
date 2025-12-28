// src/app/page.tsx
import { HOME_CUSTOM_TYPE, PAGE_DESCRIPTION, PAGE_TITLE } from "@/constants";
import { createClient } from "@/prismicio";
import { FilterState, WorkTag } from "@/types";
import { getFormattedPageMeta } from "@/utils/get-formatted-page-meta";
import { type Metadata } from "next";
import HomeClient from "../components/HomeClient";

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const home = await client.getSingle(HOME_CUSTOM_TYPE);
	return getFormattedPageMeta({
		title: PAGE_TITLE,
		description: PAGE_DESCRIPTION,
		img: home.data.preview,
	});
}

export default async function Home({
	searchParams,
}: {
	searchParams: { year?: string; language?: string; technology?: string };
}) {
	const params = await searchParams;

	// Parse search params into initial filter state
	const initialFilters: FilterState = {
		yearRange: params.year
			? [Number(params.year), Number(params.year)]
			: [null, null],
		languages: params.language ? [params.language as WorkTag] : [],
		technologies: params.technology ? [params.technology as WorkTag] : [],
	};

	return <HomeClient initialFilters={initialFilters} />;
}
