"use client";

import { KeyTextField, NumberField } from "@prismicio/client";
import mediumZoom from "medium-zoom";
import { useEffect, useRef } from "react";
import { WorkDocumentDataProjectTechnologiesListItem } from "../../prismicio-types";
import ArticleFooter from "./ArticleFooter";
import { SinglePageHeader } from "./SinglePageHeader";

function WorkClient({
	title,
	type,
	year,
	technologies,
	html,
	prevWorkLink,
	prevWorkTitle,
	nextWorkLink,
	nextWorkTitle,
}: {
	title: KeyTextField;
	type: string | null;
	year: NumberField;
	technologies: WorkDocumentDataProjectTechnologiesListItem[];
	html: string;
	prevWorkLink: string;
	prevWorkTitle: KeyTextField;
	nextWorkLink: string;
	nextWorkTitle: KeyTextField;
}) {
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (rootRef.current == null) {
			return;
		}
		const allImages = [...rootRef.current.getElementsByTagName("img")].filter(
			(img) => {
				if (img == null || img.parentNode == null) {
					return false;
				}
				return img.parentNode.nodeName !== "A";
			},
		) as HTMLImageElement[];

		const zoom = mediumZoom(allImages, {
			container: {
				width: innerWidth,
				height: innerHeight,
				top: 32,
				bottom: 32,
				right: 0,
				left: 0,
			},
			background: "var(--background)",
		});

		return () => {
			zoom.detach();
		};
	}, [title]);

	return (
		<div ref={rootRef}>
			<SinglePageHeader
				title={title}
				type={type}
				year={year}
				technologies={technologies.map(
					({ project_tech }) => project_tech as string,
				)}
			/>
			<main className="typeset">
				<div dangerouslySetInnerHTML={{ __html: html }}></div>
			</main>
			<ArticleFooter
				prevWorkLink={prevWorkLink}
				prevWorkTitle={prevWorkTitle}
				nextWorkLink={nextWorkLink}
				nextWorkTitle={nextWorkTitle}
			/>
		</div>
	);
}

WorkClient.displayName = "WorkClient";

export default WorkClient;
