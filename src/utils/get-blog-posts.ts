import { WRITING_CUSTOM_TYPE } from "@/constants";
import { createClient } from "@/prismicio";
import { BlogDocument } from "../../prismicio-types";

export default async function getBlogPosts(): Promise<BlogDocument[]> {
	const client = createClient();
	const isDev = process.env.NODE_ENV === "development";
	return (await client.getAllByType(WRITING_CUSTOM_TYPE)).filter(
		({ data: { visibility } }) => {
			if (!isDev) {
				return visibility === "public";
			}

			return true;
		},
	);
}
