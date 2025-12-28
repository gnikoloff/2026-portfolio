import { KeyTextField, NumberField } from "@prismicio/client";
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
	technologies?: string[];
}) {
	return (
		<header className={styles.root}>
			<div className={styles.titleWrapper}>
				<h1 className={styles.pageTitle}>{title}</h1>
				<h6>{year}</h6>
			</div>
			<div className={styles.secondaryWrapper}>
				<h3 className={styles.type}>{type}</h3>
				{technologies.length ? <WorkTagsList tags={technologies} /> : null}
			</div>
		</header>
	);
}
