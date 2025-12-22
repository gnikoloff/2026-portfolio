import { createBox, Drawable } from "@/libs/hwoa-rang-gl2/dist";

import fragShaderSrc from "./shaders/uberFragShader";
import vertShaderSrc from "./shaders/uberVertexShader";

const geometry = createBox({ useCubemapCrossLayout: true });

export default class Skybox extends Drawable {
	private cameraUBOIndex: number;

	public envTexture?: WebGLTexture;

	constructor(gl: WebGL2RenderingContext) {
		super(gl, vertShaderSrc, fragShaderSrc, {
			USE_UBOS: true,
			IS_SKYBOX: true,
			USE_WORLD_POS: true,
			USE_MRT: true,
		});

		const { vertexCount, vertexStride, interleavedArray, indicesArray } =
			geometry;

		this.vertexCount = vertexCount;

		const aPosition = gl.getAttribLocation(this.program, "aPosition");

		const interleavedBuffer = gl.createBuffer();
		const indexBuffer = gl.createBuffer();

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

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesArray, gl.STATIC_DRAW);

		gl.bindVertexArray(null);

		this.updateUniform("u_worldMatrix", this.worldMatrix as Float32Array);
		this.setUniform("u_environmentMap", {
			type: gl.INT,
			value: 0,
		});

		this.cameraUBOIndex = gl.getUniformBlockIndex(this.program, "Camera");
	}

	render(): void {
		const gl = this.gl;
		gl.depthFunc(gl.LEQUAL);
		gl.cullFace(gl.FRONT);

		if (this.envTexture != null) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.envTexture);
		}

		gl.uniformBlockBinding(this.program, this.cameraUBOIndex, 0);
		gl.useProgram(this.program);
		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
		gl.bindVertexArray(null);
		gl.cullFace(gl.BACK);
		gl.depthFunc(gl.LESS);
	}
}
