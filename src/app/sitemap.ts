import {
	ABOUT_URL_SEGMENT_NAME,
	BASE_URL,
	CONTACT_URL_SEGMENT_NAME,
	WORKS_CUSTOM_TYPE,
	WORKS_URL_SEGMENT_NAME,
	WRITING_URL_SEGMENT_NAME,
} from "@/constants";
import { createClient } from "@/prismicio";
import getBlogPosts from "@/utils/get-blog-posts";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const rootRoutes = [
		"",
		`/${WORKS_URL_SEGMENT_NAME}`,
		`/${WRITING_URL_SEGMENT_NAME}`,
		`/${ABOUT_URL_SEGMENT_NAME}`,
		`/${CONTACT_URL_SEGMENT_NAME}`,
	].map((route) => ({
		url: `${BASE_URL}${route}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: route === "" ? 1 : 0.8,
	}));

	const client = createClient();
	const works = await client.getAllByType(WORKS_CUSTOM_TYPE);
	const articles = await getBlogPosts();

	const workRoutes = works.map((work) => ({
		url: `${BASE_URL}/${WORKS_URL_SEGMENT_NAME}/${work.uid}`,
		lastModified: new Date(work.last_publication_date),
		changeFrequency: "yearly" as const,
		priority: 0.7,
	}));

	const articleRoutes = articles.map((work) => ({
		url: `${BASE_URL}/${WRITING_URL_SEGMENT_NAME}/${work.uid}`,
		lastModified: new Date(work.last_publication_date),
		changeFrequency: "yearly" as const,
		priority: 0.6,
	}));

	return [...rootRoutes, ...workRoutes, ...articleRoutes];
}
