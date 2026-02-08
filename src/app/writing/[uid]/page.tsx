import { HOME_CUSTOM_TYPE, WRITING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { htmlSerializer } from "@/utils/htmlSerialiser";
import { asHTML, asImageSrc } from "@prismicio/client";

import AppHeaderBorder from "@/components/AppHeaderBorder";
import ArticleClient from "@/components/ArticleClient";
import PageLayout from "@/components/PageLayout";
import { getFormattedPageMeta } from "@/utils/get-formatted-page-meta";
import { Metadata } from "next";
import styles from "./page.module.css";

type Params = { uid: string };

export async function generateMetadata({
	params,
}: {
	params: Promise<Params>;
}): Promise<Metadata> {
	const { uid } = await params;
	const client = createClient();

	const [home, page] = await Promise.all([
		client.getSingle(HOME_CUSTOM_TYPE),
		client.getByUID(WRITING_CUSTOM_TYPE, uid),
	]);

	return getFormattedPageMeta({
		title: page.data.title as string,
		description: page.data.metadata_description as string,
		imgUrl:
			asImageSrc(page.data.metadata_image) ??
			asImageSrc(home.data.preview) ??
			"",
	});
}
export default async function WritingWork({
	params,
}: {
	params: Promise<Params>;
}) {
	const { uid } = await params;
	const client = createClient();
	const page = await client.getByUID(WRITING_CUSTOM_TYPE, uid);
	const html = asHTML(page.data.body, { serializer: htmlSerializer });

	return (
		<PageLayout>
			<AppHeaderBorder />
			<div className="tight-container">
				<main className={styles.main}>
					<ArticleClient
						tableOfContents={
							page.data.table_of_contents && page.data.table_of_contents[0]
						}
						title={page.data.title}
						html={html}
						date={new Date(page.last_publication_date)}
						technologies={page.data.article_technologies.map(
							({ article_tech }) => article_tech as string,
						)}
					/>
				</main>
			</div>
		</PageLayout>
	);
}
