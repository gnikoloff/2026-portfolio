import { KeyTextField } from "@prismicio/client";
import Link from "next/link";

import styles from "./PrevNextWorkNav.module.css";

function PrevNextWorkNav({
	prevLink,
	prevTitle,
	nextLink,
	nextTitle,
}: {
	prevLink: string;
	prevTitle: KeyTextField;
	nextLink: string;
	nextTitle: KeyTextField;
}) {
	return (
		<div className={styles.root}>
			<Link className={`${styles.link} btn-simple`} href={prevLink}>
				<div className={"sub-nav-container"}>
					<i className={`${styles.arrow} ${styles.prevArrow}`}>←</i>
					{prevTitle}
				</div>
			</Link>
			<Link className={`${styles.link} btn-simple`} href={nextLink}>
				<div className={"sub-nav-container"}>
					{nextTitle}
					<i className={`${styles.arrow} ${styles.nextArrow}`}>→</i>
				</div>
			</Link>
		</div>
	);
}

PrevNextWorkNav.displayName = "PrevNextWorkNav";

export default PrevNextWorkNav;
