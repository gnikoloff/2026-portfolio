import { WRITING_URL_SEGMENT_NAME } from "@/constants";
import { useAppData } from "@/contexts/DataContext";
import { TableContentsEntry } from "@/types";
import { usePathname } from "next/navigation";
import TableContentsSelect from "./TableContentsSelect";

function SingleBlogNavigation({
	pathname: pathnameProp,
}: {
	pathname?: string;
}) {
	const currentPathname = usePathname();
	const pathname = pathnameProp || currentPathname;

	const uid = pathname.split("/").pop()!;
	const { articles } = useAppData();
	const page = articles.find(({ uid: pageUID }) => pageUID === uid);

	if (
		!(page && page.data.table_of_contents && page.data.table_of_contents[0])
	) {
		return (
			<TableContentsSelect
				entries={[]}
				backURL={`/${WRITING_URL_SEGMENT_NAME}`}
			/>
		);
	}

	const entries: TableContentsEntry[] = JSON.parse(
		page.data.table_of_contents[0].text,
	);

	return (
		<div>
			<TableContentsSelect
				entries={entries}
				backURL={`/${WRITING_URL_SEGMENT_NAME}`}
			/>
		</div>
	);
}

SingleBlogNavigation.displayName = "SingleBlogNavigation";

export default SingleBlogNavigation;
