import Link from "@/components/CustomLink";
import { KeyTextField } from "@prismicio/client";
import styles from "./ArticleFooter.module.css";

function ArticleFooter({
	prevWorkLink,
	prevWorkTitle,
	nextWorkLink,
	nextWorkTitle,
}: {
	prevWorkLink: string;
	prevWorkTitle: KeyTextField;
	nextWorkLink: string;
	nextWorkTitle: KeyTextField;
}) {
	return (
		<footer className={styles.root}>
			<Link
				href={prevWorkLink}
				className={`${styles.workLink} ${styles.prevLink} btn`}
			>
				<i>←</i>
				{prevWorkTitle}
			</Link>
			<Link
				href={nextWorkLink}
				className={`${styles.workLink} ${styles.nextLink} btn`}
			>
				{nextWorkTitle}
				<i>→</i>
			</Link>
		</footer>
	);
}

ArticleFooter.displayName = "ArticleFooter";

export default ArticleFooter;
