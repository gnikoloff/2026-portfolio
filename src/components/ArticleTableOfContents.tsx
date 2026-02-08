import { TableContentsEntry } from "@/types";
import { RTNode } from "@prismicio/client";
import styles from "./ArticleTableOfContents.module.css";

function ArticleTableOfContents({
	tableOfContents,
}: {
	tableOfContents: RTNode;
}) {
	const entries: TableContentsEntry[] = JSON.parse(
		// @ts-ignore
		tableOfContents.text,
	);
	console.log(entries);
	return (
		<details open className={styles.toc}>
			<summary className={styles.summary}>
				<h4 className={styles.headline}>Table of Contents</h4>
			</summary>
			<nav>
				<TableOfContents entries={entries} />
			</nav>
		</details>
	);
}

ArticleTableOfContents.displayName = "ArticleTableOfContents";

export default ArticleTableOfContents;

function TableOfContents({ entries }: { entries: TableContentsEntry[] }) {
	return (
		<ul>
			{entries.map((entry) => (
				<li key={entry.id}>
					<a href={`#${entry.id}`}>{entry.label}</a>
					{entry.children && entry.children.length > 0 && (
						<TableOfContents entries={entry.children} />
					)}
				</li>
			))}
		</ul>
	);
}
