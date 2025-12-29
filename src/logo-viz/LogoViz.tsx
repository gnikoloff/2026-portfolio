"use client";

import { useEffect, useRef, useState } from "react";
import LogoVizApp from "./LogoVizApp";

import { LOGO_ANIM_HEIGHT, LOGO_ANIM_WIDTH } from "@/constants";
import styles from "./LogoVizApp.module.css";

function LogoViz() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [loadingAnim, setLoadingAnim] = useState(false);
	const [noGL2Supported, setNoGL2Supported] = useState(false);
	const isVisibleRef = useRef(true);

	useEffect(() => {
		const c = canvasRef.current;
		if (c == null) return;

		const gl = c.getContext("webgl2", {
			antialias: false,
			depth: false,
		});

		if (gl == null) {
			setNoGL2Supported(true);
			return;
		}

		let viz: LogoVizApp | null = null;
		let raf: number;

		try {
			setLoadingAnim(true);
			viz = new LogoVizApp(c, gl, () => {
				setLoadingAnim(false);
			});

			function drawFrame(ts: number) {
				try {
					if (isVisibleRef.current) {
						viz!.drawFrame(ts);
					}
					raf = requestAnimationFrame(drawFrame);
				} catch (error) {
					console.error("Error in draw loop:", error);
					setNoGL2Supported(true);
					setLoadingAnim(false);
					cancelAnimationFrame(raf);
				}
			}

			raf = requestAnimationFrame(drawFrame);
		} catch (error) {
			setNoGL2Supported(true);
			setLoadingAnim(false);
			console.error("Error initializing:", error);
		}

		const observer = new IntersectionObserver(
			(entries) => {
				isVisibleRef.current = entries[0].isIntersecting; // Update ref directly
			},
			{ threshold: 0 },
		);

		observer.observe(c);

		return () => {
			observer.disconnect();
			if (raf) {
				cancelAnimationFrame(raf);
			}
			if (viz) {
				viz.dispose();
			}
		};
	}, []);

	return (
		<div
			className={`${styles.root} ${loadingAnim ? styles.loading : ""} ${noGL2Supported ? styles.noGL : ""}`}
		>
			<canvas
				id="logo"
				ref={canvasRef}
				width={LOGO_ANIM_WIDTH * devicePixelRatio}
				height={LOGO_ANIM_HEIGHT * devicePixelRatio}
				style={{
					display: noGL2Supported ? "none" : "block",
					width: `${LOGO_ANIM_WIDTH}px`,
					height: `${LOGO_ANIM_HEIGHT}px`,
				}}
			/>
			<h1 className={`${noGL2Supported ? "" : styles.titleHidden}`}>
				Georgi Nikolov
			</h1>
		</div>
	);
}

LogoViz.displayName = "LogoViz";

export default LogoViz;
