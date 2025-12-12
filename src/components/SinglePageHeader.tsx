import { KeyTextField, NumberField } from "@prismicio/client";
import { WorkDocumentDataProjectTechnologiesListItem } from "../../prismicio-types";
import styles from "./SinglePageHeader.module.css";
import WorkTagsList from "./WorkTagsList";

export function SinglePageHeader({
	title,
	type,
	year,
	technologies = [],
}: {
	title: KeyTextField;
	type: KeyTextField;
	year: NumberField;
	technologies?: WorkDocumentDataProjectTechnologiesListItem[];
}) {
	return (
		<header className={styles.root}>
			<div className={styles.titleWrapper}>
				<h1 className={styles.pageTitle}>{title}</h1>
				<h6>{year}</h6>
			</div>
			<div className={styles.secondaryWrapper}>
				<h3>{type}</h3>
				{technologies.length ? (
					<WorkTagsList
						tags={technologies.map(
							({ project_tech }) => project_tech as string,
						)}
					/>
				) : null}
			</div>
		</header>
	);
}
