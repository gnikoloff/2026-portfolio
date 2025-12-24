import { useSpeakingFilterStore } from "@/store/speakingFilterStore";
import { SpeakingDocument } from "../../prismicio-types";
import WorkPreview from "./WorkPreview";
import { YearSectionTitle } from "./YearSectionTitle";
import styles from "./YearWorkContainer.module.css";

export default function YearSpeakingContainer({
	year,
	works,
	hasMarginTop,
}: {
	year: number;
	works: SpeakingDocument[];
	hasMarginTop: boolean;
}) {
	const { filters } = useSpeakingFilterStore();
	return (
		<section className={styles.root}>
			<YearSectionTitle year={year} hasMarginTop={hasMarginTop} />
			<div className={styles.worksWrapper}>
				{works.map((work) => (
					<WorkPreview
						isHomepage={false}
						key={work.uid}
						uid={work.uid}
						title={work.data.project_title}
						type={work.data.project_type}
						technologies={work.data.project_technologies.map(
							({ technology }) => technology as string,
						)}
						previewImageURL={work.data.project_image.url}
						filters={filters}
					/>
				))}
			</div>
		</section>
	);
}
