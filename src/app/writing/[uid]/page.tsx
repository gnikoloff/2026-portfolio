import { PAGE_TITLE, WRITING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { htmlSerializer } from "@/utils/htmlSerialiser";
import { asHTML } from "@prismicio/client";

import AppHeaderBorder from "@/components/AppHeaderBorder";
import ArticleClient from "@/components/ArticleClient";
import PageLayout from "@/components/PageLayout";
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
	const page = await client.getByUID(WRITING_CUSTOM_TYPE, uid);

	return {
		title: `${page.data.title} - ${PAGE_TITLE}`,
		description: page.data.seo_description,
		// openGraph: {
		// 	images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
		// },
	};
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
				{/* <SinglePageHeader
				title={page.data.title}
				// type={page.data.}
				year={page.data.year}
			/> */}

				<main className={styles.main}>
					<ArticleClient
						title={page.data.title}
						html={html}
						date={new Date(page.last_publication_date)}
					/>
				</main>
			</div>
		</PageLayout>
	);
}
