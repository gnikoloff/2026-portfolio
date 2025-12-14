"use client";

import { useHomeFilterStore } from "@/store/filterStore";
import { Tag } from "@/types";
import { usePathname } from "next/navigation";
import styles from "./WorkTagsList.module.css";

export default function WorkTagsList({ tags }: { tags: string[] }) {
	const pathname = usePathname();
	const filters = useHomeFilterStore((state) => state.filters);
	return (
		<ul className={styles.root}>
			{tags.map((tech) => {
				const isMarked =
					(pathname === "/" && filters.languages.includes(tech as Tag)) ||
					filters.technologies.includes(tech as Tag);
				return (
					<li key={tech}>
						<h5>{isMarked ? <mark>{tech}</mark> : tech}</h5>
					</li>
				);
			})}
		</ul>
	);
}
