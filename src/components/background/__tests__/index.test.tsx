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

describe('components/background', () => {
  test('render - no WebGL', () => {
    const { unmount } = render(<Background />)

    unmount()
  })

  test('render - no WebGL', () => {
    // Object.defineProperty(window, 'WebGLRenderingContext', { value: {} })
    const { unmount } = render(<Background />)

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
