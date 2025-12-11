import { getPrevNextWorkLinks, getPrevNextWorks } from "@/utils/works";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WorkDocument } from "../../../prismicio-types";
import styles from "./SingleWorkNavigation.module.css";

export default function SingleWorkNavigation({
	works,
}: {
	works: WorkDocument[];
}) {
	const pathname = usePathname();
	const uid = pathname.split("/").pop()!;
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
