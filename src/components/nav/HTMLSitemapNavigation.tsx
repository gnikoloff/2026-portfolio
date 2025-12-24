import styles from "./EmptyNavigation.module.css";
import TableContentsSelect from "./TableContentsSelect";

function HTMLSitemapNavigation() {
	return (
		<div className={styles.root}>
			<TableContentsSelect
				entries={[
					{ id: "root-pages", label: "Root Pages" },
					{ id: "works", label: "Works" },
					{ id: "speaking", label: "Speaking" },
					{ id: "writing", label: "Writing" },
				]}
			/>
		</div>
	);
}

HTMLSitemapNavigation.displayName = "HTMLSitemapNavigation";

export default HTMLSitemapNavigation;
