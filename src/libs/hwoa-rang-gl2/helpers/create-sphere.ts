import { vec3 } from 'gl-matrix'
import { Sphere, SphereGeometry } from '..'

/**
 * Generates geometry data for a sphere
 * @param {Sphere} params
 * @returns {SphereGeometry}
 */
const createSphere = (params: Sphere = {}): SphereGeometry => {
  const {
    radius = 0.5,
    widthSegments = 16,
    heightSegments = Math.ceil(widthSegments * 0.5),
    phiStart = 0,
    phiLength = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI,
  } = params

  const wSegs = widthSegments
  const hSegs = heightSegments
  const pStart = phiStart
  const pLength = phiLength
  const tStart = thetaStart
  const tLength = thetaLength

  const num = (wSegs + 1) * (hSegs + 1)
  const vertexCount = wSegs * hSegs * 6

  const vertexStride = 3 + 3 + 2

  // const position = new Float32Array(num * 3)
  // const normal = new Float32Array(num * 3)
  // const uv = new Float32Array(num * 2)
  const interleavedArray = new Float32Array(num * vertexStride)
  const indicesArray =
    num > 65536 ? new Uint32Array(vertexCount) : new Uint16Array(vertexCount)

  let i = 0
  let iv = 0
  let ii = 0
  const te = tStart + tLength
  const grid: Array<number[]> = []

  const n = vec3.create()

  for (let iy = 0; iy <= hSegs; iy++) {
    const vRow: number[] = []
    const v = iy / hSegs
    for (let ix = 0; ix <= wSegs; ix++, i++) {
      const u = ix / wSegs
      const x =
        -radius *
        Math.cos(pStart + u * pLength) *
        Math.sin(tStart + v * tLength)
      const y = radius * Math.cos(tStart + v * tLength)
      const z =
        radius * Math.sin(pStart + u * pLength) * Math.sin(tStart + v * tLength)

      interleavedArray[i * vertexStride + 0] = x
      interleavedArray[i * vertexStride + 1] = y
      interleavedArray[i * vertexStride + 2] = z

      vec3.set(n, x, y, z)
      vec3.normalize(n, n)

      interleavedArray[i * vertexStride + 3] = n[0]
      interleavedArray[i * vertexStride + 4] = n[1]
      interleavedArray[i * vertexStride + 5] = n[2]

      interleavedArray[i * vertexStride + 6] = u
      interleavedArray[i * vertexStride + 7] = 1 - v

      vRow.push(iv++)
    }

    grid.push(vRow)
  }

  for (let iy = 0; iy < hSegs; iy++) {
    for (let ix = 0; ix < wSegs; ix++) {
      const a = grid[iy][ix + 1]
      const b = grid[iy][ix]
      const c = grid[iy + 1][ix]
      const d = grid[iy + 1][ix + 1]

      if (iy !== 0 || tStart > 0) {
        indicesArray[ii * 3] = a
        indicesArray[ii * 3 + 1] = b
        indicesArray[ii * 3 + 2] = d
        ii++
      }
      if (iy !== hSegs - 1 || te < Math.PI) {
        indicesArray[ii * 3] = b
        indicesArray[ii * 3 + 1] = c
        indicesArray[ii * 3 + 2] = d
        ii++
      }
    }
  }

  return {
    radius,
    vertexCount,
    vertexStride,
    interleavedArray,
    indicesArray,
  }
}

export default createSphere
