"use client";

import { useUIStore } from "@/store/uiStore";
import { MouseEvent, useEffect, useRef, useState } from "react";
import AppNavigation from "./AppNavigation";
import styles from "./AppNavigationWrapper.module.css";

const HANDLE_DOTS_COL_COUNT = 3;
const HANDLE_DOTS_TOTAL_COUNT = HANDLE_DOTS_COL_COUNT * 2;
const HANDLE_ACTIVE_TRANSITION_DURATION = 0.125;

function AppNavigationWrapper() {
	const {
		navigationX,
		navigationY,
		initNavigationX,
		initNavigationY,
		initedNavigation,
		setNavigationX,
		setNavigationY,
	} = useUIStore();

	const draggableAreaRef = useRef<HTMLDivElement>(null);
	const mouseRef = useRef({ x: initNavigationX, y: initNavigationY });
	const mouseTargetRef = useRef({ x: initNavigationX, y: initNavigationY });
	const navContainerRef = useRef<HTMLDivElement>(null);
	const rafIdRef = useRef<number>(-1);

	const [draggableWidth, setDraggableWidth] = useState(0);
	const [draggableHeight, setDraggableHeight] = useState(0);

	const [isDragging, setIsDragging] = useState(false);

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
		mouseRef.current.y = initNavigationY;
		mouseTargetRef.current.x = initNavigationX;
		mouseTargetRef.current.y = initNavigationY;
	}, [initNavigationX, initNavigationY]);

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

	useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: globalThis.MouseEvent) => {
			e.preventDefault();
			mouseTargetRef.current.x = e.pageX - draggableWidth * 0.5;
			mouseTargetRef.current.y =
				e.pageY - draggableHeight * 0.5 - window.pageYOffset;
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			document.body.classList.remove("dragging");

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
	}, [isDragging, draggableWidth, draggableHeight]);

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

	useEffect(() => {
		const draggableArea = draggableAreaRef.current;
		if (draggableArea == null) {
			return;
		}
		const bbox = draggableArea.getBoundingClientRect();
		setDraggableWidth(bbox.width);
		setDraggableHeight(bbox.height);
	}, []);

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
					ref={draggableAreaRef}
					className={styles.draggable}
					onMouseDown={(e: MouseEvent) => {
						e.preventDefault();
						setIsDragging(true);
						mouseTargetRef.current.x = e.pageX - draggableWidth * 0.5;
						mouseTargetRef.current.y =
							e.pageY - draggableHeight * 0.5 - window.pageYOffset;
						document.body.classList.add("dragging");
					}}
				>
					<div className={styles.dotWrapper}>
						<div className={`${styles.dotColumn} ${styles.dotColumnLeft}`}>
							{new Array(HANDLE_DOTS_COL_COUNT).fill(null).map((_, i) => (
								<div
									key={i}
									className={styles.dot}
									style={{
										transitionDuration: `${HANDLE_ACTIVE_TRANSITION_DURATION}s`,
										transitionDelay: `${(i / HANDLE_DOTS_TOTAL_COUNT) * HANDLE_ACTIVE_TRANSITION_DURATION}s`,
									}}
								/>
							))}
						</div>
						<div className={styles.dotColumn}>
							{new Array(HANDLE_DOTS_COL_COUNT).fill(null).map((_, i) => (
								<div
									key={i}
									className={styles.dot}
									style={{
										transitionDuration: `${HANDLE_ACTIVE_TRANSITION_DURATION}s`,
										transitionDelay: `${((i + HANDLE_DOTS_COL_COUNT) / HANDLE_DOTS_TOTAL_COUNT) * HANDLE_ACTIVE_TRANSITION_DURATION}s`,
									}}
								/>
							))}
						</div>
					</div>
				</div>

				<AppNavigation />
			</div>
		</section>
	);
}

AppNavigationWrapper.displayName = "AppNavigationWrapper";

export default AppNavigationWrapper;
