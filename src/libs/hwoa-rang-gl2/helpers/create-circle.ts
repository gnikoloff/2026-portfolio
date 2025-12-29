import { Circle, CircleGeometry } from '../interfaces'

const createCircle = (params: Circle = {}): CircleGeometry => {
  const {
    radius = 1,
    segments = 32,
    thetaStart = 0,
    thetaEnd = Math.PI * 2,
  } = params

  const indices = []
  const vertices = []
  const uvs = []

  vertices.push(0, 0, 0)
  uvs.push(0, 0)

  for (let s = 0, i = 3; s <= segments; s++, i += 3) {
    const segment = thetaStart + (s / segments) * thetaEnd

    const x = Math.cos(segment) * radius
    const y = Math.sin(segment) * radius
    vertices.push(x, y, 0)

    const uvx = (vertices[i] / radius + 1) / 2
    const uvy = (vertices[i + 1] / radius + 1) / 2

    uvs.push(uvx, uvy)
  }

  for (let i = 1; i <= segments; i++) {
    indices.push(i, i + 1, 0)
  }

  const vertexStride = 5
  const indicesArray =
    segments > 65536 ? new Uint32Array(indices) : new Uint16Array(indices)

  const interleavedArray = new Float32Array((segments + 1) * 3 * vertexStride)

  for (let i = 0; i <= segments + 1; i++) {
    interleavedArray[i * 5 + 0] = vertices[i * 3 + 0]
    interleavedArray[i * 5 + 1] = vertices[i * 3 + 1]
    interleavedArray[i * 5 + 2] = vertices[i * 3 + 2]
    interleavedArray[i * 5 + 3] = uvs[i * 2 + 0]
    interleavedArray[i * 5 + 4] = uvs[i * 2 + 1]
  }
  return {
    radius,
    interleavedArray,
    vertexCount: segments * 3,
    vertexStride,
    indicesArray,
  }
}

export default createCircle
