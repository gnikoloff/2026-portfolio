import { useAppData } from "@/contexts/DataContext";
import { getPrevNextWorkLinks, getPrevNextWorks } from "@/utils/works";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SingleWorkNavigation.module.css";

export default function SingleWorkNavigation() {
	const pathname = usePathname();
	const uid = pathname.split("/").pop()!;
	const { works } = useAppData();
	const [prevWork, nextWork] = getPrevNextWorks(works, uid);
	const [prevWorkLink, nextWorkLink] = getPrevNextWorkLinks(works, uid);
	return (
		<div className={styles.root}>
			<Link href="/">Back</Link>
			&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
			<Link href={prevWorkLink}>{prevWork.data.project_title}</Link>
			&nbsp;|&nbsp;
			<Link href={nextWorkLink}>{nextWork.data.project_title}</Link>
		</div>
	);
}
