import { ShaderDefineValue } from '..'

const SHADER_DEFINES_HOOK = '-- DEFINES_HOOK --'

/**
 * Create and compile WebGLShader
 * @param {WebGL2RenderingContext)} gl
 * @param {GLenum} shaderType
 * @param {string} shaderSource
 * @param {Record<string, any>} defines
 * @returns {WebGLShader}
 */
const createShader = (
  gl: WebGL2RenderingContext,
  shaderType: GLenum,
  shaderSource: string,
  defines: { [key: string]: ShaderDefineValue } = {},
): WebGLShader => {
  if (
    Object.keys(defines).length &&
    !shaderSource.includes(SHADER_DEFINES_HOOK)
  ) {
    throw new Error(
      `in order to include defines, you must provide "${SHADER_DEFINES_HOOK}" in your shader code`,
    )
  }
  let shaderDefinesString = ''
  for (const [key, value] of Object.entries(defines)) {
    if (typeof value === 'boolean' && !value) {
      continue
    }
    let valueFormatted = `${value}`
    if (typeof value === 'number' && Number.isInteger(value)) {
      valueFormatted += '.0'
    }
    shaderDefinesString += `#define ${key} ${valueFormatted}\n`
  }
  shaderSource = shaderSource.replace(SHADER_DEFINES_HOOK, shaderDefinesString)

  const shader: WebGLShader = gl.createShader(shaderType)!
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader
  }
  const errorMessage = `
    Error in ${shaderType === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment'} shader:
    ${gl.getShaderInfoLog(shader)}
  `
  gl.deleteShader(shader)
  throw new Error(errorMessage)
}

export default createShader
