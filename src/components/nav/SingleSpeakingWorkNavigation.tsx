import { SPEAKING_URL_SEGMENT_NAME } from "@/constants";
import { useAppData } from "@/contexts/DataContext";
import {
	getPrevNextSpeakingWorkLinks,
	getPrevNextSpeakingWorks,
} from "@/utils/speakingWorks";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SingleSpeakingWorkNavigation() {
	const pathname = usePathname();
	const uid = pathname.split("/").pop()!;
	const { speakingWorks } = useAppData();
	const [prevWork, nextWork] = getPrevNextSpeakingWorks(speakingWorks, uid);
	const [prevWorkLink, nextWorkLink] = getPrevNextSpeakingWorkLinks(
		speakingWorks,
		uid,
	);
	return (
		<div>
			<Link href={`/${SPEAKING_URL_SEGMENT_NAME}`}>Back</Link>
			&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
			<Link href={prevWorkLink}>{prevWork.data.project_title}</Link>
			&nbsp;|&nbsp;
			<Link href={nextWorkLink}>{nextWork.data.project_title}</Link>
		</div>
	);
}

SingleSpeakingWorkNavigation.displayName = "SingleSpeakingWorkNavigation";

export default SingleSpeakingWorkNavigation;
