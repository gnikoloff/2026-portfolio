import { IndexlessGeometry } from '../interfaces'

const createTriangle = (
  v0x: number,
  v0y: number,
  v1x: number,
  v1y: number,
  v2x: number,
  v2y: number,
): IndexlessGeometry => {
  const vertexStride = 3
  const vertexCount = 3
  const interleavedArray = new Float32Array(vertexCount * vertexStride)
  interleavedArray[0] = v0x
  interleavedArray[1] = v0y
  interleavedArray[2] = 0

  interleavedArray[3] = v1x
  interleavedArray[4] = v1y
  interleavedArray[5] = 0

  interleavedArray[6] = v2x
  interleavedArray[7] = v2y
  interleavedArray[8] = 0

  return {
    vertexCount,
    vertexStride,
    interleavedArray,
  }
}

export default createTriangle
