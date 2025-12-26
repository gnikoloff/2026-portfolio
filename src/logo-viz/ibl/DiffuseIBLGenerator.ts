import BaseUtilObject from "./IBLGenerator";

import fragShaderSrc from "../shaders/diffuseIBLGenerator";
import { cubemapGeometry } from "../utils/utils";

export default class DiffuseIBLGenerator extends BaseUtilObject {
	constructor(gl: WebGL2RenderingContext, texSize = 32) {
		super(gl, texSize, fragShaderSrc, cubemapGeometry, false, {
			PI: Math.PI,
			USE_WORLD_POS: true,
		});

		this.updateUniform("u_worldMatrix", this.worldMatrix as Float32Array);
		this.setUniform("u_environmentMap", {
			type: gl.INT,
			value: 0,
		});
	}

	public convert(sourceTexture: WebGLTexture) {
		const gl = this.gl;
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.outTexture);

		for (let i = 0; i < 6; i++) {
			gl.texImage2D(
				gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
				0,
				gl.RGBA16F,
				this.texSize,
				this.texSize,
				0,
				gl.RGBA,
				gl.FLOAT,
				null,
			);
		}
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		gl.bindVertexArray(this.vao);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
		gl.viewport(0, 0, this.texSize, this.texSize);
		gl.framebufferRenderbuffer(
			gl.FRAMEBUFFER,
			gl.DEPTH_ATTACHMENT,
			gl.RENDERBUFFER,
			this.depthRenderbuffer,
		);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, sourceTexture);
		for (let i = 0; i < 6; i++) {
			gl.framebufferTexture2D(
				gl.FRAMEBUFFER,
				gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
				this.outTexture,
				0,
			);
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
			gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindVertexArray(null);
	}
}
