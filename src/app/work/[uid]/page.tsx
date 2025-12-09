import { createClient } from "@/prismicio";
// import styles from "./page.module.css";

type Params = { uid: string };

export default async function Work({ params }: { params: Promise<Params> }) {
	const { uid } = await params;
	const client = createClient();
	const page = await client.getByUID("work", uid);
	return (
		<div>
			<h1>{page.data.project_title}</h1>
		</div>
	);
}
