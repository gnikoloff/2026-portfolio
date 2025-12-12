"use client";

import { WORKS_CUSTOM_TYPE } from "@/constants";
import { useUIStore } from "@/store/uiStore";
import { usePathname } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { WorkDocument } from "../../../prismicio-types";
import styles from "./AppNavigation.module.css";
import HomeNavigation from "./HomeNavigation";
import PageNavigation from "./PageNavigation";
import SingleWorkNavigation from "./SingleWorkNavigation";

export default function AppNavigation({ works }: { works: WorkDocument[] }) {
	const pathname = usePathname();
	const {
		navigationX,
		navigationY,
		initNavigationX,
		initNavigationY,
		initedNavigation,
		setNavigationX,
		setNavigationY,
	} = useUIStore();

	const [isDragging, setIsDragging] = useState(false);

	const mouseRef = useRef({ x: initNavigationX, y: initNavigationY });
	const mouseTargetRef = useRef({ x: initNavigationX, y: initNavigationY });
	const navContainerRef = useRef<HTMLDivElement>(null);
	const rafIdRef = useRef<number>(-1);

	// Function to clamp position within viewport bounds
	const clampToViewport = (x: number, y: number) => {
		if (!navContainerRef.current) return { x, y };

		const rect = navContainerRef.current.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;

		const minX = 0;
		const minY = 0;
		const maxX = window.innerWidth - width;
		const maxY = window.innerHeight - height;

		return {
			x: Math.max(minX, Math.min(maxX, x)),
			y: Math.max(minY, Math.min(maxY, y)),
		};
	};

	useEffect(() => {
		if (!navContainerRef.current) {
			return;
		}
		const rect = navContainerRef.current.getBoundingClientRect();
		mouseRef.current.x = initNavigationX;
		mouseRef.current.y = initNavigationY - rect.height * 0.5;
		mouseTargetRef.current.x = initNavigationX;
		mouseTargetRef.current.y = initNavigationY - rect.height * 0.5;
	}, [initNavigationX, initNavigationY]);

	// Continuous animation loop - runs independently of dragging
	useEffect(() => {
		let oldTime = performance.now() * 0.001;

		const animate = () => {
			const ts = performance.now() * 0.001;
			const dt = Math.min(ts - oldTime, 0.1);
			oldTime = ts;

			const damping = 10;
			const threshold = 0.001;

			const dx = mouseTargetRef.current.x - mouseRef.current.x;
			const dy = mouseTargetRef.current.y - mouseRef.current.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > threshold) {
				mouseRef.current.x += dx * damping * dt;
				mouseRef.current.y += dy * damping * dt;

				setNavigationX(mouseRef.current.x);
				setNavigationY(mouseRef.current.y);
			} else {
				mouseRef.current.x = mouseTargetRef.current.x;
				mouseRef.current.y = mouseTargetRef.current.y;

				setNavigationX(mouseRef.current.x);
				setNavigationY(mouseRef.current.y);
			}

			rafIdRef.current = requestAnimationFrame(animate);
		};

		rafIdRef.current = requestAnimationFrame(animate);

		return () => {
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, [setNavigationX, setNavigationY]);

	// Dragging handlers - only update target position
	useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: globalThis.MouseEvent) => {
			e.preventDefault();
			mouseTargetRef.current.x = e.pageX - 56;
			mouseTargetRef.current.y = e.pageY - 56 - window.pageYOffset;
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			document.body.style.cursor = "unset";

			// Clamp to viewport bounds on mouse up
			const clamped = clampToViewport(
				mouseTargetRef.current.x,
				mouseTargetRef.current.y,
			);
			mouseTargetRef.current.x = clamped.x;
			mouseTargetRef.current.y = clamped.y;
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	// Handle window resize to keep navigation in bounds
	useEffect(() => {
		const handleResize = () => {
			const clamped = clampToViewport(navigationX, navigationY);
			if (clamped.x !== navigationX || clamped.y !== navigationY) {
				mouseTargetRef.current.x = clamped.x;
				mouseTargetRef.current.y = clamped.y;
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [navigationX, navigationY]);

	return (
		<section
			id="app-nav"
			className={`${styles.root} ${isDragging ? styles.dragging : ""}`}
		>
			<div
				ref={navContainerRef}
				className={`${styles.navContainer} ${initedNavigation ? styles.inited : ""}`}
				style={{
					transform: `translate3d(${navigationX}px, ${navigationY}px, 0)`,
				}}
			>
				<div
					className={styles.draggable}
					onMouseDown={(e: MouseEvent) => {
						e.preventDefault();
						setIsDragging(true);
						mouseTargetRef.current.x = e.pageX - 56;
						mouseTargetRef.current.y = e.pageY - 56 - window.pageYOffset;
						document.body.style.cursor = "grabbing";
					}}
				/>
				<div className={styles.navWrapper}>
					<PageNavigation />
					{pathname === "/" ? (
						<HomeNavigation />
					) : pathname.includes(WORKS_CUSTOM_TYPE) ? (
						<SingleWorkNavigation works={works} />
					) : (
						<h4>Irem lopsum</h4>
					)}
				</div>
			</div>
		</section>
	);
}
