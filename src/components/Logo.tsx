import Link from "@/components/CustomLink";

import styles from "./Logo.module.css";

export default function Logo() {
	return (
		<Link className={styles.root} href={"/"}>
			Georgi Nikolov
		</Link>
	);
}
