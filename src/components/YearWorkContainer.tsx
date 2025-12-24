import { useHomeFilterStore } from "@/store/homeFilterStore";
import { WorkDocument } from "../../prismicio-types";
import WorkPreview from "./WorkPreview";
import { YearSectionTitle } from "./YearSectionTitle";
import styles from "./YearWorkContainer.module.css";

export default function YearWorkContainer({
	year,
	works,
	hasMarginTop,
}: {
	year: number;
	works: WorkDocument[];
	hasMarginTop: boolean;
}) {
	const { filters } = useHomeFilterStore();
	return (
		<section className={styles.root}>
			<YearSectionTitle year={year} hasMarginTop={hasMarginTop} />
			<div className={styles.worksWrapper}>
				{works.map((work) => (
					<WorkPreview
						isHomepage={true}
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
