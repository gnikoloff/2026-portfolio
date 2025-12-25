// src/app/page.tsx
import { PAGE_TITLE } from "@/constants";
import { FilterState, Tag } from "@/types/filters";
import { type Metadata } from "next";
import HomeClient from "../components/HomeClient";

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
		languages: params.language ? [params.language as Tag] : [],
		technologies: params.technology ? [params.technology as Tag] : [],
	};

	return <HomeClient initialFilters={initialFilters} />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: PAGE_TITLE,
		// description: page.data.meta_description,
		// openGraph: {
		// 	images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
		// },
	};
}
