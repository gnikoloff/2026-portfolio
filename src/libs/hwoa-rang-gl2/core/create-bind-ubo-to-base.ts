const createAndBindUBOToBase = (
  gl: WebGL2RenderingContext,
  blockSize: GLuint,
  baseIdx: GLuint = 0,
  usage: GLuint = gl.DYNAMIC_DRAW,
) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.UNIFORM_BUFFER, buffer)
  gl.bufferData(gl.UNIFORM_BUFFER, blockSize, usage)
  gl.bindBuffer(gl.UNIFORM_BUFFER, null)
  gl.bindBufferBase(gl.UNIFORM_BUFFER, baseIdx, buffer)
  return buffer
}

export default createAndBindUBOToBase
