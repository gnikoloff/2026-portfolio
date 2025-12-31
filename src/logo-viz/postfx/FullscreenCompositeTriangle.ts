import { LogoRenderMode } from "@/types";
import FullscreenTriangle from "./FullscreenTriangle";

export class FullscreenCompositeTriangle extends FullscreenTriangle {
	public inBloomTexture?: WebGLTexture;

	public updateIntensity(value: number) {
		this.updateUniform("bloomMixFactor", value);
	}

	public updateRenderModeMixFactor(v: number) {
		this.updateUniform("renderModeMixFactor", v);
	}

	public updateRenderMode(v: LogoRenderMode) {
		if (v === "bloom") {
			this.updateRenderModeMixFactor(0);
		} else {
			this.updateRenderModeMixFactor(1);
		}
	}

	constructor(gl: WebGL2RenderingContext, bloomMixFactor: number) {
		super(gl);

		this.setUniform("bloomTexture", {
			type: gl.INT,
			value: 1,
		});
		this.setUniform("renderModeMixFactor", {
			type: gl.FLOAT,
			value: 1,
		});
		this.setUniform("bloomMixFactor", {
			type: this.gl.FLOAT,
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
