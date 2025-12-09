import { createClient } from "@/prismicio";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
	const client = createClient();
	const works = await client.getAllByType("work");
	return (
		<div className={styles.page}>
			{works.map((work) => (
				<h2 key={work.uid}>
					<Link href={`/work/${work.uid}`}>{work.data.project_title}</Link>
				</h2>
			))}
		</div>
	);
}
