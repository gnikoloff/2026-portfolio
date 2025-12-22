export interface MainSceneMSAAFramebufferResult {
	msaaFramebuffer: WebGLFramebuffer;
	resolveFramebuffer: WebGLFramebuffer;
	colorTargetTexture: WebGLTexture;
	thresholdTargetTexture: WebGLTexture;
	width: number;
	height: number;
	samples: number;
}

function createMainSceneMSAAFramebuffer(
	gl: WebGL2RenderingContext,
	width: number,
	height: number,
): MainSceneMSAAFramebufferResult {
	const maxSamples = gl.getParameter(gl.MAX_SAMPLES);
	const samples = Math.min(4, maxSamples);

	// === MSAA Framebuffer (both attachments MSAA) ===
	const msaaFramebuffer = gl.createFramebuffer()!;
	gl.bindFramebuffer(gl.FRAMEBUFFER, msaaFramebuffer);

	// MSAA color renderbuffer
	const colorMSAABuffer = gl.createRenderbuffer()!;
	gl.bindRenderbuffer(gl.RENDERBUFFER, colorMSAABuffer);
	gl.renderbufferStorageMultisample(
		gl.RENDERBUFFER,
		samples,
		gl.RGBA16F,
		width,
		height,
	);
	gl.framebufferRenderbuffer(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT0,
		gl.RENDERBUFFER,
		colorMSAABuffer,
	);

	// MSAA threshold renderbuffer (changed to MSAA)
	const thresholdMSAABuffer = gl.createRenderbuffer()!;
	gl.bindRenderbuffer(gl.RENDERBUFFER, thresholdMSAABuffer);
	gl.renderbufferStorageMultisample(
		gl.RENDERBUFFER,
		samples,
		gl.RGBA16F,
		width,
		height,
	);
	gl.framebufferRenderbuffer(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT1,
		gl.RENDERBUFFER,
		thresholdMSAABuffer,
	);

	// MSAA depth renderbuffer
	const depthMSAABuffer = gl.createRenderbuffer()!;
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthMSAABuffer);
	gl.renderbufferStorageMultisample(
		gl.RENDERBUFFER,
		samples,
		gl.DEPTH_COMPONENT24,
		width,
		height,
	);
	gl.framebufferRenderbuffer(
		gl.FRAMEBUFFER,
		gl.DEPTH_ATTACHMENT,
		gl.RENDERBUFFER,
		depthMSAABuffer,
	);

	gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
		throw new Error("MSAA Framebuffer not complete");
	}

	// === Resolve Framebuffer (both textures) ===
	const resolveFramebuffer = gl.createFramebuffer()!;
	gl.bindFramebuffer(gl.FRAMEBUFFER, resolveFramebuffer);

	// Color texture
	const colorTargetTexture = gl.createTexture()!;
	gl.bindTexture(gl.TEXTURE_2D, colorTargetTexture);
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
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT0,
		gl.TEXTURE_2D,
		colorTargetTexture,
		0,
	);

	// Threshold texture
	const thresholdTargetTexture = gl.createTexture()!;
	gl.bindTexture(gl.TEXTURE_2D, thresholdTargetTexture);
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
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT1,
		gl.TEXTURE_2D,
		thresholdTargetTexture,
		0,
	);

	gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);

	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
		throw new Error("Resolve Framebuffer not complete");
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	return {
		msaaFramebuffer,
		resolveFramebuffer,
		colorTargetTexture,
		thresholdTargetTexture,
		width,
		height,
		samples,
	};
}

export default createMainSceneMSAAFramebuffer;
