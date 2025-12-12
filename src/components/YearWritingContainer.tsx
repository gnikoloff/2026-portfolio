import { BlogDocument } from "../../prismicio-types";
import { YearSectionTitle } from "./YearSectionTitle";

import ArticlePreview from "./ArticlePreview";
import styles from "./YearWritingContainer.module.css";

export default function YearWritingContainer({
	year,
	works,
}: {
	year: number;
	works: BlogDocument[];
}) {
	return (
		<section className={styles.root}>
			<YearSectionTitle year={year} />
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
									/>
								</li>
							);
						})}
				</ul>
			</div>
		</section>
	);
}
