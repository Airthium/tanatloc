import { Vector3, WebGLRenderer } from 'three'

import { LabelHelper } from '../LabelHelper'

document.createElement = jest.fn().mockImplementation(() => ({
  getContext: () => ({
    fillRect: jest.fn,
    fillText: jest.fn
  })
}))

describe('lib/three/helpers/LabelHelper', () => {
  const renderer = {} as WebGLRenderer
  renderer.capabilities = {} as WebGLRenderer['capabilities']
  renderer.capabilities.getMaxAnisotropy = () => 1

  test('call', () => {
    const label = LabelHelper(renderer, 'text')
    expect(label).toBeDefined()
  })

  test('dispose', () => {
    const label = LabelHelper(renderer, 'text')
    label.dispose()
  })

  test('with parameters', () => {
    const label = LabelHelper(renderer, 'text', {
      background: 'white',
      position: new Vector3(0, 0, 1),
      align: 'right',
      scale: 2
    })
    expect(label).toBeDefined()
  })
})
