import Link from "@/components/CustomLink";
import {
	ABOUT_URL_SEGMENT_NAME,
	CONTACT_URL_SEGMENT_NAME,
	WRITING_URL_SEGMENT_NAME,
} from "@/constants";
import { NavType } from "@/types";
import styles from "./PageNavigation.module.css";

export default function PageNavigation({ navType }: { navType: NavType }) {
	const isWork = navType === "work" || navType === "home";
	const isWriting = navType === "blog" || navType === "blog-single";
	const isAbout = navType === "about";
	const isContact = navType === "contact";
	return (
		<nav className={styles.root}>
			<ul className={`navList ${styles.navList}`}>
				<li>
					<Link className={isWork ? styles.active : ""} href={"/"}>
						Works
					</Link>
				</li>
				<li>
					<Link
						className={isWriting ? styles.active : ""}
						href={`/${WRITING_URL_SEGMENT_NAME}`}
					>
						Writing
					</Link>
				</li>
				<li>
					<Link
						className={isAbout ? styles.active : ""}
						href={`/${ABOUT_URL_SEGMENT_NAME}`}
					>
						About
					</Link>
				</li>
				<li>
					<Link
						className={isContact ? styles.active : ""}
						href={`/${CONTACT_URL_SEGMENT_NAME}`}
					>
						Contact
					</Link>
				</li>
			</ul>
		</nav>
	);
}
