import {
	CameraController,
	createAndBindUBOToBase,
	createUniformBlockInfo,
	PerspectiveCamera,
	UBOInfo,
} from "@/libs/hwoa-rang-gl2/dist";
import { CharData } from "@/types";
import { HDRImageElement } from "@/types/hdrpng";
import { loadHDR, makeHDRGLTexture } from "@/utils/load-hdr";
import { loadImg } from "@/utils/load-img";
import { vec3 } from "gl-matrix";
import Char3D from "./Char3D";
import CubemapGenerator from "./ibl/CubemapGenerator";
import DiffuseIBLGenerator from "./ibl/DiffuseIBLGenerator";
import SpecularIBLGenerator from "./ibl/SpecularIBLGenerator";
import FullscreenBlurTriangle from "./postfx/FullscreenBlurTriangle";
import { FullscreenCompositeTriangle } from "./postfx/FullscreenCompositeTriangle";
import Skybox from "./Skybox";
import createMainSceneMSAAFramebuffer, {
	MainSceneMSAAFramebufferResult,
} from "./utils/create-main-scene-framebuffer";

const MODELS = ["/assets/georgi_2.json"];

const BDRFlut = "/assets/brdfLUT.png";

const CUBEMAP_SIZE = 256;
const IBL_DIFFUSE_SIZE = 32;
const IBL_SPECULAR_SIZE = 128;
interface Asset {
	pbrTextureURLs: string[];
	skyboxURL: string;
	bloomMixFactor: number;
}

const ASSETS: Asset[] = [
	{
		pbrTextureURLs: [
			"/assets/Metal007_1K-PNG_Color-512.webp",
			"/assets/Metal007_1K-PNG_Metalness-512.webp",
			"/assets/Metal007_1K-PNG_Roughness-512.webp",
			"/assets/Metal007_1K-PNG_NormalGL-512.webp",
		],
		skyboxURL: "/assets/StandardCubeMap_0.hdr",
		bloomMixFactor: 0.05,
	},
	{
		pbrTextureURLs: [
			"/assets/PaintedMetal007_1K-PNG_Color-512.webp",
			"/assets/PaintedMetal007_1K-PNG_Metalness-512.webp",
			"/assets/PaintedMetal007_1K-PNG_Roughness-512.webp",
			"/assets/PaintedMetal007_1K-PNG_NormalGL-512.webp",
		],
		skyboxURL: "/assets/StandardCubeMap_2.hdr",
		bloomMixFactor: 0.2,
	},
	{
		pbrTextureURLs: [
			"/assets/PaintedMetal009_1K-PNG_Color-512.webp",
			"/assets/PaintedMetal009_1K-PNG_Metalness-512.webp",
			"/assets/PaintedMetal009_1K-PNG_Roughness-512.webp",
			"/assets/PaintedMetal009_1K-PNG_NormalGL-512.webp",
		],
		skyboxURL: "/assets/StandardCubeMap_12.hdr",
		bloomMixFactor: 0.2,
	},
];

const loadIdx = Math.floor(Math.random() * ASSETS.length);
const ASSET_TO_LOAD = ASSETS[loadIdx]!;

const CAMERA_UBO_NAME = "Camera";
const CAMERA_UBO_FIELDS = [
	"projMatrix",
	"viewMatrix",
	"zNear",
	"zFar",
	"cameraPosition",
	"time",
];

const loadModel = (src: string): Promise<CharData> => {
	return fetch(src).then((res) => res.json());
};

interface ConvolutionState {
	width: number;
	height: number;
	image: HDRImageElement;
	step: 0;
	maxSteps: 5; // hdr gl texture, cubemap, irradiance, prefilter
}

const scale = vec3.fromValues(1, 1, 1);
export default class LogoVizApp {
	private perspCamera: PerspectiveCamera;
	private cameraCtrl: CameraController;
	private mesh!: Char3D;

	private cameraUBOInfo!: UBOInfo;
	private cameraUBO!: WebGLBuffer;

	private skybox!: Skybox;
	private blitMainSceneFX!: FullscreenCompositeTriangle;
	private blurThresholdFX!: FullscreenBlurTriangle;

	private geoLoaded = false;
	private oldTime = 0;

