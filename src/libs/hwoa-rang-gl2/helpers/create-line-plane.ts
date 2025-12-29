import { Plane, PlaneLineGeometry } from '../interfaces'

const createLinePlane = (params: Plane = {}): PlaneLineGeometry => {
  const { width = 1, height = 1 } = params

  const vertexCount = 4
  const vertexStride = 3
  const interleavedArray = new Float32Array(vertexCount * vertexStride)
  interleavedArray[0] = -width * 0.5
  interleavedArray[1] = -height * 0.5
  interleavedArray[2] = 0

  interleavedArray[3] = width * 0.5
  interleavedArray[4] = -height * 0.5
  interleavedArray[5] = 0

  interleavedArray[6] = width * 0.5
  interleavedArray[7] = height * 0.5
  interleavedArray[8] = 0

  interleavedArray[9] = -width * 0.5
  interleavedArray[10] = height * 0.5
  interleavedArray[11] = 0

  return {
    width,
    height,
    vertexCount,
    vertexStride,
    interleavedArray,
  }
}

export default createLinePlane
