import PageLayout from "@/components/PageLayout";
import {
	ABOUT_CUSTOM_TYPE,
	ABOUT_SECTION_EXPERIENCE,
	ABOUT_SECTION_INTRO,
	ABOUT_SECTION_SKILLS,
} from "@/constants";
import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";

import styles from "./page.module.css";

async function About() {
	const client = await createClient();
	const page = await client.getSingle(ABOUT_CUSTOM_TYPE);
	return (
		<PageLayout>
			<div className="typeset tight-container">
				<header>{/* <h1 style={{ marginTop: 0 }}>{title}</h1> */}</header>
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