	private state: ConvolutionState | null = null;
	private pbrTexImages: HTMLImageElement[] = [];

	private iblDiffuseTexture!: WebGLTexture;
	private iblSpecularTexture!: WebGLTexture;
	private brdfLutTexture!: WebGLTexture;
	private pbrTextures: WebGLTexture[] = [];

	private skyboxCubeCrossTexture!: WebGLTexture;
	private skyboxCubemapTexture!: WebGLTexture;

	private mainSceneBuffers!: MainSceneMSAAFramebufferResult;

	private loadingT = 0;
	private loadingTTarget = 0;
	private loadingTTargetTarget = 0;

	private opacityT = 0;
	private opacityTTarget = 0;

	constructor(
		private canvas: HTMLCanvasElement,
		private gl: WebGL2RenderingContext,
		private onAnimStart: () => void,
	) {
		this.canvas.style.opacity = `0`;

		// Enable HDR extensions
		const ext =
			gl.getExtension("EXT_color_buffer_float") ||
			gl.getExtension("OES_texture_float_linear");

		if (ext == null) {
			throw new Error(
				"Need EXT_color_buffer_float / OES_texture_float_linear to render",
			);
		}

		const bbox = canvas.getBoundingClientRect();
		this.perspCamera = new PerspectiveCamera(
			(30 * Math.PI) / 180,
			bbox.width / bbox.height,
			0.1,
			20,
		);
		const lookAt = vec3.fromValues(-0.25, 0.1, 0);
		this.perspCamera.position = [-2.25, -1.2, 3];
		this.perspCamera.lookAt = lookAt;
		this.perspCamera.updateProjectionMatrix();

		this.cameraCtrl = new CameraController(
			this.perspCamera,
			canvas,
			false,
			0.1,
		);
		this.cameraCtrl.minDistance = 1;
		this.cameraCtrl.maxDistance = 8;
		this.cameraCtrl.lookAt(lookAt as [number, number, number]);

		gl.enable(gl.DEPTH_TEST);

		// Create MSAA framebuffers
		this.mainSceneBuffers = createMainSceneMSAAFramebuffer(
			gl,
			canvas.width,
			canvas.height,
		);

		this.blitMainSceneFX = new FullscreenCompositeTriangle(
			gl,
			ASSET_TO_LOAD.bloomMixFactor,
		);
		this.blurThresholdFX = new FullscreenBlurTriangle(
			gl,
			canvas.width,
			canvas.height,
		);

		Promise.all([
			Promise.all(MODELS.map(loadModel)),
			loadHDR(ASSET_TO_LOAD.skyboxURL),
			loadImg(BDRFlut),
			Promise.all(ASSET_TO_LOAD.pbrTextureURLs.map(loadImg)),
		])
			.then(this.onResourcesLoaded)
			.catch((err) => {
				console.error(err);
			});
	}

