import PageLayout from "@/components/PageLayout";
import {
	ABOUT_CUSTOM_TYPE,
	ABOUT_SECTION_EXPERIENCE,
	ABOUT_SECTION_INTRO,
	ABOUT_SECTION_SKILLS,
	HOME_CUSTOM_TYPE,
	PAGE_DESCRIPTION,
	PAGE_TITLE,
} from "@/constants";
import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";

import AppHeaderBorder from "@/components/AppHeaderBorder";
import { getFormattedPageMeta } from "@/utils/get-formatted-page-meta";
import { Metadata } from "next";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
	const client = createClient();
	const home = await client.getSingle(HOME_CUSTOM_TYPE);
	return getFormattedPageMeta({
		title: `About - ${PAGE_TITLE}`,
		description: PAGE_DESCRIPTION,
		img: home.data.preview,
	});
}

async function About() {
	const client = await createClient();
	const page = await client.getSingle(ABOUT_CUSTOM_TYPE);
	return (
		<PageLayout>
			<AppHeaderBorder />
			<div className={`typeset tight-container ${styles.root}`}>
				<section
					id={ABOUT_SECTION_INTRO}
					className={`${styles.section} ${styles.borderBottom} ${styles.firstSection}`}
				>
					<PrismicRichText field={page.data.text} />
				</section>
				<section
					id={ABOUT_SECTION_SKILLS}
					className={`${styles.section} ${styles.borderBottom}`}
				>
					<PrismicRichText field={page.data.experience} />
				</section>
				<section id={ABOUT_SECTION_EXPERIENCE} className={styles.section}>
					<PrismicRichText field={page.data.work_experience} />
				</section>
			</div>
		</PageLayout>
	);
}

About.displayName = "About";

export default About;
