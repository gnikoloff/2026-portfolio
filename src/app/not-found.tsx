import PageLayout from "@/components/PageLayout";

import Link from "@/components/CustomLink";
import styles from "./not-found.module.css";

function NotFound() {
	return (
		<PageLayout>
			<div className={styles.root}>
				<h1 className={styles.title}>404</h1>
				<p>
					Page not found. Go to <Link href="/">homepage</Link>.
				</p>
			</div>
		</PageLayout>
	);
}

NotFound.displayName = "NotFound";

export default NotFound;
