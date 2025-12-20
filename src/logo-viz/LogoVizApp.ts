import {
	CameraController,
	createAndBindUBOToBase,
	createUniformBlockInfo,
	PerspectiveCamera,
	SceneNode,
	UBOInfo,
} from "@/libs/hwoa-rang-gl2/dist";
import { CharData } from "@/types";
import { HDRImageElement } from "@/types/hdrpng";
import { loadHDRTexture } from "@/utils/load-hdr";
import Char3D from "./Char3D";
import Skybox from "./Skybox";

const MODELS = [
	"/assets/g.json",
	"/assets/e.json",
	"/assets/o.json",
	"/assets/r.json",
	"/assets/g_second.json",
	"/assets/i.json",
	"/assets/dot.json",
	"/assets/o_second.json",
	"/assets/r_second.json",
	"/assets/g_third.json",
];

const CAMERA_UBO_NAME = "Camera";
const CAMERA_UBO_FIELDS = [
	"projMatrix",
	"viewMatrix",
	"zNear",
	"zFar",
	"position",
	"time",
];

const loadModel = (src: string): Promise<CharData> => {
	return fetch(src).then((res) => res.json());
};

export default class LogoVizApp {
	private perspCamera: PerspectiveCamera;
	private cameraCtrl: CameraController;
	private scene = new SceneNode();

	private cameraUBOInfo!: UBOInfo;
	private cameraUBO!: WebGLBuffer;

	private skyboxCubeImage!: HDRImageElement;
	private skybox!: Skybox;

	private geoLoaded = false;

	constructor(
		private canvas: HTMLCanvasElement,
		private gl: WebGL2RenderingContext,
	) {
		const bbox = canvas.getBoundingClientRect();
		this.perspCamera = new PerspectiveCamera(
			(30 * Math.PI) / 180,
			bbox.width / bbox.height,
			0.1,
			20,
		);
		const camY = 0.3;
		this.perspCamera.position = [0, camY, 5];
		this.perspCamera.lookAt = [0, camY, 0];
		this.perspCamera.updateProjectionMatrix();

		this.cameraCtrl = new CameraController(this.perspCamera, canvas, false, 1);
		this.cameraCtrl.lookAt([0, camY, 0]);

		gl.enable(gl.DEPTH_TEST);

		Promise.all([
			Promise.all(MODELS.map(loadModel)),
			loadHDRTexture(gl, "/assets/StandardCubeMap.hdr"),
		]).then(this.onResourcesLoaded);
	}

	private onResourcesLoaded = ([allModels, [skyboxCubeImage, skyboxCubeTex]]: [
		CharData[],
		[HDRImageElement, WebGLTexture],
	]) => {
		const gl = this.gl;
		this.geoLoaded = true;

		this.skyboxCubeImage = skyboxCubeImage;

		// document.body.appendChild(skyboxHDR);

		this.skybox = new Skybox(gl);
		this.skybox.envTexture = skyboxCubeTex;
		// this.scene.addChild(skybox);

		allModels.forEach((model, i) => {
			const mesh = new Char3D(gl, model);
			this.scene.addChild(mesh);

			if (i === 0) {
				this.cameraUBOInfo = createUniformBlockInfo(
					gl,
					mesh.program,
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
		if (!this.geoLoaded) {
			return;
		}
		ts *= 0.001;

		const gl = this.gl;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this.perspCamera.updateViewMatrix();

		this.updateCameraUBO(ts);

		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		gl.clearColor(0.1, 0.1, 0.1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this.scene.updateWorldMatrix().render();
		this.skybox.render();
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
			this.cameraUBOInfo.uniforms.position.offset as number,
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
