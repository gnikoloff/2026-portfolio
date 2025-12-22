"use client";

import { useEffect, useRef, useState } from "react";
import LogoVizApp from "./LogoVizApp";

import styles from "./LogoVizApp.module.css";

function LogoViz() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [loadingAnim, setLoadingAnim] = useState(false);
	const [noGL2Supported, setNoGL2Supported] = useState(false);

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

		const w = 300;
		const h = 120;
		c.width = w * devicePixelRatio;
		c.height = h * devicePixelRatio;
		c.style.width = `${w}px`;
		c.style.height = `${h}px`;

		let viz: LogoVizApp | null = null;
		let raf: number;

		try {
			setLoadingAnim(true);
			viz = new LogoVizApp(c, gl, () => {
				setLoadingAnim(false);
			});

			function drawFrame(ts: number) {
				try {
					viz!.drawFrame(ts); // Wrap in try-catch
					raf = requestAnimationFrame(drawFrame);
				} catch (error) {
					console.error("Error in draw loop:", error);
					setNoGL2Supported(true);
					cancelAnimationFrame(raf);
				}
			}

			raf = requestAnimationFrame(drawFrame);
		} catch (error) {
			setNoGL2Supported(true);
			console.error("Error initializing:", error);
		}

		return () => {
			if (raf) {
				cancelAnimationFrame(raf);
			}
			if (viz) {
				viz.dispose();
			}
		};
	}, []);

	return (
		<div className={`${styles.root} ${loadingAnim ? styles.loading : ""}`}>
			<canvas
				id="logo"
				ref={canvasRef}
				style={{ display: noGL2Supported ? "none" : "block" }}
			/>
			{noGL2Supported ? <h1>Georgi Nikolov</h1> : null}
		</div>
	);
}

LogoViz.displayName = "LogoViz";

export default LogoViz;
