"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import LogoVizApp from "./LogoVizApp";

import { LOGO_ANIM_HEIGHT, LOGO_ANIM_WIDTH } from "@/constants";
import { LogoAsset } from "@/types";
import { vec3 } from "gl-matrix";
import styles from "./LogoVizApp.module.css";

const ASSETS: LogoAsset[] = [
	{
		pbrTextureURLs: [
			"/assets/Metal007_1K-PNG_Color-512.webp",
			"/assets/Metal007_1K-PNG_Metalness-512.webp",
			"/assets/Metal007_1K-PNG_Roughness-512.webp",
			"/assets/Metal007_1K-PNG_NormalGL-512.webp",
		],
		skyboxURL: "/assets/StandardCubeMap_0.hdr",
		bloomMixFactor: 0.05,
		camPosition: vec3.fromValues(-2.25, -1.2, 3),
		camLookAt: vec3.fromValues(-0.25, 0.1, 0),
	},
	{
		pbrTextureURLs: [
			"/assets/PaintedMetal007_1K-PNG_Color-512.webp",
			"/assets/PaintedMetal007_1K-PNG_Metalness-512.webp",
			"/assets/PaintedMetal007_1K-PNG_Roughness-512.webp",
			"/assets/PaintedMetal007_1K-PNG_NormalGL-512.webp",
		],
		skyboxURL: "/assets/StandardCubeMap_2.hdr",
		bloomMixFactor: 0.3,
		camPosition: vec3.fromValues(-2.56357, -1.3369, 2.8435),
		camLookAt: vec3.fromValues(-0.25, 0.1, 0),
	},
	{
		pbrTextureURLs: [
			"/assets/Metal007_1K-PNG_Color-512.webp",
			"/assets/Metal007_1K-PNG_Metalness-512.webp",
			"/assets/Metal007_1K-PNG_Roughness-512.webp",
			"/assets/Metal007_1K-PNG_NormalGL-512.webp",
		],
		skyboxURL: "/assets/StandardCubeMap_9.hdr",
		bloomMixFactor: 0.8,
		camPosition: vec3.fromValues(1.15649, -1.37456, 3.0555),
		camLookAt: vec3.fromValues(0.07, 0.09, -0.13),
	},
];

const loadIdx = 1; //Math.floor(Math.random() * ASSETS.length);
const ASSET_TO_LOAD = ASSETS[loadIdx]!;

type InputDragStatis = "bloom-intensity" | "ambient-factor" | "inactive";

function LogoViz() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [loadingAnim, setLoadingAnim] = useState(false);
	const [noGL2Supported, setNoGL2Supported] = useState(false);
	const [infoVisible, setInfoVisible] = useState(false);
	const [dragStatus, setDragStatus] = useState<InputDragStatis>("inactive");
	const [toggleBtnFaded, setToggleBtnFaded] = useState(true);

	const isVisibleRef = useRef(true);
	const vizRef = useRef<LogoVizApp>(null);

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
			viz = new LogoVizApp(ASSET_TO_LOAD, c, gl, () => {
				setLoadingAnim(false);
			});
			vizRef.current = viz;

			viz.onFadeIn = () => {
				setToggleBtnFaded(false);
			};

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

	const isDragging = dragStatus !== "inactive";

	const onMouseUp = () => {
		setDragStatus("inactive");
	};

	return (
		<div className={`${styles.root} ${noGL2Supported ? styles.noGL : ""}`}>
			<div className={`${styles.wrapper} ${loadingAnim ? styles.loading : ""}`}>
				<canvas
					id="logo"
					className={styles.logo}
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
			<section
				className={`${styles.logoConfig} ${infoVisible ? styles.visible : ""} ${isDragging ? styles.focused : ""}`}
				id="logo-config"
			>
				<div
					className={`${styles.sectionWrapper} ${infoVisible ? styles.visible : ""}`}
					style={{
						width: `${LOGO_ANIM_WIDTH}px`,
					}}
				>
					<div
						className={styles.section}
						style={{
							width: `${LOGO_ANIM_WIDTH * 0.5}px`,
						}}
					>
						<label
							className={`${styles.label} ${styles.fadable} ${dragStatus === "ambient-factor" ? styles.faded : ""}`}
							htmlFor="blur-intensity"
						>
							Bloom Intensity
						</label>
						<input
							id="blur-intensity"
							className={`${styles.input} ${styles.fadable} ${dragStatus === "ambient-factor" ? styles.faded : ""}`}
							name="Value"
							type="range"
							defaultValue={ASSET_TO_LOAD.bloomMixFactor * 100}
							onInput={(e: FormEvent<HTMLInputElement>) => {
								const normf = Number(e.currentTarget.value) / 100;
								vizRef.current?.updateBlurIntensity(normf);
								setDragStatus("bloom-intensity");
							}}
							onMouseUp={onMouseUp}
							onTouchEnd={onMouseUp}
							onTouchCancel={onMouseUp}
						></input>
					</div>

					<div
						className={styles.section}
						style={{
							width: `${LOGO_ANIM_WIDTH * 0.5}px`,
						}}
					>
						<label
							className={`${styles.label} ${styles.fadable} ${dragStatus === "bloom-intensity" ? styles.faded : ""}`}
							htmlFor="ambient-detail"
						>
							Ambient Detail
						</label>
						<input
							id="ambient-detail"
							className={`${styles.input} ${styles.fadable} ${dragStatus === "bloom-intensity" ? styles.faded : ""}`}
							name="Value"
							type="range"
							defaultValue={100}
							onInput={(e: FormEvent<HTMLInputElement>) => {
								const normf = Number(e.currentTarget.value) / 100;
								vizRef.current?.updateAmbientDetail(1 - normf);
								setDragStatus("ambient-factor");
							}}
							onMouseUp={onMouseUp}
							onTouchEnd={onMouseUp}
							onTouchCancel={onMouseUp}
						></input>
					</div>
				</div>
			</section>

			<div
				className={`${styles.toggleBtnWrapper} ${styles.fadable} ${isDragging ? styles.faded : ""}`}
				style={{
					width: `${LOGO_ANIM_WIDTH}px`,
				}}
			>
				<button
					className={`${styles.toggleBtn} ${infoVisible ? styles.expanded : ""} ${toggleBtnFaded ? styles.faded : ""}`}
					role="button"
					data-aria={`${infoVisible ? "Close" : "Open"} Settings`}
					data-expanded={infoVisible}
					onClick={() => {
						setInfoVisible(!infoVisible);
					}}
				></button>
			</div>
		</div>
	);
}

export default LogoViz;
