import Link from "@/components/CustomLink";
import { useAppData } from "@/contexts/DataContext";
import { getPrevNextWorkLinks, getPrevNextWorks } from "@/utils/works";
import { usePathname } from "next/navigation";
import PrevNextWorkNav from "./PrevNextWorkNav";
import styles from "./SingleWorkNavigation.module.css";

export default function SingleWorkNavigation({
	pathname: pathnameProp,
}: {
	pathname?: string;
}) {
	const currentPathname = usePathname();
	const pathname = pathnameProp || currentPathname;
	const uid = pathname.split("/").pop()!;
	const { works } = useAppData();
	const [prevWork, nextWork] = getPrevNextWorks(works, uid);
	const [prevWorkLink, nextWorkLink] = getPrevNextWorkLinks(works, uid);
	return (
		<div className={styles.root}>
			<Link href="/" className="btn-simple">
				<div className={`${styles.backWrapper} sub-nav-container`}>Back</div>
			</Link>
			<div className={styles.subNavWrapper}>
				<PrevNextWorkNav
					nextLink={nextWorkLink}
					nextTitle={nextWork.data.project_title}
					prevLink={prevWorkLink}
					prevTitle={prevWork.data.project_title}
				/>
			</div>
		</div>
	);
}