	private onResourcesLoaded = ([
		allModels,
		skyboxCubeImage,
		brdfLUTImg,
		pbrTextureImgs,
	]: [CharData[], HDRImageElement, HTMLImageElement, HTMLImageElement[]]) => {
		this.opacityTTarget = 1;

		const gl = this.gl;

		this.state = {
			width: skyboxCubeImage.width,
			height: skyboxCubeImage.height,
			image: skyboxCubeImage,
			step: 0,
			maxSteps: 5,
		};

		const brdfLUT = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, brdfLUT);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, gl.RG, gl.HALF_FLOAT, brdfLUTImg);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		this.pbrTexImages = pbrTextureImgs;

		this.brdfLutTexture = brdfLUT;

		this.skybox = new Skybox(gl);

		allModels.forEach((model, i) => {
			this.mesh = new Char3D(gl, model);

			if (i === 0) {
				this.cameraUBOInfo = createUniformBlockInfo(
					gl,
					this.mesh.program,
					CAMERA_UBO_NAME,
					CAMERA_UBO_FIELDS,
				);

				this.cameraUBO = createAndBindUBOToBase(
					gl,
					this.cameraUBOInfo.blockSize,
					0,
				)!;
			}
		});
	};

	drawFrame(ts: number) {
		ts *= 0.001;

		const gl = this.gl;

		const dt = ts - this.oldTime;
		this.oldTime = ts;

		// const error = gl.getError();
		// if (error !== gl.NO_ERROR) {
		// 	console.error("WebGL error before render:", error);
		// 	debugger;
		// }

		if (this.state != null) {
			const stepMS = 50;
			if (this.state.step === 0 * stepMS) {
				this.pbrTextures = this.pbrTexImages.map((img) => {
					const tex = gl.createTexture();
					gl.bindTexture(gl.TEXTURE_2D, tex);
					gl.texImage2D(
						gl.TEXTURE_2D,
						0,
						gl.RGBA8,
						gl.RGBA,
						gl.UNSIGNED_BYTE,
						img,
					);
					gl.generateMipmap(gl.TEXTURE_2D);
					gl.texParameteri(
						gl.TEXTURE_2D,
						gl.TEXTURE_MIN_FILTER,
						gl.LINEAR_MIPMAP_LINEAR,
					);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

					return tex;
				});
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
			if (this.state.step === 1 * stepMS) {
				this.skyboxCubeCrossTexture = makeHDRGLTexture(gl, this.state.image);
			} else if (this.state.step === 2 * stepMS) {
				const cubemapConvert = new CubemapGenerator(gl, CUBEMAP_SIZE);
				cubemapConvert.convert(this.skyboxCubeCrossTexture);
				cubemapConvert.dispose();
				gl.deleteTexture(this.skyboxCubeCrossTexture);
				this.skyboxCubemapTexture = cubemapConvert.outTexture;
				this.skybox.envTexture = cubemapConvert.outTexture;
			} else if (this.state.step === 3 * stepMS) {
				const iblDiffuse = new DiffuseIBLGenerator(gl, IBL_DIFFUSE_SIZE);
				iblDiffuse.convert(this.skyboxCubemapTexture);
				iblDiffuse.dispose();
				this.iblDiffuseTexture = iblDiffuse.outTexture;
			} else if (this.state.step === 4 * stepMS) {
				const iblSpecular = new SpecularIBLGenerator(
					gl,
					IBL_SPECULAR_SIZE,
					CUBEMAP_SIZE,
				);
				iblSpecular.convert(this.skyboxCubemapTexture);
				iblSpecular.dispose();
				this.iblSpecularTexture = iblSpecular.outTexture;
				this.state = null;
				this.geoLoaded = true;
				this.onAnimStart();
				console.log("call 4");
				return;
			}
			this.state.step++;
			return;
		}
		if (!this.geoLoaded) {
			return;
		}

		this.loadingTTarget +=
			(this.loadingTTargetTarget - this.loadingTTarget) * dt * 6;
		this.loadingT += (this.loadingTTarget - this.loadingT) * dt * 5;

		this.opacityT += (this.opacityTTarget - this.opacityT) * dt * 3;
		this.canvas.style.opacity = this.opacityT.toString();

		if (this.opacityT > 0.7 && this.loadingTTargetTarget === 0) {
			this.loadingTTargetTarget = 1;
		}

		// 1. Render to MSAA framebuffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.mainSceneBuffers.msaaFramebuffer);
		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this.perspCamera.updateViewMatrix();
		this.updateCameraUBO(ts);

		let texOffset = 0;
		for (const pbrTex of this.pbrTextures) {
			gl.activeTexture(gl.TEXTURE0 + texOffset);
			gl.bindTexture(gl.TEXTURE_2D, pbrTex);
			texOffset++;
		}

		gl.activeTexture(gl.TEXTURE0 + texOffset);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.iblDiffuseTexture);
		texOffset++;

		gl.activeTexture(gl.TEXTURE0 + texOffset);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.iblSpecularTexture);
		texOffset++;

		gl.activeTexture(gl.TEXTURE0 + texOffset);
		gl.bindTexture(gl.TEXTURE_2D, this.brdfLutTexture);

		// gl.disable(gl.BLEND);
		this.skybox.render();

		// gl.enable(gl.BLEND);
		// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		this.mesh.updateWorldMatrix().render();

		vec3.set(scale, this.loadingT, this.loadingT, this.loadingT);
		this.mesh.setScale(scale);
		this.mesh.loadingT = this.loadingT;

		// 2. Resolve MSAA to textures
		gl.bindFramebuffer(
			gl.READ_FRAMEBUFFER,
			this.mainSceneBuffers.msaaFramebuffer,
		);
		gl.bindFramebuffer(
			gl.DRAW_FRAMEBUFFER,
			this.mainSceneBuffers.resolveFramebuffer,
		);

		// Resolve color attachment
		gl.readBuffer(gl.COLOR_ATTACHMENT0);
		gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.NONE]);
		gl.blitFramebuffer(
			0,
			0,
			this.mainSceneBuffers.width,
			this.mainSceneBuffers.height,
			0,
			0,
			this.mainSceneBuffers.width,
			this.mainSceneBuffers.height,
			gl.COLOR_BUFFER_BIT,
			gl.NEAREST,
		);

		// Resolve threshold attachment
		gl.readBuffer(gl.COLOR_ATTACHMENT1);
		gl.drawBuffers([gl.NONE, gl.COLOR_ATTACHMENT1]);
		gl.blitFramebuffer(
			0,
			0,
			this.mainSceneBuffers.width,
			this.mainSceneBuffers.height,
			0,
			0,
			this.mainSceneBuffers.width,
			this.mainSceneBuffers.height,
			gl.COLOR_BUFFER_BIT,
			gl.NEAREST,
		);

		// 3. Blur threshold texture
		this.blurThresholdFX.inTexture =
			this.mainSceneBuffers.thresholdTargetTexture;
		const blurTex = this.blurThresholdFX.blur(12, 0.1);

		// 4. Composite to screen
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		this.blitMainSceneFX.inTexture = this.mainSceneBuffers.colorTargetTexture;
		this.blitMainSceneFX.inBloomTexture = blurTex;
		this.blitMainSceneFX.render();
	}

	dispose() {
		this.blitMainSceneFX.dispose();
		this.blurThresholdFX.dispose();
		if (this.mesh) {
			this.mesh.destroy();
		}

		const gl = this.gl;
		gl.deleteTexture(this.iblDiffuseTexture);
		gl.deleteTexture(this.iblSpecularTexture);
		gl.deleteTexture(this.brdfLutTexture);
		for (const tex of this.pbrTextures) {
			gl.deleteTexture(tex);
		}
		gl.deleteTexture(this.mainSceneBuffers.colorTargetTexture);
		gl.deleteTexture(this.mainSceneBuffers.thresholdTargetTexture);
		gl.deleteFramebuffer(this.mainSceneBuffers.msaaFramebuffer);
		gl.deleteFramebuffer(this.mainSceneBuffers.resolveFramebuffer);

		gl.deleteBuffer(this.cameraUBO);
	}

	private updateCameraUBO(ts: number) {
		const gl = this.gl;
		gl.bindBuffer(gl.UNIFORM_BUFFER, this.cameraUBO);

		gl.bufferSubData(
			gl.UNIFORM_BUFFER,
			this.cameraUBOInfo.uniforms.projMatrix.offset as number,
			this.perspCamera.projectionMatrix as Float32Array,
			0,
		);
		gl.bufferSubData(
			gl.UNIFORM_BUFFER,
			this.cameraUBOInfo.uniforms.viewMatrix.offset as number,
			this.perspCamera.viewMatrix as Float32Array,
			0,
		);
		gl.bufferSubData(
			gl.UNIFORM_BUFFER,
			this.cameraUBOInfo.uniforms.zNear.offset as number,
			new Float32Array([this.perspCamera.near]),
			0,
		);
		gl.bufferSubData(
			gl.UNIFORM_BUFFER,
			this.cameraUBOInfo.uniforms.zFar.offset as number,
			new Float32Array([this.perspCamera.far]),
			0,
		);
		gl.bufferSubData(
			gl.UNIFORM_BUFFER,
			this.cameraUBOInfo.uniforms.cameraPosition.offset as number,
			this.perspCamera.getTypedPosition(),
			0,
		);
		gl.bufferSubData(
			gl.UNIFORM_BUFFER,
			this.cameraUBOInfo.uniforms.time.offset as number,
			new Float32Array([ts]),
			0,
		);
	}
}
