import { FramebufferInfo } from '..'

/**
 * @description Creates a framebuffer, attaches a texture to COLOR_ATTACHMENT0 and optional depth texture to DEPTH_ATTACHMENT
 * @param {WebGL2RenderingContext} gl
 * @param {number} width
 * @param {number} height
 * @param {boolean} useDepthTexture
 * @param {string} debugName
 */
const createFramebuffer = (
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  useDepthTexture = false,
  colorBufferFormat = gl.RGB,
  debugName: string,
): FramebufferInfo => {
  const framebuffer = gl.createFramebuffer()!
  if (debugName) {
    // @ts-ignore
    framebuffer.__SPECTOR_Metadata = { name: `framebuffer ${debugName}` }
  }

  const texture = gl.createTexture()!
  if (debugName) {
    // @ts-ignore
    framebuffer.__SPECTOR_Metadata = {
      name: `framebuffer ${debugName} color attachment 0`,
    }
  }

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    colorBufferFormat,
    width,
    height,
    0,
    colorBufferFormat,
    gl.UNSIGNED_BYTE,
    null,
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  )

  let depthTexture: WebGLTexture | undefined = undefined

  if (useDepthTexture) {
    depthTexture = gl.createTexture()!
    if (debugName) {
      // @ts-ignore
      depthTexture.__SPECTOR_Metadata = {
        name: `framebuffer ${debugName} depth attachment`,
      }
    }
    gl.bindTexture(gl.TEXTURE_2D, depthTexture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.DEPTH_COMPONENT32F,
      width,
      height,
      0,
      gl.DEPTH_COMPONENT,
      gl.FLOAT,
      null,
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      depthTexture,
      0,
    )
  } else {
    const depthBuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      depthBuffer,
    )
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  return {
    width,
    height,
    framebuffer,
    texture,
    depthTexture,
  }
}

export default createFramebuffer
