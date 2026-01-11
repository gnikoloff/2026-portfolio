import { useHomeFilterStore } from "@/store/homeFilterStore";
import { WorkDocument } from "../../prismicio-types";
import WorkPreview from "./WorkPreview";
import { WorkSectionTitle } from "./WorkSectionTitle";
import styles from "./YearWorkContainer.module.css";

export default function YearWorkContainer({
	title,
	works,
	hasMarginTop,
}: {
	title: string;
	works: WorkDocument[];
	hasMarginTop: boolean;
}) {
	const { filters } = useHomeFilterStore();
	return (
		<section className={styles.root}>
			<WorkSectionTitle title={title} hasMarginTop={hasMarginTop} />
			<div className={styles.worksWrapper}>
				{works.map((work) => (
					<WorkPreview
						key={work.uid}
						uid={work.uid}
						title={work.data.project_title}
						type={work.data.project_type}
						technologies={work.data.project_technologies_list.map(
							({ project_tech }) => project_tech as string,
						)}
						previewImageURL={work.data.project_image.url}
						filters={filters}
					/>
				))}
			</div>
		</section>
	);
}
