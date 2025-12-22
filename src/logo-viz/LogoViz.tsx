"use client";

import { useEffect, useRef, useState } from "react";
import LogoVizApp from "./LogoVizApp";

function LogoViz() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [noGL2Supported, setNoGL2Supported] = useState(false);

	useEffect(() => {
		const c = canvasRef.current;
		if (c == null) {
			return;
		}

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

		const viz = new LogoVizApp(c, gl);

		let raf = requestAnimationFrame(drawFrame);

		function drawFrame(ts: number) {
			raf = requestAnimationFrame(drawFrame);

			viz.drawFrame(ts);
		}

		return () => {
			viz.dispose();
			cancelAnimationFrame(raf);
		};
	}, []);

	return (
		<div>
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
