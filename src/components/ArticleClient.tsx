"use client";

import { KeyTextField, RTNode } from "@prismicio/client";
import Splide from "@splidejs/splide";
import hljs from "highlight.js";
// @ts-ignore
import ImageCompare from "image-compare-viewer";
import { useEffect, useRef } from "react";

import styles from "./ArticleClient.module.css";
import ArticleTableOfContents from "./ArticleTableOfContents";
import { SinglePageHeader } from "./SinglePageHeader";

export default function ArticleClient({
	title,
	date,
	technologies,
	html,
	tableOfContents,
}: {
	title: KeyTextField;
	html: string;
	technologies: string[];
	date: Date;
	tableOfContents: RTNode | undefined;
}) {
	const contentRef = useRef<HTMLDivElement>(null);
	const splideInited = useRef(false);
	const hljsInited = useRef(false);
	const imageCompareInited = useRef(false);

	useEffect(() => {
		const container = contentRef.current;
		if (!container) {
			return;
		}

		if (!splideInited.current) {
			// Query within the container, not the whole document
			container.querySelectorAll(".splide").forEach((el) => {
				new Splide(el as HTMLElement, {
					type: "fade",
					rewind: true,
					lazyLoad: "nearby",
				}).mount();
			});
			splideInited.current = true;
		}

		if (!hljsInited.current) {
			container.querySelectorAll("pre code").forEach((block) => {
				hljs.highlightBlock(block as HTMLElement);
			});
			hljsInited.current = true;
		}

		if (!imageCompareInited.current) {
			container.querySelectorAll(".image-compare").forEach((el) => {
				const pics = el.querySelectorAll("[data-label]");
				const beforePic = pics[0] as HTMLElement;
				const afterPic = pics[1] as HTMLElement;

				if (beforePic && afterPic) {
					new ImageCompare(el, {
						showLabels: true,
						labelOptions: {
							before: beforePic.dataset.label,
							after: afterPic.dataset.label,
							onHover: false,
						},
					}).mount();
				}
			});
			imageCompareInited.current = true;
		}

		// Cleanup function to destroy instances on unmount
		return () => {
			// Destroy Splide instances if they have a destroy method
			container.querySelectorAll(".splide").forEach((el) => {
				const splideInstance = (el as any).splide;
				if (splideInstance?.destroy) {
					splideInstance.destroy();
				}
			});
		};
	}, [title]);

	return (
		<div>
			<SinglePageHeader
				title={title}
				type={"Article"}
				year={new Date(date).getFullYear()}
				technologies={technologies}
			/>
			<div className={`typeset ${styles.root}`} ref={contentRef}>
				{tableOfContents && (
					<ArticleTableOfContents tableOfContents={tableOfContents} />
				)}
				<div dangerouslySetInnerHTML={{ __html: html }} />
			</div>
		</div>
	);
}
