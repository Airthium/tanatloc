import React from 'react'
import { render } from '@testing-library/react'

import Background from '@/components/background'

let mockAnimationCount = 0
Object.defineProperty(window, 'requestAnimationFrame', {
  value: (callback: Function) => {
    mockAnimationCount++
    if (mockAnimationCount === 1) callback()
  }
})

//@ts-ignore
global.MockScene.children = [
  {
    rotation: {},
    geometry: {
      dispose: jest.fn
    },
    material: {
      dispose: jest.fn
    }
  },
  {
    rotation: {},
    geometry: {
      dispose: jest.fn
    },
    material: {
      dispose: jest.fn
    }
  }
]

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

const mockWebGLAvailable = jest.fn()
jest.mock('three/examples/jsm/capabilities/WebGL', () => ({
  isWebGLAvailable: () => mockWebGLAvailable()
}))

describe('components/background', () => {
  beforeEach(() => {
    mockWebGLAvailable.mockReset()
    mockWebGLAvailable.mockImplementation(() => true)
  })

  test('render - no WebGL', () => {
    const { unmount } = render(<Background />)

    unmount()
  })

  test('render - no WebGL', () => {
    mockWebGLAvailable.mockImplementation(() => false)
    const { unmount } = render(<Background />)

    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(<Background />)
    window.dispatchEvent(new Event('resize'))

    unmount()
  })

  test('pixelRatio', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: undefined })
    const { unmount } = render(<Background />)

    unmount()
  })
})
