import { WorkDocument } from "../../prismicio-types";
import WorkPreview from "./WorkPreview";
import styles from "./YearWorkContainer.module.css";

export default function YearWorkContainer({
	year,
	works,
}: {
	year: string;
	works: WorkDocument[];
}) {
	return (
		<section className={styles.root}>
			<h2 className={styles.yearTitle}>{year}</h2>
			<div className={styles.worksWrapper}>
				{works.map((work) => (
					<WorkPreview
						key={work.uid}
						uid={work.uid}
						title={work.data.project_title}
						technologies={[...work.data.project_technologies_list]}
						previewImageURL={work.data.project_image.url}
					/>
				))}
			</div>
		</section>
	);
}
