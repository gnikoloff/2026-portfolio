import { WRITING_URL_SEGMENT_NAME } from "@/constants";
import { getFormattedDate } from "@/utils/date";
import { KeyTextField } from "@prismicio/client";
import Link from "next/link";
import styles from "./ArticlePreview.module.css";

export default function ArticlePreview({
	externalURL,
	externalResourceName,
	uid,
	title,
	date,
}: {
	externalURL?: string;
	externalResourceName: KeyTextField;
	uid: string;
	title: KeyTextField;
	date: Date;
}) {
	const hasExternalURL = !!externalURL;
	const linkURL = hasExternalURL
		? externalURL
		: `/${WRITING_URL_SEGMENT_NAME}/${uid}`;
	const linkTarget = hasExternalURL ? `_blank` : "_self";
	return (
		<Link className={styles.root} href={linkURL} target={linkTarget}>
			<main className={`${styles.title} fw500`}>{title}</main>
			<footer className={styles.footer}>
				<div className={styles.date}>{getFormattedDate(date)}</div>
				{hasExternalURL ? (
					<div className={styles.externalResource}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							version="1.1"
							width="17"
							height="17"
							viewBox="0 0 24 24"
							className={styles.externalIcon}
						>
							<path d="M19 6.41L8.7 16.71a1 1 0 1 1-1.4-1.42L17.58 5H14a1 1 0 0 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V6.41zM17 14a1 1 0 0 1 2 0v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h5a1 1 0 0 1 0 2H5v12h12v-5z"></path>
						</svg>
						<span>{externalResourceName}</span>
					</div>
				) : null}
			</footer>
		</Link>
	);
}
