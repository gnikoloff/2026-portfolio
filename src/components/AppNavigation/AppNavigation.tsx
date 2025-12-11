// src/components/AppNavigation.tsx
"use client";

import { usePathname } from "next/navigation";
import { WorkDocument } from "../../../prismicio-types";
import styles from "./AppNavigation.module.css";
import HomeNavigation from "./HomeNavigation";
import SingleWorkNavigation from "./SingleWorkNavigation";

export default function AppNavigation({ works }: { works: WorkDocument[] }) {
	const pathname = usePathname();
	console.log({ pathname });
	return (
		<section id="app-nav" className={styles.root}>
			{pathname === "/" ? (
				<HomeNavigation />
			) : pathname.includes("work") ? (
				<SingleWorkNavigation works={works} />
			) : (
				<h4>Irem lopsum</h4>
			)}
		</section>
	);
}
