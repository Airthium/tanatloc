const { convert } = require('..')

const mockPathJoin = jest.fn()
jest.mock('path', () => ({
  join: () => mockPathJoin()
}))

const mockReadFile = jest.fn()
jest.mock('fs', () => ({
  readFileSync: () => mockReadFile()
}))

jest.mock(
  'canvas',
  () =>
    class {
      constructor() {
        return { canvas: true }
      }
    }
)

jest.mock('../../lib/three/GLTFExporter', () => {
  // mock
})

jest.mock('../../lib/three/Lut', () => {
  // mock
})

jest.mock('../../lib/three/BufferGeometryUtils', () => {
  // mock
})

describe('modules/three-to-glb/src', () => {
  beforeEach(() => {
    mockPathJoin.mockReset()
    mockPathJoin.mockImplementation(() => 'path')

    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => JSON.stringify({}))
  })

  test('create canvas', () => {
    try {
      threeToGlbGlobal.document.createElement('div')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Cannot create node div')
    }

    const canvas = threeToGlbGlobal.document.createElement('canvas')
    expect(canvas).toEqual({ canvas: true })
  })

  test('empty part', async () => {
    const res = await convert('location', 'name')
    expect(res).toBe('gltf')
  })

  test('geometry', async () => {
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [1, 2, 3]
    })
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 1)
        return JSON.stringify({
          type: 'geometry',
          solids: [{}],
          faces: [{}]
        })
      return JSON.stringify({})
    })
    const res = await convert('location', 'name')
    expect(res).toBe('gltf')
  })

  test('geometry without colors', async () => {
    global.MockGeometry.getAttribute = (attribute) => {
      if (attribute !== 'color')
        return {
          count: 3,
          array: [1, 2, 3]
        }
    }
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 1)
        return JSON.stringify({
          type: 'geometry',
          solids: [{}],
          faces: [{}]
        })
      return JSON.stringify({})
    })
    const res = await convert('location', 'name')
    expect(res).toBe('gltf')
  })

  test('mesh', async () => {
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [1, 2, 3]
    })
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 1)
        return JSON.stringify({
          type: 'mesh',
          solids: [{}],
          faces: [{}]
        })
      return JSON.stringify({})
    })
    const res = await convert('location', 'name')
    expect(res).toBe('gltf')
  })

  test('result', async () => {
    global.MockGeometry.getAttribute = (attribute) => {
      if (attribute !== 'data')
        return {
          count: 3,
          array: [1, 2, 3]
        }
    }
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 1)
        return JSON.stringify({
          type: 'result',
          solids: [{}],
          faces: [{}]
        })
      return JSON.stringify({})
    })
    const res = await convert('location', 'name')
    expect(res).toBe('gltf')
  })

  test('result with data', async () => {
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [1, 2, 3]
    })
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 1)
        return JSON.stringify({
          type: 'result',
          solids: [{}],
          faces: [{}]
        })
      return JSON.stringify({})
    })
    const res = await convert('location', 'name')
    expect(res).toBe('gltf')
  })

  test('result with 1 data', async () => {
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [1, 1, 1]
    })
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 1)
        return JSON.stringify({
          type: 'result',
          solids: [{}],
          faces: [{}]
        })
      return JSON.stringify({})
    })
    const res = await convert('location', 'name')
    expect(res).toBe('gltf')
  })

  test('result with 0 data', async () => {
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [0, 0, 0]
    })
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 1)
        return JSON.stringify({
          type: 'result',
          solids: [{}],
          faces: [{}]
        })
      return JSON.stringify({})
    })
    const res = await convert('location', 'name')
    expect(res).toBe('gltf')
  })

  test('other', async () => {
    global.MockGeometry.getAttribute = () => {
      // mock function
    }
    let count = 0
    mockReadFile.mockImplementation(() => {
      count++
      if (count === 1)
        return JSON.stringify({
          type: 'other',
          solids: [{}],
          faces: [{}]
        })
      return JSON.stringify({})
    })
    const res = await convert('location', 'name')
    expect(res).toBe('gltf')
  })
})
