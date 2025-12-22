import { Drawable } from "@/libs/hwoa-rang-gl2";

import { CharData } from "@/types";
import { vec3 } from "gl-matrix";
import fragShaderSrc from "./shaders/uberFragShader";
import vertShaderSrc from "./shaders/uberVertexShader";

export default class Char3D extends Drawable {
	private cameraUBOIndex: number;

	public loadingT = 0;

	constructor(gl: WebGL2RenderingContext, charData: CharData) {
		super(gl, vertShaderSrc, fragShaderSrc, {
			USE_UBOS: true,
			USE_UV: true,
			USE_NORMAL: true,
			USE_TANGENT: true,
			USE_WORLD_POS: true,
			USE_PBR: true,
			USE_MRT: true,
			HAS_LOADING_ANIM: true,
			MAX_REFLECTION_LOD: 4,
		});
		this.vertexCount = charData.positions.length / 3;

		const arrCount =
			charData.positions.length +
			charData.normals.length +
			charData.tangents.length +
			charData.uvs.length;

		const interleavedArray = new Float32Array(arrCount);
		const indicesArray = new Uint16Array(charData.indices);

		const vertexStride = 3 + 3 + 4 + 2;

		for (let i = 0; i < this.vertexCount; i++) {
			interleavedArray[i * vertexStride + 0] = charData.positions[i * 3 + 0];
			interleavedArray[i * vertexStride + 1] = charData.positions[i * 3 + 1];
			interleavedArray[i * vertexStride + 2] = charData.positions[i * 3 + 2];

			interleavedArray[i * vertexStride + 3] = charData.normals[i * 3 + 0];
			interleavedArray[i * vertexStride + 4] = charData.normals[i * 3 + 1];
			interleavedArray[i * vertexStride + 5] = charData.normals[i * 3 + 2];

			interleavedArray[i * vertexStride + 6] = charData.tangents[i * 4 + 0];
			interleavedArray[i * vertexStride + 7] = charData.tangents[i * 4 + 1];
			interleavedArray[i * vertexStride + 8] = charData.tangents[i * 4 + 2];
			interleavedArray[i * vertexStride + 9] = charData.tangents[i * 4 + 3];

			interleavedArray[i * vertexStride + 10] = charData.uvs[i * 2 + 0];
			interleavedArray[i * vertexStride + 11] = charData.uvs[i * 2 + 1];
		}

		const aPosition = gl.getAttribLocation(this.program, "aPosition");
		const aNormal = gl.getAttribLocation(this.program, "aNormal");
		const aTangent = gl.getAttribLocation(this.program, "aTangent");
		const aUv = gl.getAttribLocation(this.program, "aUv");

		this.cameraUBOIndex = gl.getUniformBlockIndex(this.program, "Camera");

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

		gl.enableVertexAttribArray(aNormal);
		gl.vertexAttribPointer(
			aNormal,
			3,
			gl.FLOAT,
			false,
			vertexStride * Float32Array.BYTES_PER_ELEMENT,
			3 * Float32Array.BYTES_PER_ELEMENT,
		);

		gl.enableVertexAttribArray(aTangent);
		gl.vertexAttribPointer(
			aTangent,
			4,
			gl.FLOAT,
			false,
			vertexStride * Float32Array.BYTES_PER_ELEMENT,
			6 * Float32Array.BYTES_PER_ELEMENT,
		);

		gl.enableVertexAttribArray(aUv);
		gl.vertexAttribPointer(
			aUv,
			2,
			gl.FLOAT,
			false,
			vertexStride * Float32Array.BYTES_PER_ELEMENT,
			10 * Float32Array.BYTES_PER_ELEMENT,
		);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesArray, gl.STATIC_DRAW);

		gl.bindVertexArray(null);

		// this.setUniform("u_aoMap", {
		// 	type: gl.INT,
		// 	value: 0,
		// });
		// this.setUniform("u_heightMap", {
		// 	type: gl.INT,
		// 	value: 1,
		// });
		this.setUniform("u_albedoMap", {
			type: gl.INT,
			value: 0,
		});
		this.setUniform("u_metallicMap", {
			type: gl.INT,
			value: 1,
		});
		this.setUniform("u_roughnessMap", {
			type: gl.INT,
			value: 2,
		});
		this.setUniform("u_normalMap", {
			type: gl.INT,
			value: 3,
		});
		this.setUniform("u_irradianceMap", {
			type: gl.INT,
			value: 4,
		});
		this.setUniform("u_prefilterMap", {
			type: gl.INT,
			value: 5,
		});
		this.setUniform("u_brdfLUT", {
			type: gl.INT,
			value: 6,
		});
		this.setUniform("loadingT", {
			type: gl.FLOAT,
			value: 7,
		});

		this.updateUniform("loadingT", 0);

		this.setScale(vec3.fromValues(0, 0, 0));
	}

	render(): void {
		const gl = this.gl;
		gl.uniformBlockBinding(this.program, this.cameraUBOIndex, 0);
		this.updateUniform("loadingT", this.loadingT);
		this.gl.bindVertexArray(this.vao);
		this.gl.drawElements(
			this.gl.TRIANGLES,
			this.vertexCount,
			this.gl.UNSIGNED_SHORT,
			0,
		);
	}
}
