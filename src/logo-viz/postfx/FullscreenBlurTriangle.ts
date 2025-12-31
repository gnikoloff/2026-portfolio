import FullscreenTriangle from "./FullscreenTriangle";

export default class FullscreenBlurTriangle extends FullscreenTriangle {
	private fboPing: WebGLFramebuffer;
	private fboPong: WebGLFramebuffer;
	private texturePing: WebGLTexture;
	private texturePong: WebGLTexture;
	private width: number;
	private height: number;

	constructor(gl: WebGL2RenderingContext, width: number, height: number) {
		super(gl, {
			IS_GAUSSIAN_BLUR: true,
		});

		this.width = width;
		this.height = height;

		// Create ping-pong framebuffers
		this.fboPing = gl.createFramebuffer()!;
		this.fboPong = gl.createFramebuffer()!;

		// Create ping texture
		this.texturePing = gl.createTexture()!;
		gl.bindTexture(gl.TEXTURE_2D, this.texturePing);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA16F,
			width,
			height,
			0,
			gl.RGBA,
			gl.HALF_FLOAT,
			null,
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		// Create pong texture
		this.texturePong = gl.createTexture()!;
		gl.bindTexture(gl.TEXTURE_2D, this.texturePong);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA16F,
			width,
			height,
			0,
			gl.RGBA,
			gl.HALF_FLOAT,
			null,
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		// Attach textures to framebuffers
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboPing);
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,
			gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D,
			this.texturePing,
			0,
		);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboPong);
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,
			gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D,
			this.texturePong,
			0,
		);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		// Set uniforms
		this.setUniform("u_resolution", {
			type: gl.FLOAT_VEC2,
			value: new Float32Array([width, height]),
		});
		this.setUniform("u_direction", {
			type: gl.FLOAT_VEC2,
			value: new Float32Array([0, 0]),
		});
	}

	/**
	 * Apply multi-pass Gaussian blur
	 * @param sourceTexture Input texture to blur
	 * @param iterations Number of blur passes (default 8)
	 * @param radius Blur radius multiplier (default 1.0)
	 * @returns Final blurred texture
	 */
	public blur(iterations = 8, radius = 0.2): WebGLTexture {
		const { gl, fboPing, fboPong, texturePing, texturePong, width, height } =
			this;

		gl.viewport(0, 0, width, height);
		gl.useProgram(this.program);
		gl.bindVertexArray(this.vao);

		let writeBuffer = fboPing;
		let writeTexture = texturePing;
		let readBuffer = fboPong;
		let readTexture = texturePong;

		for (let i = 0; i < iterations; i++) {
			// Calculate blur radius for this pass (wider at start, narrower at end)
			const passRadius = (iterations - i - 1) * radius;

			// Bind write framebuffer
			gl.bindFramebuffer(gl.FRAMEBUFFER, writeBuffer);

			// Bind read texture
			gl.activeTexture(gl.TEXTURE0);
			if (i === 0) {
				gl.bindTexture(gl.TEXTURE_2D, this.inTexture);
			} else {
				gl.bindTexture(gl.TEXTURE_2D, readTexture);
			}

			// Alternate between horizontal and vertical blur
			if (i % 2 === 0) {
				// Horizontal
				this.updateUniform("u_direction", new Float32Array([passRadius, 0]));
			} else {
				// Vertical
				this.updateUniform("u_direction", new Float32Array([0, passRadius]));
			}

			// Clear and draw
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, 3);

			// Swap buffers
			const tempBuffer = writeBuffer;
			const tempTexture = writeTexture;
			writeBuffer = readBuffer;
			writeTexture = readTexture;
			readBuffer = tempBuffer;
			readTexture = tempTexture;
		}

		gl.bindVertexArray(null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		// Return the texture that was written to last
		return readTexture;
	}

	public dispose() {
		const { gl, fboPing, fboPong, texturePing, texturePong } = this;
		gl.deleteFramebuffer(fboPing);
		gl.deleteFramebuffer(fboPong);
		gl.deleteTexture(texturePing);
		gl.deleteTexture(texturePong);
	}
}
