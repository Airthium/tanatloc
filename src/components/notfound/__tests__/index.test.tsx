import { fireEvent, render, screen } from '@testing-library/react'

import NotFound from '@/components/notfound'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => mockRouter()
  })
}))

const mockFontError = jest.fn()
const mockFontReturn = jest.fn()
jest.mock('three/examples/jsm/loaders/FontLoader', () => ({
  FontLoader: class {
    load = (_: any, finish: Function, progress: Function, error: Function) => {
      progress('progress')
      error('error')
      finish(mockFontReturn)
    }
  }
}))

jest.mock('three/examples/jsm/geometries/TextGeometry', () => ({
  TextGeometry: class {
    boundingBox = {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 1, y: 1, z: 1 }
    }
    computeBoundingBox = jest.fn()
  }
}))

const mockGLTFError = jest.fn()
const mockGLTFReturn = jest.fn()
jest.mock('three/examples/jsm/loaders/GLTFLoader', () => ({
  GLTFLoader: class {
    load = (_: any, finish: Function, error: Function) => {
      error('error')
      finish(mockGLTFReturn())
    }
  }
}))

const mockIsWebGLAvailable = jest.fn()
jest.mock('three/examples/jsm/capabilities/WebGL', () => ({
  isWebGLAvailable: () => mockIsWebGLAvailable()
}))

Object.defineProperty(global, 'setTimeout', {
  value: (callback: Function) => callback()
})

describe('components/notfound', () => {
  let count = 0
  beforeEach(() => {
    mockRouter.mockReset()

    mockFontError.mockReset()
    mockFontReturn.mockReset()

    mockGLTFError.mockReset()
    mockGLTFReturn.mockReset()
    mockGLTFReturn.mockImplementation(() => ({
      scene: {
        children: [
          {
            geometry: {
              attributes: {
                color: {
                  setXYZ: jest.fn
                }
              },
              boundingSphere: {
                center: {
                  x: 0,
                  y: 0,
                  z: 0
                }
              },
              getAttribute: () => ({
                count: 3,
                getY: () => {
                  count++
                  if (count === 1) return 450
                  else return 750
                }
              }),
              setAttribute: jest.fn
            }
          }
        ]
      }
    }))

    mockIsWebGLAvailable.mockReset()
    mockIsWebGLAvailable.mockImplementation(() => true)
  })

  test('render', () => {
    //@ts-ignore
    global.MockScene = {
      children: [
        { type: 'Group', rotateY: jest.fn, children: [{}] },
        { type: 'Other' }
      ]
    }

    const { unmount } = render(<NotFound />)

    unmount()
  })

  test('no WebGL', () => {
    mockIsWebGLAvailable.mockImplementation(() => false)
    const { unmount } = render(<NotFound />)

    unmount()
  })

  test('onClick', () => {
    const { unmount } = render(<NotFound />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockRouter).toHaveBeenCalledTimes(1)

    unmount()
  })
})
