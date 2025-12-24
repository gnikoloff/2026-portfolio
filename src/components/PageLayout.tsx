"use client";

import { useUIStore } from "@/store/uiStore";
import { useEffect, useRef } from "react";
import AppFooter from "./AppFooter";

import styles from "./PageLayout.module.css";

function PageLayout({
	children,
	hasMainPaddingBottom = false,
}: Readonly<{
	children: React.ReactNode;
	hasMainPaddingBottom?: boolean;
}>) {
	const {
		initedNavigation,
		setInitNavigationX,
		setInitNavigationY,
		setNavigationInited,
	} = useUIStore();

	// const headerRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!bodyRef.current) {
			return;
		}
		if (initedNavigation) {
			return;
		}
		// const headerBBox = headerRef.current.getBoundingClientRect();
		const bodyBBox = bodyRef.current.getBoundingClientRect();

		const headerBotEdge = 0; // headerBBox.bottom;
		const mainTopEdge = bodyBBox.top;
		const mid = (headerBotEdge + mainTopEdge) * 0.5 + pageYOffset;

		setInitNavigationY(30);
		setInitNavigationX(innerWidth / 2 - 718 / 2);
		setNavigationInited(true);
	}, []);

	return (
		<div>
			<main
				id="app-main"
				className={`container ${hasMainPaddingBottom ? styles.paddingBottom : ""}`}
				ref={bodyRef}
			>
				{children}
			</main>
			<AppFooter />
		</div>
	);
}

PageLayout.displayName = "Page Layout";

export default PageLayout;
