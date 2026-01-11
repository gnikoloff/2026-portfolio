"use client";

import {
	ABOUT_URL_SEGMENT_NAME,
	CONTACT_URL_SEGMENT_NAME,
	HTML_SITEMAP_URL_SEGMENT_NAME,
	IMPRINT_URL_SEGMENT_NAME,
	PRIVACY_POLICY_URL_SEGMENT_NAME,
	WORKS_URL_SEGMENT_NAME,
	WRITING_URL_SEGMENT_NAME,
} from "@/constants";
import { useLoadingStore } from "@/store/loadingState";
import { NavType } from "@/types";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AboutNavigation from "./AboutNavigation";
import styles from "./AppNavigation.module.css";
import BlogNavigation from "./BlogNavigation";
import ContactNavigation from "./ContactNavigation";
import HomeNavigation from "./HomeNavigation";
import HTMLSitemapNavigation from "./HTMLSitemapNavigation";
import ImprintNavigation from "./ImprintNavigation";
import PageNavigation from "./PageNavigation";
import PrivacyPolicyNavigation from "./PrivacyPolicyNavigation";
import SingleBlogNavigation from "./SingleBlogNavigation";
import SingleWorkNavigation from "./SingleWorkNavigation";

const getNavType = (pathname: string): NavType => {
	if (pathname === `/${WRITING_URL_SEGMENT_NAME}`) return "blog";
	if (pathname.startsWith(`/${WRITING_URL_SEGMENT_NAME}/`))
		return "blog-single";
	if (pathname.includes(WORKS_URL_SEGMENT_NAME)) return "work";
	if (pathname.includes(ABOUT_URL_SEGMENT_NAME)) return "about";
	if (pathname.includes(CONTACT_URL_SEGMENT_NAME)) return "contact";
	if (pathname.includes(HTML_SITEMAP_URL_SEGMENT_NAME)) return "html-sitemap";
	if (pathname.includes(PRIVACY_POLICY_URL_SEGMENT_NAME))
		return "privacy-policy";
	if (pathname.includes(IMPRINT_URL_SEGMENT_NAME)) return "imprint";
	return "home";
};

function usePrevious<T>(value: T): T {
	const ref = useRef<T>(value);
	const prevRef = useRef<T>(value);

	if (ref.current !== value) {
		prevRef.current = ref.current;
		ref.current = value;
	}

	return prevRef.current;
}

export default function AppNavigation() {
	const pathname = usePathname();
	const currentNavType = getNavType(pathname);

	const prevNavTypeRef = useRef<NavType>(currentNavType);
	const prevPathnameRef = useRef(pathname);

	const [previousNavTypeState, setPreviousNavTypeState] =
		useState<NavType | null>(null);
	const [previousPathnameState, setPreviousPathnameState] = useState<
		string | null
	>(null);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [willTransition, setWillTransition] = useState(false);
	const isNavigatingRef = useRef(false);

	const { isLoadingPage } = useLoadingStore();

	useEffect(() => {
		if (currentNavType !== prevNavTypeRef.current) {
			isNavigatingRef.current = true; // Mark that we're navigating

			setPreviousNavTypeState(prevNavTypeRef.current);
			setPreviousPathnameState(prevPathnameRef.current);
			setWillTransition(true);

			requestAnimationFrame(() => {
				setWillTransition(false);
				setIsTransitioning(true);
				isNavigatingRef.current = false; // Navigation complete
			});

			prevNavTypeRef.current = currentNavType;
			prevPathnameRef.current = pathname;
		}
	}, [pathname, currentNavType]);

	const renderNav = (navType: NavType, frozenPathname?: string) => {
		const pathToUse = frozenPathname || pathname;

		switch (navType) {
			case "home":
				return <HomeNavigation />;
			case "work":
				return <SingleWorkNavigation pathname={pathToUse} />;
			case "contact":
				return <ContactNavigation />;
			case "about":
				return <AboutNavigation />;
			case "blog":
				return <BlogNavigation />;
			case "blog-single":
				return <SingleBlogNavigation pathname={pathToUse} />;
			case "html-sitemap":
				return <HTMLSitemapNavigation />;
			case "privacy-policy":
				return <PrivacyPolicyNavigation />;
			case "imprint":
				return <ImprintNavigation />;
		}
	};

	return (
		<div className={styles.navWrapper}>
			<div
				className={`${styles.subNavWrapper} ${styles.mainNav} ${isLoadingPage ? styles.isLoading : ""}`}
			>
				<div className={styles.mainNavScroll}>
					<div className={`sub-nav-container ${styles.mainNavWrapper}`}>
						<PageNavigation navType={getNavType(pathname)} />
					</div>
				</div>
			</div>
			<div className={`${styles.subNavWrapper} ${styles.secondaryNav}`}>
				{previousNavTypeState && previousPathnameState && (
					<div
						className={`${styles.navTransition} ${styles.prevNav} ${isTransitioning ? styles.isTransitioning : ""}`}
						onTransitionEnd={() => {
							if (!isNavigatingRef.current) {
								setIsTransitioning(false);
								setPreviousNavTypeState(null);
								setPreviousPathnameState(null);
							}
						}}
						onTransitionCancel={() => {
							if (!isNavigatingRef.current) {
								setIsTransitioning(false);
								setPreviousNavTypeState(null);
								setPreviousPathnameState(null);
							}
						}}
					>
						{renderNav(previousNavTypeState, previousPathnameState)}
					</div>
				)}
				<div
					className={`${styles.navTransition} ${styles.currNav} ${willTransition ? styles.willTransition : ""}`}
				>
					{renderNav(currentNavType)}
				</div>
			</div>
		</div>
	);
}
