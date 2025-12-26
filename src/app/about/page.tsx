import PageLayout from "@/components/PageLayout";
import {
	ABOUT_CUSTOM_TYPE,
	ABOUT_SECTION_EXPERIENCE,
	ABOUT_SECTION_INTRO,
	ABOUT_SECTION_SKILLS,
	PAGE_TITLE,
} from "@/constants";
import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";

import AppHeaderBorder from "@/components/AppHeaderBorder";
import { Metadata } from "next";
import styles from "./page.module.css";

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

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: `About - ${PAGE_TITLE}`,
		// description: page.data.meta_description,
		// openGraph: {
		// 	images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
		// },
	};
}
