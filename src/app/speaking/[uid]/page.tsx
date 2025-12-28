import AppHeaderBorder from "@/components/AppHeaderBorder";
import ArticleFooter from "@/components/ArticleFooter";
import PageLayout from "@/components/PageLayout";
import { SinglePageHeader } from "@/components/SinglePageHeader";
import { HOME_CUSTOM_TYPE, SPEAKING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { getFormattedPageMeta } from "@/utils/get-formatted-page-meta";
import { htmlSerializer } from "@/utils/htmlSerialiser";
import {
	getPrevNextSpeakingWorkLinks,
	getPrevNextSpeakingWorks,
} from "@/utils/speakingWorks";
import { asHTML, asImageSrc } from "@prismicio/client";
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
		client.getByUID(SPEAKING_CUSTOM_TYPE, uid),
	]);
	return getFormattedPageMeta({
		title: page.data.project_title as string,
		description: page.data.meta_description as string,
		imgUrl:
			asImageSrc(page.data.meta_image) ?? asImageSrc(home.data.preview) ?? "",
	});
}

export default async function SpeakingWork({
	params,
}: {
	params: Promise<Params>;
}) {
	const { uid } = await params;
	const client = createClient();
	const speakingWorks = await client.getAllByType(SPEAKING_CUSTOM_TYPE);

	const page = speakingWorks.find(({ uid: pageUid }) => pageUid === uid)!;
	const html = asHTML(page.data.project_body, { serializer: htmlSerializer });
	const [prevWork, nextWork] = getPrevNextSpeakingWorks(speakingWorks, uid);
	const [prevWorkLink, nextWorkLink] = getPrevNextSpeakingWorkLinks(
		speakingWorks,
		uid,
	);
	return (
		<PageLayout>
			<AppHeaderBorder />
			<div className="tight-container">
				<SinglePageHeader
					title={page.data.project_title}
					type={page.data.project_type}
					year={page.data.project_year}
				/>
				<main className={`${styles.main} typeset`}>
					<div dangerouslySetInnerHTML={{ __html: html }}></div>
				</main>
				<ArticleFooter
					prevWorkLink={prevWorkLink}
					prevWorkTitle={prevWork.data.project_title}
					nextWorkLink={nextWorkLink}
					nextWorkTitle={nextWork.data.project_title}
				/>
			</div>
		</PageLayout>
	);
}
