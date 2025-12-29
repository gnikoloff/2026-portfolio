import { UBOInfo, UBOVariableInfo } from '..'

const createUniformBlockInfo = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniformBlockName: string,
  uniformNames: string[],
): UBOInfo => {
  const blockIndex = gl.getUniformBlockIndex(program, uniformBlockName)
  const blockSize = gl.getActiveUniformBlockParameter(
    program,
    blockIndex,
    gl.UNIFORM_BLOCK_DATA_SIZE,
  )
  const usedInVertexShader = gl.getActiveUniformBlockParameter(
    program,
    blockIndex,
    gl.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER,
  )
  const usedInFragmentShader = gl.getActiveUniformBlockParameter(
    program,
    blockIndex,
    gl.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER,
  )
  const uniformIndices = gl.getUniformIndices(program, uniformNames)!
  const uniformOffsets = gl.getActiveUniforms(
    program,
    uniformIndices,
    gl.UNIFORM_OFFSET,
  )
  const uniformSizes = gl.getActiveUniforms(
    program,
    uniformIndices,
    gl.UNIFORM_SIZE,
  )
  const uniforms: { [key: string]: UBOVariableInfo } = {}
  for (let i = 0; i < uniformNames.length; i++) {
    const name = uniformNames[i]
    const uniformInfo: UBOVariableInfo = {
      index: uniformIndices[i],
      offset: uniformOffsets[i],
      size: uniformSizes[i],
    }
    uniforms[name] = uniformInfo
  }
  return {
    blockIndex,
    blockSize,
    usedInVertexShader,
    usedInFragmentShader,
    uniforms,
  }
}

export default createUniformBlockInfo
