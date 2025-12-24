import Link from "next/link";

import { SPEAKING_URL_SEGMENT_NAME, WORKS_URL_SEGMENT_NAME } from "@/constants";
import { FilterState } from "@/types";
import { KeyTextField } from "@prismicio/client";
import Image from "next/image";
import styles from "./WorkPreview.module.css";
import WorkTagsList from "./WorkTagsList";

export default function WorkPreview({
	isHomepage,
	title,
	type = null,
	technologies = [],
	uid,
	previewImageURL,
	filters,
}: {
	isHomepage: boolean;
	title: KeyTextField;
	type?: KeyTextField;
	technologies?: string[];
	uid: string;
	previewImageURL: string | null | undefined;
	filters: FilterState;
}) {
	const rootSegment = isHomepage
		? WORKS_URL_SEGMENT_NAME
		: SPEAKING_URL_SEGMENT_NAME;

	return (
		<Link
			href={`/${rootSegment}/${uid}`}
			className={styles.root}
			onClick={(_) => {
				sessionStorage.setItem("homeScrollY", pageYOffset.toString());
			}}
		>
			<div className={styles.imageWrapper}>
				{previewImageURL ? (
					<Image
						fill
						src={previewImageURL}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
						alt={`Thumbnail Preview Image`}
						className={styles.image}
					/>
				) : null}
			</div>
			<section className={styles.body}>
				<h3 className={styles.title}>{title}</h3>
				{type ? (
					<h5
						className={`${styles.subtitle} ${technologies.length ? "" : styles.noBottomMargin} fw500`}
					>
						{type}
					</h5>
				) : null}
				<WorkTagsList tags={technologies} filters={filters} />
			</section>
		</Link>
	);
}
