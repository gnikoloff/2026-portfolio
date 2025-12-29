import { Circle, CircleLineGeometry } from '../interfaces'

const createLineCircle = (params: Circle = {}): CircleLineGeometry => {
  const {
    radius = 1,
    segments = 32,
    thetaStart = 0,
    thetaEnd = Math.PI * 2,
  } = params
  const vertexStride = 3
  const interleavedArray = new Float32Array(segments * vertexStride)
  const step = thetaEnd / segments
  for (let i = 0; i < segments; i++) {
    const x = Math.cos(thetaStart + i * step) * radius
    const y = Math.sin(thetaStart + i * step) * radius
    interleavedArray[i * 3 + 0] = x
    interleavedArray[i * 3 + 1] = y
    interleavedArray[i * 3 + 2] = 0
  }
  return {
    radius,
    vertexCount: segments,
    vertexStride,
    interleavedArray,
  }
}

export default createLineCircle
