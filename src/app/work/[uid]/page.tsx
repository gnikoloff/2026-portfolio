import AppNavigation from "@/components/AppNavigation/AppNavigation";
import WorkTagsList from "@/components/WorkTagsList";
import { createClient } from "@/prismicio";
import { htmlSerializer } from "@/utils/htmlSerialiser";
import { getPrevNextWorkLinks, getPrevNextWorks } from "@/utils/works";
import { asHTML } from "@prismicio/client";
import Link from "next/link";
import styles from "./page.module.css";

type Params = { uid: string };

export default async function Work({ params }: { params: Promise<Params> }) {
	const { uid } = await params;
	const client = createClient();
	const works = await client.getAllByType("work");
	const page = works.find(({ uid: pageUid }) => pageUid === uid)!;
	const html = asHTML(page.data.project_body, { serializer: htmlSerializer });
	const [prevWork, nextWork] = getPrevNextWorks(works, uid);
	const [prevWorkLink, nextWorkLink] = getPrevNextWorkLinks(works, uid);
	return (
		<>
			<AppNavigation works={works} />
			<div className="tight-container">
				<header className={styles.header}>
					<div className={styles.titleWrapper}>
						<h1 className={styles.pageTitle}>{page.data.project_title}</h1>
						<h6>{page.data.project_year}</h6>
					</div>
					<div className={styles.secondaryWrapper}>
						<h3>{page.data.project_type}</h3>
						<WorkTagsList
							tags={page.data.project_technologies_list.map(
								({ project_tech }) => project_tech as string,
							)}
						/>
					</div>
				</header>
				<main className={`${styles.main} typeset`}>
					<div dangerouslySetInnerHTML={{ __html: html }}></div>
				</main>
				<footer className={styles.footer}>
					<Link
						href={prevWorkLink}
						className={`${styles.footerWorkLink} ${styles.footerWorkLinkPrev}`}
					>
						<i>←</i>
						{prevWork.data.project_title}
					</Link>

					<Link
						href={nextWorkLink}
						className={`${styles.footerWorkLink} ${styles.footerWorkLinkNext}`}
					>
						{nextWork.data.project_title}
						<i>→</i>
					</Link>
				</footer>
			</div>
		</>
	);
}
