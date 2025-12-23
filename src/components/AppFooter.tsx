import { HTML_SITEMAP_URL_SEGMENT_NAME } from "@/constants";
import Link from "next/link";
import styles from "./AppFooter.module.css";
import SocialList from "./SocialList";

function AppFooter() {
	return (
		<footer className={`${styles.root} tight-container`}>
			<div className={styles.header}>
				<p>©{new Date().getFullYear()} Georgi Nikolov </p>
				<SocialList />
			</div>
			<div className={styles.footer}>
				<ul className="navList">
					<li>
						<a href="">Legal Notice</a>
					</li>
					<li>
						<Link href={`/${HTML_SITEMAP_URL_SEGMENT_NAME}`}>HTML Sitemap</Link>
					</li>
				</ul>
			</div>
		</footer>
	);
}

AppFooter.displayName = "AppFooter";

export default AppFooter;
