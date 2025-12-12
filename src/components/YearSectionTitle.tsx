import { NumberField } from "@prismicio/client";

import styles from "./YearSectionTitle.module.css";

export function YearSectionTitle({ year }: { year: NumberField }) {
	return <h2 className={styles.root}>{year}</h2>;
}
