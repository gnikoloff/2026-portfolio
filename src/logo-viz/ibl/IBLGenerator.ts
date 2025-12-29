import { Drawable, Geometry, ShaderDefineValue } from "@/libs/hwoa-rang-gl2";
import { mat4 } from "gl-matrix";
import vertShaderSrc from "../shaders/uberVertexShader";

const CUBE_VIEWS = [
	mat4.lookAt(mat4.create(), [0, 0, 0], [1, 0, 0], [0, -1, 0]), // +X
	mat4.lookAt(mat4.create(), [0, 0, 0], [-1, 0, 0], [0, -1, 0]), // -X
	mat4.lookAt(mat4.create(), [0, 0, 0], [0, 1, 0], [0, 0, 1]), // +Y
	mat4.lookAt(mat4.create(), [0, 0, 0], [0, -1, 0], [0, 0, -1]), // -Y
	mat4.lookAt(mat4.create(), [0, 0, 0], [0, 0, 1], [0, -1, 0]), // +Z
	mat4.lookAt(mat4.create(), [0, 0, 0], [0, 0, -1], [0, -1, 0]), // -Z
];

const CUBE_PROJ_MATRIX = mat4.create();
mat4.perspective(CUBE_PROJ_MATRIX, Math.PI / 2, 1.0, 0.1, 10.0);

export default class IBLGenerator extends Drawable {
	public outTexture: WebGLTexture;

	protected framebuffer: WebGLFramebuffer;
	protected depthRenderbuffer: WebGLRenderbuffer; // ADD THIS

	constructor(
		gl: WebGL2RenderingContext,
		protected texSize: number,
		fragShaderSrc: string,
		geometry: Geometry,
		hasUV: boolean,
		defines: Record<string, ShaderDefineValue> = {},
	) {
		super(gl, vertShaderSrc, fragShaderSrc, defines);

		const { vertexCount, vertexStride, interleavedArray, indicesArray } =
			geometry;
		this.vertexCount = vertexCount;

		const interleavedBuffer = gl.createBuffer();
		const indexBuffer = gl.createBuffer();

		const aPosition = gl.getAttribLocation(this.program, "aPosition");
		let aUv = -1;
		if (hasUV) {
			aUv = gl.getAttribLocation(this.program, "aUv");
		}

		gl.bindVertexArray(this.vao);

		gl.bindBuffer(gl.ARRAY_BUFFER, interleavedBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, interleavedArray, gl.STATIC_DRAW);

		gl.enableVertexAttribArray(aPosition);
		gl.vertexAttribPointer(
			aPosition,
			3,
			gl.FLOAT,
			false,
			vertexStride * Float32Array.BYTES_PER_ELEMENT,
			0 * Float32Array.BYTES_PER_ELEMENT,
		);

		if (hasUV) {
			gl.enableVertexAttribArray(aUv);
			gl.vertexAttribPointer(
				aUv,
				2,
				gl.FLOAT,
				false,
				vertexStride * Float32Array.BYTES_PER_ELEMENT,
				6 * Float32Array.BYTES_PER_ELEMENT,
			);
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesArray, gl.STATIC_DRAW);

		this.gl.bindVertexArray(null);

		this.outTexture = gl.createTexture();

		this.framebuffer = gl.createFramebuffer()!;
		this.depthRenderbuffer = gl.createRenderbuffer()!;
		this.setupDepthBuffer();
	}

	protected getCamProjMatrix(): mat4 {
		return CUBE_PROJ_MATRIX;
	}

	protected getCamViewMatrix(faceIdx: number): mat4 {
		return CUBE_VIEWS[faceIdx];
	}

	protected setupDepthBuffer() {
		const { gl, texSize, depthRenderbuffer } = this;

		gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
		gl.renderbufferStorage(
			gl.RENDERBUFFER,
			gl.DEPTH_COMPONENT24,
			texSize,
			texSize,
		);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	}

	public dispose() {
		const { gl, framebuffer, depthRenderbuffer } = this;

		gl.deleteFramebuffer(framebuffer);
		gl.deleteRenderbuffer(depthRenderbuffer);
	}
}
