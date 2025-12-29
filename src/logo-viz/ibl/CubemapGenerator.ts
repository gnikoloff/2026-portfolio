import { createBox } from "@/libs/hwoa-rang-gl2";
import fragShaderSrc from "../shaders/uberFragShader";
import IBLGenerator from "./IBLGenerator";

export default class CubemapGenerator extends IBLGenerator {
	constructor(gl: WebGL2RenderingContext, size: number) {
		super(
			gl,
			size,
			fragShaderSrc,
			createBox({ useCubemapCrossLayout: true }),
			true,
			{
				IS_TO_CUBEMAP_CONVERT: true,
				USE_UV: true,
			},
		);

		this.setupCubemapTexture();

		this.updateUniform("u_worldMatrix", this.worldMatrix as Float32Array);
		this.setUniform("u_environmentMap", {
			type: gl.INT,
			value: 0,
		});
	}

	private setupCubemapTexture() {
		const { gl, texSize, outTexture } = this;

		gl.bindTexture(gl.TEXTURE_CUBE_MAP, outTexture);

		for (let i = 0; i < 6; i++) {
			gl.texImage2D(
				gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
				0,
				gl.RGBA16F,
				texSize,
				texSize,
				0,
				gl.RGBA,
				gl.HALF_FLOAT,
				null,
			);
		}

		// Set to LINEAR initially (no mipmaps yet)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Changed
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}

	public convert(sourceTexture: WebGLTexture) {
		const { gl, framebuffer, outTexture, texSize } = this;

		// Bind framebuffer and setup
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.viewport(0, 0, texSize, texSize);

		gl.framebufferRenderbuffer(
			gl.FRAMEBUFFER,
			gl.DEPTH_ATTACHMENT,
			gl.RENDERBUFFER,
			this.depthRenderbuffer,
		);

		// Bind source texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, sourceTexture);

		// Use shader program
		gl.useProgram(this.program);

		this.setUniform("u_environmentMap", {
			type: gl.INT,
			value: 0,
		});

		// Render each face
		for (let i = 0; i < 6; i++) {
			gl.framebufferTexture2D(
				gl.FRAMEBUFFER,
				gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
				outTexture,
				0,
			);

			const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (status !== gl.FRAMEBUFFER_COMPLETE) {
				throw new Error("Framebuffer not complete: " + status);
			}

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			const projMatrix = this.getCamProjMatrix();
			const viewMatrix = this.getCamViewMatrix(i);
			this.setUniform("projMatrix", {
				type: gl.FLOAT_MAT4,
				value: projMatrix as Float32Array,
			});
			this.setUniform("viewMatrix", {
				type: gl.FLOAT_MAT4,
				value: viewMatrix as Float32Array,
			});

			gl.bindVertexArray(this.vao);
			gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
		}

		// Generate mipmaps
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, outTexture);
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

		// NOW set mipmap filtering - ADD THIS
		gl.texParameteri(
			gl.TEXTURE_CUBE_MAP,
			gl.TEXTURE_MIN_FILTER,
			gl.LINEAR_MIPMAP_LINEAR,
		);

		// Restore state
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}
}
