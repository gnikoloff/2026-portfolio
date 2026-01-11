import AppHeaderBorder from "@/components/AppHeaderBorder";
import Link from "@/components/CustomLink";
import PageLayout from "@/components/PageLayout";
import {
	ABOUT_URL_SEGMENT_NAME,
	CONTACT_URL_SEGMENT_NAME,
	HOME_CUSTOM_TYPE,
	PAGE_DESCRIPTION,
	PAGE_TITLE,
	WORKS_CUSTOM_TYPE,
	WORKS_URL_SEGMENT_NAME,
	WRITING_URL_SEGMENT_NAME,
} from "@/constants";
import { createClient } from "@/prismicio";

import getBlogPosts from "@/utils/get-blog-posts";
import { getFormattedPageMeta } from "@/utils/get-formatted-page-meta";
import { asImageSrc } from "@prismicio/client";
import { Metadata } from "next";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const home = await client.getSingle(HOME_CUSTOM_TYPE);
	return getFormattedPageMeta({
		title: `HTML Sitemap - ${PAGE_TITLE}`,
		description: PAGE_DESCRIPTION,
		imgUrl: asImageSrc(home.data.preview) ?? "",
	});
}

async function HTMLSitemap() {
	const client = createClient();
	const works = await client.getAllByType(WORKS_CUSTOM_TYPE);
	const articles = await getBlogPosts();

	return (
		<PageLayout>
			<AppHeaderBorder />
			<div className={`tight-container typeset ${styles.root}`}>
				<h1>HTML Sitemap</h1>
				<h2 id="root-pages">Root Pages</h2>
				<ul>
					<li>
						<Link href={`/`}>Works</Link>
					</li>
					<li>
						<Link href={`/${WRITING_URL_SEGMENT_NAME}`}>Writing</Link>
					</li>
					<li>
						<Link href={`/${ABOUT_URL_SEGMENT_NAME}`}>About</Link>
					</li>
					<li>
						<Link href={`/${CONTACT_URL_SEGMENT_NAME}`}>Contact</Link>
					</li>
				</ul>
				<h2 id="works">Works</h2>
				<ul>
					{[...works]
						.sort(
							(
								{ first_publication_date: aPubDate },
								{ first_publication_date: bPubDate },
							) => {
								const dateA = new Date(aPubDate).getTime();
								const dateB = new Date(bPubDate).getTime();
								return dateB - dateA;
							},
						)
						.map((work) => (
							<li key={work.uid}>
								<Link href={`/${WORKS_URL_SEGMENT_NAME}/${work.uid}`}>
									{work.data.project_title}
								</Link>
							</li>
						))}
				</ul>
				<h2 id="writing">Writing</h2>
				<ul>
					{[...articles]
						.sort(
							(
								{ first_publication_date: aPubDate },
								{ first_publication_date: bPubDate },
							) => {
								const dateA = new Date(aPubDate).getTime();
								const dateB = new Date(bPubDate).getTime();
								return dateB - dateA;
							},
						)
						.map((work) => (
							<li key={work.uid}>
								<Link href={`/${WRITING_URL_SEGMENT_NAME}/${work.uid}`}>
									{work.data.title}
								</Link>
							</li>
						))}
				</ul>
			</div>
		</PageLayout>
	);
}

HTMLSitemap.displayName = "HTMLSitemap";

export default HTMLSitemap;
