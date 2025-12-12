// src/components/AppNavigation.tsx
"use client";

import { WORKS_CUSTOM_TYPE } from "@/constants";
import { usePathname } from "next/navigation";
import { WorkDocument } from "../../../prismicio-types";
import styles from "./AppNavigation.module.css";
import HomeNavigation from "./HomeNavigation";
import PageNavigation from "./PageNavigation";
import SingleWorkNavigation from "./SingleWorkNavigation";

export default function AppNavigation({ works }: { works: WorkDocument[] }) {
	const pathname = usePathname();
	console.log({ pathname });
	return (
		<section id="app-nav" className={styles.root}>
			<PageNavigation />
			{pathname === "/" ? (
				<HomeNavigation />
			) : pathname.includes(WORKS_CUSTOM_TYPE) ? (
				<SingleWorkNavigation works={works} />
			) : (
				<h4>Irem lopsum</h4>
			)}
		</section>
	);
}
