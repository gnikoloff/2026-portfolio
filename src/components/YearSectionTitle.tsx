import { NumberField } from "@prismicio/client";

import styles from "./YearSectionTitle.module.css";

export function YearSectionTitle({
	year,
	hasMarginTop,
}: {
	year: NumberField;
	hasMarginTop: boolean;
}) {
	return (
		<h2 className={`${styles.root} ${hasMarginTop ? "" : styles.noMarginTop}`}>
			{year}
		</h2>
	);
}
