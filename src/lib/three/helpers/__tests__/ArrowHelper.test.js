import ArrowHelper from '../ArrowHelper'

describe('lib/three/helpers/ArrowHelper', () => {
  it('call', () => {
    const arrow = ArrowHelper('red')
    expect(arrow).toBeDefined()
  })

  it('dispose', () => {
    const arrow = ArrowHelper('red')
    arrow.dispose()
  })
})
