"use client";

import { useUIStore } from "@/store/uiStore";
import { useEffect, useRef } from "react";
import AppHeader from "./AppHeader";

function PageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const {
		initedNavigation,
		setInitNavigationX,
		setInitNavigationY,
		setNavigationInited,
	} = useUIStore();

	const headerRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!(headerRef.current && bodyRef.current)) {
			return;
		}
		if (initedNavigation) {
			return;
		}
		const headerBBox = headerRef.current.getBoundingClientRect();
		const bodyBBox = bodyRef.current.getBoundingClientRect();

		const headerBotEdge = headerBBox.bottom;
		const mainTopEdge = bodyBBox.top;
		const mid = (headerBotEdge + mainTopEdge) * 0.5 + pageYOffset;
		console.log(mid);

		setInitNavigationY(mid);
		setInitNavigationX(headerBBox.left);
		setNavigationInited(true);
	}, []);

	return (
		<div>
			<AppHeader ref={headerRef} />
			<main id="app-main" className="container" ref={bodyRef}>
				{children}
			</main>
		</div>
	);
}

PageLayout.displayName = "Page Layout";

export default PageLayout;
