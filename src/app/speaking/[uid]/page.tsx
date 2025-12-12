import { SinglePageHeader } from "@/components/SinglePageHeader";
import { SPEAKING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { htmlSerializer } from "@/utils/htmlSerialiser";
import { asHTML } from "@prismicio/client";
import styles from "./page.module.css";
type Params = { uid: string };

export default async function SpeakingWork({
	params,
}: {
	params: Promise<Params>;
}) {
	const { uid } = await params;
	const client = createClient();
	const speakingWorks = await client.getAllByType(SPEAKING_CUSTOM_TYPE);
	console.log({ speakingWorks });

	const page = speakingWorks.find(({ uid: pageUid }) => pageUid === uid)!;
	const html = asHTML(page.data.project_body, { serializer: htmlSerializer });
	return (
		<>
			<div className="tight-container">
				<SinglePageHeader
					title={page.data.project_title}
					type={page.data.project_type}
					year={page.data.project_year}
				/>
				<main className={`${styles.main} typeset`}>
					<div dangerouslySetInnerHTML={{ __html: html }}></div>
				</main>
			</div>
		</>
	);
}
