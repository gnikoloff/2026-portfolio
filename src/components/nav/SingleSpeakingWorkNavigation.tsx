import Link from "@/components/CustomLink";
import { SPEAKING_URL_SEGMENT_NAME } from "@/constants";
import { useAppData } from "@/contexts/DataContext";
import {
	getPrevNextSpeakingWorkLinks,
	getPrevNextSpeakingWorks,
} from "@/utils/speakingWorks";
import { usePathname } from "next/navigation";
import PrevNextWorkNav from "./PrevNextWorkNav";
import styles from "./SingleWorkNavigation.module.css";

function SingleSpeakingWorkNavigation({
	pathname: pathnameProp,
}: {
	pathname?: string;
}) {
	const currentPathname = usePathname();
	const pathname = pathnameProp || currentPathname;

	const uid = pathname.split("/").pop()!;
	const { speakingWorks } = useAppData();
	const [prevWork, nextWork] = getPrevNextSpeakingWorks(speakingWorks, uid);
	const [prevWorkLink, nextWorkLink] = getPrevNextSpeakingWorkLinks(
		speakingWorks,
		uid,
	);
	return (
		<div className={styles.root}>
			<Link href={`/${SPEAKING_URL_SEGMENT_NAME}`} className="btn-simple">
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

SingleSpeakingWorkNavigation.displayName = "SingleSpeakingWorkNavigation";

export default SingleSpeakingWorkNavigation;
