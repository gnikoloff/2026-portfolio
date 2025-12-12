import WritingClient from "@/components/WritingClient";
import { WRITING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";

export default async function Writing() {
	const client = createClient();
	const writingWorks = await client.getAllByType(WRITING_CUSTOM_TYPE);

	return <WritingClient writingWorks={writingWorks} />;
}
