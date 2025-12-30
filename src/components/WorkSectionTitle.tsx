import styles from "./WorkSectionTitle.module.css";

export function WorkSectionTitle({
	title,
	hasMarginTop,
}: {
	title: string;
	hasMarginTop: boolean;
}) {
	return (
		<h2 className={`${styles.root} ${hasMarginTop ? "" : styles.noMarginTop}`}>
			{title}
		</h2>
	);
}
