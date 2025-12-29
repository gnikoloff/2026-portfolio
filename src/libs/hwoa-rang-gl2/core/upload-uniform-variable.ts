import { UniformValue } from '..'

// Ported from OGL
// https://github.com/oframe/ogl/blob/0fc80bbe0eeffc9abb21872b1bd6085dbc29df82/src/core/Program.js#L213

/**
 * @description Upload value to GPU using appropriate uniform[Matrix][1234][fi]() call
 * @param {WebGL2RenderingContext} gl
 * @param {GLuint} type
 * @param {UniformValue.} value
 * @returns {void}
 */
const uploadUniformVariable = (
  gl: WebGL2RenderingContext,
  type: GLuint,
  location: WebGLUniformLocation | null,
  value: UniformValue,
): void => {
  let arr
  switch (type) {
    case gl.FLOAT:
      return gl.uniform1f(location, value as GLfloat)
    case gl.FLOAT_VEC2:
      arr = value as Float32Array
      return gl.uniform2f(location, arr[0], arr[1])
    case gl.FLOAT_VEC3:
      arr = value as Float32Array
      return gl.uniform3f(location, arr[0], arr[1], arr[2])
    case gl.FLOAT_VEC4:
      arr = value as Float32Array
      return gl.uniform4f(location, arr[0], arr[1], arr[2], arr[3])
    case gl.BOOL:
    case gl.INT:
    case gl.SAMPLER_2D:
    case gl.SAMPLER_CUBE:
      return gl.uniform1i(location, value as number)
    case gl.BOOL_VEC2:
    case gl.INT_VEC2:
      arr = value as Int32Array
      return gl.uniform2i(location, arr[0], arr[1])
    case gl.BOOL_VEC3:
    case gl.INT_VEC3:
      arr = value as Int32Array
      return gl.uniform3i(location, arr[0], arr[1], arr[2])
    case gl.BOOL_VEC4:
    case gl.INT_VEC4:
      arr = value as Int32Array
      return gl.uniform4i(location, arr[0], arr[1], arr[2], arr[3])
    case gl.FLOAT_MAT2:
      return gl.uniformMatrix2fv(location, false, value as Float32Array)
    case gl.FLOAT_MAT3:
      return gl.uniformMatrix3fv(location, false, value as Float32Array)
    case gl.FLOAT_MAT4:
      // console.log(value, value.length)
      return gl.uniformMatrix4fv(location, false, value as Float32Array)
    default:
      throw new Error('wrong type for uniform')
  }
}

export default uploadUniformVariable
