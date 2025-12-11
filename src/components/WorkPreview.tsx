import Link from "next/link";

import { KeyTextField } from "@prismicio/client";
import Image from "next/image";
import { WorkDocumentDataProjectTechnologiesListItem } from "../../prismicio-types";
import styles from "./WorkPreview.module.css";
import WorkTagsList from "./WorkTagsList";

export default function WorkPreview({
	title,
	type,
	technologies,
	uid,
	previewImageURL,
}: {
	title: KeyTextField;
	type: KeyTextField;
	technologies: WorkDocumentDataProjectTechnologiesListItem[];
	uid: string;
	previewImageURL: string | null | undefined;
}) {
	return (
		<Link
			href={`/work/${uid}`}
			className={styles.root}
			onClick={(_) => {
				sessionStorage.setItem("homeScrollY", pageYOffset.toString());
			}}
		>
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
			<section className={styles.body}>
				<h3 className={styles.title}>{title}</h3>
				<h5 className={styles.subtitle}>{type}</h5>
				<WorkTagsList
					tags={technologies.map(({ project_tech }) => project_tech as string)}
				/>
			</section>
		</Link>
	);
}
