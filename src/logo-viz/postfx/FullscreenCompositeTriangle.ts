import FullscreenTriangle from "./FullscreenTriangle";

export class FullscreenCompositeTriangle extends FullscreenTriangle {
	public inBloomTexture?: WebGLTexture;

	constructor(gl: WebGL2RenderingContext, bloomMixFactor: number) {
		super(gl);

		this.setUniform("bloomTexture", {
			type: gl.INT,
			value: 1,
		});
		this.setUniform("bloomMixFactor", {
			type: gl.FLOAT,
			value: bloomMixFactor,
		});
	}

	preRender(): void {
		const gl = this.gl;
		if (this.inBloomTexture) {
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, this.inBloomTexture);
		}
	}
}
