import {
	ABOUT_URL_SEGMENT_NAME,
	CONTACT_URL_SEGMENT_NAME,
	SPEAKING_URL_SEGMENT_NAME,
	WRITING_URL_SEGMENT_NAME,
} from "@/constants";
import Link from "next/link";
import styles from "./PageNavigation.module.css";

export default function PageNavigation({}: {}) {
	return (
		<nav className={styles.root}>
			<ul className={"navList"}>
				<li>
					<Link href={"/"}>Works</Link>
				</li>
				<li>
					<Link href={`/${SPEAKING_URL_SEGMENT_NAME}`}>Speaking</Link>
				</li>
				<li>
					<Link href={`/${WRITING_URL_SEGMENT_NAME}`}>Writing</Link>
				</li>
				<li>
					<Link href={`/${ABOUT_URL_SEGMENT_NAME}`}>About</Link>
				</li>
				<li>
					<Link href={`/${CONTACT_URL_SEGMENT_NAME}`}>Contact</Link>
				</li>
			</ul>
		</nav>
	);
}
