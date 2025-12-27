import Link from "@/components/CustomLink";
import {
	HTML_SITEMAP_URL_SEGMENT_NAME,
	IMPRINT_URL_SEGMENT_NAME,
	PRIVACY_POLICY_URL_SEGMENT_NAME,
} from "@/constants";
import styles from "./AppFooter.module.css";
import SocialList from "./SocialList";

function AppFooter() {
	return (
		<footer className={`${styles.root} tight-container`}>
			<div className={styles.header}>
				<p className={styles.copyright}>
					©{new Date().getFullYear()} Georgi Nikolov{" "}
				</p>
				<SocialList navClassName={styles.navList} />
			</div>
			<div className={styles.footer}>
				<ul className={`navList ${styles.navList}`}>
					<li>
						<Link href={`/${PRIVACY_POLICY_URL_SEGMENT_NAME}`}>
							Privacy Policy
						</Link>
					</li>
					<li>
						<Link href={`/${IMPRINT_URL_SEGMENT_NAME}`}>Imprint</Link>
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
