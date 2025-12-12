// src/app/page.tsx
import { WORKS_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { FilterState, Tag } from "@/types/filters";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import HomeClient from "./HomeClient";

export default async function Home({
	searchParams,
}: {
	searchParams: { year?: string; language?: string; technology?: string };
}) {
	const params = await searchParams;
	const client = createClient();
	const page = await client.getSingle("home").catch(() => notFound());
	const works = await client.getAllByType(WORKS_CUSTOM_TYPE);

	// Parse search params into initial filter state
	const initialFilters: FilterState = {
		yearRange: params.year
			? [Number(params.year), Number(params.year)]
			: [null, null],
		languages: params.language ? [params.language as Tag] : [],
		technologies: params.technology ? [params.technology as Tag] : [],
	};

	return (
		<HomeClient
			initialWorks={works}
			homePage={page}
			initialFilters={initialFilters}
		/>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const page = await client.getSingle("home").catch(() => notFound());

	return {
		// title: page.data.meta_title,
		// description: page.data.meta_description,
		// openGraph: {
		// 	images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
		// },
	};
}
