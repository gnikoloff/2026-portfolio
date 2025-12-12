import { WRITING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { htmlSerializer } from "@/utils/htmlSerialiser";
import { asHTML } from "@prismicio/client";

import ArticleClient from "@/components/ArticleClient";
import styles from "./page.module.css";

type Params = { uid: string };

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
		<div className="tight-container">
			{/* <SinglePageHeader
				title={page.data.title}
				// type={page.data.}
				year={page.data.year}
			/> */}
			<main className={styles.main}>
				<ArticleClient title={page.data.title} html={html} />
			</main>
		</div>
	);
}
