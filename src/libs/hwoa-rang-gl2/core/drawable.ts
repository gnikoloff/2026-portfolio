import { mat4 } from "gl-matrix";

import { BoundingBox } from "../../hwoa-rang-math";
import {
	ShaderDefineValue,
	Uniform,
	UniformInfo,
	UniformValue,
} from "../interfaces";
import createProgram from "./create-program";
import SceneNode from "./scene-node";
import uploadUniformVariable from "./upload-uniform-variable";

export default class Drawable extends SceneNode {
	protected gl: WebGL2RenderingContext;
	protected vao: WebGLVertexArrayObject;
	protected vertexCount!: number;

	#uniforms: Map<string, Uniform> = new Map();
	// protected attributes: Map<string, Attribute> = new Map()

	boundingBox!: BoundingBox;
	program!: WebGLProgram;

	static WORLD_MATRIX_UNIFORM_NAME = "u_worldMatrix";

	constructor(
		gl: WebGL2RenderingContext,
		vertexShaderSource: string,
		fragmentShaderSource: string,
		shaderDefines: { [name: string]: ShaderDefineValue } = {},
		supportsWorldMatrix = true,
		name?: string,
	) {
		super(name);
		this.gl = gl;

		this.vao = gl.createVertexArray()!;
		this.program = createProgram(
			gl,
			vertexShaderSource,
			fragmentShaderSource,
			shaderDefines,
		);
		// @ts-ignore
		this.program.__SPECTOR_Metadata = { name, shaderDefines };

		if (supportsWorldMatrix) {
			const worldMatrixSet = this.setUniform(
				Drawable.WORLD_MATRIX_UNIFORM_NAME,
				{
					type: gl.FLOAT_MAT4,
				},
			);

			if (!worldMatrixSet) {
				throw new Error(
					`Each Drawable is expected to have a mat4 ${Drawable.WORLD_MATRIX_UNIFORM_NAME} implemented in shader`,
				);
			}
		}
	}

	setUniform(name: string, { type, value }: UniformInfo): boolean {
		const gl = this.gl;
		let uniform;
		if ((uniform = this.#uniforms.get(name))) {
			uniform.value = value;
		} else {
			const location = gl.getUniformLocation(this.program, name);
			if (!location) {
				throw new Error(
					`uniform with name ${name} was not found in the program`,
				);
			}
			uniform = { type, location, value };
			this.#uniforms.set(name, uniform);
		}
		if (value != null) {
			gl.useProgram(this.program);
			uploadUniformVariable(gl, uniform.type, uniform.location, value);
		}
		return true;
	}

	updateUniform(name: string, value: UniformValue): boolean {
		let uniform;
		if ((uniform = this.getUniform(name))) {
			uniform.value = value;
			const gl = this.gl;
			gl.useProgram(this.program);
			uploadUniformVariable(gl, uniform.type, uniform.location, value);
			return true;
		}
		return false;
	}

	getUniform(name: string): Uniform | null {
		let uniform;
		if ((uniform = this.#uniforms.get(name))) {
			return uniform;
		}
		throw new Error(`can't locate uniform with that name`);
	}

	updateWorldMatrix(parentWorldMatrix?: mat4 | null): this {
		super.updateWorldMatrix(parentWorldMatrix);
		this.updateUniform(
			Drawable.WORLD_MATRIX_UNIFORM_NAME,
			this.worldMatrix as Float32Array,
		);
		return this;
	}

	destroy(): void {
		this.#uniforms.clear();
		// this.attributes.clear()
		const gl = this.gl;
		gl.deleteVertexArray(this.vao);
		gl.deleteProgram(this.program);
	}
}
