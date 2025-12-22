import IBLGenerator from "./IBLGenerator";

import fragShaderSrc from "../shaders/specularIBLGenerator";
import { cubemapGeometry } from "../utils/utils";

export default class SpecularIBLGenerator extends IBLGenerator {
	constructor(
		gl: WebGL2RenderingContext,
		texSize: number,
		private srcTexSize: number,
	) {
		const defines = {
			PI: Math.PI,
			CUBEMAP_SIDE_SIZE: srcTexSize,
			USE_WORLD_POS: true,
		};
		super(gl, texSize, fragShaderSrc, cubemapGeometry, false, defines);

		this.updateUniform("u_worldMatrix", this.worldMatrix as Float32Array);

		this.setUniform("u_environmentMap", {
			type: gl.INT,
			value: 0,
		});
		this.setUniform("u_roughness", {
			type: gl.FLOAT,
			value: 0,
		});
	}

	public convert(sourceTexture: WebGLTexture) {
		const { gl, outTexture } = this;
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, outTexture);
		for (let i = 0; i < 6; i++) {
			gl.texImage2D(
				gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
				0,
				gl.RGBA16F,
				this.srcTexSize,
				this.srcTexSize,
				0,
				gl.RGBA,
				gl.HALF_FLOAT,
				null,
			);
		}
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
		gl.texParameteri(
			gl.TEXTURE_CUBE_MAP,
			gl.TEXTURE_MIN_FILTER,
			gl.LINEAR_MIPMAP_LINEAR,
		);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, sourceTexture);

		const maxMipLevels = 5;
		for (let mip = 0; mip < maxMipLevels; mip++) {
			const mipWidth = this.srcTexSize * Math.pow(0.5, mip);
			const mipHeight = this.srcTexSize * Math.pow(0.5, mip);

			gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderbuffer);
			gl.renderbufferStorage(
				gl.RENDERBUFFER,
				gl.DEPTH_COMPONENT16,
				mipWidth,
				mipHeight,
			);

			gl.bindVertexArray(this.vao);
			gl.viewport(0, 0, mipWidth, mipHeight);

			const roughness = mip / (maxMipLevels - 1);
			this.updateUniform("u_roughness", roughness);

			for (let i = 0; i < 6; i++) {
				gl.framebufferTexture2D(
					gl.FRAMEBUFFER,
					gl.COLOR_ATTACHMENT0,
					gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
					this.outTexture,
					mip,
				);

				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				const projViewMatrix = this.getCamProjViewMatrix(i);
				this.setUniform("projViewMatrix", {
					type: gl.FLOAT_MAT4,
					value: projViewMatrix as Float32Array,
				});
				gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
			}
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindVertexArray(null);
	}
}
