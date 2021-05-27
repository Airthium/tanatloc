import ArrowHelper from '../ArrowHelper'

describe('lib/three/helpers/ArrowHelper', () => {
  test('call', () => {
    const arrow = ArrowHelper('red')
    expect(arrow).toBeDefined()
  })

  test('dispose', () => {
    const arrow = ArrowHelper('red')
    arrow.dispose()
  })
})
