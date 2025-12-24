"use client";

import {
	SPEAKING_URL_SEGMENT_NAME,
	WRITING_URL_SEGMENT_NAME,
} from "@/constants";
import { FilterState } from "@/types";
import { usePathname } from "next/navigation";
import styles from "./WorkTagsList.module.css";

export default function WorkTagsList({
	tags,
	filters = undefined,
}: {
	tags: string[];
	filters?: FilterState;
}) {
	const pathname = usePathname();
	return (
		<ul className={styles.root}>
			{tags.map((tech) => {
				const isMarked =
					(filters &&
						(pathname === "/" ||
							pathname === `/${WRITING_URL_SEGMENT_NAME}` ||
							pathname === `/${SPEAKING_URL_SEGMENT_NAME}`) &&
						filters.languages.some((lang) => lang === tech)) ||
					(filters && filters.technologies.some((lang) => lang === tech));
				return (
					<li
						className={`${styles.listItem} ${isMarked ? styles.marked : ""}`}
						key={tech}
					>
						<h5 className={styles.tag}>{tech}</h5>
					</li>
				);
			})}
		</ul>
	);
}
