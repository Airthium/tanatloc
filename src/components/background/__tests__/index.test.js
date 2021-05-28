import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Background from '@/components/background'

let mockAnimationCount = 0
window.requestAnimationFrame = (callback) => {
  mockAnimationCount++
  if (mockAnimationCount === 1) callback()
}

global.MockScene.children = [
  {
    rotation: {},
    geometry: {
      dispose: () => {}
    },
    material: {
      dispose: () => {}
    }
  },
  {
    rotation: {},
    geometry: {
      dispose: () => {}
    },
    material: {
      dispose: () => {}
    }
  }
]

describe('components/background', () => {
  test('render', () => {
    const { unmount } = render(<Background />)

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(<Background />)
    window.dispatchEvent(new Event('resize'))

    unmount()
  })

  test('pixelRatio', () => {
    window.devicePixelRatio = undefined
    const { unmount } = render(<Background />)

    unmount()
  })
})
