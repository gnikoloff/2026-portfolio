import Link from "next/link";

import { useFilterStore } from "@/store/filterStore";
import { Tag } from "@/types";
import { KeyTextField } from "@prismicio/client";
import Image from "next/image";
import { WorkDocumentDataProjectTechnologiesListItem } from "../../prismicio-types";
import styles from "./WorkPreview.module.css";

export default function WorkPreview({
	title,
	technologies,
	uid,
	previewImageURL,
}: {
	title: KeyTextField;
	technologies: WorkDocumentDataProjectTechnologiesListItem[];
	uid: string;
	previewImageURL: string | null | undefined;
}) {
	const filters = useFilterStore((state) => state.filters);

	return (
		<Link href={`/work/${uid}`} className={styles.root}>
			<div className={styles.imageWrapper}>
				{previewImageURL ? (
					<Image
						fill
						src={previewImageURL}
						alt={`Thumbnail Preview Image`}
						className={styles.image}
					/>
				) : null}
			</div>
			<h3>{title}</h3>
			<ul className={styles.technologiesList}>
				{technologies.map((tech) => {
					const isMarked =
						filters.languages.includes(tech.project_tech as Tag) ||
						filters.technologies.includes(tech.project_tech as Tag);
					return (
						<li key={tech.project_tech}>
							<h5>
								{isMarked ? (
									<mark>{tech.project_tech}</mark>
								) : (
									tech.project_tech
								)}
							</h5>
						</li>
					);
				})}
			</ul>
		</Link>
	);
}
