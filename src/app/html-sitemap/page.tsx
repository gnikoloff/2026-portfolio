import PageLayout from "@/components/PageLayout";
import {
	ABOUT_URL_SEGMENT_NAME,
	CONTACT_URL_SEGMENT_NAME,
	SPEAKING_CUSTOM_TYPE,
	SPEAKING_URL_SEGMENT_NAME,
	WORKS_CUSTOM_TYPE,
	WORKS_URL_SEGMENT_NAME,
	WRITING_CUSTOM_TYPE,
	WRITING_URL_SEGMENT_NAME,
} from "@/constants";
import { createClient } from "@/prismicio";
import Link from "next/link";

async function HTMLSitemap() {
	const client = createClient();
	const works = await client.getAllByType(WORKS_CUSTOM_TYPE);
	const speakingWorks = await client.getAllByType(SPEAKING_CUSTOM_TYPE);
	const articles = await client.getAllByType(WRITING_CUSTOM_TYPE);

	return (
		<PageLayout>
			<div className="tight-container typeset">
				<h1>HTML Sitemap</h1>
				<h2>Root Pages</h2>
				<ul>
					<li>
						<Link href={`/`}>Works</Link>
					</li>
					<li>
						<Link href={`/${SPEAKING_URL_SEGMENT_NAME}`}>Speaking</Link>
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
				<h2>Works</h2>
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
				<h2>Speaking</h2>
				<ul>
					{[...speakingWorks]
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
								<Link href={`/${SPEAKING_URL_SEGMENT_NAME}/${work.uid}`}>
									{work.data.project_title}
								</Link>
							</li>
						))}
				</ul>
				<h2>Writing</h2>
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
