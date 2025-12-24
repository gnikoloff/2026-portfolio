"use client";

import { TableContentsEntry } from "@/types";
import { useEffect, useState } from "react";

import Link from "next/link";
import inputStyles from "./FilterSelector.module.css";
import styles from "./TableContentsSelect.module.css";

function TableContentsSelect({
	entries,
	backURL = undefined,
}: {
	entries: TableContentsEntry[];
	backURL?: string;
}) {
	const [selectedId, setSelectedId] = useState<string>("");

	useEffect(() => {
		// Get hash on mount
		const hash = window.location.hash.slice(1); // Remove the '#'
		if (hash) {
			setSelectedId(hash);
			const element = document.getElementById(hash);
			if (element) {
				const offset = 150;
				const elementPosition = element.getBoundingClientRect().top;
				const offsetPosition = elementPosition + window.scrollY - offset;

				window.scrollTo({
					top: offsetPosition,
					behavior: "instant",
				});
			}
		}
	}, []);

	const select = (
		<div className={`${styles.selectContainer} btn-simple`}>
			<select
				className={`${inputStyles.input} ${styles.input}`}
				value={selectedId}
				onChange={(e) => {
					const id = e.target.value;
					setSelectedId(id);

					if (id) {
						const element = document.getElementById(id);
						if (element) {
							const offset = 150;
							const elementPosition = element.getBoundingClientRect().top;
							const offsetPosition = elementPosition + window.scrollY - offset;

							window.scrollTo({
								top: offsetPosition,
								behavior: "smooth",
							});

							history.pushState(null, "", `#${id}`);
						}
					}
				}}
			>
				{entries.map((item) => {
					if (!item.children) {
						return (
							<option key={item.id} value={item.id}>
								{item.label}
							</option>
						);
					}

					return (
						<optgroup key={item.id} label={item.label}>
							{flattenChildren(item.children).map((child) => (
								<option key={child.id} value={child.id}>
									{child.indent}
									{child.label}
								</option>
							))}
						</optgroup>
					);
				})}
			</select>
		</div>
	);

	return (
		<div className={`${styles.root}`}>
			{backURL ? (
				<Link href={backURL} className="btn-simple">
					<div className={`${styles.backWrapper} sub-nav-container`}>Back</div>
				</Link>
			) : null}

			<div
				className={`${styles.selectWrapper} ${entries.length === 0 ? "" : styles.hoverable}`}
			>
				<svg
					className={styles.icon}
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				{entries.length === 0 ? (
					<div
						className={`${inputStyles.input} ${inputStyles.noArrow} ${styles.input}`}
					>
						Table of Contents Unavailable
					</div>
				) : (
					select
				)}
			</div>
		</div>
	);
}

type FlattenedChild = {
	id: string;
	label: string;
	indent: string;
	children?: TableContentsEntry[];
};

function flattenChildren(
	items: TableContentsEntry[],
	level = 0,
): FlattenedChild[] {
	return items.flatMap((item) => {
		const indent = "\u00A0\u00A0".repeat(level * 2);
		if (!item.children) {
			return [{ ...item, indent }];
		}
		return [
			{ id: item.id, label: item.label, indent },
			...flattenChildren(item.children, level + 1),
		];
	});
}

TableContentsSelect.displayName = "TableContentsSelect";

export default TableContentsSelect;
