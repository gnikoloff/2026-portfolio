import "../libs/hdrpng.min.js";
import { HDRImage } from "../libs/hdrpng.min.js";

import type { HDRImageElement } from "../types/hdrpng.d.ts";

export const loadHDR = (
	src: string,
	exposure = 1,
	gamma = 2.2,
): Promise<HDRImageElement> =>
	new Promise((resolve, reject) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const img = new HDRImage();
		img.exposure = exposure;
		img.gamma = gamma;
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});

export const loadHDRTexture = (
	gl: WebGL2RenderingContext,
	src: string,
	exposure = 1,
	gamma = 2.2,
): Promise<[HDRImageElement, WebGLTexture]> =>
	new Promise(async (resolve, reject) => {
		let img!: HDRImageElement;
		try {
			img = await loadHDR(src, exposure, gamma);
		} catch (err) {
			reject(err);
			return; // Don't continue after rejecting
		}

		const tex = gl.createTexture();
		if (!tex) {
			reject(new Error("Failed to create texture"));
			return;
		}

		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGB32F, // Changed from gl.RGB - use sized format
			img.width,
			img.height,
			0,
			gl.RGB, // format stays gl.RGB
			gl.FLOAT, // type stays gl.FLOAT
			img.dataFloat,
		);

		// Set texture parameters
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		gl.bindTexture(gl.TEXTURE_2D, null);
		resolve([img, tex]);
	});
