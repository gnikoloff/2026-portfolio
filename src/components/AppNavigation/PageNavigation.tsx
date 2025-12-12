import { SPEAKING_URL_SEGMENT_NAME } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./PageNavigation.module.css";

export default function PageNavigation({}: {}) {
	const pathname = usePathname();
	return (
		<nav className={styles.root}>
			<ul className={styles.listRoot}>
				<li>
					<Link href={"/"}>Works</Link>
				</li>
				<li>
					<Link href={`/${SPEAKING_URL_SEGMENT_NAME}`}>Speaking</Link>
				</li>
				<li>
					<Link href={"/"}>Writing</Link>
				</li>
				<li>
					<Link href={"/"}>About</Link>
				</li>
				<li>
					<Link href={"/"}>Contact</Link>
				</li>
			</ul>
		</nav>
	);
}
