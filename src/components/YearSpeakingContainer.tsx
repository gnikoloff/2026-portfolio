import { SpeakingDocument } from "../../prismicio-types";
import WorkPreview from "./WorkPreview";
import styles from "./YearWorkContainer.module.css";

export default function YearSpeakingContainer({
	year,
	works,
}: {
	year: string;
	works: SpeakingDocument[];
}) {
	return (
		<section className={styles.root}>
			<h2 className={styles.yearTitle}>{year}</h2>
			<div className={styles.worksWrapper}>
				{works.map((work) => (
					<WorkPreview
						isHomepage={false}
						key={work.uid}
						uid={work.uid}
						title={work.data.project_title}
						type={work.data.project_type}
						previewImageURL={work.data.project_image.url}
					/>
				))}
			</div>
		</section>
	);
}
