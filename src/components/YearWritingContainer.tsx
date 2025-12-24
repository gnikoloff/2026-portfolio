import { BlogDocument } from "../../prismicio-types";
import { YearSectionTitle } from "./YearSectionTitle";

import ArticlePreview from "./ArticlePreview";
import styles from "./YearWritingContainer.module.css";

export default function YearWritingContainer({
	year,
	works,
	hasMarginTop,
}: {
	year: number;
	works: BlogDocument[];
	hasMarginTop: boolean;
}) {
	return (
		<section className={styles.root}>
			<YearSectionTitle year={year} hasMarginTop={hasMarginTop} />
			<div className={styles.worksWrapper}>
				<ul>
					{[...works]
						.sort(
							(
								{ first_publication_date: aPubDate },
								{ first_publication_date: bPubDate },
							) => {
								return (
									new Date(bPubDate).getTime() - new Date(aPubDate).getTime()
								);
							},
						)
						.map((work) => {
							// @ts-ignore
							const url = work.data.external_link.url;

							return (
								<li key={work.uid} className={styles.listItem}>
									<ArticlePreview
										externalURL={url}
										externalResourceName={work.data.external_resource_name}
										uid={work.uid}
										title={work.data.title}
										date={new Date(work.first_publication_date)}
										tags={work.data.article_technologies}
									/>
								</li>
							);
						})}
				</ul>
			</div>
		</section>
	);
}
