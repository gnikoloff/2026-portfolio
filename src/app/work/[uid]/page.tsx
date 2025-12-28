import AppHeaderBorder from "@/components/AppHeaderBorder";
import PageLayout from "@/components/PageLayout";
import WorkClient from "@/components/WorkClient";
import { WORKS_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { getFormattedPageMeta } from "@/utils/get-formatted-page-meta";
import { htmlSerializer } from "@/utils/htmlSerialiser";
import { getPrevNextWorkLinks, getPrevNextWorks } from "@/utils/works";
import { asHTML } from "@prismicio/client";
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
	const page = await client.getByUID(WORKS_CUSTOM_TYPE, uid);
	return getFormattedPageMeta({
		title: page.data.project_title as string,
		description: page.data.meta_description as string,
		img: page.data.meta_image,
	});
}

export default async function Work({ params }: { params: Promise<Params> }) {
	const { uid } = await params;
	const client = createClient();
	const works = await client.getAllByType(WORKS_CUSTOM_TYPE);
	const page = works.find(({ uid: pageUid }) => pageUid === uid)!;
	const html = asHTML(page.data.project_body, { serializer: htmlSerializer });
	const [prevWork, nextWork] = getPrevNextWorks(works, uid);
	const [prevWorkLink, nextWorkLink] = getPrevNextWorkLinks(works, uid);

	return (
		<PageLayout>
			<AppHeaderBorder />
			<div className={`${styles.main} tight-container`}>
				<WorkClient
					title={page.data.project_title}
					type={page.data.project_type}
					year={page.data.project_year}
					technologies={page.data.project_technologies_list}
					html={html}
					prevWorkLink={prevWorkLink}
					prevWorkTitle={prevWork.data.project_title}
					nextWorkLink={nextWorkLink}
					nextWorkTitle={nextWork.data.project_title}
				/>
			</div>
		</PageLayout>
	);
}
