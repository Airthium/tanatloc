import ArrowHelper from '../ArrowHelper'

describe('src/lib/three/helpers/ArrowHelper', () => {
  it('call', () => {
    const arrow = ArrowHelper('red')
    expect(arrow).toBeDefined()
  })
})
