import { WorkDocument } from "../../prismicio-types";
import WorkPreview from "./WorkPreview";
import { YearSectionTitle } from "./YearSectionTitle";
import styles from "./YearWorkContainer.module.css";

export default function YearWorkContainer({
	year,
	works,
}: {
	year: number;
	works: WorkDocument[];
}) {
	return (
		<section className={styles.root}>
			<YearSectionTitle year={year} />
			<div className={styles.worksWrapper}>
				{works.map((work) => (
					<WorkPreview
						isHomepage={true}
						key={work.uid}
						uid={work.uid}
						title={work.data.project_title}
						type={work.data.project_type}
						technologies={[...work.data.project_technologies_list]}
						previewImageURL={work.data.project_image.url}
					/>
				))}
			</div>
		</section>
	);
}
