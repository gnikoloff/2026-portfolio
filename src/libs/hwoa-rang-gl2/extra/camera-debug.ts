import { Drawable, PerspectiveCamera } from '..'

const vertexShader = `#version 300 es
  in vec4 a_position;
  uniform mat4 u_worldMatrix;
  uniform mat4 u_projectionViewMatrix;
  void main () {
    gl_Position = u_projectionViewMatrix * u_worldMatrix * a_position;
  }
`

const fragmentShader = `#version 300 es
  precision highp float;
  out vec4 finalColor;
  void main () {
    finalColor = vec4(0.2);
  }
`

export default class CameraDebug extends Drawable {
  #camera: PerspectiveCamera

  constructor(gl: WebGL2RenderingContext, camera: PerspectiveCamera) {
    super(gl, vertexShader, fragmentShader)
    this.#camera = camera
    // console.log(rad)
    // prettier-ignore

    const numSides = 4
    const step = (Math.PI * 2) / numSides
    const frameVertices = new Float32Array(
      // frustum floats count
      numSides * 2 * 3 +
        // center line
        2 * 3,
    )
    const radius = 10

    for (let i = 0; i <= numSides; i++) {
      const offset = Math.PI * 0.25

      frameVertices[i * 6 + 0] = 0
      frameVertices[i * 6 + 1] = 0
      frameVertices[i * 6 + 2] = 0

      frameVertices[i * 6 + 3] = Math.cos(i * step + offset) * radius
      frameVertices[i * 6 + 4] = Math.sin(i * step + offset) * radius
      frameVertices[i * 6 + 5] = -10
    }
    frameVertices[numSides * 6 + 0] = 0
    frameVertices[numSides * 6 + 1] = 0
    frameVertices[numSides * 6 + 2] = 0

    frameVertices[numSides * 6 + 3] = 0
    frameVertices[numSides * 6 + 4] = 0
    frameVertices[numSides * 6 + 5] = -100

    this.vertexCount = numSides * 2 + 2
    const interleavedBuffer = gl.createBuffer()

    const a_posLoc = gl.getAttribLocation(this.program, 'a_position')

    this.setUniform('u_worldMatrix', {
      type: gl.FLOAT_MAT4,
    })
    this.setUniform('u_projectionViewMatrix', {
      type: gl.FLOAT_MAT4,
    })

    gl.bindVertexArray(this.vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, interleavedBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, frameVertices, gl.STATIC_DRAW)

    gl.enableVertexAttribArray(a_posLoc)
    gl.vertexAttribPointer(a_posLoc, 3, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)
  }
  preRender(displayCamera: PerspectiveCamera): this {
    this.updateUniform(
      'u_projectionViewMatrix',
      displayCamera.projectionViewMatrix as Float32Array,
    )
    return this
  }
  render(): void {
    // const modelMatrix = mat4.create()
    // const invertProjectionMatrix = mat4.create()
    // mat4.invert(invertProjectionMatrix, this.#camera.projectionMatrix)
    // mat4.mul(
    //   modelMatrix,
    //   this.#camera.viewMatrixInverse,
    //   invertProjectionMatrix,
    // )

    this.updateUniform(
      'u_worldMatrix',
      this.#camera.viewMatrixInverse as Float32Array,
    )

    const gl = this.gl
    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)
    gl.drawArrays(gl.LINES, 0, this.vertexCount)
  }
}
