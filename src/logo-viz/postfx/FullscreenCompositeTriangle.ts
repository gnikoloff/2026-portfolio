import FullscreenTriangle from "./FullscreenTriangle";

export class FullscreenCompositeTriangle extends FullscreenTriangle {
	public inBloomTexture?: WebGLTexture;

	constructor(gl: WebGL2RenderingContext) {
		super(gl);

		this.setUniform("bloomTexture", {
			type: gl.INT,
			value: 1,
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
