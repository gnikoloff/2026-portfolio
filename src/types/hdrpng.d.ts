export interface HDRImageElement extends HTMLCanvasElement {
	// Properties
	exposure: number;
	gamma: number;
	readonly dataFloat: Float32Array;
	readonly dataRGBE: Uint8Array;
	src: string;

	// Methods
	toHDRBlob(callback?: BlobCallback, mode?: string, quality?: number): void;

	// Canvas inherited properties
	width: number;
	height: number;
	style: CSSStyleDeclaration;

	// Event handlers
	onload?: () => void;
}

interface HDRImageConstructor {
	new (): HDRImageElement;
	(): HTMLCanvasElement;

	// Static conversion methods
	floatToRgbe(buffer: Float32Array, res?: Uint8Array): Uint8Array;
	rgbeToFloat(buffer: Uint8Array, res?: Float32Array): Float32Array;

	floatToRgb9_e5(buffer: Float32Array, res?: Uint32Array): Uint32Array;
	rgb9_e5ToFloat(buffer: Uint32Array, res?: Float32Array): Float32Array;

	rgbeToLDR(
		buffer: Uint8Array,
		exposure?: number,
		gamma?: number,
		res?: Uint8ClampedArray,
	): Uint8ClampedArray;

	floatToLDR(
		buffer: Float32Array,
		exposure?: number,
		gamma?: number,
		res?: Uint8ClampedArray,
	): Uint8ClampedArray;
}

const HDRImage: HDRImageConstructor;
export default HDRImage;
