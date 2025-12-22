import { Drawable, ShaderDefineValue } from "@/libs/hwoa-rang-gl2/dist";

import fragShaderSrc from "../shaders/uberFragShader";
import vertShaderSrc from "../shaders/uberVertexShader";

export default class FullscreenTriangle extends Drawable {
	public inTexture!: WebGLTexture;

	constructor(
		gl: WebGL2RenderingContext,
		shaderDefines: { [name: string]: ShaderDefineValue } = {},
	) {
		super(
			gl,
			vertShaderSrc,
			fragShaderSrc,
			{
				...shaderDefines,
				IS_FULLSCREEN_TRIANGLE: true,
				USE_UV: true,
			},
			false,
		);

		this.setUniform("inTexture", {
			type: gl.INT,
			value: 0,
		});

		const fullscreenTriangle = new Float32Array([
			-1.0,
			-1.0,
			0.0,
			0.0, // Bottom-left
			3.0,
			-1.0,
			2.0,
			0.0, // Bottom-right (off-screen)
			-1.0,
			3.0,
			0.0,
			2.0, // Top-left (off-screen)
		]);

		gl.bindVertexArray(this.vao);

		// Setup in WebGL:
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, fullscreenTriangle, gl.STATIC_DRAW);

		// Position attribute (location 0)
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(
			0,
			2,
			gl.FLOAT,
			false,
			4 * Float32Array.BYTES_PER_ELEMENT,
			0 * Float32Array.BYTES_PER_ELEMENT,
		);

		// UV attribute (location 1)
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(
			1,
			2,
			gl.FLOAT,
			false,
			4 * Float32Array.BYTES_PER_ELEMENT,
			2 * Float32Array.BYTES_PER_ELEMENT,
		);

		gl.bindVertexArray(null);
	}

	preRender(): void {}

	render(): void {
		const gl = this.gl;

		this.preRender();

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.inTexture);

		gl.useProgram(this.program);
		gl.bindVertexArray(this.vao);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		gl.bindVertexArray(null);
	}

	public dispose() {
		// ...
	}
}
